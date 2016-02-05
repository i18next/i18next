'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _postProcessor = require('./postProcessor');

var _postProcessor2 = _interopRequireDefault(_postProcessor);

var _compatibilityV1 = require('./compatibility/v1');

var compat = _interopRequireWildcard(_compatibilityV1);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var Translator = (function (_EventEmitter) {
  _inherits(Translator, _EventEmitter);

  function Translator(services) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Translator);

    _get(Object.getPrototypeOf(Translator.prototype), 'constructor', this).call(this);

    utils.copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector'], services, this);

    this.options = options;
    this.logger = _logger2['default'].create('translator');
  }

  _createClass(Translator, [{
    key: 'changeLanguage',
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: 'exists',
    value: function exists(key) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? { interpolation: {} } : arguments[1];

      if (this.options.compatibilityAPI === 'v1') {
        options = compat.convertTOptions(options);
      }

      return this.resolve(key, options) !== undefined;
    }
  }, {
    key: 'extractFromKey',
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator || this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';

      var namespaces = options.ns || this.options.defaultNS;
      if (nsSeparator && key.indexOf(nsSeparator) > -1) {
        var parts = key.split(nsSeparator);
        namespaces = parts[0];
        key = parts[1];
      }
      if (typeof namespaces === 'string') namespaces = [namespaces];

      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: 'translate',
    value: function translate(keys) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof options !== 'object') {
        options = this.options.overloadTranslationOptionHandler(arguments);
      } else if (this.options.compatibilityAPI === 'v1') {
        options = compat.convertTOptions(options);
      }

      // non valid keys handling
      if (keys === undefined || keys === null || keys === '') return '';
      if (typeof keys === 'number') keys = String(keys);
      if (typeof keys === 'string') keys = [keys];

      // return key on CIMode
      var lng = options.lng || this.language;
      if (lng && lng.toLowerCase() === 'cimode') return keys[keys.length - 1];

      // separators
      var keySeparator = options.keySeparator || this.options.keySeparator || '.';

      // get namespace(s)

      var _extractFromKey = this.extractFromKey(keys[keys.length - 1], options);

      var key = _extractFromKey.key;
      var namespaces = _extractFromKey.namespaces;

      var namespace = namespaces[namespaces.length - 1];

      // resolve from store
      var res = this.resolve(keys, options);

      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;

      // object
      if (res && typeof res !== 'string' && noObject.indexOf(resType) < 0 && !(joinArrays && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(key, res, options) : 'key \'' + key + ' (' + this.language + ')\' returned an object instead of string.';
        }

        var copy = resType === '[object Array]' ? [] : {}; // apply child translation on a copy

        for (var m in res) {
          copy[m] = this.translate('' + key + keySeparator + m, _extends({ joinArrays: false, ns: namespaces }, options));
        }
        res = copy;
      }
      // array special treatment
      else if (joinArrays && resType === '[object Array]') {
          res = res.join(joinArrays);
          if (res) res = this.extendTranslation(res, key, options);
        }
        // string, empty or null
        else {
            var usedDefault = false,
                usedKey = false;

            // fallback value
            if (!this.isValidLookup(res) && options.defaultValue) {
              usedDefault = true;
              res = options.defaultValue;
            }
            if (!this.isValidLookup(res)) {
              usedKey = true;
              res = key;
            }

            // save missing
            if (usedKey || usedDefault) {
              this.logger.log('missingKey', lng, namespace, key, res);

              if (this.options.saveMissing) {
                var lngs = [];
                if (this.options.saveMissingTo === 'fallback' && this.options.fallbackLng && this.options.fallbackLng[0]) {
                  for (var i = 0; i < this.options.fallbackLng.length; i++) {
                    lngs.push(this.options.fallbackLng[i]);
                  }
                } else if (this.options.saveMissingTo === 'all') {
                  lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
                } else {
                  //(this.options.saveMissingTo === 'current' || (this.options.saveMissingTo === 'fallback' && this.options.fallbackLng[0] === false) ) {
                  lngs.push(options.lng || this.language);
                }

                if (this.options.missingKeyHandler) {
                  this.options.missingKeyHandler(lngs, namespace, key, res);
                } else if (this.backendConnector && this.backendConnector.saveMissing) {
                  this.backendConnector.saveMissing(lngs, namespace, key, res);
                }

                this.emit('missingKey', lngs, namespace, key, res);
              }
            }

            // extend
            res = this.extendTranslation(res, key, options);

            // append namespace if still key
            if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = namespace + ':' + key;

            // parseMissingKeyHandler
            if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
          }

      // return
      return res;
    }
  }, {
    key: 'extendTranslation',
    value: function extendTranslation(res, key, options) {
      var _this = this;

      if (options.interpolation) this.interpolator.init(options);

      // interpolate
      var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = _extends({}, this.options.interpolation.defaultVariables, data);
      res = this.interpolator.interpolate(res, data);

      // nesting
      res = this.interpolator.nest(res, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this.translate.apply(_this, args);
      }, options);

      if (options.interpolation) this.interpolator.reset();

      // post process
      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

      if (res !== undefined && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = _postProcessor2['default'].handle(postProcessorNames, res, key, options, this);
      }

      return res;
    }
  }, {
    key: 'resolve',
    value: function resolve(keys) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var found = undefined;

      if (typeof keys === 'string') keys = [keys];

      // forEach possible key
      keys.forEach(function (k) {
        if (_this2.isValidLookup(found)) return;

        var _extractFromKey2 = _this2.extractFromKey(k, options);

        var key = _extractFromKey2.key;
        var namespaces = _extractFromKey2.namespaces;

        if (_this2.options.fallbackNS) namespaces = namespaces.concat(_this2.options.fallbackNS);

        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

        var codes = options.lngs ? options.lngs : _this2.languageUtils.toResolveHierarchy(options.lng || _this2.language);

        namespaces.forEach(function (ns) {
          if (_this2.isValidLookup(found)) return;

          codes.forEach(function (code) {
            if (_this2.isValidLookup(found)) return;

            var finalKey = key;
            var finalKeys = [finalKey];

            // get key for context if needed
            if (needsContextHandling) finalKeys.push(finalKey += '' + _this2.options.contextSeparator + options.context);

            // get key for plural if needed
            if (needsPluralHandling) finalKeys.push(finalKey += _this2.pluralResolver.getSuffix(code, options.count));

            // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
            var possibleKey = undefined;
            while (possibleKey = finalKeys.pop()) {
              if (_this2.isValidLookup(found)) continue;
              found = _this2.getResource(code, ns, possibleKey, options);
            }
          });
        });
      });

      return found;
    }
  }, {
    key: 'isValidLookup',
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: 'getResource',
    value: function getResource(code, ns, key) {
      var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      return this.resourceStore.getResource(code, ns, key, options);
    }
  }]);

  return Translator;
})(_EventEmitter3['default']);

exports['default'] = Translator;
module.exports = exports['default'];