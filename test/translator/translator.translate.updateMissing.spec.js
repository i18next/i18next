import Interpolator from '../../src/Interpolator';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import ResourceStore from '../../src/ResourceStore.js';
import Translator from '../../src/Translator';

describe('Translator', () => {
  let t;
  let tServices;
  let missingKeyHandler;

  beforeEach(() => {
    const rs = new ResourceStore({
      en: {
        translation: {
          test: 'test_en',
          deep: {
            test: 'deep_en',
          },
        },
      },
      de: {
        translation: {
          test: 'test_de',
        },
      },
    });

    const lu = new LanguageUtils({ fallbackLng: 'en' });

    tServices = {
      resourceStore: rs,
      languageUtils: lu,
      pluralResolver: new PluralResolver(lu, { prepend: '_', simplifyPluralSuffix: true }),
      interpolator: new Interpolator(),
    };

    missingKeyHandler = sinon.spy();
  });

  describe('translate() using updateMissing', () => {
    beforeEach(() => {
      t = new Translator(tServices, {
        defaultNS: 'translation',
        ns: 'translation',
        saveMissing: true,
        updateMissing: true,
        missingKeyHandler,
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true,
        },
      });
      t.changeLanguage('en');
    });

    it('correctly sends missing', () => {
      expect(t.translate('translation:test', { defaultValue: 'new value' })).to.eql('test_en');
      expect(missingKeyHandler.calledOnce).to.be.true;
      expect(missingKeyHandler.calledWith(['en'], 'translation', 'test', 'new value', true)).to.be
        .true;
    });
  });

  describe('translate() using updateMissing with saveMissingPlurals', () => {
    beforeEach(() => {
      t = new Translator(tServices, {
        defaultNS: 'translation',
        ns: 'translation',
        saveMissing: true,
        saveMissingPlurals: true,
        updateMissing: true,
        missingKeyHandler,
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true,
        },
      });
      t.changeLanguage('en');
    });

    it('correctly sends missing', () => {
      expect(
        t.translate('translation:test', {
          count: 1,
          defaultValue: 'new value',
          defaultValue_plural: 'new values',
        }),
      ).to.eql('test_en');
      expect(missingKeyHandler.calledTwice).to.be.true;
      expect(missingKeyHandler.calledWith(['en'], 'translation', 'test', 'new value', true)).to.be
        .true;
      expect(missingKeyHandler.calledWith(['en'], 'translation', 'test_plural', 'new values', true))
        .to.be.true;
    });
  });
});
