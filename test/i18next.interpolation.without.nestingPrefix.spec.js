import i18next from '../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.interpolation.without.nestingPrefix', () => {
  before(done => {
    instance.init(
      {
        interpolation: {
          nestingPrefix: false,
        },
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
            },
          },
        },
      },
      () => {
        done();
      },
    );
  });

  describe('nesting', () => {
    var tests = [
      {
        args: ['test1', { a: 'foo' }],
        expected: 'test $t(nest1) foo',
      },
      {
        args: ['test2', { a: 'foo' }],
        expected: 'test $t(nest2, { "b": "foo" })',
      },
      {
        args: ['test3', { a: 'foo', b: 'bar' }],
        expected: 'test $t(nest3, { "b": "foo", "c": "bar" })',
      },
      {
        args: ['test102'],
        expected: '$t(test102, is, {"key": "success"})',
      },
      {
        args: ['test103'],
        expected: '$t(test103, is, {"key": "success", "key2": "full"})',
      },
      {
        args: ['$t(test1)', { a: 'foo' }],
        expected: '$t(test1)',
      },
      // {
      //   args: ['$t(translation:test1)', { a: 'foo' }],
      //   expected: 'test1)',
      // },
      {
        args: ['something $t(test1)', { a: 'foo' }],
        expected: 'something $t(test1)',
      },
      // {
      //   args: ['something $t(translation:test1)', { a: 'foo' }],
      //   expected: 'test1)',
      // },
      {
        args: ['keyB1'],
        expected: 'Text to interpolate => $t(keyA1, { "text": "foo" })',
      },
      {
        args: ['keyB1rec'],
        expected: 'Text to interpolate => $t(keyA1rec, { "text": "foo" })',
      },
    ];

    tests.forEach(test => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
