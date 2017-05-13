class Cache {
  constructor(services, options = {}) {
    this.init(services, options);
  }

  init(services, options) {
    this.services = services;
    this.options = options;
  }

  load(languages, callback) {
    callback(null, {
      en: {
        ns: {
          key: 'ok'
        }
      }
    });
  }

  save(store) {

  }
}


export default Cache;
