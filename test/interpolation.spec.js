import Interpolator from '../src/Interpolator';

describe('Interpolator', () => {
  describe('interpolate()', () => {
    var ip;

    before(() => {
      ip = new Interpolator({ interpolation: { escapeValue: false } });
    });

    var tests = [
      { args: ['test', { test: '123' }], expected: 'test' },
      { args: ['test {{test}}', { test: '123' }], expected: 'test 123' },
      {
        args: ['test {{test}} a {{bit.more}}', { test: '123', bit: { more: '456' } }],
        expected: 'test 123 a 456',
      },
      { args: ['test {{ test }}', { test: '123' }], expected: 'test 123' },
      { args: ['test {{ test }}', { test: null }], expected: 'test ' },
      { args: ['test {{ test }}', { test: undefined }], expected: 'test ' },
      { args: ['test {{ test }}', {}], expected: 'test ' },
      { args: ['test {{test.deep}}', { test: { deep: '123' } }], expected: 'test 123' },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - defaultVariables', () => {
    var ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          escapeValue: false,
          defaultVariables: { test: '123', bit: { more: '456' } },
        },
      });
    });

    var tests = [
      { args: ['test'], expected: 'test' },
      { args: ['test {{test}}'], expected: 'test 123' },
      {
        args: ['test {{test}} a {{bit.more}}'],
        expected: 'test 123 a 456',
      },
      // prio has passed in variables
      { args: ['test {{ test }}', { test: '124' }], expected: 'test 124' },
      { args: ['test {{ test }}', { test: null }], expected: 'test ' },

      // Override default variable only with null, not with undefined.
      { args: ['test {{ test }}', { test: undefined }], expected: 'test 123' },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - options', () => {
    var tests = [
      {
        options: { interpolation: {} },
        expected: {
          escapeValue: true,
          prefix: '{{',
          suffix: '}}',
          formatSeparator: ',',
          unescapePrefix: '-',
          unescapeSuffix: '',
          nestingPrefix: '\\$t\\(',
          nestingSuffix: '\\)',
        },
      },
      {
        options: {},
        expected: {
          escapeValue: true,
          prefix: '{{',
          suffix: '}}',
          formatSeparator: ',',
          unescapePrefix: '-',
          unescapeSuffix: '',
          nestingPrefix: '\\$t\\(',
          nestingSuffix: '\\)',
        },
      },
      {
        description: 'uses and regex escapes prefix and suffix',
        options: {
          interpolation: {
            prefix: '(*(',
            suffix: ')*)',
            prefixEscaped: '\\(\\^\\(',
            suffixEscaped: ')\\^\\)',
          },
        },
        expected: { prefix: '\\(\\*\\(', suffix: '\\)\\*\\)' },
      },
      {
        description: 'uses prefixEscaped and suffixEscaped if prefix and suffix not provided',
        options: { interpolation: { prefixEscaped: '<<', suffixEscaped: '>>' } },
        expected: { prefix: '<<', suffix: '>>' },
      },
      {
        description: 'uses unescapePrefix if provided',
        options: { interpolation: { unescapePrefix: '=>' } },
        expected: { unescapePrefix: '=>', unescapeSuffix: '' },
      },
      {
        description: 'uses unescapeSuffix if provided',
        options: { interpolation: { unescapeSuffix: '<=' } },
        expected: { unescapePrefix: '', unescapeSuffix: '<=' },
      },
      {
        description: 'uses unescapeSuffix if both unescapePrefix and unescapeSuffix are provided',
        options: { interpolation: { unescapePrefix: '=>', unescapeSuffix: '<=' } },
        expected: { unescapePrefix: '', unescapeSuffix: '<=' },
      },
      {
        description: 'uses and regex escapes nestingPrefix and nestingSuffix',
        options: {
          interpolation: {
            nestingPrefix: 'nest(',
            nestingSuffix: ')nest',
            nestingPrefixEscaped: 'neste\\(',
            nestingSuffixEscaped: '\\)neste',
          },
        },
        expected: { nestingPrefix: 'nest\\(', nestingSuffix: '\\)nest' },
      },
      {
        description:
          'uses nestingPrefixEscaped and nestingSuffixEscaped if nestingPrefix and nestingSuffix not provided',
        options: {
          interpolation: { nestingPrefixEscaped: 'neste\\(', nestingSuffixEscaped: '\\)neste' },
        },
        expected: { nestingPrefix: 'neste\\(', nestingSuffix: '\\)neste' },
      },
      {
        description: 'uses maxReplaces if provided',
        options: { interpolation: { maxReplaces: 100 } },
        expected: { maxReplaces: 100 },
      },
    ];

    tests.forEach(test => {
      describe(test.description || 'when called with ' + JSON.stringify(test.options), () => {
        var ip;

        before(() => {
          ip = new Interpolator(test.options);
        });

        Object.keys(test.expected).forEach(key => {
          it(key + ' is set correctly', () => {
            expect(ip[key]).to.eql(test.expected[key]);
          });
        });
      });
    });
  });

  describe('interpolate() - with formatter', () => {
    var ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          escapeValue: false,
          format: function(value, format, lng, options) {
            if (format === 'uppercase') return value.toUpperCase();
            if (format === 'lowercase') return value.toLowerCase();
            if (format === 'throw') throw new Error('Formatter error');
            if (format === 'currency')
              return Intl.NumberFormat(options.parmOptions[options.interpolationkey].locale, {
                style: 'currency',
                currency: options.parmOptions[options.interpolationkey].currency,
              }).format(value);
            return value;
          },
        },
      });
    });

    var tests = [
      { args: ['test {{test, uppercase}}', { test: 'up' }], expected: 'test UP' },
      { args: ['test {{test, lowercase}}', { test: 'DOWN' }], expected: 'test down' },
      {
        args: [
          'test {{localValue, currency}} {{altValue, currency}}',
          {
            localValue: 12345.67,
            altValue: 16543.21,
            parmOptions: {
              localValue: { currency: 'USD', locale: 'en-US' },
              altValue: { currency: 'CAD', locale: 'fr-CA' },
            },
          },
        ],
        expected: 'test $12,345.67 16 543,21 $ CA',
      },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });

    it('correctly manage exception in formatter', () => {
      expect(() => {
        ip.interpolate.apply(ip, ['test {{test, throw}}', { test: 'up' }]);
      }).to.throw(Error, 'Formatter error');

      const test = tests[0];

      expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
    });
  });

  describe('interpolate() - with formatter using a special formatSeparator', () => {
    let ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          formatSeparator: '|',
          format: function(value, format, lng) {
            if (format === 'uppercase') return value.toUpperCase();
            return value;
          },
        },
      });
    });

    var tests = [{ args: ['test {{test | uppercase}}', { test: 'up' }], expected: 'test UP' }];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - with formatter always', () => {
    let ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          alwaysFormat: true,
          format: function(value, format, lng) {
            if (format === 'uppercase') return value.toUpperCase();
            return value.toLowerCase();
          },
        },
      });
    });

    var tests = [
      { args: ['test {{test, uppercase}}', { test: 'up' }], expected: 'test UP' },
      { args: ['test {{test}}', { test: 'DOWN' }], expected: 'test down' },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - unescape', () => {
    var ip;

    before(() => {
      ip = new Interpolator({});
    });

    var tests = [
      {
        args: ['test {{test}}', { test: '<a>foo</a>' }],
        expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;',
      },
      {
        args: ['test {{test.deep}}', { test: { deep: '<a>foo</a>' } }],
        expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;',
      },
      {
        args: ['test {{- test.deep}}', { test: { deep: '<a>foo</a>' } }],
        expected: 'test <a>foo</a>',
      },
      {
        args: [
          'test {{- test}} {{- test2}} {{- test3}}',
          { test: ' ', test2: '<span>test2</span>', test3: '<span>test3</span>' },
        ],
        expected: 'test   <span>test2</span> <span>test3</span>',
      },
      {
        args: ['test {{- test}}', {}],
        expected: 'test ',
      },
      {
        args: ['test {{- test}}', { test: null }],
        expected: 'test ',
      },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - nesting', () => {
    var ip;

    before(() => {
      ip = new Interpolator({});
    });

    var tests = [
      {
        args: [
          'test $t(test)',
          function() {
            return 'success';
          },
        ],
        expected: 'test success',
      },
      {
        args: [
          '$t(test, {"key": "success"})',
          function(key, opts) {
            return 'test ' + opts.key;
          },
        ],
        expected: 'test success',
      },
      {
        args: [
          "$t(test, {'key': 'success'})",
          function(key, opts) {
            return 'test ' + opts.key;
          },
        ],
        expected: 'test success',
      },
      {
        args: [
          '$t(test, is, {"key": "success"})',
          function(key, opts) {
            return 'test, is ' + opts.key;
          },
        ],
        expected: 'test, is success',
      },
      {
        args: [
          '$t(test, is, ok)',
          function() {
            return 'test, is, ok';
          },
        ],
        expected: 'test, is, ok',
      },
      {
        args: [
          '$t(ns:test)',
          function() {
            return 'test from ns';
          },
        ],
        expected: 'test from ns',
      },
    ];

    tests.forEach(test => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.nest.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - backwards compatible', () => {
    var ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          escapeValue: true,
          prefix: '__',
          suffix: '__',
          unescapeSuffix: 'HTML',
        },
      });
    });

    var tests = [
      { args: ['test __test__', { test: '123' }], expected: 'test 123' },
      {
        args: ['test __test__ a __bit.more__', { test: '123', bit: { more: '456' } }],
        expected: 'test 123 a 456',
      },
      { args: ['test __ test __', { test: '123' }], expected: 'test 123' },
      { args: ['test __test.deep__', { test: { deep: '123' } }], expected: 'test 123' },
      {
        args: ['test __test__', { test: '<a>foo</a>' }],
        expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;',
      },
      {
        args: ['test __test.deep__', { test: { deep: '<a>foo</a>' } }],
        expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;',
      },
      {
        args: ['test __test.deepHTML__', { test: { deep: '<a>foo</a>' } }],
        expected: 'test <a>foo</a>',
      },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - max replaced to prevent endless loop', () => {
    var ip;

    before(() => {
      ip = new Interpolator({
        interpolation: {
          maxReplaces: 10,
        },
      });
    });

    var tests = [
      {
        args: ['test {{test}}', { test: 'tested {{test}}' }],
        expected:
          'test tested tested tested tested tested tested tested tested tested tested {{test}}',
      },
    ];

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - with undefined interpolation value', () => {
    var ip;
    var tests = [{ args: ['{{test}}'], expected: '' }];

    before(() => {
      ip = new Interpolator({
        missingInterpolationHandler: (str, match) => {
          expect(str).to.eql('{{test}}');
          expect(match[0]).to.eql('{{test}}');
          expect(match[1]).to.eql('test');
        },
      });
    });

    tests.forEach(test => {
      it(
        'correctly calls missingInterpolationHandler for ' + JSON.stringify(test.args) + ' args',
        () => {
          expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
        },
      );
    });
  });

  describe('interpolate() - with undefined interpolation value - filled by missingInterpolationHandler', () => {
    var ip;
    var tests = [{ args: ['{{test}}'], expected: 'test' }];

    before(() => {
      ip = new Interpolator({
        missingInterpolationHandler: (str, match) => {
          expect(str).to.eql('{{test}}');
          expect(match[0]).to.eql('{{test}}');
          expect(match[1]).to.eql('test');
          return 'test';
        },
      });
    });

    tests.forEach(test => {
      it(
        'correctly calls missingInterpolationHandler for ' + JSON.stringify(test.args) + ' args',
        () => {
          expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
        },
      );
    });

    it('correctly calls handler provided via options', () => {
      expect(
        ip.interpolate('{{custom}}', {}, null, {
          missingInterpolationHandler: (str, match) => 'overridden',
        }),
      ).to.eql('overridden');
    });
  });

  describe('interpolate() - with null interpolation value - not filled by missingInterpolationHandler', () => {
    var ip;
    var tests = [{ args: ['{{test}}', { test: null }], expected: '' }];

    before(() => {
      ip = new Interpolator({
        missingInterpolationHandler: (str, match) => {
          return 'test';
        },
      });
    });

    tests.forEach(test => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });
});
