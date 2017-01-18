import baseLogger from './logger';
import EventEmitter from './EventEmitter';
import ResourceStore from './ResourceStore';
import Translator from './Translator';
import LanguageUtils from './LanguageUtils';
import PluralResolver from './PluralResolver';
import Interpolator from './Interpolator';
import BackendConnector from './BackendConnector';
import CacheConnector from './CacheConnector';
import { get as getDefaults, transformOptions } from './defaults';
import postProcessor from './postProcessor';

import * as compat from './compatibility/v1';

function noop() {};

class I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {};

    if (callback && !this.isInitialized) this.init(options, callback);
  }

  init(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!options) options = {};

    if (options.compatibilityAPI === 'v1') {
      this.options = {...getDefaults(), ...transformOptions(compat.convertAPIOptions(options)), ...{}};
    } else if (options.compatibilityJSON === 'v1') {
      this.options = {...getDefaults(), ...transformOptions(compat.convertJSONOptions(options)), ...{}};
    } else {
      this.options = {...getDefaults(), ...this.options, ...transformOptions(options)};
    }
    if (!callback) callback = noop;

    function createClassOnDemand(ClassOrObject) {
      if (!ClassOrObject) return;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    }

    // init services
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }

      const lu = new LanguageUtils(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);

      var s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.resourceStore.on('added removed', (lng, ns) => {
        s.cacheConnector.save();
      });
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {prepend: this.options.pluralSeparator, compatibilityJSON:  this.options.compatibilityJSON});
      s.interpolator = new Interpolator(this.options);

      s.backendConnector = new BackendConnector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      // pipe events from backendConnector
      s.backendConnector.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });

      s.backendConnector.on('loaded', (loaded) => {
        s.cacheConnector.save();
      });

      s.cacheConnector = new CacheConnector(createClassOnDemand(this.modules.cache), s.resourceStore, s, this.options);
      // pipe events from backendConnector
      s.cacheConnector.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });

      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        s.languageDetector.init(s, this.options.detection, this.options);
      }

      this.translator = new Translator(this.services, this.options);
      // pipe events from translator
      this.translator.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });
    }

    // append api
    const storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle'];
    storeApi.forEach(fcName => {
      this[fcName] = function() { return this.store[fcName].apply(this.store, arguments); };
    });

    // TODO: COMPATIBILITY remove this
    if (this.options.compatibilityAPI === 'v1') compat.appendBackwardsAPI(this);

    const load = () => {
      this.changeLanguage(this.options.lng, (err, t) => {
        this.isInitialized = true;
        this.logger.log('initialized', this.options);
        this.emit('initialized', this.options);

        callback(err, t);
      });
    }

    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }

    return this;
  }

  loadResources(callback = noop) {
    if (!this.options.resources) {
      if (this.language && this.language.toLowerCase() === 'cimode') return callback(); // avoid loading resources for cimode

      let toLoad = [];

      let append = lng => {
        let lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach(l => {
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };

      append(this.language);

      if (this.options.preload) {
        this.options.preload.forEach(l => {
          append(l);
        });
      }

      this.services.cacheConnector.load(toLoad, this.options.ns, () => {
        this.services.backendConnector.load(toLoad, this.options.ns, callback);
      });
    } else {
      callback(null);
    }
  }

  reloadResources(lngs, ns) {
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    this.services.backendConnector.reload(lngs, ns);
  }

  use(module) {
    if (module.type === 'backend') {
      this.modules.backend = module;
    }

    if (module.type === 'cache') {
      this.modules.cache = module;
    }

    if (module.type === 'logger' || (module.log && module.warn && module.warn)) {
      this.modules.logger = module;
    }

    if (module.type === 'languageDetector') {
      this.modules.languageDetector = module;
    }

    if (module.type === 'postProcessor') {
      postProcessor.addPostProcessor(module);
    }

    return this;
  }

  changeLanguage(lng, callback) {
    let done = (err) => {
      if (lng) {
        this.emit('languageChanged', lng);
        this.logger.log('languageChanged', lng);
      }

      if (callback) callback(err, (...args) => { return this.t.apply(this, args); });
    };

    if (!lng && this.services.languageDetector) lng = this.services.languageDetector.detect();

    if (lng) {
      this.language = lng;
      this.languages = this.services.languageUtils.toResolveHierarchy(lng);

      this.translator.changeLanguage(lng);

      if (this.services.languageDetector) this.services.languageDetector.cacheUserLanguage(lng);
    }

    this.loadResources((err) => {
      done(err);
    });
  }

  getFixedT(lng, ns) {
    let fixedT = (key, opts = {}) => {
      const options = { ...opts };
      options.lng = options.lng || fixedT.lng;
      options.ns = options.ns || fixedT.ns;
      return this.t(key, options);
    };
    fixedT.lng = lng;
    fixedT.ns = ns;
    return fixedT;
  }

  t() {
    return this.translator && this.translator.translate.apply(this.translator, arguments);
  }

  exists() {
    return this.translator && this.translator.exists.apply(this.translator, arguments);
  }

  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }

  loadNamespaces(ns, callback) {
    if (!this.options.ns) return callback && callback();
    if (typeof ns === 'string') ns = [ns];

    ns.forEach(n => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });

    this.loadResources(callback);
  }

  loadLanguages(lngs, callback) {
    if (typeof lngs === 'string') lngs = [lngs];
    const preloaded = this.options.preload || [];

    const newLngs = lngs.filter(lng => {
      return preloaded.indexOf(lng) < 0;
    });
    // Exit early if all given languages are already preloaded
    if (!newLngs.length) return callback();

    this.options.preload = preloaded.concat(newLngs);
    this.loadResources(callback);
  }

  dir(lng) {
    if (!lng) lng = this.language;
    if (!lng) return 'rtl';

    const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm',
      'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb',
      'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he',
      'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo',
      'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'
    ];

    return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
  }

  createInstance(options = {}, callback) {
    return new I18n(options, callback);
  }

  cloneInstance(options = {}, callback = noop) {
    let clone = new I18n({...options, ...this.options, ...{isClone: true}}, callback);
    const membersToCopy = ['store', 'services', 'language'];
    membersToCopy.forEach(m => {
      clone[m] = this[m];
    });
    clone.translator = new Translator(clone.services, clone.options);
    clone.translator.on('*', (event, ...args) => {
      clone.emit(event, ...args);
    });

    return clone;
  }
}

export default new I18n();
