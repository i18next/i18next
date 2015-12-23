import Translator from '../../src/Translator';
import ResourceStore from '../../src/ResourceStore.js';
import LanguageUtils from '../../src/LanguageUtils';
import PluralResolver from '../../src/PluralResolver';
import Interpolator from '../../src/Interpolator';

describe('Translator', () => {

  describe('translate() with arrays', () => {
    var t;

    before(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: ['test_en_1', 'test_en_2', '{{myVar}}']
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
        joinArrays: '+',
        ns: 'translation',
        defaultNS: 'translation',
        interpolation: {
          interpolateResult: true,
          interpolateDefaultValue: true,
          interpolateKey: true
        }
      });
      t.changeLanguage('en');
    });

    var tests = [
      { args: ['translation:test.0'], expected: 'test_en_1' },
      { args: ['translation:test.2', {myVar: 'test'}], expected: 'test' },
      { args: ['translation:test', {myVar: 'test'}], expected: 'test_en_1+test_en_2+test' }
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(t.translate.apply(t, test.args)).to.eql(test.expected);
      });
    });
  });

});
