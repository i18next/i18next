import * as utils from './utils';
import baseLogger from './logger';

class Interpolator {
  constructor(options = {}) {
    this.logger = baseLogger.create('interpolator');

    this.init(options, true);
  }

  /* eslint no-param-reassign: 0 */
  init(options = {}, reset) {
    if (reset) {
      this.options = options;
      this.format = (options.interpolation && options.interpolation.format) || (value => value);
      this.escape = (options.interpolation && options.interpolation.escape) || utils.escape;
    }
    if (!options.interpolation) options.interpolation = { escapeValue: true };

    const iOpts = options.interpolation;

    this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;

    this.prefix = iOpts.prefix ? utils.regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
    this.suffix = iOpts.suffix ? utils.regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';

    this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';

    this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';

    this.nestingPrefix = iOpts.nestingPrefix ? utils.regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || utils.regexEscape('$t(');
    this.nestingSuffix = iOpts.nestingSuffix ? utils.regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || utils.regexEscape(')');

    // the regexp
    this.resetRegExp();
  }

  reset() {
    if (this.options) this.init(this.options);
  }

  resetRegExp() {
    // the regexp
    const regexpStr = `${this.prefix}(.+?)${this.suffix}`;
    this.regexp = new RegExp(regexpStr, 'g');

    const regexpUnescapeStr = `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`;
    this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');

    const nestingRegexpStr = `${this.nestingPrefix}(.+?)${this.nestingSuffix}`;
    this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
  }

  interpolate(str, data, lng) {
    let match;
    let value;
    let pattern;
    let patternIndex;

    function regexSafe(val) {
      return val.replace(/\$/g, '$$$$');
    }

    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) return utils.getPath(data, key);

      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();

      return this.format(utils.getPath(data, k), f, lng);
    };

    this.resetRegExp();

    // unescape if has unescapePrefix/Suffix
    /* eslint no-cond-assign: 0 */
    while (match = this.regexpUnescape.exec(str)) {
      value = handleFormat(match[1].trim());
      pattern = match[0];
      patternIndex = str.indexOf(pattern);
      str = str.replace(pattern, value);
      // progress matching just past the replacement
      this.regexpUnescape.lastIndex = patternIndex + value.length;
    }

    // regular escape on demand
    while (match = this.regexp.exec(str)) {
      value = handleFormat(match[1].trim());
      if (typeof value !== 'string') value = utils.makeString(value);
      if (!value) {
        this.logger.warn(`missed to pass in variable ${match[1]} for interpolating ${str}`);
        value = '';
      }
      value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
      pattern = match[0];
      patternIndex = str.indexOf(pattern);
      str = str.replace(pattern, value);
      // progress matching just past the replacement
      this.regexp.lastIndex = patternIndex + value.length;
    }
    return str;
  }

  nest(str, fc, options = {}) {
    let match;
    let value;

    let clonedOptions = { ...options };
    clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup

    // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
    function handleHasOptions(key) {
      if (key.indexOf(',') < 0) return key;

      const p = key.split(',');
      key = p.shift();
      let optionsString = p.join(',');
      optionsString = this.interpolate(optionsString, clonedOptions);
      optionsString = optionsString.replace(/'/g, '"');

      try {
        clonedOptions = JSON.parse(optionsString);
      } catch (e) {
        this.logger.error(`failed parsing options string in nesting for key ${key}`, e);
      }

      return key;
    }

    // regular escape on demand
    while (match = this.nestingRegexp.exec(str)) {
      value = fc(handleHasOptions.call(this, match[1].trim()), clonedOptions);

      // is only the nesting key (key1 = '$(key2)') return the value without stringify
      if (value && match[0] === str && typeof value !== 'string') return value;

      // no string to include or empty
      if (typeof value !== 'string') value = utils.makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = '';
      }
      // Nested keys should not be escaped by default #854
      // value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}


export default Interpolator;
