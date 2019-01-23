import postProcessor from '../src/postProcessor';

describe('postProcessor', () => {
  describe('add and handle()', () => {
    before(() => {
      postProcessor.addPostProcessor({
        name: 'dummy',
        process: (value, key, options, translator) => {
          return value.toUpperCase();
        },
      });
    });

    var tests = [{ args: [['dummy'], 'test', 'key', {}, () => {}], expected: 'TEST' }];

    tests.forEach(test => {
      it('correctly process for ' + JSON.stringify(test.args) + ' args', () => {
        expect(postProcessor.handle.apply(postProcessor, test.args)).to.eql(test.expected);
      });
    });
  });
});
