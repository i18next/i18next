import PluralResolver from '../src/PluralResolver';
import LanguageUtils from '../src/LanguageUtils';

describe('PluralResolver', () => {

  describe('needsPlural()', () => {
    let pr;

    before(() => {
      let lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { simplifyPluralSuffix: true });
    });

    var tests = [
      {args: ['en'], expected: true},
      {args: ['fr'], expected: true},
      {args: ['ar'], expected: true},
      {args: ['ru'], expected: true},
      {args: ['ms'], expected: false},
      {args: ['lo'], expected: false},
      {args: ['su'], expected: false},
      {args: ['ach'], expected: true},
      {args: ['af'], expected: true},
      {args: ['ay'], expected: false},
      {args: ['be'], expected: true},
      {args: ['cs'], expected: true},
      {args: ['csb'], expected: true},
      {args: ['cy'], expected: true},
      {args: ['ga'], expected: true},
      {args: ['gd'], expected: true},
      {args: ['is'], expected: true},
      {args: ['jv'], expected: true},
      {args: ['kw'], expected: true},
      {args: ['lt'], expected: true},
      {args: ['lv'], expected: true},
      {args: ['mk'], expected: true},
      {args: ['mnk'], expected: true},
      {args: ['mt'], expected: true},
      {args: ['or'], expected: true},
      {args: ['ro'], expected: true},
      {args: ['sl'], expected: true}
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
      pr = new PluralResolver(cu, { simplifyPluralSuffix: true });
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
