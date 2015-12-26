'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var Interpolator = (function () {
  function Interpolator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Interpolator);

    this.logger = _logger2['default'].create('interpolator');

    this.init(options, true);
  }

  _createClass(Interpolator, [{
    key: 'init',
    value: function init(options, reset) {
      if (options === undefined) options = {};

      if (reset) this.options = options;
      if (!options.interpolation) options.interpolation = { escapeValue: true };

      var iOpts = options.interpolation;

      this.escapeValue = iOpts.escapeValue;

      this.prefix = iOpts.prefix ? utils.regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? utils.regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';

      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';

      this.nestingPrefix = iOpts.nestingPrefix ? utils.regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || utils.regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? utils.regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || utils.regexEscape(')');

      // the regexp
      var regexpStr = this.prefix + '(.+?)' + this.suffix;
      this.regexp = new RegExp(regexpStr, 'g');

      var regexpUnescapeStr = this.prefix + this.unescapePrefix + '(.+?)' + this.unescapeSuffix + this.suffix;
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');

      var nestingRegexpStr = this.nestingPrefix + '(.+?)' + this.nestingSuffix;
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: 'reset',
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: 'interpolate',
    value: function interpolate(str, data) {
      var match = undefined,
          value = undefined;

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      // unescape if has unescapePrefix/Suffix
      while (match = this.regexpUnescape.exec(str)) {
        var _value = utils.getPath(data, match[1].trim());
        str = str.replace(match[0], _value);
      }

      // regular escape on demand
      while (match = this.regexp.exec(str)) {
        value = utils.getPath(data, match[1].trim());
        if (typeof value !== 'string') value = utils.makeString(value);
        if (!value) {
          this.logger.warn('missed to pass in variable ' + match[1] + ' for interpolating ' + str);
          value = '';
        }
        value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }
      return str;
    }
  }, {
    key: 'nest',
    value: function nest(str, fc) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var match = undefined,
          value = undefined;

      var clonedOptions = JSON.parse(JSON.stringify(options));
      clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
      function handleHasOptions(key) {
        if (key.indexOf(',') < 0) return key;

        var p = key.split(',');
        key = p.shift();
        var optionsString = p.join(',');
        optionsString = this.interpolate(optionsString, clonedOptions);

        try {
          clonedOptions = JSON.parse(optionsString);
        } catch (e) {
          this.logger.error('failed parsing options string in nesting for key ' + key, e);
        }

        return key;
      }

      // regular escape on demand
      while (match = this.nestingRegexp.exec(str)) {
        value = fc(handleHasOptions.call(this, match[1].trim()), clonedOptions);
        if (typeof value !== 'string') value = utils.makeString(value);
        if (!value) {
          this.logger.warn('missed to pass in variable ' + match[1] + ' for interpolating ' + str);
          value = '';
        }
        value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }
      return str;
    }
  }]);

  return Interpolator;
})();

exports['default'] = Interpolator;
module.exports = exports['default'];