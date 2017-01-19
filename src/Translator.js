import baseLogger from './logger';
import EventEmitter from './EventEmitter';
import postProcessor from './postProcessor';
import * as compat from './compatibility/v1';
import * as utils from './utils';

class Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();

    utils.copy(['resourceStore','languageUtils','pluralResolver','interpolator','backendConnector'], services, this);

    this.options = options;
    this.logger = baseLogger.create('translator');
  }

  changeLanguage(lng) {
    if (lng) this.language = lng;
  }

  exists(key, options = { interpolation: {} }) {
    if (this.options.compatibilityAPI === 'v1') {
      options = compat.convertTOptions(options);
    }

    return this.resolve(key, options) !== undefined;
  }

  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator || this.options.nsSeparator
    if (nsSeparator === undefined ) nsSeparator = ':';

    let namespaces = options.ns || this.options.defaultNS;
    if (nsSeparator && key.indexOf(nsSeparator) > -1) {
      const parts = key.split(nsSeparator);
      namespaces = parts[0];
      key = parts[1];
    }
    if (typeof namespaces === 'string') namespaces = [namespaces];

    return {
      key: key,
      namespaces: namespaces
    };
  }

  translate(keys, options = {}) {
    if (typeof options !== 'object') {
      options = this.options.overloadTranslationOptionHandler(arguments);
    } else if (this.options.compatibilityAPI === 'v1') {
      options = compat.convertTOptions(options);
    }

    // non valid keys handling
    if (keys === undefined || keys === null || keys === '') return '';
    if (typeof keys === 'number') keys = String(keys);
    if (typeof keys === 'string') keys = [keys];

    // separators
    let keySeparator = options.keySeparator || this.options.keySeparator || '.';

    // get namespace(s)
    let { key, namespaces } = this.extractFromKey(keys[keys.length - 1], options);
    let namespace = namespaces[namespaces.length - 1];

    // return key on CIMode
    let lng = options.lng || this.language;
    let appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        let nsSeparator = options.nsSeparator || this.options.nsSeparator
        return namespace + nsSeparator + key;
      }

      return key;
    }

    // resolve from store
    let res = this.resolve(keys, options);

    let resType = Object.prototype.toString.apply(res);
    let noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    let joinArrays = options.joinArrays !== undefined ?  options.joinArrays : this.options.joinArrays;

    // object
    if (res && typeof res !== 'string' && noObject.indexOf(resType) < 0 && !(joinArrays && resType === '[object Array]')) {
      if (!options.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(key, res, options): `key '${key} (${this.language})' returned an object instead of string.`;
      }

      let copy = (resType === '[object Array]') ? [] : {}; // apply child translation on a copy

      for (let m in res) {
        copy[m] = this.translate(`${key}${keySeparator}${m}`, {...{joinArrays: false, ns: namespaces}, ...options});
      }
      res = copy;
    }
    // array special treatment
    else if (joinArrays && resType === '[object Array]') {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, key, options);
    }
    // string, empty or null
    else {
      let usedDefault = false,
        usedKey = false;

      // fallback value
      if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
        usedDefault = true;
        res = options.defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }

      // save missing
      if (usedKey || usedDefault) {
        this.logger.log('missingKey', lng, namespace, key, res);

        var lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {//(this.options.saveMissingTo === 'current' || (this.options.saveMissingTo === 'fallback' && this.options.fallbackLng[0] === false) ) {
          lngs.push(options.lng || this.language);
        }

        if (this.options.saveMissing) {
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(lngs, namespace, key, res);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(lngs, namespace, key, res);
          }
        }

        this.emit('missingKey', lngs, namespace, key, res);
      }

      // extend
      res = this.extendTranslation(res, key, options);

      // append namespace if still key
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;

      // parseMissingKeyHandler
      if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  }

  extendTranslation(res, key, options) {
    if (options.interpolation) this.interpolator.init({ ...options, ...{ interpolation: { ...this.options.interpolation, ...options.interpolation } } });

    // interpolate
    let data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
    if (this.options.interpolation.defaultVariables) data = {...this.options.interpolation.defaultVariables, ...data};
    res = this.interpolator.interpolate(res, data, this.language);

    // nesting
    res = this.interpolator.nest(res, (...args) => { return this.translate.apply(this, args); }, options);

    if (options.interpolation) this.interpolator.reset();

    // post process
    let postProcess = options.postProcess || this.options.postProcess;
    let postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

    if (res !== undefined &&
      postProcessorNames &&
      postProcessorNames.length &&
      options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, options, this);
    }

    return res;
  }

  resolve(keys, options = {}) {
    let found;

    if (typeof keys === 'string') keys = [keys];

    // forEach possible key
    keys.forEach(k => {
      if (this.isValidLookup(found)) return;

      let { key, namespaces } = this.extractFromKey(k, options);
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);

      let needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
      let needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

      let codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language);

      namespaces.forEach(ns => {
        if (this.isValidLookup(found)) return;

        codes.forEach(code => {
          if (this.isValidLookup(found)) return;

          let finalKey = key;
          let finalKeys = [finalKey];

          let pluralSuffix;
          if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count);

          // fallback for plural if context not found
          if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);

          // get key for context if needed
          if (needsContextHandling) finalKeys.push(finalKey += `${this.options.contextSeparator}${options.context}`);

          // get key for plural if needed
          if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);

          // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
          let possibleKey;
          while(possibleKey = finalKeys.pop()) {
            if (this.isValidLookup(found)) continue;
            found = this.getResource(code, ns, possibleKey, options);
          }
        });
      });
    });

    return found;
  }

  isValidLookup(res) {
    return res !== undefined &&
      !(!this.options.returnNull && res === null) &&
      !(!this.options.returnEmptyString && res === '');
  }

  getResource(code, ns, key, options = {}) {
    return this.resourceStore.getResource(code, ns, key, options);
  }
}


export default Translator;
