import i18next from '../src/i18next';

describe('i18next', () => {

  before(() => {
    i18next.init({
      compatibilityAPI: 'v1',
      compatibilityJSON: 'v1',
      sendMissing: true,
      useLocalStorage: true,
      debug: false
    });
    i18next.changeLanguage('en');
  });

  describe('converting', () => {
    it('it should convert options', () => {
      expect(i18next.options.saveMissing).to.be.true;
      expect(i18next.options.cache.enabled).to.be.true;
    });

    it('it should append old api', () => {
      expect(i18next.preload).to.be.ok;
    });
  });

});
