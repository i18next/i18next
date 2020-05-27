import baseLogger from './logger.js';
import EventEmitter from './EventEmitter.js';
import postProcessor from './postProcessor.js';
import * as utils from './utils.js';

const checkedLoadedFor = {};

class Translator extends EventEmitter {
  constructor(services, opt = {}) {
    super();
    if (utils.isIE10) EventEmitter.call(this); // <=IE10 fix (unable to call parent constructor)

    utils.copy(
      [
        'resourceStore',
        'languageUtils',
        'pluralResolver',
        'interpolator',
        'backendConnector',
        'i18nFormat',
        'utils',
      ],
      services,
      this,
    );

    this.options = opt;
    if (this.options.keySeparator === undefined) this.options.keySeparator = '.';

    this.logger = baseLogger.create('translator');
  }

  changeLanguage(lng) {
    if (lng) this.language = lng;
  }

  exists(key, opt = { interpolation: {} }) {
    const r = this.resolve(key, opt);
    return r && r.res !== undefined;
  }

  extractFromKey(key, opt) {
    let nsSep = opt.nsSeparator || this.options.nsSeparator;
    if (nsSep === undefined) nsSep = ':';

    const keySep = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;

    let namespaces = opt.ns || this.options.defaultNS;
    if (nsSep && key.indexOf(nsSep) > -1) {
      const parts = key.split(nsSep);
      if (nsSep !== keySep || (nsSep === keySep && this.options.ns.indexOf(parts[0]) > -1))
        namespaces = parts.shift();
      key = parts.join(keySep);
    }
    if (typeof namespaces === 'string') namespaces = [namespaces];

    return {
      key,
      namespaces,
    };
  }

  translate(keys, opt) {
    if (typeof opt !== 'object' && this.options.overloadTranslationOptionHandler) {
      /* eslint prefer-rest-params: 0 */
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (!opt) opt = {};

    // non valid keys handling
    if (keys === undefined || keys === null /* || keys === ''*/) return '';
    if (!Array.isArray(keys)) keys = [String(keys)];

    // separators
    const keySep = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;

    // get namespace(s)
    const { key, namespaces } = this.extractFromKey(keys[keys.length - 1], opt);
    const ns = namespaces[namespaces.length - 1];

    // return key on CIMode
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode =
      opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        const nsSeparator = opt.nsSeparator || this.options.nsSeparator;
        return ns + nsSeparator + key;
      }
      return key;
    }

    // resolve from store
    const resolved = this.resolve(keys, opt);
    let res = resolved && resolved.res;
    const resUsedKey = (resolved && resolved.usedKey) || key;
    const resExactUsedKey = (resolved && resolved.exactUsedKey) || key;

    const resType = Object.prototype.toString.apply(res);
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    const joinArrays = opt.joinArrays !== undefined ? opt.joinArrays : this.options.joinArrays;

