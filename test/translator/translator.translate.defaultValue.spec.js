import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() defaultValue', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {},
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
      { args: ['translation:test', { defaultValue: 'test_en' }], expected: 'test_en' },
      { args: ['translation:test', { defaultValue: 'test_en', count: 1 }], expected: 'test_en' },
      {
        args: [
          'translation:test',
          { defaultValue_plural: 'test_en_plural', defaultValue: 'test_en', count: 10 },
        ],
        expected: 'test_en_plural',
      },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});
