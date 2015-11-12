import * as utils from './utils';
import baseLogger from './logger';
import EventEmitter from './EventEmitter';

class Connector  extends EventEmitter {
  constructor(backend, cache, store, services, options = {}) {
    super();
    this.backend = backend;
    this.cache = cache;
    this.store = store;
    this.services = services;
    this.options = options;
    this.logger = baseLogger.create('backendConnector');

    this.pending = {};

    this.backend.init(services, options.backend, options);
    if (this.cache) this.cache.init(services, options.cache, options);
  }

  load(languages, namespaces, callback) {
    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    // first try loading data from cache
    this.loadFromCache(languages);

    // load with multi-load
    if (this.options.backend.allowMultiLoading && this.backend.readMulti) {
      let loaded = {};

      // find what needs to be loaded
      let toLoadLanguages = [], toLoadNamespaces = [];
      languages.forEach(lng => {
        let hasAllNamespaces = true;
        namespaces.forEach(ns => {
          if (!this.store.hasResourceBundle(lng, ns) &&
              utils.getPath(this.pending, [lng, ns]) !== true) {
            hasAllNamespaces = false;
            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
          }
        });
        if (!hasAllNamespaces) toLoadLanguages.push(lng);
      });

      function read(lng, ns, tried, wait) {
        if (!tried) tried = 0;
        if (!wait) wait = 250;

        if (!lng.length) return callback(); // noting to load

        this.backend.readMulti(lng, ns, (err, data) => {
          if (err && data /* = retryFlag */ && tried < 5) {
            setTimeout(() => {
              read.call(this, lng, ns, ++tried, wait*2);
            }, wait);
            return;
          }

          if (err) this.logger.warn(`loading namespaces ${ns.join(', ')} for languages ${lng.join(', ')} via multiloading failed`, err);

          if (data) {
            toLoadLanguages.forEach(l => {
              toLoadNamespaces.forEach(n => {
                let bundle = utils.getPath(data, [l, n]);
                if (bundle) {
                  this.store.addResourceBundle(l, n, bundle);
                  utils.pushPath(loaded, [l], n);
                }
                // set not pending
                utils.setPath(this.pending, [lng, ns], false);
                if (!bundle) this.logger.error(`loading namespace ${n} for language ${l} via multiloading failed`);
              });
            });
          }

          this.saveToCache();
          this.emit('loaded', loaded);
          callback(err);
        });
      };

      // store pending loads
      toLoadLanguages.forEach(lng => {
        toLoadNamespaces.forEach(ns => {
          utils.setPath(this.pending, [lng, ns], true);
        });
      });

      read.call(this, toLoadLanguages, toLoadNamespaces);
    }

    // load one by one
    else {
      let todo = languages.length * namespaces.length;
      let loaded = {};

      function done() {
        todo--;
        if (!todo) {
          this.saveToCache();
          this.emit('loaded', loaded);
          callback();
        }
      }

      function read(lng, ns, tried, wait) {
        if (!tried) tried = 0;
        if (!wait) wait = 250;

        this.backend.read(lng, ns, (err, data) => {
          if (err && data /*retryFlag*/ && tried < 5) {
            setTimeout(() => {
              read.call(this, lng, ns, ++tried, wait*2);
            }, wait);
            return;
          }

          if (err) this.logger.warn(`loading namespace ${ns} for language ${lng} failed`, err);

          // set not pending
          utils.setPath(this.pending, [lng, ns], false);

          if (data) {
            this.store.addResourceBundle(lng, ns, data);
            utils.pushPath(loaded, [lng], ns);
          }
          done.call(this);
        });
      };

      languages.forEach(lng => {
        namespaces.forEach(ns => {
          if (!this.store.hasResourceBundle(lng, ns) &&
              utils.getPath(this.pending, [lng, ns]) !== true) {
            utils.setPath(this.pending, [lng, ns], true);
            read.call(this, lng, ns);
          } else {
            done.call(this);
          }
        });
      });
    }
  }

  loadFromCache(languages) {
    if (this.cache && this.options.cache && this.options.cache.enabled) {
      this.cache.load(languages, (err, data) => {
        if (err) this.logger.error(`loading languages ${languages.join(', ')} from cache failed`, err);
        if (data) {
          for(var l in data) {
            for (var n in data[l]) {
              if (n === 'i18nStamp') continue;
              let bundle = data[l][n];
              if (bundle) this.store.addResourceBundle(l, n, bundle);
            }
          }
        }
      });
    }
  }

  saveToCache() {
    if (this.cache && this.options.cache && this.options.cache.enabled) this.cache.save(this.store.data);
  }

  saveMissing(languages, namespace, key, fallbackValue) {
    if (this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);

    // write to store to avoid resending
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}


export default Connector;
