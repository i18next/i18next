import baseLogger from './logger.js';
import EventEmitter from './EventEmitter.js';
import postProcessor from './postProcessor.js';
import * as utils from './utils.js';

class Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();

    utils.copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat'], services, this);

    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }

    this.logger = baseLogger.create('translator');
  }

  changeLanguage(lng) {
    if (lng) this.language = lng;
  }

  exists(key, options = { interpolation: {} }) {
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== undefined;
  }

  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator || this.options.nsSeparator;
    if (nsSeparator === undefined) nsSeparator = ':';

    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

    let namespaces = options.ns || this.options.defaultNS;
    if (nsSeparator && key.indexOf(nsSeparator) > -1) {
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || (nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1)) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    if (typeof namespaces === 'string') namespaces = [namespaces];

    return {
      key,
      namespaces
    };
  }

  translate(keys, options) {
    if (typeof options !== 'object' && this.options.overloadTranslationOptionHandler) {
      /* eslint prefer-rest-params: 0 */
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (!options) options = {};

    // non valid keys handling
    if (keys === undefined || keys === null || keys === '') return '';
    if (typeof keys === 'number') keys = String(keys);
    if (typeof keys === 'string') keys = [keys];

    // separators
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

    // get namespace(s)
    const { key, namespaces } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];

    // return key on CIMode
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        return namespace + nsSeparator + key;
      }

      return key;
    }

    // resolve from store
    const resolved = this.resolve(keys, options);
    let res = resolved && resolved.res;
    const resUsedKey = (resolved && resolved.usedKey) || key;

    const resType = Object.prototype.toString.apply(res);
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    const joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;

    // object
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(joinArrays && resType === '[object Array]')) {
      if (!options.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, options) : `key '${key} (${this.language})' returned an object instead of string.`;
      }

      // if we got a separator we loop over children - else we just return object as is
      // as having it set to false means no hierarchy so no lookup for nested values
      if (keySeparator) {
        const copy = (resType === '[object Array]') ? [] : {}; // apply child translation on a copy

        /* eslint no-restricted-syntax: 0 */
        for (const m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            const deepKey = `${resUsedKey}${keySeparator}${m}`;
            copy[m] = this.translate(deepKey, { ...options, ...{ joinArrays: false, ns: namespaces } });
            if (copy[m] === deepKey) copy[m] = res[m]; // if nothing found use orginal value as fallback
          }
        }
        res = copy;
      }
    } else if (handleAsObjectInI18nFormat && joinArrays && resType === '[object Array]') {
      // array special treatment
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options);
    } else {
      // string, empty or null
      let usedDefault = false;
      let usedKey = false;

      // fallback value
      if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
        usedDefault = true;

        if (options.count !== undefined) {
          const suffix = this.pluralResolver.getSuffix(lng, options.count);
          res = options[`defaultValue${suffix}`];
        }
        if (!res) res = options.defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }

      // save missing
      const updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);

        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }

        const send = (l, k) => {
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
          }
          this.emit('missingKey', l, namespace, k, res);
        };

        if (this.options.saveMissing) {
          const needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((l) => {
              const plurals = this.pluralResolver.getPluralFormsOfKey(l, key);

              plurals.forEach(p => send([l], p));
            });
          } else {
            send(lngs, key);
          }
        }
      }

      // extend
      res = this.extendTranslation(res, keys, options, resolved);

      // append namespace if still key
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;

      // parseMissingKeyHandler
      if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  }

  extendTranslation(res, key, options, resolved) {
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
    } else if (!options.skipInterpolation) { // i18next.parsing
      if (options.interpolation) this.interpolator.init({ ...options, ...{ interpolation: { ...this.options.interpolation, ...options.interpolation } } });

      // interpolate
      let data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = { ...this.options.interpolation.defaultVariables, ...data };
      res = this.interpolator.interpolate(res, data, options.lng || this.language);

      // nesting
      if (options.nest !== false) res = this.interpolator.nest(res, (...args) => this.translate(...args), options);

      if (options.interpolation) this.interpolator.reset();
    }

    // post process
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

    if (res !== undefined &&
      res !== null &&
      postProcessorNames &&
      postProcessorNames.length &&
      options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, options, this);
    }

    return res;
  }

  resolve(keys, options = {}) {
    let found;
    let usedKey;
    let usedLng;
    let usedNS;

    if (typeof keys === 'string') keys = [keys];

    // forEach possible key
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);

      const needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
      const needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);

      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;

        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;

          let finalKey = key;
          const finalKeys = [finalKey];

          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count);

            // fallback for plural if context not found
            if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);

            // get key for context if needed
            if (needsContextHandling) finalKeys.push(finalKey += `${this.options.contextSeparator}${options.context}`);

            // get key for plural if needed
            if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
          }

          // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
          let possibleKey;
          /* eslint no-cond-assign: 0 */
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });

    return { res: found, usedKey, usedLng, usedNS };
  }

  isValidLookup(res) {
    return res !== undefined &&
      !(!this.options.returnNull && res === null) &&
      !(!this.options.returnEmptyString && res === '');
  }

  getResource(code, ns, key, options = {}) {
    if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
}

export default Translator;
