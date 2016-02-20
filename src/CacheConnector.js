import * as utils from './utils';
import baseLogger from './logger';
import EventEmitter from './EventEmitter';

class Connector  extends EventEmitter {
  constructor(cache, store, services, options = {}) {
    super();
    this.cache = cache;
    this.store = store;
    this.services = services;
    this.options = options;
    this.logger = baseLogger.create('cacheConnector');

    this.cache && this.cache.init && this.cache.init(services, options.cache, options);
  }

  load(languages, namespaces, callback) {
    if (!this.cache) return callback && callback();
    let options = {...this.cache.options, ...this.options.cache};

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    if (options.enabled) {
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
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  save() {
    if (this.cache && this.options.cache && this.options.cache.enabled) this.cache.save(this.store.data);
  }
}

export default Connector;
