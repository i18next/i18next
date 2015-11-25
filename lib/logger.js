'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var consoleLogger = {
  type: 'logger',

  log: function log(args) {
    this._output('log', args);
  },

  warn: function warn(args) {
    this._output('warn', args);
  },

  error: function error(args) {
    this._output('error', args);
  },

  _output: function _output(type, args) {
    if (console && console[type]) console[type].apply(console, Array.prototype.slice.call(args));
  }
};

var Logger = (function () {
  function Logger(concreteLogger) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Logger);

    this.subs = [];
    this.init(concreteLogger, options);
  }

  _createClass(Logger, [{
    key: 'init',
    value: function init(concreteLogger) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug === false ? false : true;
    }
  }, {
    key: 'setDebug',
    value: function setDebug(bool) {
      this.debug = bool;
      this.subs.forEach(function (sub) {
        sub.setDebug(bool);
      });
    }
  }, {
    key: 'log',
    value: function log() {
      if (!this.debug) return;

      if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
      this.logger.log(arguments);
    }
  }, {
    key: 'warn',
    value: function warn() {
      if (!this.debug) return;

      if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
      this.logger.warn(arguments);
    }
  }, {
    key: 'error',
    value: function error() {
      if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
      this.logger.error(arguments);
    }
  }, {
    key: 'deprecate',
    value: function deprecate() {
      if (typeof arguments[0] === 'string') arguments[0] = 'WARNING DEPRECATED: ' + this.prefix + ' ' + arguments[0];
      if (this.debug) this.logger.warn(arguments);
    }
  }, {
    key: 'create',
    value: function create(moduleName) {
      var sub = new Logger(this.concreteLogger, _extends({ prefix: this.prefix + ':' + moduleName + ':' }, this.options));
      this.subs.push(sub);

      return sub;
    }

    // createInstance(options = {}) {
    //   return new Logger(options, callback);
    // }

  }]);

  return Logger;
})();

;

exports['default'] = new Logger();
module.exports = exports['default'];