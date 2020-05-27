import * as utils from './utils.js';
import baseLogger from './logger.js';
import EventEmitter from './EventEmitter.js';

function remove(arr, what) {
  let found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

class Connector extends EventEmitter {
  constructor(backend, store, services, opt = {}) {
    super();
    if (utils.isIE10) {
      EventEmitter.call(this); // <=IE10 fix (unable to call parent constructor)
    }

    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = opt;
    this.logger = baseLogger.create('backendConnector');

    this.state = {};
    this.queue = [];

    if (this.backend && this.backend.init) {
      this.backend.init(services, opt.backend, opt);
    }
  }

  queueLoad(languages, nss, opt, clb) {
    // find what needs to be loaded
    const toLoad = [];
    const pending = [];
    const toLoadLanguages = [];
    const toLoadNamespaces = [];

    languages.forEach(lng => {
      let hasAllNss = true;

      nss.forEach(ns => {
        const name = `${lng}|${ns}`;

        if (!opt.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2; // loaded
        } else if (this.state[name] < 0) {
          // nothing to do for err
        } else if (this.state[name] === 1) {
          if (pending.indexOf(name) < 0) pending.push(name);
        } else {
          this.state[name] = 1; // pending

          hasAllNss = false;

          if (pending.indexOf(name) < 0) pending.push(name);
          if (toLoad.indexOf(name) < 0) toLoad.push(name);
          if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
        }
      });

      if (!hasAllNss) toLoadLanguages.push(lng);
    });

    if (toLoad.length || pending.length) {
      this.queue.push({
        pending,
        loaded: {},
        errors: [],
        clb,
      });
    }

    return {
      toLoad,
      pending,
      toLoadLanguages,
      toLoadNamespaces,
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

    // consolidated loading done in this run - only emit once for a loaded namespace
    const loaded = {};

    // clb if ready
    this.queue.forEach(q => {
      utils.pushPath(q.loaded, [lng], ns);
      remove(q.pending, name);

      if (err) q.errors.push(err);

      if (q.pending.length === 0 && !q.done) {
        // only do once per loaded -> this.emit('loaded', q.loaded);
        Object.keys(q.loaded).forEach(l => {
          if (!loaded[l]) loaded[l] = [];
          if (q.loaded[l].length) {
            q.loaded[l].forEach(ns => {
              if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
            });
          }
        });

        /* eslint no-param-reassign: 0 */
        q.done = true;
        if (q.errors.length) {
          q.clb(q.errors);
        } else {
          q.clb();
        }
      }
    });

    // emit consolidated loaded event
    this.emit('loaded', loaded);

    // remove done load requests
    this.queue = this.queue.filter(q => !q.done);
  }

  read(lng, ns, fcName, tried = 0, wait = 350, clb) {
    if (!lng.length) return clb(null, {}); // noting to load

    return this.backend[fcName](lng, ns, (err, data) => {
      if (err && data /* = retryFlag */ && tried < 5) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, clb);
        }, wait);
        return;
      }
      clb(err, data);
    });
  }

  /* eslint consistent-return: 0 */
  prepareLoading(languages, namespaces, opt = {}, clb) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
      return clb && clb();
    }

    if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    const toLoad = this.queueLoad(languages, namespaces, opt, clb);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) clb(); // nothing to load and no pendings...clb now
      return null; // pendings will trigger clb
    }

    toLoad.toLoad.forEach(name => {
      this.loadOne(name);
    });
  }

  load(languages, namespaces, clb) {
    this.prepareLoading(languages, namespaces, {}, clb);
  }

  reload(languages, namespaces, clb) {
    this.prepareLoading(languages, namespaces, { reload: true }, clb);
  }

  loadOne(name, prefix = '') {
    const [lng, ns] = name.split('|');

    this.read(lng, ns, 'read', undefined, undefined, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data)
        this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);

      this.loaded(name, err, data);
    });
  }

  saveMissing(languages, namespace, key, fallbackValue, isUpdate, opt = {}) {
    if (
      this.services.utils &&
      this.services.utils.hasLoadedNamespace &&
      !this.services.utils.hasLoadedNamespace(namespace)
    ) {
      this.logger.warn(
        `did not save key "${key}" for namespace "${namespace}" as the namespace was not yet loaded`,
        'This means something IS WRONG in your application setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the clb or Promise to resolve before accessing it!!!',
      );
      return;
    }

    // ignore non valid keys
    if (key === undefined || key === null || key === '') return;

    if (this.backend && this.backend.create) {
      this.backend.create(languages, namespace, key, fallbackValue, null /* unused clb */, {
        ...opt,
        isUpdate,
      });
    }

    // write to store to avoid resending
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}

export default Connector;
