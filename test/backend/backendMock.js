class Backend {
  constructor(services, options = {}) {
    this.init(services, options);
  }

  init(services, options) {
    this.services = services;
    this.options = options;
    this.retries = {};
  }

  read(language, namespace, callback) {
    if (!this.retries[language]) this.retries[language] = 0;

    if (namespace === 'retry' && this.retries[language] < 2) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else {
      callback(null, { status: 'nok', retries: this.retries[language] });
      delete this.retries[language];
      return;
    }
  }

  readMulti(languages, namespaces, callback) {
    const language = languages[0];
    const namespace = namespaces[0];

    if (!this.retries[language]) this.retries[language] = 0;

    if (namespace === 'retry' && this.retries[language] < 2) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else {
      callback(null, {
        [language]: { [namespace]: { status: 'nok', retries: this.retries[language] } },
      });
      delete this.retries[language];
      return;
    }
  }
}

export default Backend;
