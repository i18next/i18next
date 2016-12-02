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
  }

  log() {
    this.forward(arguments, 'log', '', true);
  }

  warn() {
    this.forward(arguments, 'warn', '', true);
  }

  error() {
    this.forward(arguments, 'error', '');
  }

  deprecate() {
    this.forward(arguments, 'warn', 'WARNING DEPRECATED: ', true);
  }

  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return;
    if (typeof args[0] === 'string') args[0] = prefix + this.prefix + ' ' + args[0];
    this.logger[lvl](args);
  }

  create(moduleName) {
    let sub = new Logger(this.logger, {...{prefix: this.prefix + ':' + moduleName + ':'}, ...this.options});

    return sub;
  }

  // createInstance(options = {}) {
  //   return new Logger(options, callback);
  // }

};

export default new Logger();
