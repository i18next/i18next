import Interpolator from '../src/Interpolator';

describe('Interpolator', () => {

  describe('interpolate()', () => {
    var ip;

    before(() => {
      ip = new Interpolator({interpolation: { escapeValue: false }});
    });

    var tests = [
      {args: ['test', {test: '123'}], expected: 'test'},
      {args: ['test {{test}}', {test: '123'}], expected: 'test 123'},
      {args: ['test {{test}} a {{bit.more}}', {test: '123', bit: {more: '456'}}], expected: 'test 123 a 456'},
      {args: ['test {{ test }}', {test: '123'}], expected: 'test 123'},
      {args: ['test {{ test }}', {test: null}], expected: 'test '},
      {args: ['test {{ test }}', {test: undefined}], expected: 'test '},
      {args: ['test {{ test }}', {}], expected: 'test '},
      {args: ['test {{test.deep}}', {test: {deep: '123'}}], expected: 'test 123'}
    ];

    tests.forEach((test) => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - options', () => {
    var tests = [
      {
        options: {interpolation: {}},
        expected: {escapeValue: true, prefix: '{{', suffix: '}}', formatSeparator: ',', unescapePrefix: '-', unescapeSuffix: '', nestingPrefix: '\\$t\\(', nestingSuffix: '\\)' }
      },
      {
        options: {},
        expected: {escapeValue: true, prefix: '{{', suffix: '}}', formatSeparator: ',', unescapePrefix: '-', unescapeSuffix: '', nestingPrefix: '\\$t\\(', nestingSuffix: '\\)' }
      },
      {
        description: 'uses and regex escapes prefix and suffix',
        options: {interpolation: {prefix: '(*(', suffix: ')*)', prefixEscaped: '\\(\\^\\(', suffixEscaped: ')\\^\\)'}},
        expected: {prefix: '\\(\\*\\(', suffix: '\\)\\*\\)'}
      },
      {
        description: 'uses prefixEscaped and suffixEscaped if prefix and suffix not provided',
        options: {interpolation: {prefixEscaped: '<<', suffixEscaped: '>>'}},
        expected: {prefix: '<<', suffix: '>>'}
      },
      {
        description: 'uses unescapePrefix if provided',
        options: {interpolation: {unescapePrefix: '=>'}},
        expected: {unescapePrefix: '=>', unescapeSuffix: ''}
      },
      {
        description: 'uses unescapeSuffix if provided',
        options: {interpolation: {unescapeSuffix: '<='}},
        expected: {unescapePrefix: '', unescapeSuffix: '<='}
      },
      {
        description: 'uses unescapeSuffix if both unescapePrefix and unescapeSuffix are provided',
        options: {interpolation: {unescapePrefix: '=>', unescapeSuffix: '<='}},
        expected: {unescapePrefix: '', unescapeSuffix: '<='}
      },
      {
        description: 'uses and regex escapes nestingPrefix and nestingSuffix',
        options: {interpolation: {nestingPrefix: 'nest(', nestingSuffix: ')nest', nestingPrefixEscaped: 'neste\\(', nestingSuffixEscaped: '\\)neste'}},
        expected: {nestingPrefix: 'nest\\(', nestingSuffix: '\\)nest'}
      },
      {
        description: 'uses nestingPrefixEscaped and nestingSuffixEscaped if nestingPrefix and nestingSuffix not provided',
        options: {interpolation: {nestingPrefixEscaped: 'neste\\(', nestingSuffixEscaped: '\\)neste'}},
        expected: {nestingPrefix: 'neste\\(', nestingSuffix: '\\)neste'}
      }
    ];

    tests.forEach((test) => {

      describe(test.description || 'when called with ' + JSON.stringify(test.options), () => {
        var ip;

        before(() => {
          ip = new Interpolator(test.options);
        });

        Object.keys(test.expected).forEach((key) => {
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
          format: function(value, format, lng) {
            if (format === 'uppercase') return value.toUpperCase();
            if (format === 'lowercase') return value.toLowerCase();
            if (format === 'throw') throw new Error('Formatter error');
            return value;
          }
        }
      });
    });

    var tests = [
      {args: ['test {{test, uppercase}}', {test: 'up'}], expected: 'test UP'},
      {args: ['test {{test, lowercase}}', {test: 'DOWN'}], expected: 'test down'}
    ];

    tests.forEach((test) => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });

    it('correctly manage exception in formatter', () => {
      expect(() => {
        ip.interpolate.apply(ip,  ['test {{test, throw}}', {test: 'up'}])
      }).to.throw(Error, 'Formatter error');

      const test = tests[0];

      expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
    });
  });


  describe('interpolate() - unescape', () => {
    var ip;

    before(() => {
      ip = new Interpolator({});
    });

    var tests = [
      {args: ['test {{test}}', {test: '<a>foo</a>'}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test {{test.deep}}', {test: {deep: '<a>foo</a>'}}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test {{- test.deep}}', {test: {deep: '<a>foo</a>'}}], expected: 'test <a>foo</a>'},
      {args: ['test {{- test}} {{- test2}} {{- test3}}', {test:' ', test2: '<span>test2</span>', test3:'<span>test3</span>'}], expected: 'test   <span>test2</span> <span>test3</span>'},
    ];

    tests.forEach((test) => {
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
      {args: ['test $t(test)', function() { return 'success'; }], expected: 'test success'},
      {args: ['$t(test, {"key": "success"})', function(key, opts) { return 'test ' + opts.key; }], expected: 'test success'},
      {args: ['$t(test, {\'key\': \'success\'})', function(key, opts) { return 'test ' + opts.key }], expected: 'test success'}
    ];

    tests.forEach((test) => {
      it('correctly nests for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.nest.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('interpolate() - backwards compatible', () => {
    var ip;

    before(() => {
      ip = new Interpolator({interpolation: {
        escapeValue: true,
        prefix: '__',
        suffix: '__',
        unescapeSuffix: 'HTML'
      }});
    });

    var tests = [
      {args: ['test __test__', {test: '123'}], expected: 'test 123'},
      {args: ['test __test__ a __bit.more__', {test: '123', bit: {more: '456'}}], expected: 'test 123 a 456'},
      {args: ['test __ test __', {test: '123'}], expected: 'test 123'},
      {args: ['test __test.deep__', {test: {deep: '123'}}], expected: 'test 123'},
      {args: ['test __test__', {test: '<a>foo</a>'}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test __test.deep__', {test: {deep: '<a>foo</a>'}}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test __test.deepHTML__', {test: {deep: '<a>foo</a>'}}], expected: 'test <a>foo</a>'},
    ];

    tests.forEach((test) => {
      it('correctly interpolates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(ip.interpolate.apply(ip, test.args)).to.eql(test.expected);
      });
    });
  });


});
