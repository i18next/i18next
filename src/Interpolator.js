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

    let iOpts = options.interpolation;

    this.escapeValue = iOpts.escapeValue;

    this.prefix = iOpts.prefix ? utils.regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
    this.suffix = iOpts.suffix ? utils.regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';

    this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';

    this.nestingPrefix = iOpts.nestingPrefix ? utils.regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || utils.regexEscape('$t(');
    this.nestingSuffix = iOpts.nestingSuffix ? utils.regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || utils.regexEscape(')');

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

  nest(str, fc, options = {}) {
    let match, value;

    let clonedOptions = JSON.parse(JSON.stringify(options));
    clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup

    function regexSafe(val) {
      return val.replace(/\$/g, '$$$$');
    }

    // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
    function handleHasOptions(key) {
      if (key.indexOf(',') < 0) return key;

      let p = key.split(',');
      key = p.shift();
      let optionsString = p.join(',');
      optionsString = this.interpolate(optionsString, clonedOptions);

      try {
        clonedOptions = JSON.parse(optionsString);
      } catch (e) {
        this.logger.error(`failed parsing options string in nesting for key ${key}`, e);
      }

      return key;
    }

    // regular escape on demand
    while(match = this.nestingRegexp.exec(str)) {
      value = fc(handleHasOptions.call(this, match[1].trim()), clonedOptions);
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
