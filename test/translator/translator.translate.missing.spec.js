import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() using missing', () => {
    var t;

    before(() => {
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
      t = new Translator(
        {
          resourceStore: rs,
          languageUtils: lu,
          pluralResolver: new PluralResolver(lu, { prepend: '_', simplifyPluralSuffix: true }),
          interpolator: new Interpolator(),
        },
        {
          defaultNS: 'translation',
          ns: 'translation',
          saveMissing: true,
          interpolation: {
            interpolateResult: true,
            interpolateDefaultValue: true,
            interpolateKey: true,
          },
        },
      );
      t.changeLanguage('en');
    });

    var tests = [{ args: ['translation:test.missing'], expected: 'test.missing' }];

    tests.forEach(test => {
      it('correctly sends missing for ' + JSON.stringify(test.args) + ' args', () => {
        t.options.missingKeyHandler = (lngs, namespace, key, res) => {
          expect(lngs).to.eql(['en']);
          expect(namespace).to.eql('translation');
          expect(key).to.eql(test.expected);
          expect(res).to.eql(test.expected);
        };

        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('translate() using missing with saveMissingPlurals options', () => {
    const NB_PLURALS_ARABIC = 6;
    var t;

    before(() => {
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
      t = new Translator(
        {
          resourceStore: rs,
          languageUtils: lu,
          pluralResolver: new PluralResolver(lu, { prepend: '_', simplifyPluralSuffix: true }),
          interpolator: new Interpolator(),
        },
        {
          defaultNS: 'translation',
          ns: 'translation',
          saveMissing: true,
          saveMissingPlurals: true,
          interpolation: {
            interpolateResult: true,
            interpolateDefaultValue: true,
            interpolateKey: true,
          },
        },
      );
      t.changeLanguage('ar');
    });

    var tests = [
      { args: ['translation:test.missing', { count: 10 }], expected: NB_PLURALS_ARABIC },
      { args: ['translation:test.missing', { count: 0 }], expected: NB_PLURALS_ARABIC },
    ];

    tests.forEach(test => {
      it('correctly sends missing for ' + JSON.stringify(test.args) + ' args', () => {
        let todo = test.expected;
        t.options.missingKeyHandler = (lngs, namespace, key, res) => {
          // console.warn(lngs, namespace, key, res);
          todo--;
        };

        t.translate.apply(t, test.args);
        expect(todo).to.eql(0);
      });
    });
  });
});
