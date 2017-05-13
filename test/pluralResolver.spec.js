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

      {args: ['ach', 0], expected: ''},
      {args: ['ach', 1], expected: ''},
      {args: ['ach', 10], expected: 'plural'},
      {args: ['ach', 10.5], expected: 'plural'},

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
      {args: ['ar', 100], expected: '5'},

      // be
      {args: ['be', 0], expected: '2'},
      {args: ['be', 1], expected: '0'},
      {args: ['be', 5], expected: '2'},

      // sk
      {args: ['sk', 0], expected: '2'},
      {args: ['sk', 1], expected: '0'},
      {args: ['sk', 5], expected: '2'},

      // pl
      {args: ['pl', 0], expected: '2'},
      {args: ['pl', 1], expected: '0'},
      {args: ['pl', 5], expected: '2'},

      // cy
      {args: ['cy', 0], expected: '2'},
      {args: ['cy', 1], expected: '0'},
      {args: ['cy', 3], expected: '2'},
      {args: ['cy', 8], expected: '3'},

      // ga
      {args: ['ga', 1], expected: '0'},
      {args: ['ga', 2], expected: '1'},
      {args: ['ga', 3], expected: '2'},
      {args: ['ga', 7], expected: '3'},
      {args: ['ga', 11], expected: '4'},

      // gd
      {args: ['gd', 1], expected: '0'},
      {args: ['gd', 2], expected: '1'},
      {args: ['gd', 3], expected: '2'},
      {args: ['gd', 20], expected: '3'},

      // is
      {args: ['is', 1], expected: ''},
      {args: ['is', 2], expected: 'plural'},

      // jv
      {args: ['jv', 0], expected: '0'},
      {args: ['jv', 1], expected: '1'},

      // kw
      {args: ['kw', 1], expected: '0'},
      {args: ['kw', 2], expected: '1'},
      {args: ['kw', 3], expected: '2'},
      {args: ['kw', 4], expected: '3'},

      // lt
      {args: ['lt', 1], expected: '0'},
      {args: ['lt', 2], expected: '1'},
      {args: ['lt', 10], expected: '2'},

      // lv
      {args: ['lv', 1], expected: '0'},
      {args: ['lv', 2], expected: '1'},
      {args: ['lv', 0], expected: '2'},

      // mk
      {args: ['mk', 1], expected: ''},
      {args: ['mk', 2], expected: 'plural'},
      {args: ['mk', 0], expected: 'plural'},

      // mnk
      {args: ['mnk', 0], expected: '0'},
      {args: ['mnk', 1], expected: '1'},
      {args: ['mnk', 2], expected: '2'},

      // mt
      {args: ['mt', 1], expected: '0'},
      {args: ['mt', 2], expected: '1'},
      {args: ['mt', 11], expected: '2'},
      {args: ['mt', 20], expected: '3'},

      // or
      {args: ['or', 2], expected: '1'},
      {args: ['or', 1], expected: '0'},

      // ro
      {args: ['ro', 0], expected: '1'},
      {args: ['ro', 1], expected: '0'},
      {args: ['ro', 20], expected: '2'},

      // sl
      {args: ['sl', 5], expected: '0'},
      {args: ['sl', 1], expected: '1'},
      {args: ['sl', 2], expected: '2'},
      {args: ['sl', 3], expected: '3'},

    ];

    tests.forEach((test) => {
      it('correctly returns suffix for ' + JSON.stringify(test.args) + ' args', () => {
        expect(pr.getSuffix.apply(pr, test.args)).to.eql(test.expected);
      });
    });
  });


});
