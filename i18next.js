(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.i18next = factory());
}(this, function () { 'use strict';

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  var consoleLogger = {
    type: 'logger',
    log: function log(args) {
      this.output('log', args);
    },
    warn: function warn(args) {
      this.output('warn', args);
    },
    error: function error(args) {
      this.output('error', args);
    },
    output: function output(type, args) {
      var _console;

      if (console && console[type]) (_console = console)[type].apply(_console, _toConsumableArray(args));
    }
  };

  var Logger = function () {
    function Logger(concreteLogger) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Logger);

      this.init(concreteLogger, opt);
    }

    _createClass(Logger, [{
      key: "init",
      value: function init(concreteLogger) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.prefix = opt.prefix || 'i18next:';
        this.logger = concreteLogger || consoleLogger;
        this.options = opt;
        this.debug = opt.debug;
      }
    }, {
      key: "setDebug",
      value: function setDebug(bool) {
        this.debug = bool;
      }
    }, {
      key: "log",
      value: function log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.forward(args, 'log', '', true);
      }
    }, {
      key: "warn",
      value: function warn() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this.forward(args, 'warn', '', true);
      }
    }, {
      key: "error",
      value: function error() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this.forward(args, 'error', '');
      }
    }, {
      key: "deprecate",
      value: function deprecate() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
      }
    }, {
      key: "forward",
      value: function forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
        return this.logger[lvl](args);
      }
    }, {
      key: "create",
      value: function create(moduleName) {
        return new Logger(this.logger, _objectSpread({}, {
          prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
        }, this.options));
      }
    }]);

    return Logger;
  }();

  var baseLogger = new Logger();

  var EventEmitter = function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this.observers = {};
    }

    _createClass(EventEmitter, [{
      key: "on",
      value: function on(events, listener) {
        var _this = this;

        events.split(' ').forEach(function (event) {
          _this.observers[event] = _this.observers[event] || [];

          _this.observers[event].push(listener);
        });
        return this;
      }
    }, {
      key: "off",
      value: function off(event, listener) {
        if (!this.observers[event]) return;

        if (!listener) {
          delete this.observers[event];
          return;
        }

        this.observers[event] = this.observers[event].filter(function (l) {
          return l !== listener;
        });
      }
    }, {
      key: "emit",
      value: function emit(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (this.observers[event]) {
          var cloned = [].concat(this.observers[event]);
          cloned.forEach(function (observer) {
            observer.apply(void 0, args);
          });
        }

        if (this.observers['*']) {
          var _cloned = [].concat(this.observers['*']);

          _cloned.forEach(function (observer) {
            observer.apply(observer, [event].concat(args));
          });
        }
      }
    }]);

    return EventEmitter;
  }();

  function defer() {
    var res;
    var rej;
    var p = new Promise(function (resolve, reject) {
      res = resolve;
      rej = reject;
    });
    p.resolve = res;
    p.reject = rej;
    return p;
  }
  function makeString(object) {
    if (object == null) return '';
    return '' + object;
  }
  function copy(a, s, t) {
    a.forEach(function (m) {
      if (s[m]) t[m] = s[m];
    });
  }

  function getLastOfPath(obj, path, Empty) {
    function cleanKey(key) {
      return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
    }

    function canNotTraverseDeeper() {
      return !obj || typeof obj === 'string';
    }

    var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

    while (stack.length > 1) {
      if (canNotTraverseDeeper()) return {};
      var key = cleanKey(stack.shift());
      if (!obj[key] && Empty) obj[key] = new Empty();
      obj = obj[key];
    }

    if (canNotTraverseDeeper()) return {};
    return {
      obj: obj,
      k: cleanKey(stack.shift())
    };
  }

  function setPath(object, path, newValue) {
    var _getLastOfPath = getLastOfPath(object, path, Object),
        obj = _getLastOfPath.obj,
        k = _getLastOfPath.k;

    obj[k] = newValue;
  }
  function pushPath(object, path, newValue, concat) {
    var _getLastOfPath2 = getLastOfPath(object, path, Object),
        obj = _getLastOfPath2.obj,
        k = _getLastOfPath2.k;

    obj[k] = obj[k] || [];
    if (concat) obj[k] = obj[k].concat(newValue);
    if (!concat) obj[k].push(newValue);
  }
  function getPath(object, path) {
    var _getLastOfPath3 = getLastOfPath(object, path),
        obj = _getLastOfPath3.obj,
        k = _getLastOfPath3.k;

    if (!obj) return undefined;
    return obj[k];
  }
  function getPathWithDefaults(data, defaultData, key) {
    var value = getPath(data, key);
    if (value !== undefined) return value;
    return getPath(defaultData, key);
  }
  function deepExtend(target, source, overwrite) {
    for (var prop in source) {
      if (prop in target) {
        if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }

    return target;
  }
  function regexEscape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
  var _entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  function escape(data) {
    if (typeof data === 'string') return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
    return data;
  }
  var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;

  var ResourceStore = function (_EventEmitter) {
    _inherits(ResourceStore, _EventEmitter);

    function ResourceStore(data) {
      var _this;

      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        ns: ['translation'],
        defaultNS: 'translation'
      };

      _classCallCheck(this, ResourceStore);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceStore).call(this));

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.data = data || {};
      _this.options = opt;

      if (_this.options.keySeparator === undefined) {
        _this.options.keySeparator = '.';
      }

      return _this;
    }

    _createClass(ResourceStore, [{
      key: "addNamespaces",
      value: function addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) {
          this.options.ns.push(ns);
        }
      }
    }, {
      key: "removeNamespaces",
      value: function removeNamespaces(ns) {
        var index = this.options.ns.indexOf(ns);

        if (index > -1) {
          this.options.ns.splice(index, 1);
        }
      }
    }, {
      key: "getResource",
      value: function getResource(lng, ns, key) {
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
        var path = [lng, ns];
        if (key && typeof key !== 'string') path = path.concat(key);
        if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
        }

        return getPath(this.data, path);
      }
    }, {
      key: "addResource",
      value: function addResource(lng, ns, key, value) {
        var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
          silent: false
        };
        var keySeparator = this.options.keySeparator;
        if (keySeparator === undefined) keySeparator = '.';
        var path = [lng, ns];
        if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          value = ns;
          ns = path[1];
        }

        this.addNamespaces(ns);
        setPath(this.data, path, value);
        if (!opt.silent) this.emit('added', lng, ns, key, value);
      }
    }, {
      key: "addResources",
      value: function addResources(lng, ns, res) {
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
          silent: false
        };

        for (var m in res) {
          if (typeof res[m] === 'string' || Object.prototype.toString.apply(res[m]) === '[object Array]') this.addResource(lng, ns, m, res[m], {
            silent: true
          });
        }

        if (!opt.silent) this.emit('added', lng, ns, res);
      }
    }, {
      key: "addResourceBundle",
      value: function addResourceBundle(lng, ns, res, deep, overwrite) {
        var opt = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
          silent: false
        };
        var path = [lng, ns];

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          deep = res;
          res = ns;
          ns = path[1];
        }

        this.addNamespaces(ns);
        var pack = getPath(this.data, path) || {};

        if (deep) {
          deepExtend(pack, res, overwrite);
        } else {
          pack = _objectSpread({}, pack, res);
        }

        setPath(this.data, path, pack);
        if (!opt.silent) this.emit('added', lng, ns, res);
      }
    }, {
      key: "removeResourceBundle",
      value: function removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) {
          delete this.data[lng][ns];
        }

        this.removeNamespaces(ns);
        this.emit('removed', lng, ns);
      }
    }, {
      key: "hasResourceBundle",
      value: function hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== undefined;
      }
    }, {
      key: "getResourceBundle",
      value: function getResourceBundle(lng, ns) {
        if (!ns) ns = this.options.defaultNS;
        if (this.options.compatibilityAPI === 'v1') return _objectSpread({}, {}, this.getResource(lng, ns));
        return this.getResource(lng, ns);
      }
    }, {
      key: "getDataByLanguage",
      value: function getDataByLanguage(lng) {
        return this.data[lng];
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.data;
      }
    }]);

    return ResourceStore;
  }(EventEmitter);

  var postProcessor = {
    processors: {},
    addPostProcessor: function addPostProcessor(module) {
      this.processors[module.name] = module;
    },
    handle: function handle(processors, value, key, opt, translator) {
      var _this = this;

      processors.forEach(function (processor) {
        if (_this.processors[processor]) value = _this.processors[processor].process(value, key, opt, translator);
      });
      return value;
    }
  };

  var checkedLoadedFor = {};

  var Translator = function (_EventEmitter) {
    _inherits(Translator, _EventEmitter);

    function Translator(services) {
      var _this;

      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Translator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Translator).call(this));
      if (isIE10) EventEmitter.call(_assertThisInitialized(_this));
      copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, _assertThisInitialized(_this));
      _this.options = opt;
      if (_this.options.keySeparator === undefined) _this.options.keySeparator = '.';
      _this.logger = baseLogger.create('translator');
      return _this;
    }

    _createClass(Translator, [{
      key: "changeLanguage",
      value: function changeLanguage(lng) {
        if (lng) this.language = lng;
      }
    }, {
      key: "exists",
      value: function exists(key) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          interpolation: {}
        };
        var r = this.resolve(key, opt);
        return r && r.res !== undefined;
      }
    }, {
      key: "extractFromKey",
      value: function extractFromKey(key, opt) {
        var nsSep = opt.nsSeparator || this.options.nsSeparator;
        if (nsSep === undefined) nsSep = ':';
        var keySep = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
        var namespaces = opt.ns || this.options.defaultNS;

        if (nsSep && key.indexOf(nsSep) > -1) {
          var parts = key.split(nsSep);
          if (nsSep !== keySep || nsSep === keySep && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
          key = parts.join(keySep);
        }

        if (typeof namespaces === 'string') namespaces = [namespaces];
        return {
          key: key,
          namespaces: namespaces
        };
      }
    }, {
      key: "translate",
      value: function translate(keys, opt) {
        var _this2 = this;

        if (_typeof(opt) !== 'object' && this.options.overloadTranslationOptionHandler) {
          opt = this.options.overloadTranslationOptionHandler(arguments);
        }

        if (!opt) opt = {};
        if (keys === undefined || keys === null) return '';
        if (!Array.isArray(keys)) keys = [String(keys)];
        var keySep = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;

        var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], opt),
            key = _this$extractFromKey.key,
            namespaces = _this$extractFromKey.namespaces;

        var ns = namespaces[namespaces.length - 1];
        var lng = opt.lng || this.language;
        var appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

        if (lng && lng.toLowerCase() === 'cimode') {
          if (appendNamespaceToCIMode) {
            var nsSeparator = opt.nsSeparator || this.options.nsSeparator;
            return ns + nsSeparator + key;
          }

          return key;
        }

        var resolved = this.resolve(keys, opt);
        var res = resolved && resolved.res;
        var resUsedKey = resolved && resolved.usedKey || key;
        var resExactUsedKey = resolved && resolved.exactUsedKey || key;
        var resType = Object.prototype.toString.apply(res);
        var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
        var joinArrays = opt.joinArrays !== undefined ? opt.joinArrays : this.options.joinArrays;
        var hndAsObjInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        var hndAsObj = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

        if (hndAsObjInI18nFormat && res && hndAsObj && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
          if (!opt.returnObjects && !this.options.returnObjects) {
            this.logger.warn('accessing an object - but returnObjects opt is not enabled!');
            return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, opt) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
          }

          if (keySep) {
            var resTypeIsArray = resType === '[object Array]';
            var copy$$1 = resTypeIsArray ? [] : {};
            var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

            for (var m in res) {
              if (Object.prototype.hasOwnProperty.call(res, m)) {
                var deepKey = "".concat(newKeyToUse).concat(keySep).concat(m);
                copy$$1[m] = this.translate(deepKey, _objectSpread({}, opt, {
                  joinArrays: false,
                  ns: namespaces
                }));
                if (copy$$1[m] === deepKey) copy$$1[m] = res[m];
              }
            }

            res = copy$$1;
          }
        } else if (hndAsObjInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
          res = res.join(joinArrays);
          if (res) res = this.extendTranslation(res, keys, opt);
        } else {
          var usedDefault = false;
          var usedKey = false;

          if (!this.isValidLookup(res) && opt.defaultValue !== undefined) {
            usedDefault = true;

            if (opt.count !== undefined) {
              var suffix = this.pluralResolver.getSuffix(lng, opt.count);
              res = opt["defaultValue".concat(suffix)];
            }

            if (!res) res = opt.defaultValue;
          }

          if (!this.isValidLookup(res)) {
            usedKey = true;
            res = key;
          }

          var updMissing = opt.defaultValue && opt.defaultValue !== res && this.options.updateMissing;

          if (usedKey || usedDefault || updMissing) {
            this.logger.log(updMissing ? 'updateKey' : 'missingKey', lng, ns, key, updMissing ? opt.defaultValue : res);
            var lngs = [];
            var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);

            if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
              for (var i = 0; i < fallbackLngs.length; i++) {
                lngs.push(fallbackLngs[i]);
              }
            } else if (this.options.saveMissingTo === 'all') {
              lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
            } else {
              lngs.push(opt.lng || this.language);
            }

            var send = function send(l, k) {
              if (_this2.options.missingKeyHandler) {
                _this2.options.missingKeyHandler(l, ns, k, updMissing ? opt.defaultValue : res, updMissing, opt);
              } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
                _this2.backendConnector.saveMissing(l, ns, k, updMissing ? opt.defaultValue : res, updMissing, opt);
              }

              _this2.emit('missingKey', l, ns, k, res);
            };

            if (this.options.saveMissing) {
              var doPlHnd = opt.count !== undefined && typeof opt.count !== 'string';

              if (this.options.saveMissingPlurals && doPlHnd) {
                lngs.forEach(function (l) {
                  var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

                  plurals.forEach(function (p) {
                    return send([l], p);
                  });
                });
              } else {
                send(lngs, key);
              }
            }
          }

          res = this.extendTranslation(res, keys, opt, resolved);
          if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(ns, ":").concat(key);
          if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
        }

        return res;
      }
    }, {
      key: "extendTranslation",
      value: function extendTranslation(res, key, opt, resolved) {
        var _this3 = this;

        if (this.i18nFormat && this.i18nFormat.parse) {
          res = this.i18nFormat.parse(res, opt, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
            resolved: resolved
          });
        } else if (!opt.skipInterpolation) {
          if (opt.interpolation) this.interpolator.init(_objectSpread({}, opt, {
            interpolation: _objectSpread({}, this.options.interpolation, opt.interpolation)
          }));
          var data = opt.replace && typeof opt.replace !== 'string' ? opt.replace : opt;
          if (this.options.interpolation.defaultVariables) data = _objectSpread({}, this.options.interpolation.defaultVariables, data);
          res = this.interpolator.interpolate(res, data, opt.lng || this.language, opt);
          if (opt.nest !== false) res = this.interpolator.nest(res, function () {
            return _this3.translate.apply(_this3, arguments);
          }, opt);
          if (opt.interpolation) this.interpolator.reset();
        }

        var postP = opt.postProcess || this.options.postProcess;
        var postPNames = typeof postP === 'string' ? [postP] : postP;

        if (res !== undefined && res !== null && postPNames && postPNames.length && opt.applyPostProcessor !== false) {
          res = postProcessor.handle(postPNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread({
            i18nResolved: resolved
          }, opt) : opt, this);
        }

        return res;
      }
    }, {
      key: "resolve",
      value: function resolve(keys) {
        var _this4 = this;

        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var found;
        var usedKey;
        var exactUsedKey;
        var usedLng;
        var usedNS;
        if (typeof keys === 'string') keys = [keys];
        keys.forEach(function (k) {
          if (_this4.isValidLookup(found)) return;

          var extracted = _this4.extractFromKey(k, opt);

          var key = extracted.key;
          usedKey = key;
          var nss = extracted.namespaces;
          if (_this4.options.fallbackNS) nss = nss.concat(_this4.options.fallbackNS);
          var doPlHnd = opt.count !== undefined && typeof opt.count !== 'string';
          var doCtxHnd = opt.context !== undefined && typeof opt.context === 'string' && opt.context !== '';
          var codes = opt.lngs ? opt.lngs : _this4.languageUtils.toResolveHierarchy(opt.lng || _this4.language, opt.fallbackLng);
          nss.forEach(function (ns) {
            if (_this4.isValidLookup(found)) return;
            usedNS = ns;

            if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
              checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

              _this4.logger.warn("key \"".concat(usedKey, "\" for namespace \"").concat(usedNS, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace was not yet loaded"), 'This means something IS WRONG in your application setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
            }

            codes.forEach(function (code) {
              if (_this4.isValidLookup(found)) return;
              usedLng = code;
              var finalKey = key;
              var finalKeys = [finalKey];

              if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
                _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
              } else {
                var pluralSuffix;
                if (doPlHnd) pluralSuffix = _this4.pluralResolver.getSuffix(code, opt.count);
                if (doPlHnd && doCtxHnd) finalKeys.push(finalKey + pluralSuffix);
                if (doCtxHnd) finalKeys.push(finalKey += "".concat(_this4.options.contextSeparator).concat(opt.context));
                if (doPlHnd) finalKeys.push(finalKey += pluralSuffix);
              }

              var possibleKey;

              while (possibleKey = finalKeys.pop()) {
                if (!_this4.isValidLookup(found)) {
                  exactUsedKey = possibleKey;
                  found = _this4.getResource(code, ns, possibleKey, opt);
                }
              }
            });
          });
        });
        return {
          res: found,
          usedKey: usedKey,
          exactUsedKey: exactUsedKey,
          usedLng: usedLng,
          usedNS: usedNS
        };
      }
    }, {
      key: "isValidLookup",
      value: function isValidLookup(res) {
        return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
      }
    }, {
      key: "getResource",
      value: function getResource(code, ns, key) {
        var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, opt);
        return this.resourceStore.getResource(code, ns, key, opt);
      }
    }]);

    return Translator;
  }(EventEmitter);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var LanguageUtil = function () {
    function LanguageUtil(opt) {
      _classCallCheck(this, LanguageUtil);

      this.options = opt;
      this.whitelist = this.options.whitelist || false;
      this.logger = baseLogger.create('languageUtils');
    }

    _createClass(LanguageUtil, [{
      key: "getScriptPartFromCode",
      value: function getScriptPartFromCode(code) {
        if (!code || code.indexOf('-') < 0) return null;
        var p = code.split('-');
        if (p.length === 2) return null;
        p.pop();
        return this.formatLanguageCode(p.join('-'));
      }
    }, {
      key: "getLanguagePartFromCode",
      value: function getLanguagePartFromCode(code) {
        if (!code || code.indexOf('-') < 0) return code;
        var p = code.split('-');
        return this.formatLanguageCode(p[0]);
      }
    }, {
      key: "formatLanguageCode",
      value: function formatLanguageCode(code) {
        if (typeof code === 'string' && code.indexOf('-') > -1) {
          var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
          var p = code.split('-');

          if (this.options.lowerCaseLng) {
            p = p.map(function (part) {
              return part.toLowerCase();
            });
          } else if (p.length === 2) {
            p[0] = p[0].toLowerCase();
            p[1] = p[1].toUpperCase();
            if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          } else if (p.length === 3) {
            p[0] = p[0].toLowerCase();
            if (p[1].length === 2) p[1] = p[1].toUpperCase();
            if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
            if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
            if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
          }

          return p.join('-');
        }

        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
      }
    }, {
      key: "isWhitelisted",
      value: function isWhitelisted(code) {
        if (this.options.load === 'languageOnly' || this.options.nonExplicitWhitelist) {
          code = this.getLanguagePartFromCode(code);
        }

        return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1;
      }
    }, {
      key: "getFallbackCodes",
      value: function getFallbackCodes(fallbacks, code) {
        if (!fallbacks) return [];
        if (typeof fallbacks === 'string') fallbacks = [fallbacks];
        if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
        if (!code) return fallbacks["default"] || [];
        var found = fallbacks[code];
        if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
        if (!found) found = fallbacks[this.formatLanguageCode(code)];
        if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
        if (!found) found = fallbacks["default"];
        return found || [];
      }
    }, {
      key: "toResolveHierarchy",
      value: function toResolveHierarchy(code, fallbackCode) {
        var _this = this;

        var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
        var codes = [];

        var addCode = function addCode(c) {
          if (!c) return;

          if (_this.isWhitelisted(c)) {
            codes.push(c);
          } else {
            _this.logger.warn("rejecting non-whitelisted language code: ".concat(c));
          }
        };

        if (typeof code === 'string' && code.indexOf('-') > -1) {
          if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
          if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
          if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
        } else if (typeof code === 'string') {
          addCode(this.formatLanguageCode(code));
        }

        fallbackCodes.forEach(function (fc) {
          if (codes.indexOf(fc) < 0) addCode(_this.formatLanguageCode(fc));
        });
        return codes;
      }
    }]);

    return LanguageUtil;
  }();

  var sets = [{
    lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
    nr: [1],
    fc: 3
  }, {
    lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ['ar'],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ['cs', 'sk'],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ['csb', 'pl'],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ['cy'],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ['fr'],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ['ga'],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ['gd'],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ['is'],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ['jv'],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ['kw'],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ['lt'],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ['lv'],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ['mk'],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ['mnk'],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ['mt'],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ['or'],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ['ro'],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ['sl'],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ['he'],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  var _rulesPluralsTypes = {
    1: function _(n) {
      return Number(n > 1);
    },
    2: function _(n) {
      return Number(n != 1);
    },
    3: function _(n) {
      return 0;
    },
    4: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    5: function _(n) {
      return Number(n === 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
    },
    6: function _(n) {
      return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
    },
    7: function _(n) {
      return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    8: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
    },
    9: function _(n) {
      return Number(n >= 2);
    },
    10: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
    },
    11: function _(n) {
      return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
    },
    12: function _(n) {
      return Number(n % 10 != 1 || n % 100 == 11);
    },
    13: function _(n) {
      return Number(n !== 0);
    },
    14: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
    },
    15: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    16: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
    },
    17: function _(n) {
      return Number(n == 1 || n % 10 == 1 ? 0 : 1);
    },
    18: function _(n) {
      return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
    },
    19: function _(n) {
      return Number(n == 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
    },
    20: function _(n) {
      return Number(n == 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
    },
    21: function _(n) {
      return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
    },
    22: function _(n) {
      return Number(n === 1 ? 0 : n === 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
    }
  };

  function createRules() {
    var rules = {};
    sets.forEach(function (set) {
      set.lngs.forEach(function (l) {
        rules[l] = {
          numbers: set.nr,
          plurals: _rulesPluralsTypes[set.fc]
        };
      });
    });
    return rules;
  }

  var PluralResolver = function () {
    function PluralResolver(languageUtils) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, PluralResolver);

      this.languageUtils = languageUtils;
      this.options = opt;
      this.logger = baseLogger.create('pluralResolver');
      this.rules = createRules();
    }

    _createClass(PluralResolver, [{
      key: "addRule",
      value: function addRule(lng, obj) {
        this.rules[lng] = obj;
      }
    }, {
      key: "getRule",
      value: function getRule(code) {
        return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
      }
    }, {
      key: "needsPlural",
      value: function needsPlural(code) {
        var rule = this.getRule(code);
        return rule && rule.numbers.length > 1;
      }
    }, {
      key: "getPluralFormsOfKey",
      value: function getPluralFormsOfKey(code, key) {
        var _this = this;

        var ret = [];
        var rule = this.getRule(code);
        if (!rule) return ret;
        rule.numbers.forEach(function (n) {
          var suffix = _this.getSuffix(code, n);

          ret.push("".concat(key).concat(suffix));
        });
        return ret;
      }
    }, {
      key: "getSuffix",
      value: function getSuffix(code, count) {
        var _this2 = this;

        var rule = this.getRule(code);

        if (rule) {
          var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
          var suffix = rule.numbers[idx];

          if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
            if (suffix === 2) {
              suffix = 'plural';
            } else if (suffix === 1) {
              suffix = '';
            }
          }

          var returnSuffix = function returnSuffix() {
            return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
          };

          if (this.options.compatibilityJSON === 'v1') {
            if (suffix === 1) return '';
            if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
            return returnSuffix();
          } else if (this.options.compatibilityJSON === 'v2') {
            return returnSuffix();
          } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
            return returnSuffix();
          }

          return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
        }

        this.logger.warn("no plural rule found for: ".concat(code));
        return '';
      }
    }]);

    return PluralResolver;
  }();

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  var Interpolator = function () {
    function Interpolator() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Interpolator);

      this.logger = baseLogger.create('interpolator');
      this.options = opt;

      this.format = opt.interpolation && opt.interpolation.format || function (value) {
        return value;
      };

      this.init(opt);
    }

    _createClass(Interpolator, [{
      key: "init",
      value: function init() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!opt.interpolation) opt.interpolation = {
          escapeValue: true
        };
        var iOpts = opt.interpolation;
        this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
        this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
        this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
        this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
        this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
        this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
        this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
        this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
        this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
        this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
        this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
        this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
        this.resetRegExp();
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this.options) this.init(this.options);
      }
    }, {
      key: "resetRegExp",
      value: function resetRegExp() {
        var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
        this.regexp = new RegExp(regexpStr, 'g');
        var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
        this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
        var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
        this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
      }
    }, {
      key: "interpolate",
      value: function interpolate(str, data, lng, opt) {
        var _this = this;

        var match;
        var value;
        var replaces;
        var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

        function regexSafe(val) {
          return val.replace(/\$/g, '$$$$');
        }

        var handleFormat = function handleFormat(key) {
          if (key.indexOf(_this.formatSeparator) < 0) {
            var path = getPathWithDefaults(data, defaultData, key);
            return _this.alwaysFormat ? _this.format(path, undefined, lng) : path;
          }

          var p = key.split(_this.formatSeparator);
          var k = p.shift().trim();
          var f = p.join(_this.formatSeparator).trim();
          return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, opt);
        };

        this.resetRegExp();
        var missingInterpolationHandler = opt && opt.missingInterpolationHandler || this.options.missingInterpolationHandler;
        replaces = 0;

        while (match = this.regexpUnescape.exec(str)) {
          value = handleFormat(match[1].trim());

          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var temp = missingInterpolationHandler(str, match, opt);
              value = typeof temp === 'string' ? temp : '';
            } else {
              this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
              value = '';
            }
          } else if (typeof value !== 'string' && !this.useRawValueToEscape) {
            value = makeString(value);
          }

          str = str.replace(match[0], regexSafe(value));
          this.regexpUnescape.lastIndex = 0;
          replaces++;

          if (replaces >= this.maxReplaces) {
            break;
          }
        }

        replaces = 0;

        while (match = this.regexp.exec(str)) {
          value = handleFormat(match[1].trim());

          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var _temp = missingInterpolationHandler(str, match, opt);

              value = typeof _temp === 'string' ? _temp : '';
            } else {
              this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));
              value = '';
            }
          } else if (typeof value !== 'string' && !this.useRawValueToEscape) {
            value = makeString(value);
          }

          value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
          replaces++;

          if (replaces >= this.maxReplaces) {
            break;
          }
        }

        return str;
      }
    }, {
      key: "nest",
      value: function nest(str, fc) {
        var _this2 = this;

        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var match;
        var value;

        var clonedOptions = _objectSpread({}, opt);

        clonedOptions.applyPostProcessor = false;
        delete clonedOptions.defaultValue;

        function handleHasOptions(key, inheritedOptions) {
          var sep = this.nestingOptionsSeparator;
          if (key.indexOf(sep) < 0) return key;
          var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
          var optString = "{".concat(c[1]);
          key = c[0];
          optString = this.interpolate(optString, clonedOptions);
          optString = optString.replace(/'/g, '"');

          try {
            clonedOptions = JSON.parse(optString);
            if (inheritedOptions) clonedOptions = _objectSpread({}, inheritedOptions, clonedOptions);
          } catch (e) {
            this.logger.warn("failed parsing opt string in nesting for key ".concat(key), e);
            return "".concat(key).concat(sep).concat(optString);
          }

          delete clonedOptions.defaultValue;
          return key;
        }

        while (match = this.nestingRegexp.exec(str)) {
          var formatters = [];
          var doReduce = false;

          if (match[0].includes(this.formatSeparator) && !/{.*}/.test(match[1])) {
            var _match$1$split$map = match[1].split(this.formatSeparator).map(function (elem) {
              return elem.trim();
            });

            var _match$1$split$map2 = _toArray(_match$1$split$map);

            match[1] = _match$1$split$map2[0];
            formatters = _match$1$split$map2.slice(1);
            doReduce = true;
          }

          value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
          if (value && match[0] === str && typeof value !== 'string') return value;
          if (typeof value !== 'string') value = makeString(value);

          if (!value) {
            this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
            value = '';
          }

          if (doReduce) {
            value = formatters.reduce(function (v, f) {
              return _this2.format(v, f, opt.lng, opt);
            }, value.trim());
          }

          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
        }

        return str;
      }
    }]);

    return Interpolator;
  }();

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
      arr.splice(found, 1);
      found = arr.indexOf(what);
    }
  }

  var Connector = function (_EventEmitter) {
    _inherits(Connector, _EventEmitter);

    function Connector(backend, store, services) {
      var _this;

      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, Connector);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.backend = backend;
      _this.store = store;
      _this.services = services;
      _this.languageUtils = services.languageUtils;
      _this.options = opt;
      _this.logger = baseLogger.create('backendConnector');
      _this.state = {};
      _this.queue = [];

      if (_this.backend && _this.backend.init) {
        _this.backend.init(services, opt.backend, opt);
      }

      return _this;
    }

    _createClass(Connector, [{
      key: "queueLoad",
      value: function queueLoad(languages, nss, opt, clb) {
        var _this2 = this;

        var toLoad = [];
        var pending = [];
        var toLoadLanguages = [];
        var toLoadNamespaces = [];
        languages.forEach(function (lng) {
          var hasAllNss = true;
          nss.forEach(function (ns) {
            var name = "".concat(lng, "|").concat(ns);

            if (!opt.reload && _this2.store.hasResourceBundle(lng, ns)) {
              _this2.state[name] = 2;
            } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
              if (pending.indexOf(name) < 0) pending.push(name);
            } else {
              _this2.state[name] = 1;
              hasAllNss = false;
              if (pending.indexOf(name) < 0) pending.push(name);
              if (toLoad.indexOf(name) < 0) toLoad.push(name);
              if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
            }
          });
          if (!hasAllNss) toLoadLanguages.push(lng);
        });

        if (toLoad.length || pending.length) {
          this.queue.push({
            pending: pending,
            loaded: {},
            errors: [],
            clb: clb
          });
        }

        return {
          toLoad: toLoad,
          pending: pending,
          toLoadLanguages: toLoadLanguages,
          toLoadNamespaces: toLoadNamespaces
        };
      }
    }, {
      key: "loaded",
      value: function loaded(name, err, data) {
        var _name$split = name.split('|'),
            _name$split2 = _slicedToArray(_name$split, 2),
            lng = _name$split2[0],
            ns = _name$split2[1];

        if (err) this.emit('failedLoading', lng, ns, err);

        if (data) {
          this.store.addResourceBundle(lng, ns, data);
        }

        this.state[name] = err ? -1 : 2;
        var loaded = {};
        this.queue.forEach(function (q) {
          pushPath(q.loaded, [lng], ns);
          remove(q.pending, name);
          if (err) q.errors.push(err);

          if (q.pending.length === 0 && !q.done) {
            Object.keys(q.loaded).forEach(function (l) {
              if (!loaded[l]) loaded[l] = [];

              if (q.loaded[l].length) {
                q.loaded[l].forEach(function (ns) {
                  if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
                });
              }
            });
            q.done = true;

            if (q.errors.length) {
              q.clb(q.errors);
            } else {
              q.clb();
            }
          }
        });
        this.emit('loaded', loaded);
        this.queue = this.queue.filter(function (q) {
          return !q.done;
        });
      }
    }, {
      key: "read",
      value: function read(lng, ns, fcName) {
        var _this3 = this;

        var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
        var clb = arguments.length > 5 ? arguments[5] : undefined;
        if (!lng.length) return clb(null, {});
        return this.backend[fcName](lng, ns, function (err, data) {
          if (err && data && tried < 5) {
            setTimeout(function () {
              _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, clb);
            }, wait);
            return;
          }

          clb(err, data);
        });
      }
    }, {
      key: "prepareLoading",
      value: function prepareLoading(languages, namespaces) {
        var _this4 = this;

        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var clb = arguments.length > 3 ? arguments[3] : undefined;

        if (!this.backend) {
          this.logger.warn('No backend was added via i18next.use. Will not load resources.');
          return clb && clb();
        }

        if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
        if (typeof namespaces === 'string') namespaces = [namespaces];
        var toLoad = this.queueLoad(languages, namespaces, opt, clb);

        if (!toLoad.toLoad.length) {
          if (!toLoad.pending.length) clb();
          return null;
        }

        toLoad.toLoad.forEach(function (name) {
          _this4.loadOne(name);
        });
      }
    }, {
      key: "load",
      value: function load(languages, namespaces, clb) {
        this.prepareLoading(languages, namespaces, {}, clb);
      }
    }, {
      key: "reload",
      value: function reload(languages, namespaces, clb) {
        this.prepareLoading(languages, namespaces, {
          reload: true
        }, clb);
      }
    }, {
      key: "loadOne",
      value: function loadOne(name) {
        var _this5 = this;

        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        var _name$split3 = name.split('|'),
            _name$split4 = _slicedToArray(_name$split3, 2),
            lng = _name$split4[0],
            ns = _name$split4[1];

        this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
          if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
          if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

          _this5.loaded(name, err, data);
        });
      }
    }, {
      key: "saveMissing",
      value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
        var opt = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

        if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
          this.logger.warn("did not save key \"".concat(key, "\" for namespace \"").concat(namespace, "\" as the namespace was not yet loaded"), 'This means something IS WRONG in your application setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the clb or Promise to resolve before accessing it!!!');
          return;
        }

        if (key === undefined || key === null || key === '') return;

        if (this.backend && this.backend.create) {
          this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread({}, opt, {
            isUpdate: isUpdate
          }));
        }

        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
      }
    }]);

    return Connector;
  }(EventEmitter);

  function get() {
    return {
      debug: false,
      initImmediate: true,
      ns: ['translation'],
      defaultNS: ['translation'],
      fallbackLng: ['dev'],
      fallbackNS: false,
      whitelist: false,
      nonExplicitWhitelist: false,
      load: 'all',
      preload: false,
      simplifyPluralSuffix: true,
      keySeparator: '.',
      nsSeparator: ':',
      pluralSeparator: '_',
      contextSeparator: '_',
      partialBundledLanguages: false,
      saveMissing: false,
      updateMissing: false,
      saveMissingTo: 'fallback',
      saveMissingPlurals: true,
      missingKeyHandler: false,
      missingInterpolationHandler: false,
      postProcess: false,
      postProcessPassResolved: false,
      returnNull: true,
      returnEmptyString: true,
      returnObjects: false,
      joinArrays: false,
      returnedObjectHandler: false,
      parseMissingKeyHandler: false,
      appendNamespaceToMissingKey: false,
      appendNamespaceToCIMode: false,
      overloadTranslationOptionHandler: function handle(args) {
        var ret = {};
        if (_typeof(args[1]) === 'object') ret = args[1];
        if (typeof args[1] === 'string') ret.defaultValue = args[1];
        if (typeof args[2] === 'string') ret.tDescription = args[2];

        if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
          var opt = args[3] || args[2];
          Object.keys(opt).forEach(function (key) {
            ret[key] = opt[key];
          });
        }

        return ret;
      },
      interpolation: {
        escapeValue: true,
        format: function format(value, _format, lng, opt) {
          return value;
        },
        prefix: '{{',
        suffix: '}}',
        formatSeparator: ',',
        unescapePrefix: '-',
        nestingPrefix: '$t(',
        nestingSuffix: ')',
        nestingOptionsSeparator: ',',
        maxReplaces: 1000
      }
    };
  }
  function transformOptions(opt) {
    if (typeof opt.ns === 'string') opt.ns = [opt.ns];
    if (typeof opt.fallbackLng === 'string') opt.fallbackLng = [opt.fallbackLng];
    if (typeof opt.fallbackNS === 'string') opt.fallbackNS = [opt.fallbackNS];

    if (opt.whitelist && opt.whitelist.indexOf('cimode') < 0) {
      opt.whitelist = opt.whitelist.concat(['cimode']);
    }

    return opt;
  }

  function noop() {}

  var I18n = function (_EventEmitter) {
    _inherits(I18n, _EventEmitter);

    function I18n() {
      var _this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var clb = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, I18n);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(I18n).call(this));

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.options = transformOptions(opt);
      _this.services = {};
      _this.logger = baseLogger;
      _this.modules = {
        external: []
      };

      if (clb && !_this.isInitialized && !opt.isClone) {
        if (!_this.options.initImmediate) {
          _this.init(opt, clb);

          return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
        }

        setTimeout(function () {
          _this.init(opt, clb);
        }, 0);
      }

      return _this;
    }

    _createClass(I18n, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var clb = arguments.length > 1 ? arguments[1] : undefined;

        if (typeof opt === 'function') {
          clb = opt;
          opt = {};
        }

        this.options = _objectSpread({}, get(), this.options, transformOptions(opt));
        this.format = this.options.interpolation.format;
        if (!clb) clb = noop;

        function createClassOnDemand(ClassOrObject) {
          if (!ClassOrObject) return null;
          if (typeof ClassOrObject === 'function') return new ClassOrObject();
          return ClassOrObject;
        }

        if (!this.options.isClone) {
          if (this.modules.logger) {
            baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
          } else {
            baseLogger.init(null, this.options);
          }

          var lu = new LanguageUtil(this.options);
          this.store = new ResourceStore(this.options.resources, this.options);
          var s = this.services;
          s.logger = baseLogger;
          s.resourceStore = this.store;
          s.languageUtils = lu;
          s.pluralResolver = new PluralResolver(lu, {
            prepend: this.options.pluralSeparator,
            compatibilityJSON: this.options.compatibilityJSON,
            simplifyPluralSuffix: this.options.simplifyPluralSuffix
          });
          s.interpolator = new Interpolator(this.options);
          s.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
          };
          s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
          s.backendConnector.on('*', function (event) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            _this2.emit.apply(_this2, [event].concat(args));
          });

          if (this.modules.languageDetector) {
            s.languageDetector = createClassOnDemand(this.modules.languageDetector);
            s.languageDetector.init(s, this.options.detection, this.options);
          }

          if (this.modules.i18nFormat) {
            s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
            if (s.i18nFormat.init) s.i18nFormat.init(this);
          }

          this.translator = new Translator(this.services, this.options);
          this.translator.on('*', function (event) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }

            _this2.emit.apply(_this2, [event].concat(args));
          });
          this.modules.external.forEach(function (m) {
            if (m.init) m.init(_this2);
          });
        }

        if (!this.modules.languageDetector && !this.options.lng) {
          this.logger.warn('init: no languageDetector is used and no lng is defined');
        }

        var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
        storeApi.forEach(function (fcName) {
          _this2[fcName] = function () {
            var _this2$store;

            return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
          };
        });
        var def = defer();

        var load = function load() {
          _this2.changeLanguage(_this2.options.lng, function (err, t) {
            _this2.isInitialized = true;

            _this2.logger.log('initialized', _this2.options);

            _this2.emit('initialized', _this2.options);

            def.resolve(t);
            clb(err, t);
          });
        };

        if (this.options.resources || !this.options.initImmediate) {
          load();
        } else {
          setTimeout(load, 0);
        }

        return def;
      }
    }, {
      key: "loadResources",
      value: function loadResources(language) {
        var _this3 = this;

        var clb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
        var usedCallback = clb;
        var usedLng = typeof language === 'string' ? language : this.language;
        if (typeof language === 'function') usedCallback = language;

        if (!this.options.resources || this.options.partialBundledLanguages) {
          if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
          var toLoad = [];

          var append = function append(lng) {
            if (!lng) return;

            var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

            lngs.forEach(function (l) {
              if (toLoad.indexOf(l) < 0) toLoad.push(l);
            });
          };

          if (!usedLng) {
            var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            fallbacks.forEach(function (l) {
              return append(l);
            });
          } else {
            append(usedLng);
          }

          if (this.options.preload) {
            this.options.preload.forEach(function (l) {
              return append(l);
            });
          }

          this.services.backendConnector.load(toLoad, this.options.ns, usedCallback);
        } else {
          usedCallback(null);
        }
      }
    }, {
      key: "reloadResources",
      value: function reloadResources(lngs, ns, clb) {
        var def = defer();
        if (!lngs) lngs = this.languages;
        if (!ns) ns = this.options.ns;
        if (!clb) clb = noop;
        this.services.backendConnector.reload(lngs, ns, function (err) {
          def.resolve();
          clb(err);
        });
        return def;
      }
    }, {
      key: "use",
      value: function use(m) {
        if (!m) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
        if (!m.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

        if (m.type === 'backend') {
          this.modules.backend = m;
        }

        if (m.type === 'logger' || m.log && m.warn && m.error) {
          this.modules.logger = m;
        }

        if (m.type === 'languageDetector') {
          this.modules.languageDetector = m;
        }

        if (m.type === 'i18nFormat') {
          this.modules.i18nFormat = m;
        }

        if (m.type === 'postProcessor') {
          postProcessor.addPostProcessor(m);
        }

        if (m.type === '3rdParty') {
          this.modules.external.push(m);
        }

        return this;
      }
    }, {
      key: "changeLanguage",
      value: function changeLanguage(lng, clb) {
        var _this4 = this;

        this.isLanguageChangingTo = lng;
        var def = defer();
        this.emit('languageChanging', lng);

        var done = function done(err, l) {
          if (l) {
            _this4.language = l;
            _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);

            _this4.translator.changeLanguage(l);

            _this4.isLanguageChangingTo = undefined;

            _this4.emit('languageChanged', l);

            _this4.logger.log('languageChanged', l);
          } else {
            _this4.isLanguageChangingTo = undefined;
          }

          def.resolve(function () {
            return _this4.t.apply(_this4, arguments);
          });
          if (clb) clb(err, function () {
            return _this4.t.apply(_this4, arguments);
          });
        };

        var setLng = function setLng(l) {
          if (l) {
            if (!_this4.language) {
              _this4.language = l;
              _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
            }

            if (!_this4.translator.language) _this4.translator.changeLanguage(l);
            if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
          }

          _this4.loadResources(l, function (err) {
            done(err, l);
          });
        };

        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
          setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
          this.services.languageDetector.detect(setLng);
        } else {
          setLng(lng);
        }

        return def;
      }
    }, {
      key: "getFixedT",
      value: function getFixedT(lng, ns) {
        var _this5 = this;

        var fixedT = function fixedT(key, opts) {
          var opt;

          if (_typeof(opts) !== 'object') {
            for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
              rest[_key3 - 2] = arguments[_key3];
            }

            opt = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
          } else {
            opt = _objectSpread({}, opts);
          }

          opt.lng = opt.lng || fixedT.lng;
          opt.lngs = opt.lngs || fixedT.lngs;
          opt.ns = opt.ns || fixedT.ns;
          return _this5.t(key, opt);
        };

        if (typeof lng === 'string') {
          fixedT.lng = lng;
        } else {
          fixedT.lngs = lng;
        }

        fixedT.ns = ns;
        return fixedT;
      }
    }, {
      key: "t",
      value: function t() {
        var _this$translator;

        return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
      }
    }, {
      key: "exists",
      value: function exists() {
        var _this$translator2;

        return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
      }
    }, {
      key: "setDefaultNamespace",
      value: function setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
      }
    }, {
      key: "hasLoadedNamespace",
      value: function hasLoadedNamespace(ns) {
        var _this6 = this;

        if (!this.isInitialized) {
          this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
          return false;
        }

        if (!this.languages || !this.languages.length) {
          this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
          return false;
        }

        var lng = this.languages[0];
        var fallbackLng = this.options ? this.options.fallbackLng : false;
        var lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === 'cimode') return true;

        var loadNotPending = function loadNotPending(l, n) {
          var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

          return loadState === -1 || loadState === 2;
        };

        if (this.hasResourceBundle(lng, ns)) return true;
        if (!this.services.backendConnector.backend) return true;
        if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
        return false;
      }
    }, {
      key: "loadNamespaces",
      value: function loadNamespaces(ns, clb) {
        var _this7 = this;

        var def = defer();

        if (!this.options.ns) {
          clb && clb();
          return Promise.resolve();
        }

        if (typeof ns === 'string') ns = [ns];
        ns.forEach(function (n) {
          if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
        });
        this.loadResources(function (err) {
          def.resolve();
          if (clb) clb(err);
        });
        return def;
      }
    }, {
      key: "loadLanguages",
      value: function loadLanguages(lngs, clb) {
        var def = defer();
        if (typeof lngs === 'string') lngs = [lngs];
        var preloaded = this.options.preload || [];
        var newLngs = lngs.filter(function (lng) {
          return preloaded.indexOf(lng) < 0;
        });

        if (!newLngs.length) {
          if (clb) clb();
          return Promise.resolve();
        }

        this.options.preload = preloaded.concat(newLngs);
        this.loadResources(function (err) {
          def.resolve();
          if (clb) clb(err);
        });
        return def;
      }
    }, {
      key: "dir",
      value: function dir(lng) {
        if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
        if (!lng) return 'rtl';
        var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];
        return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
      }
    }, {
      key: "createInstance",
      value: function createInstance() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var clb = arguments.length > 1 ? arguments[1] : undefined;
        return new I18n(opt, clb);
      }
    }, {
      key: "cloneInstance",
      value: function cloneInstance() {
        var _this8 = this;

        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var clb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        var mOpt = _objectSpread({}, this.options, opt, {
          isClone: true
        });

        var clone = new I18n(mOpt);
        var memToCopy = ['store', 'services', 'language'];
        memToCopy.forEach(function (m) {
          clone[m] = _this8[m];
        });
        clone.services = _objectSpread({}, this.services);
        clone.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        clone.translator = new Translator(clone.services, clone.options);
        clone.translator.on('*', function (event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }

          clone.emit.apply(clone, [event].concat(args));
        });
        clone.init(mOpt, clb);
        clone.translator.options = clone.options;
        clone.translator.backendConnector.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        return clone;
      }
    }]);

    return I18n;
  }(EventEmitter);

  var i18next = new I18n();

  return i18next;

}));
