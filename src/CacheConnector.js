import baseLogger from './logger';
import EventEmitter from './EventEmitter';

class Connector extends EventEmitter {
  constructor(cache, store, services, options = {}) {
    super();
    this.cache = cache;
    this.store = store;
    this.services = services;
    this.options = options;
    this.logger = baseLogger.create('cacheConnector');

    if (this.cache && this.cache.init) this.cache.init(services, options.cache, options);
  }

  /* eslint consistent-return: 0 */
  load(languages, namespaces, callback) {
    if (!this.cache) return callback && callback();
    const options = { ...this.cache.options, ...this.options.cache };

    const loadLngs = (typeof languages === 'string') ? this.services.languageUtils.toResolveHierarchy(languages) : languages;

    if (options.enabled) {
      this.cache.load(loadLngs, (err, data) => {
        if (err) this.logger.error(`loading languages ${loadLngs.join(', ')} from cache failed`, err);
        if (data) {
          /* eslint no-restricted-syntax: 0 */
          for (const l in data) {
            if (Object.prototype.hasOwnProperty.call(data, l)) {
              for (const n in data[l]) {
                if (Object.prototype.hasOwnProperty.call(data[l], n)) {
                  if (n !== 'i18nStamp') {
                    const bundle = data[l][n];
                    if (bundle) this.store.addResourceBundle(l, n, bundle);
                  }
                }
              }
            }
          }
        }
        if (callback) callback();
      });
    } else if (callback) {
      callback();
    }
  }

  save() {
    if (this.cache && this.options.cache && this.options.cache.enabled) this.cache.save(this.store.data);
  }
}

export default Connector;
