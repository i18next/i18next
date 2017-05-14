import i18next from '../src/i18next';
import * as convert from '../src/compatibility/v1';

describe('i18next', () => {

  before(() => {
    i18next.init({
      compatibilityAPI: 'v1',
      compatibilityJSON: 'v1',
      sendMissing: true,
      useLocalStorage: true,
      debug: false,
      ns: {
        defaultNs: 'defaultNamespace',
        namespaces: ['defaultNamespace', 'otherNamespace']
      },
      shortcutFunction: 'sprintf'
    });
    i18next.changeLanguage('en');
  });

  describe('converting', () => {
    it('it should convert options', () => {
      expect(i18next.options.defaultNS).to.equal('defaultNamespace');
      expect(i18next.options.ns).to.eql(['defaultNamespace', 'otherNamespace']);
      expect(i18next.options.saveMissing).to.be.true;
      expect(i18next.options.cache.enabled).to.be.true;
    });

    it('it should append old api', (done) => {
      i18next.addPostProcessor('dummy', () => {});
      i18next.preload(['de'], () => {
        expect(i18next.preload).to.be.ok;
        done();
      });
    });

    it('it should append old api for lng mutation', (done) => {
      i18next.setLng('de');
      expect(i18next.lng()).to.be.equal('de');
      i18next.setLng('de', { fixLng: true }, (err, t) => {
        expect(typeof t).to.be.equal('function');
        done();
      });
    });

    it('it should convert t options', () => {
      const options = { keyseparator: '$', nsseparator: '!', escapeInterpolation: false }
      convert.convertTOptions(options);
      expect(options.nsSeparator).to.equal('!');
      expect(options.keySeparator).to.equal('$');
      expect(options.interpolation.escapeValue).to.equal(false);
    });

    it('it should convert json options', () => {
      const options = { escapeInterpolation: false }
      convert.convertJSONOptions(options);
      expect(options.interpolation.escapeValue).to.equal(false);
      expect(options.joinArrays).to.equal('\n');
    });
  });

});
