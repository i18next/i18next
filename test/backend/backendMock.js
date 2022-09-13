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

    if (namespace.indexOf('fail') === 0) {
      return callback('failed loading', true);
    } else if (namespace === 'retry0') {
      this.retries[language]++;
      return callback('failed loading', true);
    } else if (namespace === 'retry1' && this.retries[language] < 1) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else if (namespace === 'retry2' && this.retries[language] < 2) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else if (namespace === 'retry5' && this.retries[language] < 5) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else if (namespace === 'retry6' && this.retries[language] < 6) {
      this.retries[language]++;
      return callback('failed loading', true);
    } else if (namespace === 'retry7' && this.retries[language] < 7) {
      this.retries[language]++;
      return callback('failed loading', true);

      // // Is a retry, but not set to fail after a specific
      // } else if (namespace.indexOf('retry') === 0) {

      // }
    } else if (namespace.indexOf('concurrentlyLonger') === 0) {
      setTimeout(() => {
        callback(null, { status: 'ok', namespace });
      }, 400);
      return;
    } else if (namespace.indexOf('concurrently') === 0) {
      setTimeout(() => {
        callback(null, { status: 'ok', namespace });
      }, 200);
      return;
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

    if (namespace === 'retry2' && this.retries[language] < 2) {
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

Backend.type = 'backend';

export default Backend;
