import CacheConnector from '../../src/CacheConnector.js';
import CacheMock from './cacheMock.js';
import LanguageUtils from '../../src/LanguageUtils';
import ResourceStore from '../../src/ResourceStore.js';

describe('CacheConnector load retry', () => {
  let connector;

  before(() => {
    connector = new CacheConnector(new CacheMock(), new ResourceStore(), {
      languageUtils: new LanguageUtils({ fallbackLng: 'en' })
    }, {
      cache: { enabled: true }
    });
  });

  describe('#load', () => {
    it('should load data', (done) => {
      connector.load(['en'], ['ns'], function(err) {
        expect(err).to.be.not.ok;
        expect(connector.store.getResourceBundle('en', 'ns')).to.eql({ key: 'ok' });
        done();
      });
    });
  });
});
