import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() using updateMissing', () => {
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
          updateMissing: true,
          interpolation: {
            interpolateResult: true,
            interpolateDefaultValue: true,
            interpolateKey: true,
          },
        },
      );
      t.changeLanguage('en');
    });

    var tests = [
      { args: ['translation:test', { defaultValue: 'new value' }], expected: 'test_en' },
    ];

    tests.forEach(test => {
      it('correctly sends missing for ' + JSON.stringify(test.args) + ' args', () => {
        let wasCalled = false;

        t.options.missingKeyHandler = (lngs, namespace, key, res, wasUpdate) => {
          expect(lngs).to.eql(['en']);
          expect(namespace).to.eql('translation');
          expect(key).to.eql('test');
          expect(res).to.eql('new value');
          expect(wasUpdate).to.equal(true);

          wasCalled = true;
        };

        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
        expect(wasCalled).to.equal(true);
      });
    });
  });
});
