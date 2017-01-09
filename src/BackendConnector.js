import * as utils from './utils';
import baseLogger from './logger';
import EventEmitter from './EventEmitter';

function remove(arr, what) {
  var found = arr.indexOf(what);

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

    this.backend && this.backend.init && this.backend.init(services, options.backend, options);
  }

  queueLoad(languages, namespaces, callback) {
    // find what needs to be loaded
    let toLoad = [], pending = [], toLoadLanguages = [], toLoadNamespaces = [];

    languages.forEach(lng => {
      let hasAllNamespaces = true;

      namespaces.forEach(ns => {
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

    if (toLoad.length || pending.length) {
      this.queue.push({
        pending: pending,
        loaded: {},
        errors: [],
        callback: callback
      });
    }

    return {
      toLoad: toLoad,
      pending: pending,
      toLoadLanguages: toLoadLanguages,
      toLoadNamespaces: toLoadNamespaces
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
    this.queue.forEach(q => {
      utils.pushPath(q.loaded, [lng], ns);
      remove(q.pending, name);

      if (err) q.errors.push(err);

      if (q.pending.length === 0 && !q.done) {
        this.emit('loaded', q.loaded);
        q.errors.length ? q.callback(q.errors) : q.callback();
        q.done = true;
      }
    });

    // remove done load requests
    this.queue = this.queue.filter(q => {
      return !q.done;
    });
  }

  read(lng, ns, fcName, tried, wait, callback) {
    if (!tried) tried = 0;
    if (!wait) wait = 250;

    if (!lng.length) return callback(null, {}); // noting to load

    this.backend[fcName](lng, ns, (err, data) => {
      if (err && data /* = retryFlag */ && tried < 5) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, ++tried, wait*2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    });
  }

  load(languages, namespaces, callback) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.')
      return callback && callback();
    }
    let options = {...this.backend.options, ...this.options.backend};

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    let toLoad = this.queueLoad(languages, namespaces, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback(); // nothing to load and no pendings...callback now
      return; // pendings will trigger callback
    }

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(toLoad.toLoadLanguages, toLoad.toLoadNamespaces, 'readMulti', null, null, (err, data) => {
        if (err) this.logger.warn(`loading namespaces ${toLoad.toLoadNamespaces.join(', ')} for languages ${toLoad.toLoadLanguages.join(', ')} via multiloading failed`, err);
        if (!err && data) this.logger.log(`loaded namespaces ${toLoad.toLoadNamespaces.join(', ')} for languages ${toLoad.toLoadLanguages.join(', ')} via multiloading`, data);

        toLoad.toLoad.forEach(name => {
          const [l, n] = name.split('|');

          let bundle = utils.getPath(data, [l, n]);
          if (bundle) {
            this.loaded(name, err, bundle);
          } else {
            let err = `loading namespace ${n} for language ${l} via multiloading failed`;
            this.loaded(name, err);
            this.logger.error(err);
          }
        });
      });
    }

    // load one by one
    else {
      function readOne(name) {
        const [lng, ns] = name.split('|');

        this.read(lng, ns, 'read', null, null, (err, data) => {
          if (err) this.logger.warn(`loading namespace ${ns} for language ${lng} failed`, err);
          if (!err && data) this.logger.log(`loaded namespace ${ns} for language ${lng}`, data);

          this.loaded(name, err, data);
        });
      };

      toLoad.toLoad.forEach(name => {
        readOne.call(this, name);
      });
    }
  }

  reload(languages, namespaces) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
    }
    let options = {...this.backend.options, ...this.options.backend};

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(languages, namespaces, 'readMulti', null, null, (err, data) => {
        if (err) this.logger.warn(`reloading namespaces ${namespaces.join(', ')} for languages ${languages.join(', ')} via multiloading failed`, err);
        if (!err && data) this.logger.log(`reloaded namespaces ${namespaces.join(', ')} for languages ${languages.join(', ')} via multiloading`, data);

        languages.forEach(l => {
          namespaces.forEach(n => {
            let bundle = utils.getPath(data, [l, n]);
            if (bundle) {
              this.loaded(`${l}|${n}`, err, bundle);
            } else {
              let err = `reloading namespace ${n} for language ${l} via multiloading failed`;
              this.loaded(`${l}|${n}`, err);
              this.logger.error(err);
            }
          });
        });
      });
    }

    // load one by one
    else {
      function readOne(name) {
        const [lng, ns] = name.split('|');

        this.read(lng, ns, 'read', null, null, (err, data) => {
          if (err) this.logger.warn(`reloading namespace ${ns} for language ${lng} failed`, err);
          if (!err && data) this.logger.log(`reloaded namespace ${ns} for language ${lng}`, data);

          this.loaded(name, err, data);
        });
      };

      languages.forEach(l => {
        namespaces.forEach(n => {
          readOne.call(this, `${l}|${n}`);
        });
      });
    }
  }


  saveMissing(languages, namespace, key, fallbackValue) {
    if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);

    // write to store to avoid resending
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}

export default Connector;
