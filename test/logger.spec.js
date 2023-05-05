import logger from '../src/logger';

const mockLogger = {
  type: 'logger',

  log(args) {
    return this.output('log', args);
  },

  warn(args) {
    return this.output('warn', args);
  },

  error(args) {
    return this.output('error', args);
  },

  output(type, args) {
    return {
      type,
      args,
    };
  },
};

describe('logger', () => {
  before(() => {
    logger.init(mockLogger, { debug: true });
  });

  describe('converting', () => {
    it('it should log', () => {
      expect(logger.log('hello').type).to.equal('log');
      expect(logger.log('hello').args[0]).to.equal('i18next: hello');
    });

    it('it should warn', () => {
      expect(logger.warn('hello').type).to.equal('warn');
      expect(logger.warn('hello').args[0]).to.equal('i18next: hello');
    });

    it('it should error', () => {
      expect(logger.error('hello').type).to.equal('error');
      expect(logger.error('hello').args[0]).to.equal('i18next: hello');
    });

    it('it should warn deprecation', () => {
      expect(logger.deprecate('hello').type).to.equal('warn');
      expect(logger.deprecate('hello').args[0]).to.equal('WARNING DEPRECATED: i18next: hello');
    });
  });

  describe('setDebug', () => {
    let mySubLogger;

    before(() => {
      mySubLogger = logger.create('sub-module');
    });

    it('it should correctly populate setDebug to all loggers', () => {
      expect(mySubLogger.log('test').type).to.equal('log');
      expect(mySubLogger.log('test').args[0]).to.equal('i18next::sub-module: test');

      logger.setDebug(false);
      expect(mySubLogger.log('test')).to.equal(null);
    });
  });
});
