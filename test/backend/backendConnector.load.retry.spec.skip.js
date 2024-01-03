/* eslint-disable */
/** THIS FILE HAS NOT MIGRATED TO VITEST BECAUSE WAS EXCLUDED FROM RUN */
import BackendConnector from '../../src/BackendConnector.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';
import BackendMock from './backendMock.js';

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
      connector.load(['en'], ['retry2'], (err) => {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'retry2')).toEqual({
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
      connector.load(['en'], ['fail'], (err) => {
        expect(err).toEqual(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).toEqual({});
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
        (err) => {
          expect(err).toEqual([
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
          expect(connector.store.getResourceBundle('en', 'fail1')).toEqual({});
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
      connector.load(['en'], ['fail', 'fail2', 'concurrently'], (err) => {
        expect(err).toEqual(['failed loading', 'failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).toEqual({});
        expect(connector.store.getResourceBundle('en', 'fail2')).toEqual({});
        expect(connector.store.getResourceBundle('en', 'concurrently')).toEqual({
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
      connector.load(['en'], ['fail', 'fail2', 'concurrently', 'retry2'], (err) => {
        expect(err).toEqual(['failed loading', 'failed loading']);
        expect(connector.store.getResourceBundle('en', 'fail')).toEqual({});
        expect(connector.store.getResourceBundle('en', 'fail2')).toEqual({});
        expect(connector.store.getResourceBundle('en', 'concurrently')).toEqual({
          status: 'ok',
          namespace: 'concurrently',
        });
        expect(connector.store.getResourceBundle('en', 'retry2')).toEqual({
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
      expect(connector.store.getResourceBundle('es', 'noretry')).toEqual({
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
      connector.load(['en'], ['retry1'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry1')).toEqual({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(10850);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry5')).toEqual({
          status: 'nok',
          retries: 5,
        });
        done();
      });
    }).timeout(10850 + 250); // ((2^5) - 1) * 350 = 10850

    it('fail after retrying 5 times', (done) => {
      connector.load(['en'], ['retry6'], (err) => {
        expect(err).toEqual(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry6')).toEqual({});
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
      connector.load(['en'], ['retry1'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry1')).toEqual({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(10850);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry5')).toEqual({
          status: 'nok',
          retries: 5,
        });
        done();
      });
    }).timeout(10850 + 250); // ((2^5) - 1) * 350 = 10850

    it('retry 6 times', (done) => {
      connector.load(['en'], ['retry6'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry6')).toEqual({
          status: 'nok',
          retries: 6,
        });
        done();
      });
    }).timeout(22050 + 250); // ((2^6) - 1) * 350 = 22050

    it('fail after retrying 6 times', (done) => {
      connector.load(['en'], ['retry7'], (err) => {
        expect(err).toEqual(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry7')).toEqual({});
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
      connector.load(['en'], ['retry1'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry1')).toEqual({
          status: 'nok',
          retries: 1,
        });
        done();
      });
    }).timeout(100 + 250);

    it('retry 5 times', (done) => {
      connector.load(['en'], ['retry5'], (err) => {
        expect(connector.store.getResourceBundle('en', 'retry5')).toEqual({
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
      connector.load(['en'], ['concurrently'], (err) => {
        expect(err).toEqual(undefined);
        expect(connector.store.getResourceBundle('en', 'concurrently')).toEqual({
          status: 'ok',
          namespace: 'concurrently',
        });
        done();
      });
    }).timeout(10850);

    it('does not retry', (done) => {
      connector.load(['en'], ['retry0'], (err) => {
        expect(err).toEqual(['failed loading']);
        expect(connector.store.getResourceBundle('en', 'retry0')).toEqual({});
        done();
      });
    }).timeout(10850);
  });
});
