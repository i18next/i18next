import i18next from '../src/i18next.js';

const instance = i18next.createInstance();

describe('i18next.interpolation.nesting', () => {
  before(done => {
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
    ];

    tests.forEach(test => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(instance.t.apply(instance, test.args)).to.eql(test.expected);
      });
    });
  });
});
