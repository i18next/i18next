import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMock.js';
import Interpolator from '../../src/Interpolator';
import ResourceStore from '../../src/ResourceStore.js';

describe('BackendConnector load retry', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(new BackendMock(), new ResourceStore(), {
      interpolator: new Interpolator()
    }, {
      backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' }
    });
  });

  describe('#load', () => {
    it('should load data', (done) => {
      connector.load(['en'], ['retry'], function(err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'retry')).to.eql({status: 'nok', retries: 2});
        done();
      });
    });
  });
});

describe('BackendConnector load retry on multi', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(new BackendMock(), new ResourceStore(), {
      interpolator: new Interpolator()
    }, {
      backend: {
        allowMultiLoading: true,
        loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json'
      }
    });
  });

  describe('#load', () => {
    it('should load multi data', (done) => {
      connector.load(['de', 'fr'], ['retry', 'other'], function(err) {
        expect(err.length).to.equal(3);
        expect(connector.store.getResourceBundle('de', 'retry')).to.eql({status: 'nok', retries: 2});
        done();
      });
    });
  });
});

describe('BackendConnector reload retry', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(new BackendMock(), new ResourceStore(), {
      interpolator: new Interpolator()
    }, {
      backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' }
    });
  });

  describe('#reload', () => {
    it('should reload data', () => {
      connector.reload(['es'], ['noretry']);
      expect(connector.store.getResourceBundle('es', 'noretry')).to.eql({status: 'nok', retries: 0});
    });
  });
});

describe('BackendConnector reload retry on multi', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(new BackendMock(), new ResourceStore(), {
      interpolator: new Interpolator()
    }, {
      backend: {
        allowMultiLoading: true,
        loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json'
      }
    });
  });

  describe('#reload', () => {
    it('should reload multi data', () => {
      connector.reload(['it', 'fr'], ['noretry', 'other']);
      expect(connector.store.getResourceBundle('it', 'noretry')).to.eql({status: 'nok', retries: 0});
    });
  });
});
