'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var LanguageUtil = (function () {
  function LanguageUtil(options) {
    _classCallCheck(this, LanguageUtil);

    this.options = options;

    this.whitelist = this.options.whitelist || false;
    this.logger = _logger2['default'].create('languageUtils');
  }

  _createClass(LanguageUtil, [{
    key: 'getLanguagePartFromCode',
    value: function getLanguagePartFromCode(code) {
      if (code.indexOf('-') < 0) return code;

      var specialCases = ['nb-NO', 'nn-NO', 'nb-no', 'nn-no'];
      var p = code.split('-');
      return this.formatLanguageCode(specialCases.indexOf(code) > -1 ? p[1].toLowerCase() : p[0]);
    }
  }, {
    key: 'formatLanguageCode',
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var _code$split = code.split('-');

        var _code$split2 = _slicedToArray(_code$split, 2);

        var head = _code$split2[0];
        var tail = _code$split2[1];

        return this.options.lowerCaseLng ? head.toLowerCase() + '-' + tail.toLowerCase() : head.toLowerCase() + '-' + tail.toUpperCase();
      } else {
        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
      }
    }
  }, {
    key: 'isWhitelisted',
    value: function isWhitelisted(code) {
      if (this.options.load === 'languageOnly') code = this.getLanguagePartFromCode(code);
      return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1 ? true : false;
    }
  }, {
    key: 'toResolveHierarchy',
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this = this;

      fallbackCode = fallbackCode || this.options.fallbackLng || [];
      if (typeof fallbackCode === 'string') fallbackCode = [fallbackCode];

      var codes = [];
      var addCode = function addCode(code) {
        if (_this.isWhitelisted(code)) {
          codes.push(code);
        } else {
          _this.logger.warn('rejecting non-whitelisted language code: ' + code);
        }
      };

      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }

      fallbackCode.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this.formatLanguageCode(fc));
      });

      return codes;
    }
  }]);

  return LanguageUtil;
})();

;

exports['default'] = LanguageUtil;
module.exports = exports['default'];