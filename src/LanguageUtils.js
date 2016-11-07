import baseLogger from './logger';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class LanguageUtil {
  constructor(options) {
    this.options = options;

    this.whitelist = this.options.whitelist || false;
    this.logger = baseLogger.create('languageUtils');
  }

  getLanguagePartFromCode(code) {
    if (code.indexOf('-') < 0) return code;

    let specialCases = ['NB-NO', 'NN-NO', 'nb-NO', 'nn-NO', 'nb-no', 'nn-no'];
    let p = code.split('-');
    return this.formatLanguageCode((specialCases.indexOf(code) > -1) ? p[1].toLowerCase() : p[0]);
  }

  getScriptPartFromCode(code) {
    if (code.indexOf('-') < 0) return null;

    let p = code.split('-');
    if (p.length === 2) return null;
    p.pop();
    return this.formatLanguageCode(p.join('-'));
  }

  getLanguagePartFromCode(code) {
    if (code.indexOf('-') < 0) return code;

    let specialCases = ['NB-NO', 'NN-NO', 'nb-NO', 'nn-NO', 'nb-no', 'nn-no'];
    let p = code.split('-');
    return this.formatLanguageCode((specialCases.indexOf(code) > -1) ? p[1].toLowerCase() : p[0]);
  }

  formatLanguageCode(code) {
    // http://www.iana.org/assignments/language-tags/language-tags.xhtml
    if (typeof code === 'string' && code.indexOf('-') > -1) {
      let specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
      let p = code.split('-');

      if (this.options.lowerCaseLng) {
        p = p.map(part => part.toLowerCase());
      } else if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase();

        // if lenght 2 guess it's a country
        if (p[1].length === 2) p[1] = p[1].toUpperCase();
        if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
      }

      return p.join('-');
    } else {
      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }

  isWhitelisted(code, exactMatch) {
     if (this.options.load === 'languageOnly' || (this.options.nonExplicitWhitelist && !exactMatch)) {
            code = this.getLanguagePartFromCode(code);
         }
     return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1 ? true : false;
  }

  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === 'string') fallbacks = [fallbacks];
    if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;

    // asume we have an object defining fallbacks
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks.default;

    return found || [];
  }

  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);

    let codes = [];
    let addCode = (code, exactMatch = false) => {
      if (!code) return;
      if (this.isWhitelisted(code, exactMatch)) {
        codes.push(code);
      } else {
        this.logger.warn('rejecting non-whitelisted language code: ' + code);
      }
    };

    if (typeof code === 'string' && code.indexOf('-') > -1) {
      if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code), true);
      if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code), true);
      if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
    } else if (typeof code === 'string') {
      addCode(this.formatLanguageCode(code));
    }

    fallbackCodes.forEach(fc => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });

    return codes;
  }
};

export default LanguageUtil;
