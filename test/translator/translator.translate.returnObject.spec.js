import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {
  describe('translate() with returnObjects=true', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          common: {
            test: ['common_test_en_1', 'common_test_en_2'],
            something: {
              range: '[{{min}}..{{max}}]',
            },
            somethingElse: {
              range: '[{{min}}..{{max}}]',
              hello: 'hello {{what}}',
              foo: 'bar',
            },
            requirements: ['lorem ipsum', 'lorem ipsum', 'hello {{what}}'],
            boolean: { value: true },
            number: { value: 42 },
          },
          special: {
            test: ['special_test_en_1', 'special_test_en_2'],
          },
          withContext: {
            string: 'hello world',
            string_lined: ['hello', 'world'],
          },
        },
        de: {
          common: {
            test: ['common_test_de_1', 'common_test_de_2'],
          },
          special: {
            test: ['special_test_de_1', 'special_test_de_2'],
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
          keySeparator: '.',
          contextSeparator: '_',
          returnObjects: true,
          ns: ['common', 'special', 'withContext'],
          defaultNS: 'common',
          interpolation: {},
        },
      );
      t.changeLanguage('en');
    });

    var tests = [
      { args: ['common:test'], expected: ['common_test_en_1', 'common_test_en_2'] },
      { args: ['special:test'], expected: ['special_test_en_1', 'special_test_en_2'] },

      {
        args: ['common:somethingElse', { min: '1', max: '1000', what: 'world' }],
        expected: { range: '[1..1000]', hello: 'hello world', foo: 'bar' },
      },
      {
        args: ['common:requirements', { what: 'world' }],
        expected: ['lorem ipsum', 'lorem ipsum', 'hello world'],
      },

      // should not overwrite store value
      { args: ['common:something'], expected: { range: '[..]' } },
      { args: ['common:something', { min: '1', max: '1000' }], expected: { range: '[1..1000]' } },
      { args: ['common:something.range', { min: '1', max: '1000' }], expected: '[1..1000]' },
      { args: ['common:boolean'], expected: { value: true } },
      { args: ['common:number'], expected: { value: 42 } },

      // with context
      { args: ['withContext:string'], expected: 'hello world' },
      { args: ['withContext:string', { context: 'lined' }], expected: ['hello', 'world'] },
    ];

    tests.forEach(test => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });
  describe('translate() with returnObjects=false', () => {
    let t;
    let rs;
    let lu;
    before(() => {
      rs = new ResourceStore({
        en: {
          common: {
            array: ['common_array_en_1', 'common_array_en_2'],
            object: {
              value: 'common_object_en_value',
            },
            array_with_context: ['lorem ipsum', 'lorem ipsum', 'hello {{what}}'],
          },
          special: {
            array: ['special_array_en_1', 'special_array_en_2'],
          },
        },
      });
      lu = new LanguageUtils({ fallbackLng: 'en' });

      t = new Translator(
        {
          resourceStore: rs,
          languageUtils: lu,
          pluralResolver: new PluralResolver(lu, { prepend: '_', simplifyPluralSuffix: true }),
          interpolator: new Interpolator(),
        },
        {
          keySeparator: '.',
          contextSeparator: '_',
          returnObjects: false,
          returnedObjectHandler: (...args) => args,
          ns: ['common', 'special'],
          defaultNS: 'common',
          interpolation: {},
        },
      );

      t.changeLanguage('en');
    });

    var tests = [
      {
        args: ['common:array'],
        expected: ['array', ['common_array_en_1', 'common_array_en_2'], { ns: ['common'] }],
      },
      {
        args: ['array'],
        expected: ['array', ['common_array_en_1', 'common_array_en_2'], { ns: ['common'] }],
      },
      {
        args: ['common:array_with_context', { what: 'world' }],
        expected: [
          'array_with_context',
          ['lorem ipsum', 'lorem ipsum', 'hello {{what}}'],
          { what: 'world', ns: ['common'] },
        ],
      },
      {
        args: ['common:object', { what: 'world' }],
        expected: [
          'object',
          { value: 'common_object_en_value' },
          { what: 'world', ns: ['common'] },
        ],
      },
      {
        args: ['special:array'],
        expected: ['array', ['special_array_en_1', 'special_array_en_2'], { ns: ['special'] }],
      },
    ];

    describe('and "returnedObjectHandler" defined', () => {
      tests.forEach(test => {
        it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
          expect(JSON.stringify(t.translate.apply(t, test.args))).to.eql(
            JSON.stringify(test.expected),
          );
        });
      });
    });
  });
});
