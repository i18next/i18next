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
      connector.load(['en'], ['retry2'], function (err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'retry2')).to.eql({
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

describe('BackendConnector load all fail - 10 namespaces', () => {
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
      connector.load(['en'], ['fail', 'fail2', 'concurrently', 'retry2'], function (err) {
        expect(err).to.eql(['failed loading', 'failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'fail2')).to.eql({});
        expect(connector.store.getResourceBundle('en', 'concurrently')).to.eql({
          status: 'ok',
          namespace: 'concurrently',
        });
        expect(connector.store.getResourceBundle('en', 'retry2')).to.eql({
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

describe('BackendConnector retry with default maxRetries=5', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        // retryTimeout: 350,   // This is the default value
        // maxRetries: 5,       // This is the default value
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('retry 1 time', (done) => {
      connector.load(['en'], ['retry1'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry1')).to.eql({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(10850);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry5')).to.eql({
          status: 'nok',
          retries: 5,
        });
        done();
      });
    }).timeout(10850 + 250); // ((2^5) - 1) * 350 = 10850

    it('fail after retrying 5 times', (done) => {
      connector.load(['en'], ['retry6'], function (err) {
        expect(err).to.eql(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry6')).to.eql({});
        done();
      });
    }).timeout(10850 + 250); // ((2^5) - 1) * 350 = 10850
  });
});

describe('BackendConnector retry with maxRetries=6', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        // retryTimeout: 350,   // This is the default value
        maxRetries: 6,
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('retry 1 time', (done) => {
      connector.load(['en'], ['retry1'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry1')).to.eql({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(10850);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry5')).to.eql({
          status: 'nok',
          retries: 5,
        });
        done();
      });
    }).timeout(10850 + 250); // ((2^5) - 1) * 350 = 10850

    it('retry 6 times', (done) => {
      connector.load(['en'], ['retry6'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry6')).to.eql({
          status: 'nok',
          retries: 6,
        });
        done();
      });
    }).timeout(22050 + 250); // ((2^6) - 1) * 350 = 22050

    it('fail after retrying 6 times', (done) => {
      connector.load(['en'], ['retry7'], function (err) {
        expect(err).to.eql(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry7')).to.eql({});
        done();
      });
    }).timeout(22050 + 250); // ((2^6) - 1) * 350 = 22050
  });
});

// All tests have 250ms of code-execution buffer time built in.
// To ensure test correctness, the tests should never time out.
describe('BackendConnector retry with shorter intervals', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        retryTimeout: 100,
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('retry 1 time', (done) => {
      connector.load(['en'], ['retry1'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry1')).to.eql({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(100 + 250);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], function (err) {
        expect(connector.store.getResourceBundle('en', 'retry5')).to.eql({
          status: 'nok',
          retries: 5,
        });
        done();
      });
    }).timeout(3100 + 250); // ((2^5) - 1) * 100 = 3100
  });
});

describe('BackendConnector retry with default maxRetries=0', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(
      new BackendMock(),
      new ResourceStore(),
      {
        interpolator: new Interpolator(),
      },
      {
        // retryTimeout: 350,   // This is the default value
        maxRetries: 0, // This is the default value
        backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
      },
    );
  });

  describe('#load', () => {
    it('succeeds', (done) => {
      connector.load(['en'], ['concurrently'], function (err) {
        expect(err).to.eql(undefined);
        expect(connector.store.getResourceBundle('en', 'concurrently')).to.eql({
          status: 'ok',
          namespace: 'concurrently',
        });
        done();
      });
    }).timeout(10850);

    it('does not retry', (done) => {
      connector.load(['en'], ['retry0'], function (err) {
        expect(err).to.eql(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry0')).to.eql({});
        done();
      });
    }).timeout(10850);
  });
});
