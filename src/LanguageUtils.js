import baseLogger from './logger';

class LanguageUtil {
  constructor(options) {
    this.options = options;

    this.whitelist = this.options.whitelist || false;
    this.logger = baseLogger.create('languageUtils');
  }

  getLanguagePartFromCode(code) {
    if (code.indexOf('-') < 0) return code;

    let specialCases = ['nb-NO', 'nn-NO', 'nb-no', 'nn-no'];
    let p = code.split('-');
    return this.formatLanguageCode((specialCases.indexOf(code) > -1) ? p[1].toLowerCase() : p[0]);
  }

  formatLanguageCode(code) {
    if (typeof code === 'string' && code.indexOf('-') > -1) {
      const [head, tail] = code.split('-');
      return this.options.lowerCaseLng ?
        `${head.toLowerCase()}-${tail.toLowerCase()}` :
        `${head.toLowerCase()}-${tail.toUpperCase()}`;
    } else {
      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }

  isWhitelisted(code) {
    if (this.options.load === 'languageOnly') code = this.getLanguagePartFromCode(code);
    return (!this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1) ? true : false;
  }

  toResolveHierarchy(code, fallbackCode) {
    fallbackCode = fallbackCode || this.options.fallbackLng || [];
    if (typeof fallbackCode === 'string') fallbackCode = [fallbackCode];

    let codes = [];
    let addCode = (code) => {
      if (this.isWhitelisted(code)) {
        codes.push(code);
      } else {
        this.logger.warn('rejecting non-whitelisted language code: ' + code);
      }
    };

    if (typeof code === 'string' && code.indexOf('-') > -1) {
      if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
      if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
    } else if (typeof code === 'string') {
      addCode(this.formatLanguageCode(code));
    }

    fallbackCode.forEach(fc => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });

    return codes;
  }
};

export default LanguageUtil;
