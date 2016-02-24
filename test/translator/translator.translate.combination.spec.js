import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {

  describe('translate() with combined functionality', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            'key1': 'hello world',
            'key2': 'It is: $t(key1)',
            'key3': 'It is: {{val}}',

            // context with pluralization
            test: 'test_en',
            test_plural: 'tests_en',
            test_male: 'test_male_en',
            test_male_plural: 'tests_male_en',
          }
        }
      });
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      t = new Translator({
        resourceStore: rs,
        languageUtils: lu,
        pluralResolver: new PluralResolver(lu, {prepend: '_'}),
        interpolator: new Interpolator()
      }, {
        contextSeparator: '_',
        ns: 'translation',
        defaultNS: 'translation',
        interpolation: {}
      });
      t.changeLanguage('en');
    });

    var tests = [
      // interpolation and nesting in var
      { args: ['key2'], expected: 'It is: hello world' },
      { args: ['key3', { val: '$t(key1)' }], expected: 'It is: hello world' },

      // context with pluralization
      {args: ['test', { context: 'unknown', count: 1 }], expected: 'test_en'},
      {args: ['test', { context: 'unknown', count: 2 }], expected: 'tests_en'},
      {args: ['test', { context: 'male', count: 1 }], expected: 'test_male_en'},
      {args: ['test', { context: 'male', count: 2 }], expected: 'tests_male_en'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });

});
