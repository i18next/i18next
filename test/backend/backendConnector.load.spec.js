import BackendConnector from '../../src/BackendConnector.js';
import XHR from 'i18next-xhr-backend';
import Interpolator from '../../src/Interpolator';
import ResourceStore from '../../src/ResourceStore.js';

describe('BackendConnector basic load', () => {
  let connector;

  before(() => {
    connector = new BackendConnector(new XHR(), null, new ResourceStore(), {
      interpolator: new Interpolator()
    }, {
      backend: { loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json' }
    });
  });

  describe('#load', () => {
    it('should load data', (done) => {
      connector.load(['en'], ['test'], function(err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'test')).to.eql({key: 'passing'});
        done();
      });
    });
  });
});
