import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMock.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';
import { expect } from 'chai';

describe('BackendConnector performance test', () => {
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
    it('should load 10,000 items in under the 2 second timeout', (done) => {
      const namespaces = [];
      for (let i = 0; i < 10000; i++) {
        namespaces.push(`namespace${i}`);
      }
      connector.load(['en'], namespaces, function (err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
          status: 'nok',
          retries: 0,
        });
        done();
      });
    });
  });
});
