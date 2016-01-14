'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _ResourceStore = require('./ResourceStore');

var _ResourceStore2 = _interopRequireDefault(_ResourceStore);

var _Translator = require('./Translator');

var _Translator2 = _interopRequireDefault(_Translator);

var _LanguageUtils = require('./LanguageUtils');

var _LanguageUtils2 = _interopRequireDefault(_LanguageUtils);

var _PluralResolver = require('./PluralResolver');

var _PluralResolver2 = _interopRequireDefault(_PluralResolver);

var _Interpolator = require('./Interpolator');

var _Interpolator2 = _interopRequireDefault(_Interpolator);

var _BackendConnector = require('./BackendConnector');

var _BackendConnector2 = _interopRequireDefault(_BackendConnector);

var _CacheConnector = require('./CacheConnector');

var _CacheConnector2 = _interopRequireDefault(_CacheConnector);

var _defaults = require('./defaults');

var _postProcessor = require('./postProcessor');

var _postProcessor2 = _interopRequireDefault(_postProcessor);

var _compatibilityV1 = require('./compatibility/v1');

var compat = _interopRequireWildcard(_compatibilityV1);

var I18n = (function (_EventEmitter) {
  _inherits(I18n, _EventEmitter);

  function I18n(options, callback) {
    if (options === undefined) options = {};

    _classCallCheck(this, I18n);

    _get(Object.getPrototypeOf(I18n.prototype), 'constructor', this).call(this);
    this.options = (0, _defaults.transformOptions)(options);
    this.services = {};
    this.logger = _logger2['default'];
    this.modules = {};

    if (callback && !this.isInitialized) this.init(options, callback);
  }

  _createClass(I18n, [{
    key: 'init',
    value: function init(options, callback) {
      var _this = this;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!options) options = {};

      if (options.compatibilityAPI === 'v1') {
        this.options = _extends({}, (0, _defaults.get)(), (0, _defaults.transformOptions)(compat.convertAPIOptions(options)), {});
      } else if (options.compatibilityJSON === 'v1') {
        this.options = _extends({}, (0, _defaults.get)(), (0, _defaults.transformOptions)(compat.convertJSONOptions(options)), {});
      } else {
        this.options = _extends({}, (0, _defaults.get)(), this.options, (0, _defaults.transformOptions)(options));
      }
      if (!callback) callback = function () {};

      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }

      // init services
      if (!this.options.isClone) {
        if (this.modules.logger) {
          _logger2['default'].init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          _logger2['default'].init(null, this.options);
        }

        var lu = new _LanguageUtils2['default'](this.options);
        this.store = new _ResourceStore2['default'](this.options.resources, this.options);

        var s = this.services;
        s.logger = _logger2['default'];
        s.resourceStore = this.store;
        s.resourceStore.on('added removed', function (lng, ns) {
          s.cacheConnector.save();
        });
        s.languageUtils = lu;
        s.pluralResolver = new _PluralResolver2['default'](lu, { prepend: this.options.pluralSeparator, compatibilityJSON: this.options.compatibilityJSON });
        s.interpolator = new _Interpolator2['default'](this.options);

        s.backendConnector = new _BackendConnector2['default'](createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        // pipe events from backendConnector
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this.emit.apply(_this, [event].concat(args));
        });

        s.backendConnector.on('loaded', function (loaded) {
          s.cacheConnector.save();
        });

        s.cacheConnector = new _CacheConnector2['default'](createClassOnDemand(this.modules.cache), s.resourceStore, s, this.options);
        // pipe events from backendConnector
        s.cacheConnector.on('*', function (event) {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          _this.emit.apply(_this, [event].concat(args));
        });

        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          s.languageDetector.init(s, this.options.detection, this.options);
        }

        this.translator = new _Translator2['default'](this.services, this.options);
        // pipe events from translator
        this.translator.on('*', function (event) {
          for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
          }

          _this.emit.apply(_this, [event].concat(args));
        });
      }

      // append api
      var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle'];
      storeApi.forEach(function (fcName) {
        _this[fcName] = function () {
          return this.store[fcName].apply(this.store, arguments);
        };
      });

      // TODO: COMPATIBILITY remove this
      if (this.options.compatibilityAPI === 'v1') compat.appendBackwardsAPI(this);

      this.changeLanguage(this.options.lng, function (err, t) {
        _this.emit('initialized', _this.options);
        _this.logger.log('initialized', _this.options);

        callback(err, t);
      });
    }
  }, {
    key: 'loadResources',
    value: function loadResources(callback) {
      var _this2 = this;

      if (!callback) callback = function () {};

      if (!this.options.resources) {
        var _ret = (function () {
          if (_this2.language && _this2.language.toLowerCase() === 'cimode') return {
              v: callback()
            }; // avoid loading resources for cimode

          var toLoad = [];

          var append = function append(lng) {
            var lngs = _this2.services.languageUtils.toResolveHierarchy(lng);
            lngs.forEach(function (l) {
              if (toLoad.indexOf(l) < 0) toLoad.push(l);
            });
          };

          append(_this2.language);

          if (_this2.options.preload) {
            _this2.options.preload.forEach(function (l) {
              append(l);
            });
          }

          _this2.services.cacheConnector.load(toLoad, _this2.options.ns, function () {
            _this2.services.backendConnector.load(toLoad, _this2.options.ns, callback);
          });
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        callback(null);
      }
    }
  }, {
    key: 'use',
    value: function use(module) {
      if (module.type === 'backend') {
        this.modules.backend = module;
      }

      if (module.type === 'cache') {
        this.modules.cache = module;
      }

      if (module.type === 'logger' || module.log && module.warn && module.warn) {
        this.modules.logger = module;
      }

      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }

      if (module.type === 'postProcessor') {
        _postProcessor2['default'].addPostProcessor(module);
      }

      return this;
    }
  }, {
    key: 'changeLanguage',
    value: function changeLanguage(lng, callback) {
      var _this3 = this;

      var done = function done(err) {
        if (lng) {
          _this3.emit('languageChanged', lng);
          _this3.logger.log('languageChanged', lng);
        }

        if (callback) callback(err, function () {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return _this3.t.apply(_this3, args);
        });
      };

      if (!lng && this.services.languageDetector) lng = this.services.languageDetector.detect();

      if (lng) {
        this.language = lng;
        this.languages = this.services.languageUtils.toResolveHierarchy(lng);

        this.translator.changeLanguage(lng);

        if (this.services.languageDetector) this.services.languageDetector.cacheUserLanguage(lng);
      }

      this.loadResources(function (err) {
        done(err);
      });
    }
  }, {
    key: 'getFixedT',
    value: function getFixedT(lng, ns) {
      var _this4 = this;

      var fixedT = function fixedT(key, options) {
        options = options || {};
        options.lng = options.lng || fixedT.lng;
        options.ns = options.ns || fixedT.ns;
        return _this4.t(key, options);
      };
      fixedT.lng = lng;
      fixedT.ns = ns;
      return fixedT;
    }
  }, {
    key: 't',
    value: function t() {
      return this.translator && this.translator.translate.apply(this.translator, arguments);
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.translator && this.translator.exists.apply(this.translator, arguments);
    }
  }, {
    key: 'setDefaultNamespace',
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: 'loadNamespaces',
    value: function loadNamespaces(ns, callback) {
      var _this5 = this;

      if (!this.options.ns) return callback && callback();
      if (typeof ns === 'string') ns = [ns];

      ns.forEach(function (n) {
        if (_this5.options.ns.indexOf(n) < 0) _this5.options.ns.push(n);
      });

      this.loadResources(callback);
    }
  }, {
    key: 'loadLanguages',
    value: function loadLanguages(lngs, callback) {
      if (typeof lngs === 'string') lngs = [lngs];
      this.options.preload = this.options.preload ? this.options.preload.concat(lngs) : lngs;

      this.loadResources(callback);
    }
  }, {
    key: 'dir',
    value: function dir(lng) {
      if (!lng) lng = this.language;

      var ltrLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];

      return ltrLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) ? 'ltr' : 'rtl';
    }
  }, {
    key: 'createInstance',
    value: function createInstance(options, callback) {
      if (options === undefined) options = {};

      return new I18n(options, callback);
    }
  }, {
    key: 'cloneInstance',
    value: function cloneInstance(options, callback) {
      var _this6 = this;

      if (options === undefined) options = {};

      var clone = new I18n(_extends({}, options, this.options, { isClone: true }), callback);
      var membersToCopy = ['store', 'translator', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this6[m];
      });

      return clone;
    }
  }]);

  return I18n;
})(_EventEmitter3['default']);

exports['default'] = new I18n();
module.exports = exports['default'];