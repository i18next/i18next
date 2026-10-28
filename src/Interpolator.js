import {
  getPathWithDefaults,
  deepFind,
  escape as utilsEscape,
  regexEscape,
  makeString,
  isString,
} from './utils.js';
import baseLogger from './logger.js';

const deepFindWithDefaults = (
  data,
  defaultData,
  key,
  keySeparator = '.',
  ignoreJSONStructure = true,
) => {
  let path = getPathWithDefaults(data, defaultData, key);
  if (path === undefined && ignoreJSONStructure && isString(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === undefined) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};

class Interpolator {
  constructor(options = {}) {
    this.logger = baseLogger.create('interpolator');

    this.options = options;
    this.format = options?.interpolation?.format || ((value) => value);
    this.init(options);
  }

  init(options = {}) {
    if (!options.interpolation) options.interpolation = { escapeValue: true };

    const {
      escape,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat,
    } = options.interpolation;

    this.escape = escape !== undefined ? escape : utilsEscape;
    this.escapeValue = escapeValue !== undefined ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== undefined ? useRawValueToEscape : false;

    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || '{{';
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || '}}';

    this.formatSeparator = formatSeparator || ',';

    this.unescapePrefix = unescapeSuffix ? '' : unescapePrefix ? regexEscape(unescapePrefix) : '-';
    this.unescapeSuffix = this.unescapePrefix
      ? ''
      : unescapeSuffix
        ? regexEscape(unescapeSuffix)
        : '';

    this.nestingPrefix = nestingPrefix
      ? regexEscape(nestingPrefix)
      : nestingPrefixEscaped || regexEscape('$t(');
    this.nestingSuffix = nestingSuffix
      ? regexEscape(nestingSuffix)
      : nestingSuffixEscaped || regexEscape(')');

    this.nestingOptionsSeparator = nestingOptionsSeparator || ',';

    this.maxReplaces = maxReplaces || 1000;

    this.alwaysFormat = alwaysFormat !== undefined ? alwaysFormat : false;

    // the regexp
    this.resetRegExp();
  }

  reset() {
    if (this.options) this.init(this.options);
  }

  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, 'g');
    };

    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(
      this.regexpUnescape,
      `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`,
    );
    // Every alternative starts with a different char (plain / " / ' / "("), so there is
    // only one way to split the input. Overlapping alternatives (e.g. `[^()"']+` inside
    // `*?`) backtrack exponentially on an unclosed `$t(` (ReDoS).
    this.nestingRegexp = getOrResetRegExp(
      this.nestingRegexp,
      `${this.nestingPrefix}((?:[^()"']|"[^"]*"|'[^']*'|\\((?:[^()"']|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`,
    );
  }

  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;

    const defaultData =
      (this.options && this.options.interpolation && this.options.interpolation.defaultVariables) ||
      {};

    const handleFormat = (key) => {
      if (!key.includes(this.formatSeparator)) {
        const path = deepFindWithDefaults(
          data,
          defaultData,
          key,
          this.options.keySeparator,
          this.options.ignoreJSONStructure,
        );
        return this.alwaysFormat
          ? this.format(path, undefined, lng, { ...options, ...data, interpolationkey: key })
          : path;
      }

      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();

      return this.format(
        deepFindWithDefaults(
          data,
          defaultData,
          k,
          this.options.keySeparator,
          this.options.ignoreJSONStructure,
        ),
        f,
        lng,
        {
          ...options,
          ...data,
          interpolationkey: k,
        },
      );
    };

    this.resetRegExp();

    // Security warning: when escapeValue is false AND the translation embeds
    // interpolation placeholders inside a $t() nesting options block (i.e.
    // $t(key, { ... "{{var}}" ... })), attacker-controlled string values that
    // contain `"` can break out of the JSON string literal and inject extra
    // nesting options (e.g. redirect lng/ns). This is safe under the default
    // escapeValue: true, where HTML-escaping neutralises the quote before
    // JSON.parse. See CHANGELOG entry for 26.0.6 and the security docs.
    if (!this.escapeValue && typeof str === 'string' && /\$t\([^)]*\{[^}]*\{\{/.test(str)) {
      this.logger.warn(
        'nesting options string contains interpolated variables with escapeValue: false — ' +
          'if any of those values are attacker-controlled they can inject additional ' +
          'nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing ' +
          'it to t(), or keep escapeValue: true.',
      );
    }

    const missingInterpolationHandler =
      options?.missingInterpolationHandler || this.options.missingInterpolationHandler;

    const skipOnVariables =
      options?.interpolation?.skipOnVariables !== undefined
        ? options.interpolation.skipOnVariables
        : this.options.interpolation.skipOnVariables;

    const todos = [
      {
        // unescape if has unescapePrefix/Suffix
        regex: this.regexpUnescape,
        safeValue: (val) => val,
      },
      {
        // regular escape on demand
        regex: this.regexp,
        safeValue: (val) => (this.escapeValue ? this.escape(val) : val),
      },
    ];
    // skipOnVariables: the escape pass skips the unescaped values, offset by its own edits.
    const unescapedValues = [];
    let shift = 0;
    todos.forEach((todo) => {
      replaces = 0;
      while ((match = todo.regex.exec(str))) {
        const at = match.index - shift;
        const written = unescapedValues.find(([start, end]) => at >= start && at < end);
        if (written) {
          todo.regex.lastIndex = written[1] + shift;
          continue;
        }
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === undefined) {
          if (typeof missingInterpolationHandler === 'function') {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : '';
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = ''; // undefined becomes empty string
          } else if (skipOnVariables) {
            value = match[0];
            continue; // this makes sure it continues to detect others
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = '';
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        // makeString: with useRawValueToEscape, `{{- var}}` and escapeValue: false pass the raw value.
        const safeValue = makeString(todo.safeValue(value));
        // Sliced in at match.index: String.replace may hit a copy inside an earlier value.
        str = str.slice(0, match.index) + safeValue + str.slice(match.index + match[0].length);
        if (skipOnVariables) {
          if (todo.regex === this.regexpUnescape) {
            unescapedValues.push([match.index, match.index + safeValue.length]);
          } else {
            shift += safeValue.length - match[0].length;
          }
          todo.regex.lastIndex += safeValue.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }

  nest(str, fc, options = {}) {
    let match;
    let value;

    let clonedOptions;

    // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (!key.includes(sep)) return key;

      const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));

      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (
        ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes) ||
        (matchedDoubleQuotes?.length ?? 0) % 2 !== 0
      ) {
        optionsString = optionsString.replace(/'/g, '"');
      }

      try {
        clonedOptions = JSON.parse(optionsString);

        if (inheritedOptions) clonedOptions = { ...inheritedOptions, ...clonedOptions };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }

      // assert we do not get a endless loop on interpolating defaultValue again and again
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.includes(this.prefix))
        delete clonedOptions.defaultValue;
      return key;
    };

    // One pass over the original str with an own copy of the regexp. The nested lookups
    // (fc) reset the shared nestingRegexp, so the loop used to rescan from 0 after every
    // match: quadratic, and it nested again any `$t(...)` inside a resolved value (e.g. a
    // variable the nested lookup kept literal under skipOnVariables).
    const nestingRegexp = new RegExp(this.nestingRegexp);
    let out = '';
    let lastEnd = 0;
    while ((match = nestingRegexp.exec(str))) {
      let formatters = [];

      clonedOptions = { ...options };
      clonedOptions =
        clonedOptions.replace && !isString(clonedOptions.replace)
          ? clonedOptions.replace
          : clonedOptions;
      clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup
      delete clonedOptions.defaultValue; // assert we do not get a endless loop on interpolating defaultValue again and again

      /**
       * If there is more than one parameter (contains the format separator). E.g.:
       *   - t(a, b)
       *   - t(a, b, c)
       *
       * And those parameters are not dynamic values (parameters do not include curly braces). E.g.:
       *   - Not t(a, { "key": "{{variable}}" })
       *   - Not t(a, b, {"keyA": "valueA", "keyB": "valueB"})
       *
       * Since v25.3.0 also this is possible: https://github.com/i18next/i18next/pull/2325
       */
      const keyEndIndex = /{.*}/s.test(match[1])
        ? match[1].lastIndexOf('}') + 1
        : match[1].indexOf(this.formatSeparator);
      if (keyEndIndex !== -1) {
        formatters = match[1]
          .slice(keyEndIndex)
          .split(this.formatSeparator)
          .map((elem) => elem.trim())
          .filter(Boolean);
        match[1] = match[1].slice(0, keyEndIndex);
      }

      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);

      // is only the nesting key (key1 = '$(key2)') return the value without stringify
      if (value && match[0] === str && !isString(value)) return value;

      // no string to include or empty
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = '';
      }

      if (formatters.length) {
        value = formatters.reduce(
          (v, f) =>
            this.format(v, f, options.lng, { ...options, interpolationkey: match[1].trim() }),
          value.trim(),
        );
      }

      // Nested keys should not be escaped by default #854
      // Sliced in, not String.replace, so `$&`, `$'`, "$`" and `$$` in the value stay literal.
      // makeString: a formatter in the nesting chain may have returned a non-string.
      out += str.slice(lastEnd, match.index) + makeString(value);
      lastEnd = nestingRegexp.lastIndex;
      this.regexp.lastIndex = 0;
    }
    // no match: str untouched (it may be a non-string)
    return lastEnd ? out + str.slice(lastEnd) : str;
  }
}

export default Interpolator;
