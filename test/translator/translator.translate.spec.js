import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate()', () => {
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
      { args: ['translation:test'], expected: 'test_en' },
      { args: ['translation:test', { lngs: ['en-US', 'en'] }], expected: 'test_en' },
      { args: ['translation:test', { lngs: ['de'] }], expected: 'test_de' },
      { args: ['translation:test', { lng: 'de' }], expected: 'test_de' },
      { args: ['translation:test', { lng: 'fr' }], expected: 'test_en' },
      { args: ['translation:test', { lng: 'en-US' }], expected: 'test_en' },
      { args: ['translation.test', { lng: 'en-US', nsSeparator: '.' }], expected: 'test_en' },
      { args: ['translation.deep.test', { lng: 'en-US', nsSeparator: '.' }], expected: 'deep_en' },
      { args: ['deep.test', { lng: 'en-US', nsSeparator: '.' }], expected: 'deep_en' },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});
