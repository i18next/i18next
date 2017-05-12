import * as utils from './utils';
import baseLogger from './logger';
import EventEmitter from './EventEmitter';

function remove(arr, what) {
  let found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

class Connector extends EventEmitter {
  constructor(backend, store, services, options = {}) {
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.options = options;
    this.logger = baseLogger.create('backendConnector');

    this.state = {};
    this.queue = [];

    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }

  queueLoad(languages, namespaces, callback) {
    // find what needs to be loaded
    const toLoad = [];
    const pending = [];
    const toLoadLanguages = [];
    const toLoadNamespaces = [];

    languages.forEach((lng) => {
      let hasAllNamespaces = true;

      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;

        if (this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2; // loaded
        } else if (this.state[name] < 0) {
          // nothing to do for err
        } else if (this.state[name] === 1) {
          if (pending.indexOf(name) < 0) pending.push(name);
        } else {
          this.state[name] = 1; // pending

          hasAllNamespaces = false;

          if (pending.indexOf(name) < 0) pending.push(name);
          if (toLoad.indexOf(name) < 0) toLoad.push(name);
          if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
        }
      });

      if (!hasAllNamespaces) toLoadLanguages.push(lng);
    });

    if (toLoad.length || pending.length) {
      this.queue.push({
        pending,
        loaded: {},
        errors: [],
        callback
      });
    }

    return {
      toLoad,
      pending,
      toLoadLanguages,
      toLoadNamespaces
    };
  }

  loaded(name, err, data) {
    const [lng, ns] = name.split('|');

    if (err) this.emit('failedLoading', lng, ns, err);

    if (data) {
      this.store.addResourceBundle(lng, ns, data);
    }

    // set loaded
    this.state[name] = err ? -1 : 2;

    // callback if ready
    this.queue.forEach((q) => {
      utils.pushPath(q.loaded, [lng], ns);
      remove(q.pending, name);

      if (err) q.errors.push(err);

      if (q.pending.length === 0 && !q.done) {
        this.emit('loaded', q.loaded);
        /* eslint no-param-reassign: 0 */
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });

    // remove done load requests
    this.queue = this.queue.filter(q => !q.done);
  }

  read(lng, ns, fcName, tried = 0, wait = 250, callback) {
    if (!lng.length) return callback(null, {}); // noting to load

    return this.backend[fcName](lng, ns, (err, data) => {
      if (err && data /* = retryFlag */ && tried < 5) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    });
  }

  /* eslint consistent-return: 0 */
  load(languages, namespaces, callback) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
      return callback && callback();
    }
    const options = { ...this.backend.options, ...this.options.backend };

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    const toLoad = this.queueLoad(languages, namespaces, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback(); // nothing to load and no pendings...callback now
      return null; // pendings will trigger callback
    }

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(toLoad.toLoadLanguages, toLoad.toLoadNamespaces, 'readMulti', null, null, (err, data) => {
        if (err) this.logger.warn(`loading namespaces ${toLoad.toLoadNamespaces.join(', ')} for languages ${toLoad.toLoadLanguages.join(', ')} via multiloading failed`, err);
        if (!err && data) this.logger.log(`successfully loaded namespaces ${toLoad.toLoadNamespaces.join(', ')} for languages ${toLoad.toLoadLanguages.join(', ')} via multiloading`, data);

        toLoad.toLoad.forEach((name) => {
          const [l, n] = name.split('|');

          const bundle = utils.getPath(data, [l, n]);
          if (bundle) {
            this.loaded(name, err, bundle);
          } else {
            const error = `loading namespace ${n} for language ${l} via multiloading failed`;
            this.loaded(name, error);
            this.logger.error(error);
          }
        });
      });
    } else {
      toLoad.toLoad.forEach((name) => {
        this.loadOne(name);
      });
    }
  }

  reload(languages, namespaces) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
    }
    const options = { ...this.backend.options, ...this.options.backend };

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(languages, namespaces, 'readMulti', null, null, (err, data) => {
        if (err) this.logger.warn(`reloading namespaces ${namespaces.join(', ')} for languages ${languages.join(', ')} via multiloading failed`, err);
        if (!err && data) this.logger.log(`successfully reloaded namespaces ${namespaces.join(', ')} for languages ${languages.join(', ')} via multiloading`, data);

        languages.forEach((l) => {
          namespaces.forEach((n) => {
            const bundle = utils.getPath(data, [l, n]);
            if (bundle) {
              this.loaded(`${l}|${n}`, err, bundle);
            } else {
              const error = `reloading namespace ${n} for language ${l} via multiloading failed`;
              this.loaded(`${l}|${n}`, error);
              this.logger.error(error);
            }
          });
        });
      });
    } else {
      languages.forEach((l) => {
        namespaces.forEach((n) => {
          this.loadOne(`${l}|${n}`, 're');
        });
      });
    }
  }

  loadOne(name, prefix = '') {
    const [lng, ns] = name.split('|');

    this.read(lng, ns, 'read', null, null, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);

      this.loaded(name, err, data);
    });
  }

  saveMissing(languages, namespace, key, fallbackValue) {
    if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);

    // write to store to avoid resending
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}

export default Connector;
