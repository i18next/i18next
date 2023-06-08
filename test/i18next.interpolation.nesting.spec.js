import i18next from '../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.interpolation.nesting', () => {
  before((done) => {
    instance.init(
      {
        lng: 'en',
        resources: {
          en: {
            translation: {
              test1: 'test $t(nest1) {{a}}',
              nest1: 'nest value',
              // options
              test2: 'test $t(nest2, { "b": "{{a}}" })',
              nest2: 'nest {{b}}',
              // 2 options
              test3: 'test $t(nest3, { "b": "{{a}}", "c": "{{b}}" })',
              nest3: 'nest {{b}} {{c}}',
              // , in key
              test102: '$t(test102, is, {"key": "success"})',
              'test102, is': 'this test is {{key}}',
              // , in key and two options , separated
              test103: '$t(test103, is, {"key": "success", "key2": "full"})',
              'test103, is': 'this test is {{key2}} {{key}}',
              keyA1: '{{text}} interpolated',
              keyB1: 'Text to interpolate => $t(keyA1, { "text": "foo" })',
              keyA1rec: '{{text}} interpolated | $t(keyB1rec)',
              keyB1rec: 'Text to interpolate => $t(keyA1rec, { "text": "foo" })',
              test_foo: "foo $t(test, { 'context': 'bar' })",
              test_bar: "bar $t(test, { 'context': 'baz' })",
              test_baz: 'baz',
              foo: '$t(bar, {"firstName": "{{firstName}}", "lastName": "{{lastName}}" })',
              fooSingle: `$t(bar, {'firstName': '{{firstName}}', 'lastName': '{{lastName}}' })`,
              bar: '{{firstName}} {{lastName}}',

              item_one: 'item',
              item_other: 'items',
              thing_one: 'thing',
              thing_other: 'things',
              phrase: 'A: $t(thing, { "count": 1 }) B: $t(item)',
              phrase2: 'A: $t(thing, { "count": 2 }) B: $t(item)',

              date_MMDD: 'DD/MM/YY',
              dateTest: '$t({{format}}, customdDateFormatter)',
            },
          },
        },
      },
      () => {
        done();
      },
    );
    instance.services.formatter.add(
      'customdDateFormatter',
      (value, lng, options) => `${value} | ${lng}`,
    );
  });

  describe('nesting', () => {
    var tests = [
      {
        args: ['test1', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['test2', { a: 'foo' }],
        expected: 'test nest foo',
      },
      {
        args: ['test3', { a: 'foo', b: 'bar' }],
        expected: 'test nest foo bar',
      },
      {
        args: ['test102'],
        expected: 'this test is success',
      },
      {
        args: ['test103'],
        expected: 'this test is full success',
      },
      {
        args: ['$t(test1)', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['$t(translation:test1)', { a: 'foo' }],
        expected: 'test nest value foo',
      },
      {
        args: ['something $t(test1)', { a: 'foo' }],
        expected: 'something test nest value foo',
      },
      {
        args: ['something $t(translation:test1)', { a: 'foo' }],
        expected: 'something test nest value foo',
      },
      {
        args: ['keyB1'],
        expected: 'Text to interpolate => foo interpolated',
      },
      {
        args: ['keyB1rec'],
        expected: 'Text to interpolate => foo interpolated | ',
      },
      {
        args: ['test', { context: 'foo' }],
        expected: 'foo bar baz',
      },
      {
        args: [
          'foo',
          { firstName: `Cool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool O'Dood`,
      },
      {
        args: [
          'foo',
          { firstName: `C'ool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `C'ool O'Dood`,
      },
      {
        args: [
          'fooSingle',
          { firstName: `Cool`, lastName: `Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool Dood`,
      },
      {
        args: [
          'bar',
          { firstName: `Cool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `Cool O'Dood`,
      },
      {
        args: [
          'bar',
          { firstName: `C'ool`, lastName: `O'Dood`, interpolation: { escapeValue: false } },
        ],
        expected: `C'ool O'Dood`,
      },
      {
        args: ['phrase'],
        expected: 'A: thing B: item',
      },
      {
        args: ['phrase2'],
        expected: 'A: things B: item',
      },
      {
        args: ['dateTest', { format: 'date_MMDD' }],
        expected: 'DD/MM/YY | en',
      },
    ];

    tests.forEach((test) => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
