import Interpolator from '../../src/Interpolator';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import ResourceStore from '../../src/ResourceStore.js';
import Translator from '../../src/Translator';

const NB_PLURALS_ARABIC = 6;

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

  describe('translate() saveMissing', () => {
    beforeEach(() => {
      t = new Translator(tServices, {
        defaultNS: 'translation',
        ns: 'translation',
        saveMissing: true,
        missingKeyHandler,
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true,
        },
      });
      t.changeLanguage('en');
    });

    it('correctly sends missing for "translation:test.missing"', () => {
      expect(t.translate('translation:test.missing')).to.eql('test.missing');
      expect(missingKeyHandler.calledWith(['en'], 'translation', 'test.missing', 'test.missing')).to
        .be.true;
    });
  });

  describe('translate() saveMissing with saveMissingPlurals options', () => {
    beforeEach(() => {
      t = new Translator(tServices, {
        defaultNS: 'translation',
        ns: 'translation',
        saveMissing: true,
        saveMissingPlurals: true,
        missingKeyHandler,
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true,
        },
      });
      t.changeLanguage('ar');
    });

    [
      { args: ['translation:test.missing', { count: 10 }], expected: NB_PLURALS_ARABIC },
      { args: ['translation:test.missing', { count: 0 }], expected: NB_PLURALS_ARABIC },
    ].forEach(test => {
      it('correctly sends missing for ' + JSON.stringify(test.args) + ' args', () => {
        t.translate.apply(t, test.args);
        expect(missingKeyHandler.callCount).to.eql(test.expected);
        expect(
          missingKeyHandler
            .getCall(0)
            .calledWith(['ar'], 'translation', 'test.missing_0', 'test.missing'),
        ).to.be.true;
      });
    });
  });

  describe('translate() saveMissing with saveMissingPlurals and defaults', () => {
    beforeEach(() => {
      t = new Translator(tServices, {
        defaultNS: 'translation',
        ns: 'translation',
        saveMissing: true,
        saveMissingPlurals: true,
        missingKeyHandler,
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true,
        },
      });
      t.changeLanguage('ar');

      t.translate('translation:test.missing', {
        count: 0,
        defaultValue_0: 'default0',
        defaultValue_1: 'default1', // ignored
      });
    });

    it('correctly sends missing resolved value', () => {
      expect(missingKeyHandler.callCount).to.eql(NB_PLURALS_ARABIC);
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_0', 'default0')).to
        .be.true;
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_1', 'default0')).to
        .be.true;
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_2', 'default0')).to
        .be.true;
    });
  });
});
