import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMock.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';
import { expect } from 'chai';

describe('BackendConnector performance (retry) test', () => {
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
    it('should load retry (failed) items mixed with concurrent longer items in under the 12 seconds timeout', (done) => {
      const namespaces = [];
      for (let i = 0; i < 20; i++) {
        namespaces.push(`concurrentlyLonger${i}`);
      }
      for (let i = 0; i < 3; i++) {
        namespaces.push(`fail${i}`);
      }
      for (let i = 0; i < 20; i++) {
        namespaces.push(`concurrently${i}`);
      }
      connector.load(['en'], namespaces, function (err) {
        expect(err).to.be.ok;
        done();
      });
    }).timeout(12000);
  });
});
