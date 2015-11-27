const consoleLogger = {
  type: 'logger',

  log(args) {
    this._output('log', args);
  },

  warn(args) {
    this._output('warn', args);
  },

  error(args) {
    this._output('error', args);
  },

  _output(type, args) {
    if (console && console[type]) console[type].apply(console, Array.prototype.slice.call(args));
  }
};


class Logger {
  constructor(concreteLogger, options = {}) {
    this.subs = [];
    this.init(concreteLogger, options);
  }

  init(concreteLogger, options = {}) {
    this.prefix = options.prefix || 'i18next:';
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug === false ? false : true;
  }

  setDebug(bool) {
    this.debug = bool;
    this.subs.forEach(sub => {
      sub.setDebug(bool);
    });
  }

  log() {
    if (!this.debug) return;

    if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
    this.logger.log(arguments);
  }

  warn() {
    if (!this.debug) return;

    if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
    this.logger.warn(arguments);
  }

  error() {
    if (typeof arguments[0] === 'string') arguments[0] = this.prefix + ' ' + arguments[0];
    this.logger.error(arguments);
  }

  deprecate() {
    if (typeof arguments[0] === 'string') arguments[0] = 'WARNING DEPRECATED: ' + this.prefix + ' ' + arguments[0];
    if (this.debug) this.logger.warn(arguments);
  }

  create(moduleName) {
    let sub = new Logger(this.logger, {...{prefix: this.prefix + ':' + moduleName + ':'}, ...this.options});
    this.subs.push(sub);

    return sub;
  }

  // createInstance(options = {}) {
  //   return new Logger(options, callback);
  // }

};

export default new Logger();
