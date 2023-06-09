import Interpolator from '../../src/Interpolator';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import ResourceStore from '../../src/ResourceStore.js';
import Translator from '../../src/Translator';

const NB_PLURALS_ARABIC = 6;

const NB_PLURALS_ENGLISH_ORDINAL = 4;

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
    ].forEach((test) => {
      it(`correctly sends missing for ${JSON.stringify(test.args)} args`, () => {
        t.translate.apply(t, test.args);
        expect(missingKeyHandler.callCount).to.eql(test.expected);
        expect(
          missingKeyHandler
            .getCall(0)
            .calledWith(['ar'], 'translation', 'test.missing_zero', 'test.missing'),
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
        defaultValue_zero: 'default0',
        defaultValue_one: 'default1',
      });
    });

    it('correctly sends missing resolved value', () => {
      expect(missingKeyHandler.callCount).to.eql(NB_PLURALS_ARABIC);
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_zero', 'default0'))
        .to.be.true;
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_one', 'default1')).to
        .be.true;
      expect(missingKeyHandler.calledWith(['ar'], 'translation', 'test.missing_two', 'default0')).to
        .be.true;
    });
  });

  describe('translate() saveMissing with saveMissingPlurals options (ordinal)', () => {
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
      t.changeLanguage('en');
    });

    [
      {
        args: ['translation:test.missing', { count: 3, ordinal: true }],
        expected: NB_PLURALS_ENGLISH_ORDINAL,
      },
      {
        args: ['translation:test.missing', { count: 0, ordinal: true }],
        expected: NB_PLURALS_ENGLISH_ORDINAL,
      },
    ].forEach((test) => {
      it(`correctly sends missing for ${JSON.stringify(test.args)} args`, () => {
        t.translate.apply(t, test.args);
        expect(missingKeyHandler.callCount).to.eql(test.expected);
        expect(
          missingKeyHandler
            .getCall(0)
            .calledWith(['en'], 'translation', 'test.missing_ordinal_one', 'test.missing'),
        ).to.be.true;
      });
    });
  });

  describe('translate() saveMissing with saveMissingPlurals and defaults (ordinal)', () => {
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
      t.changeLanguage('en');

      t.translate('translation:test.missing', {
        count: 0,
        ordinal: true,
        defaultValue_ordinal_one: 'default1',
        defaultValue_ordinal_other: 'defaultOther',
      });
    });

    it('correctly sends missing resolved value', () => {
      expect(missingKeyHandler.callCount).to.eql(NB_PLURALS_ENGLISH_ORDINAL);
      expect(
        missingKeyHandler.calledWith(
          ['en'],
          'translation',
          'test.missing_ordinal_other',
          'defaultOther',
        ),
      ).to.be.true;
      expect(
        missingKeyHandler.calledWith(['en'], 'translation', 'test.missing_ordinal_one', 'default1'),
      ).to.be.true;
      expect(
        missingKeyHandler.calledWith(
          ['en'],
          'translation',
          'test.missing_ordinal_two',
          'defaultOther',
        ),
      ).to.be.true;
    });
  });
});
