import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMock.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';

describe('BackendConnector load retry', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('should load data', (done) => {
      connector.load(['en'], ['retry'], function (err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'retry')).to.eql({
          status: 'nok',
          retries: 2,
        });
        done();
      });
    });
  });
});

describe('BackendConnector load all fail - 1 namespace', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('should call callback on complete failure', (done) => {
      connector.load(['en'], ['fail'], function (err) {
        expect(err).to.eql(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).to.eql({});
        done();
      });
    }).timeout(12000);
  });
});

describe.only('BackendConnector load all fail - 10 namespaces', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('should call callback on complete failure - taking no longer than 1 namespace', (done) => {
      connector.load(
        ['en'],
        ['fail1', 'fail2', 'fail3', 'fail4', 'fail5', 'fail6', 'fail7', 'fail8', 'fail9', 'fail10'],
        function (err) {
          expect(err).to.eql([
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
            'failed loading',
          ]);
          expect(connector.store.getResourceBundle('en', 'fail1')).to.eql({});
          done();
        },
      );
    }).timeout(12000);
  });
});

describe('BackendConnector load only one succeeds', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('should call callback', (done) => {
      connector.load(['en'], ['fail', 'fail2', 'concurrently'], function (err) {
        expect(err).to.eql(['failed loading', 'failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'fail2')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'concurrently')).to.eql({
          status: 'ok',
          namespace: 'concurrently',
        });
        done();
      });
    }).timeout(12000);
  });
});

describe('BackendConnector load only one succeeds with retries', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('should call callback', (done) => {
      connector.load(['en'], ['fail', 'fail2', 'concurrently', 'retry'], function (err) {
        expect(err).to.eql(['failed loading', 'failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'fail2')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'concurrently')).to.eql({
          status: 'ok',
          namespace: 'concurrently',
        });
        expect(connector.store.getResourceBundle('en', 'retry')).to.eql({
          status: 'nok',
          retries: 2,
        });
        done();
      });
    }).timeout(12000);
  });
});

describe('BackendConnector reload retry', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#reload', () => {
    it('should reload data', () => {
      connector.reload(['es'], ['noretry'], () => {});
      expect(connector.store.getResourceBundle('es', 'noretry')).to.eql({
        status: 'nok',
        retries: 0,
      });
    });
  });
});
