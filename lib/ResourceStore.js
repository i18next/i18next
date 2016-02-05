'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var ResourceStore = (function (_EventEmitter) {
  _inherits(ResourceStore, _EventEmitter);

  function ResourceStore() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? { ns: ['translation'], defaultNS: 'translation' } : arguments[1];

    _classCallCheck(this, ResourceStore);

    _get(Object.getPrototypeOf(ResourceStore.prototype), 'constructor', this).call(this);
    this.data = data;
    this.options = options;
  }

  _createClass(ResourceStore, [{
    key: 'addNamespaces',
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: 'removeNamespaces',
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);
      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: 'getResource',
    value: function getResource(lng, ns, key) {
      var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var keySeparator = options.keySeparator || this.options.keySeparator;
      if (keySeparator === undefined) keySeparator = '.';

      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }

      return utils.getPath(this.data, path);
    }
  }, {
    key: 'addResource',
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length <= 4 || arguments[4] === undefined ? { silent: false } : arguments[4];

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

      utils.setPath(this.data, path, value);

      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: 'addResources',
    value: function addResources(lng, ns, resources) {
      for (var m in resources) {
        if (typeof resources[m] === 'string') this.addResource(lng, ns, m, resources[m], { silent: true });
      }
      this.emit('added', lng, ns, resources);
    }
  }, {
    key: 'addResourceBundle',
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var path = [lng, ns];
      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);

      var pack = utils.getPath(this.data, path) || {};

      if (deep) {
        utils.deepExtend(pack, resources, overwrite);
      } else {
        pack = _extends({}, pack, resources);
      }

      utils.setPath(this.data, path, pack);

      this.emit('added', lng, ns, resources);
    }
  }, {
    key: 'removeResourceBundle',
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }
      this.removeNamespaces(ns);

      this.emit('removed', lng, ns);
    }
  }, {
    key: 'hasResourceBundle',
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: 'getResourceBundle',
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;

      // TODO: COMPATIBILITY remove extend in v2.1.0
      if (this.options.compatibilityAPI === 'v1') return _extends({}, this.getResource(lng, ns));

      return this.getResource(lng, ns);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.data;
    }
  }]);

  return ResourceStore;
})(_EventEmitter3['default']);

exports['default'] = ResourceStore;
module.exports = exports['default'];