    // object
    const hndAsObjInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const hndAsObj = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (
      hndAsObjInI18nFormat &&
      res &&
      hndAsObj &&
      noObject.indexOf(resType) < 0 &&
      !(typeof joinArrays === 'string' && resType === '[object Array]')
    ) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects opt is not enabled!');
        return this.options.returnedObjectHandler
          ? this.options.returnedObjectHandler(resUsedKey, res, opt)
          : `key '${key} (${this.language})' returned an object instead of string.`;
      }

      // if we got a separator we loop over children - else we just return object as is
      // as having it set to false means no hierarchy so no lookup for nested values
      if (keySep) {
        const resTypeIsArray = resType === '[object Array]';
        const copy = resTypeIsArray ? [] : {}; // apply child translation on a copy

        /* eslint no-restricted-syntax: 0 */
        let newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            const deepKey = `${newKeyToUse}${keySep}${m}`;
            copy[m] = this.translate(deepKey, {
              ...opt,
              ...{ joinArrays: false, ns: namespaces },
            });
            if (copy[m] === deepKey) copy[m] = res[m]; // if nothing found use orginal value as fallback
          }
        }
        res = copy;
      }
    } else if (
      hndAsObjInI18nFormat &&
      typeof joinArrays === 'string' &&
      resType === '[object Array]'
    ) {
      // array special treatment
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt);
    } else {
      // string, empty or null
      let usedDefault = false;
      let usedKey = false;

      // fallback value
      if (!this.isValidLookup(res) && opt.defaultValue !== undefined) {
        usedDefault = true;

        if (opt.count !== undefined) {
          const suffix = this.pluralResolver.getSuffix(lng, opt.count);
          res = opt[`defaultValue${suffix}`];
        }
        if (!res) res = opt.defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }

      // save missing
      const updMissing = opt.defaultValue && opt.defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updMissing) {
        this.logger.log(
          updMissing ? 'updateKey' : 'missingKey',
          lng,
          ns,
          key,
          updMissing ? opt.defaultValue : res,
        );

        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(
          this.options.fallbackLng,
          opt.lng || this.language,
        );
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }

        const send = (l, k) => {
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(
              l,
              ns,
              k,
              updMissing ? opt.defaultValue : res,
              updMissing,
              opt,
            );
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(
              l,
              ns,
              k,
              updMissing ? opt.defaultValue : res,
              updMissing,
              opt,
            );
          }
          this.emit('missingKey', l, ns, k, res);
        };

        if (this.options.saveMissing) {
          const doPlHnd = opt.count !== undefined && typeof opt.count !== 'string';
          if (this.options.saveMissingPlurals && doPlHnd) {
            lngs.forEach(l => {
              const plurals = this.pluralResolver.getPluralFormsOfKey(l, key);
              plurals.forEach(p => send([l], p));
            });
          } else {
            send(lngs, key);
          }
        }
      }

      // extend
      res = this.extendTranslation(res, keys, opt, resolved);

      // append namespace if still key
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${ns}:${key}`;

      // parseMissingKeyHandler
      if (usedKey && this.options.parseMissingKeyHandler)
        res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  }

  extendTranslation(res, key, opt, resolved) {
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, opt, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved,
      });
    } else if (!opt.skipInterpolation) {
      // i18next.parsing
      if (opt.interpolation)
        this.interpolator.init({
          ...opt,
          ...{ interpolation: { ...this.options.interpolation, ...opt.interpolation } },
        });

      // interpolate
      let data = opt.replace && typeof opt.replace !== 'string' ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables)
        data = { ...this.options.interpolation.defaultVariables, ...data };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language, opt);

      // nesting
      if (opt.nest !== false)
        res = this.interpolator.nest(res, (...args) => this.translate(...args), opt);

      if (opt.interpolation) this.interpolator.reset();
    }

    // post process
    const postP = opt.postProcess || this.options.postProcess;
    const postPNames = typeof postP === 'string' ? [postP] : postP;

    if (
      res !== undefined &&
      res !== null &&
      postPNames &&
      postPNames.length &&
      opt.applyPostProcessor !== false
    ) {
      res = postProcessor.handle(
        postPNames,
        res,
        key,
        this.options && this.options.postProcessPassResolved
          ? { i18nResolved: resolved, ...opt }
          : opt,
        this,
      );
    }

    return res;
  }

  resolve(keys, opt = {}) {
    let found;
    let usedKey; // plain key
    let exactUsedKey; // key with context / plural
    let usedLng;
    let usedNS;

    if (typeof keys === 'string') keys = [keys];

    // forEach possible key
    keys.forEach(k => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let nss = extracted.namespaces;
      if (this.options.fallbackNS) nss = nss.concat(this.options.fallbackNS);

      const doPlHnd = opt.count !== undefined && typeof opt.count !== 'string';
      const doCtxHnd =
        opt.context !== undefined && typeof opt.context === 'string' && opt.context !== '';

      const codes = opt.lngs
        ? opt.lngs
        : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);

      nss.forEach(ns => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;

        if (
          !checkedLoadedFor[`${codes[0]}-${ns}`] &&
          this.utils &&
          this.utils.hasLoadedNamespace &&
          !this.utils.hasLoadedNamespace(usedNS)
        ) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(
            `key "${usedKey}" for namespace "${usedNS}" for languages "${codes.join(
              ', ',
            )}" won't get resolved as namespace was not yet loaded`,
            'This means something IS WRONG in your application setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!',
          );
        }

        codes.forEach(code => {
          if (this.isValidLookup(found)) return;
          usedLng = code;

          let finalKey = key;
          const finalKeys = [finalKey];

          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (doPlHnd) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count);

            // fallback for plural if context not found
            if (doPlHnd && doCtxHnd) finalKeys.push(finalKey + pluralSuffix);

            // get key for context if needed
            if (doCtxHnd)
              finalKeys.push((finalKey += `${this.options.contextSeparator}${opt.context}`));

            // get key for plural if needed
            if (doPlHnd) finalKeys.push((finalKey += pluralSuffix));
          }

          // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
          let possibleKey;
          /* eslint no-cond-assign: 0 */
          while ((possibleKey = finalKeys.pop())) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });

    return { res: found, usedKey, exactUsedKey, usedLng, usedNS };
  }

  isValidLookup(res) {
    return (
      res !== undefined &&
      !(!this.options.returnNull && res === null) &&
      !(!this.options.returnEmptyString && res === '')
    );
  }

  getResource(code, ns, key, opt = {}) {
    if (this.i18nFormat && this.i18nFormat.getResource)
      return this.i18nFormat.getResource(code, ns, key, opt);
    return this.resourceStore.getResource(code, ns, key, opt);
  }
}

export default Translator;
