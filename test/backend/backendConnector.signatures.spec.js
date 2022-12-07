import BackendConnector from '../../src/BackendConnector.js';
import BackendMock from './backendMock.js';
import BackendMockPromise from './backendMockPromise.js';
import BackendMockSync from './backendMockSync.js';
import Interpolator from '../../src/Interpolator.js';
import ResourceStore from '../../src/ResourceStore.js';
import { expect } from 'chai';

describe('BackendConnector with different signatures', () => {
  describe('BackendConnector with callback signature', () => {
    let connector;

    beforeEach(() => {
      connector = new BackendConnector(
        new BackendMock(),
        new ResourceStore(),
        {
          interpolator: new Interpolator(),
        },
        {},
      );
    });

    describe('#load', () => {
      it('should work as usual', (done) => {
        connector.load(['en'], ['normal'], function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'normal')).to.eql({
            status: 'ok',
            language: 'en',
            namespace: 'normal',
          });
          done();
        });
      });
    });

    describe('#saveMissing', () => {
      it('should work as usual', (done) => {
        connector.saveMissing(
          ['en'],
          'normal',
          'missing.key',
          'some fallback',
          false,
          { tDescription: 'some descr' },
          (err) => {
            expect(err).to.be.oneOf([null, undefined]);
            expect(connector.backend.created).to.eql({
              en: {
                normal: {
                  'missing.key': {
                    fallbackValue: 'some fallback',
                    options: {
                      tDescription: 'some descr',
                      isUpdate: false,
                    },
                  },
                },
              },
            });
            done();
          },
        );
      });
    });
  });

  describe('BackendConnector with promise signature', () => {
    let connector;

    beforeEach(() => {
      connector = new BackendConnector(
        new BackendMockPromise(),
        new ResourceStore(),
        {
          interpolator: new Interpolator(),
        },
        {},
      );
    });

    describe('#load', () => {
      it('should work as usual', (done) => {
        connector.load(['en'], ['namespace2'], function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace2')).to.eql({
            status: 'ok',
            language: 'en',
            namespace: 'namespace2',
          });
          done();
        });
      });
    });

    describe('#saveMissing', () => {
      it('should work as usual', (done) => {
        connector.saveMissing(
          ['en'],
          'namespace2',
          'missing.key',
          'some fallback',
          false,
          { tDescription: 'some descr' },
          (err) => {
            expect(err).to.be.oneOf([null, undefined]);
            expect(connector.backend.created).to.eql({
              en: {
                namespace2: {
                  'missing.key': {
                    fallbackValue: 'some fallback',
                    options: {
                      tDescription: 'some descr',
                      isUpdate: false,
                    },
                  },
                },
              },
            });
            done();
          },
        );
      });
    });
  });

  describe('BackendConnector with sync signature', () => {
    let connector;

    beforeEach(() => {
      connector = new BackendConnector(
        new BackendMockSync(),
        new ResourceStore(),
        {
          interpolator: new Interpolator(),
        },
        {},
      );
    });

    describe('#load', () => {
      it('should work as usual', (done) => {
        connector.load(['en'], ['namespace3'], function (err) {
          expect(err).to.eql(undefined);
          expect(connector.store.getResourceBundle('en', 'namespace3')).to.eql({
            status: 'ok',
            language: 'en',
            namespace: 'namespace3',
          });
          done();
        });
      });
    });

    describe('#saveMissing', () => {
      it('should work as usual', (done) => {
        connector.saveMissing(
          ['en'],
          'namespace3',
          'missing.key',
          'some fallback',
          false,
          { tDescription: 'some descr' },
          (err) => {
            expect(err).to.be.oneOf([null, undefined]);
            expect(connector.backend.created).to.eql({
              en: {
                namespace3: {
                  'missing.key': {
                    fallbackValue: 'some fallback',
                    options: {
                      tDescription: 'some descr',
                      isUpdate: false,
                    },
                  },
                },
              },
            });
            done();
          },
        );
      });
    });
  });
});
