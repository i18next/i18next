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
      {args: ['test {{ test }}', {}], expected: 'test '},
      {args: ['test {{test.deep}}', {test: {deep: '123'}}], expected: 'test 123'}
    ];

    tests.forEach((test) => {
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
      {args: ['test {{test}}', {test: '<a>foo</a>'}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test {{test.deep}}', {test: {deep: '<a>foo</a>'}}], expected: 'test &lt;a&gt;foo&lt;&#x2F;a&gt;'},
      {args: ['test {{- test.deep}}', {test: {deep: '<a>foo</a>'}}], expected: 'test <a>foo</a>'},
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
      {args: ['test $t(test)', function() { return 'success'; } ], expected: 'test success'}
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
