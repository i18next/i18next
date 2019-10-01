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
            key1: 'hello world',
            key2: 'It is: $t(key1)',
            key3: 'It is: {{val}}',

            // context with pluralization
            test: 'test_en',
            test_plural: 'tests_en',
            test_male: 'test_male_en',
            test_male_plural: 'tests_male_en',

            nest: {
              foo: 'bar',
              nest: '$t(nestedArray)',
            },
            nestedArray: [{ a: 'b', c: 'd' }, { a: 'b', c: 'd' }],
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
          contextSeparator: '_',
          keySeparator: '.',
          ns: 'translation',
          defaultNS: 'translation',
          interpolation: {},
          returnObjects: true,
        },
      );
      t.changeLanguage('en');
    });

    var tests = [
      // interpolation and nesting in var
      { args: ['key2'], expected: 'It is: hello world' },
      { args: ['key3', { val: '$t(key1)' }], expected: 'It is: hello world' },

      // disable nesting while interpolation
      { args: ['key3', { val: '$t(key1)', nest: false }], expected: 'It is: $t(key1)' },

      // context with pluralization
      { args: ['test', { context: 'unknown', count: 1 }], expected: 'test_en' },
      { args: ['test', { context: 'unknown', count: 2 }], expected: 'tests_en' },
      { args: ['test', { context: 'male', count: 1 }], expected: 'test_male_en' },
      { args: ['test', { context: 'male', count: 2 }], expected: 'tests_male_en' },
      { args: ['nest'], expected: { foo: 'bar', nest: [{ a: 'b', c: 'd' }, { a: 'b', c: 'd' }] } },

      // interpolation and nesting on defaultValue
      {
        args: ['noKeyFoundTestingDefault_1', { defaultValue: '{{val}} bar', val: '$t(foo)' }],
        expected: 'foo bar',
      },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
});
