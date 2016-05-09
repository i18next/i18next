import PluralResolver from '../src/PluralResolver';
import LanguageUtils from '../src/LanguageUtils';

describe('PluralResolver', () => {

  describe('needsPlural()', () => {
    let pr;

    before(() => {
      let lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu);
    });

    var tests = [
      {args: ['en'], expected: true},
      {args: ['fr'], expected: true},
      {args: ['ar'], expected: true},
      {args: ['ru'], expected: true},
      {args: ['ms'], expected: false},
      {args: ['lo'], expected: false},
      {args: ['su'], expected: false}
    ];

    tests.forEach((test) => {
      it('correctly returns needsPlural for ' + JSON.stringify(test.args) + ' args', () => {
        expect(pr.needsPlural.apply(pr, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('getSuffix()', () => {
    var cu, pr;

    before(() => {
      cu = new LanguageUtils({ fallbackCode: 'en' });
      pr = new PluralResolver(cu);
    });

    var tests = [
      {args: ['en', 0], expected: 'plural'},
      {args: ['en', 1], expected: ''},
      {args: ['en', 10], expected: 'plural'},
      {args: ['en', 10.5], expected: 'plural'},

      {args: ['fr', 0], expected: ''},
      {args: ['fr', 1], expected: ''},
      {args: ['fr', 10], expected: 'plural'},
      {args: ['fr', 10.5], expected: 'plural'},

      // only singular
      {args: ['su', 0], expected: ''},
      {args: ['su', 1], expected: ''},
      {args: ['su', 10], expected: ''},

      // ar
      {args: ['ar', 0], expected: '0'},
      {args: ['ar', 1], expected: '1'},
      {args: ['ar', 2], expected: '2'},
      {args: ['ar', 3], expected: '3'},
      {args: ['ar', 4], expected: '3'},
      {args: ['ar', 104], expected: '3'},
      {args: ['ar', 11], expected: '4'},
      {args: ['ar', 99], expected: '4'},
      {args: ['ar', 199], expected: '4'},
      {args: ['ar', 100], expected: '5'}
    ];

    tests.forEach((test) => {
      it('correctly returns suffix for ' + JSON.stringify(test.args) + ' args', () => {
        expect(pr.getSuffix.apply(pr, test.args)).to.eql(test.expected);
      });
    });
  });


});
