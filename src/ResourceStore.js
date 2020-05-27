import EventEmitter from './EventEmitter.js';
import * as utils from './utils.js';

class ResourceStore extends EventEmitter {
  constructor(data, opt = { ns: ['translation'], defaultNS: 'translation' }) {
    super();
    if (utils.isIE10) {
      EventEmitter.call(this); // <=IE10 fix (unable to call parent constructor)
    }

    this.data = data || {};
    this.options = opt;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
  }

  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }

  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }

  getResource(lng, ns, key, opt = {}) {
    const keySeparator =
      opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;

    let path = [lng, ns];
    if (key && typeof key !== 'string') path = path.concat(key);
    if (key && typeof key === 'string')
      path = path.concat(keySeparator ? key.split(keySeparator) : key);

    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
    }

    return utils.getPath(this.data, path);
  }

  addResource(lng, ns, key, value, opt = { silent: false }) {
    let keySeparator = this.options.keySeparator;
    if (keySeparator === undefined) keySeparator = '.';

    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      value = ns;
      ns = path[1];
    }

    this.addNamespaces(ns);

    utils.setPath(this.data, path, value);

    if (!opt.silent) this.emit('added', lng, ns, key, value);
  }

  addResources(lng, ns, res, opt = { silent: false }) {
    /* eslint no-restricted-syntax: 0 */
    for (const m in res) {
      if (
        typeof res[m] === 'string' ||
        Object.prototype.toString.apply(res[m]) === '[object Array]'
      )
        this.addResource(lng, ns, m, res[m], { silent: true });
    }
    if (!opt.silent) this.emit('added', lng, ns, res);
  }

  addResourceBundle(lng, ns, res, deep, overwrite, opt = { silent: false }) {
    let path = [lng, ns];
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      deep = res;
      res = ns;
      ns = path[1];
    }

    this.addNamespaces(ns);

    let pack = utils.getPath(this.data, path) || {};

    if (deep) {
      utils.deepExtend(pack, res, overwrite);
    } else {
      pack = { ...pack, ...res };
    }

    utils.setPath(this.data, path, pack);

    if (!opt.silent) this.emit('added', lng, ns, res);
  }

  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);

    this.emit('removed', lng, ns);
  }

  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== undefined;
  }

  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;

    // COMPATIBILITY: remove extend in v2.1.0
    if (this.options.compatibilityAPI === 'v1') return { ...{}, ...this.getResource(lng, ns) };

    return this.getResource(lng, ns);
  }

  getDataByLanguage(lng) {
    return this.data[lng];
  }

  toJSON() {
    return this.data;
  }
}

export default ResourceStore;
