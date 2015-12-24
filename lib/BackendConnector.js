'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var Connector = (function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(backend, store, services) {
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, Connector);

    _get(Object.getPrototypeOf(Connector.prototype), 'constructor', this).call(this);
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.options = options;
    this.logger = _logger2['default'].create('backendConnector');

    this.pending = {};

    this.backend && this.backend.init(services, options.backend, options);
  }

  _createClass(Connector, [{
    key: 'load',
    value: function load(languages, namespaces, callback) {
      var _this = this;

      if (!this.backend) return callback && callback();
      var options = _extends({}, this.backend.options, this.options.backend);

      if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];

      // load with multi-load
      if (options.allowMultiLoading && this.backend.readMulti) {
        (function () {
          var read = function read(lng, ns, tried, wait) {
            var _this2 = this;

            if (!tried) tried = 0;
            if (!wait) wait = 250;

            if (!lng.length) return callback(); // noting to load

            this.backend.readMulti(lng, ns, function (err, data) {
              if (err && data /* = retryFlag */ && tried < 5) {
                setTimeout(function () {
                  read.call(_this2, lng, ns, ++tried, wait * 2);
                }, wait);
                return;
              }

              if (err) _this2.logger.warn('loading namespaces ' + ns.join(', ') + ' for languages ' + lng.join(', ') + ' via multiloading failed', err);
              if (!err && data) _this2.logger.log('loaded namespaces ' + ns.join(', ') + ' for languages ' + lng.join(', ') + ' via multiloading', data);

              if (data) {
                toLoadLanguages.forEach(function (l) {
                  toLoadNamespaces.forEach(function (n) {
                    var bundle = utils.getPath(data, [l, n]);
                    if (bundle) {
                      _this2.store.addResourceBundle(l, n, bundle);
                      utils.pushPath(loaded, [l], n);
                    }
                    // set not pending
                    utils.setPath(_this2.pending, [l, n], false);
                    if (!bundle) _this2.logger.error('loading namespace ' + n + ' for language ' + l + ' via multiloading failed');
                  });
                });
              }

              _this2.emit('loaded', loaded);
              callback(err);
            });
          };

          var loaded = {};

          // find what needs to be loaded
          var toLoadLanguages = [],
              toLoadNamespaces = [];
          languages.forEach(function (lng) {
            var hasAllNamespaces = true;
            namespaces.forEach(function (ns) {
              if (!_this.store.hasResourceBundle(lng, ns) && utils.getPath(_this.pending, [lng, ns]) !== true) {
                hasAllNamespaces = false;
                if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
              }
            });
            if (!hasAllNamespaces) toLoadLanguages.push(lng);
          });

          ;

          // store pending loads
          toLoadLanguages.forEach(function (lng) {
            toLoadNamespaces.forEach(function (ns) {
              utils.setPath(_this.pending, [lng, ns], true);
            });
          });

          read.call(_this, toLoadLanguages, toLoadNamespaces);
        })();
      }

      // load one by one
      else {
          (function () {
            var done = function done() {
              todo--;
              if (!todo) {
                this.emit('loaded', loaded);
                callback();
              }
            };

            var read = function read(lng, ns, tried, wait) {
              var _this3 = this;

              if (!tried) tried = 0;
              if (!wait) wait = 250;

              this.backend.read(lng, ns, function (err, data) {
                if (err && data /*retryFlag*/ && tried < 5) {
                  setTimeout(function () {
                    read.call(_this3, lng, ns, ++tried, wait * 2);
                  }, wait);
                  return;
                }

                if (err) _this3.logger.warn('loading namespace ' + ns + ' for language ' + lng + ' failed', err);
                if (!err && data) _this3.logger.log('loaded namespace ' + ns + ' for language ' + lng, data);

                // set not pending
                utils.setPath(_this3.pending, [lng, ns], false);

                if (data) {
                  _this3.store.addResourceBundle(lng, ns, data);
                  utils.pushPath(loaded, [lng], ns);
                }
                done.call(_this3);
              });
            };

            var todo = languages.length * namespaces.length;
            var loaded = {};

            ;

            languages.forEach(function (lng) {
              namespaces.forEach(function (ns) {
                if (!_this.store.hasResourceBundle(lng, ns) && utils.getPath(_this.pending, [lng, ns]) !== true) {
                  utils.setPath(_this.pending, [lng, ns], true);
                  read.call(_this, lng, ns);
                } else {
                  done.call(_this);
                }
              });
            });
          })();
        }
    }
  }, {
    key: 'saveMissing',
    value: function saveMissing(languages, namespace, key, fallbackValue) {
      if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);

      // write to store to avoid resending
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);

  return Connector;
})(_EventEmitter3['default']);

exports['default'] = Connector;
module.exports = exports['default'];