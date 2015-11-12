import * as utils from './utils';
import baseLogger from './logger';

class Interpolator {
  constructor(options = {}) {
    this.logger = baseLogger.create('interpolator');

    this.init(options, true);
  }

  init(options = {}, reset) {
    if (reset) this.options = options;
    if (!options.interpolation) options.interpolation = { escapeValue: true };

    this.escapeValue = options.interpolation.escapeValue;

    this.prefix = options.interpolation.prefix ? utils.regexEscape(options.interpolation.prefix) : options.interpolation.prefixEscaped || '{{';
    this.suffix = options.interpolation.suffix ? utils.regexEscape(options.interpolation.suffix) : options.interpolation.suffixEscaped || '}}';

    this.unescapePrefix = options.interpolation.unescapeSuffix ? '' : options.interpolation.unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : options.interpolation.unescapeSuffix || '';

    this.nestingPrefix = options.interpolation.nestingPrefix ? utils.regexEscape(options.interpolation.nestingPrefix) : options.interpolation.nestingPrefixEscaped || '$t(';
    this.nestingSuffix = options.interpolation.nestingSuffix ? utils.regexEscape(options.interpolation.nestingSuffix) : options.interpolation.nestingSuffixEscaped || ')';

    // the regexp
    let regexpStr = this.prefix + '(.+?)' + this.suffix;
    this.regexp = new RegExp(regexpStr, 'g');

    let regexpUnescapeStr = this.prefix + this.unescapePrefix + '(.+?)' + this.unescapeSuffix + this.suffix;
    this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');

    let nestingRegexpStr = this.nestingPrefix + '(.+?)' + this.nestingSuffix;
    this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
  }

  reset() {
    if (this.options) this.init(this.options);
  }

  interpolate(str, data) {
    let match, value;

    function regexSafe(val) {
      return val.replace(/\$/g, '$$$$');
    }

    // unescape if has unescapePrefix/Suffix
    while(match = this.regexpUnescape.exec(str)) {
      let value = utils.getPath(data, match[1].trim());
      str = str.replace(match[0], value);
    }

    // regular escape on demand
    while(match = this.regexp.exec(str)) {
      value = utils.getPath(data, match[1].trim());
      if (typeof value !== 'string') value = utils.makeString(value);
      if (!value) {
        this.logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
        value = '';
      }
      value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }

  nest(str, fc, options) {
    let match, value;

    function regexSafe(val) {
      return val.replace(/\$/g, '$$$$');
    }

    // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
    function handleHasOptions(key) {
      if (key.indexOf(',') < 0) return key;

      let p = key.split(',');
      key = p.shift();
      let optionsString = p.join(',');
      optionsString = this.interpolate(optionsString, options);

      try {
        options = JSON.parse(optionsString);
      } catch (e) {
        this.logger.error(`failed parsing options string in nesting for key ${key}`, e);
      }

      return key;
    }

    // regular escape on demand
    while(match = this.nestingRegexp.exec(str)) {
      value = fc(handleHasOptions.call(this, match[1].trim()), options);
      if (typeof value !== 'string') value = utils.makeString(value);
      if (!value) {
        this.logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
        value = '';
      }
      value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}


export default Interpolator;
