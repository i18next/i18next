import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMockSleepy.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';
import { expect } from 'chai';

describe('BackendConnector with sleepy backend', () => {
  describe('#load', () => {
    describe('10 max parallel', () => {
      let connector;

      beforeEach(() => {
        connector = new BackendConnector(
          new BackendMock(),
          new ResourceStore(),
          {
            interpolator: new Interpolator(),
          },
          {
            maxParallelReads: 10,
            backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
          },
        );
      });

      it('backend should not be called 20 times before any have returned', (done) => {
        const namespaces = [];
        for (let i = 0; i < 20; i++) {
          namespaces.push(`namespace${i}`);
        }
        connector.load(['en'], namespaces, function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
            status: 'ok',
          });
          expect(connector.backend.parallelCallsHighWaterMark).to.be.lessThan(20);
          expect(connector.backend.parallelCallsHighWaterMark).to.eql(10);
          done();
        });
      });
    });

    describe('100 max parallel', () => {
      let connector;

      beforeEach(() => {
        connector = new BackendConnector(
          new BackendMock(),
          new ResourceStore(),
          {
            interpolator: new Interpolator(),
          },
          {
            maxParallelReads: 100,
            backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' },
          },
        );
      });

      it('backend should be called 20 times before any have returned', (done) => {
        let namespaces = [];
        for (let i = 0; i < 20; i++) {
          namespaces.push(`namespace${i}`);
        }
        connector.load(['en'], namespaces, function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
            status: 'ok',
          });
          expect(connector.backend.parallelCallsHighWaterMark).to.eql(20);
          done();
        });
      });

      it('backend should get more calls 2nd time around', (done) => {
        let namespaces = [];
        for (let i = 0; i < 20; i++) {
          namespaces.push(`namespace${i}`);
        }
        connector.load(['en'], namespaces, function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
            status: 'ok',
          });
          expect(connector.backend.parallelCallsHighWaterMark).to.eql(20);

          // Run again with higher call count - different namespace names
          namespaces = [];
          for (let i = 0; i < 30; i++) {
            namespaces.push(`namespace-run2${i}`);
          }
          connector.load(['en'], namespaces, function (err) {
            expect(err).to.eql(undefined);
            expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
              status: 'ok',
            });
            expect(connector.backend.parallelCallsHighWaterMark).to.eql(30);
            done();
          });
        });
      });

      it('reloading already loaded should not increase high watermark', (done) => {
        let namespaces = [];
        for (let i = 0; i < 20; i++) {
          namespaces.push(`namespace${i}`);
        }
        connector.load(['en'], namespaces, function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
            status: 'ok',
          });
          expect(connector.backend.parallelCallsHighWaterMark).to.eql(20);

          // Run again with higher call count - same namespace names
          namespaces = [];
          for (let i = 0; i < 30; i++) {
            namespaces.push(`namespace${i}`);
          }
          connector.load(['en'], namespaces, function (err) {
            expect(err).to.eql(undefined);
            expect(connector.store.getResourceBundle('en', 'namespace1')).to.eql({
              status: 'ok',
            });
            expect(connector.backend.parallelCallsHighWaterMark).to.eql(20);
            done();
          });
        });
      });
    });
  });
});
