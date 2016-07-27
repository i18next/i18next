import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {

  describe('translate() with returnObjects=true', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          common: {
            test: ['common_test_en_1', 'common_test_en_2'],
            something: {
              range: '[{{min}}..{{max}}]'
            }
          },
          special: {
            test: ['special_test_en_1', 'special_test_en_2']
          }
        },
        de: {
          common: {
            test: ['common_test_de_1', 'common_test_de_2']
          },
          special: {
            test: ['special_test_de_1', 'special_test_de_2']
          }
        }
      });
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      t = new Translator({
        resourceStore: rs,
        languageUtils: lu,
        pluralResolver: new PluralResolver(lu, {prepend: '_'}),
        interpolator: new Interpolator()
      }, {
        returnObjects: true,
        ns: ['common', 'special'],
        defaultNS: 'common',
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true
        }
      });
      t.changeLanguage('en');
    });

    var tests = [
      {args: ['common:test'], expected: [ 'common_test_en_1', 'common_test_en_2' ]},
      {args: ['special:test'], expected: [ 'special_test_en_1', 'special_test_en_2' ]},

      // should not overwrite store value
      {args: ['common:something'], expected: { range: '[..]' }},
      {args: ['common:something.range', { min: '1', max: '1000' }], expected: '[1..1000]'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });

});
