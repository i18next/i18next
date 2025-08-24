import { describe, it, expect, beforeAll } from 'vitest';
import Translator from '../../../src/Translator.js';
import ResourceStore from '../../../src/ResourceStore.js';
import LanguageUtils from '../../../src/LanguageUtils.js';
import PluralResolver from '../../../src/PluralResolver.js';
import Interpolator from '../../../src/Interpolator.js';

describe('Translator', () => {
  describe('translate() with selector and custom separators', () => {
    /** @type {Translator} */
    let t;

    beforeAll(() => {
      const rs = new ResourceStore({
        en: {
          root: {
            foo: {
              bar: 'foobar'
            }
          },
        },
      });
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      t = new Translator(
        {
          resourceStore: rs,
          languageUtils: lu,
          pluralResolver: new PluralResolver(lu, { prepend: '_', simplifyPluralSuffix: true }),
          interpolator: new Interpolator(),
        },
        {
          returnObjects: true,
          ns: 'root',
          defaultNS: 'root',
          nsSeparator: ':::',
          keySeparator: '::',
          pluralSeparator: '##',
          contextSeparator: '##',
          interpolation: {},
        },
      );
      t.changeLanguage('en');
    });

    const tests = [
      { args: ['root:::foo::bar'], expected: 'foobar' },
      { args: ['foo::bar'], expected: 'foobar' },
    ];

    tests.forEach((test) => {
      it(`correctly translates for ${JSON.stringify(test.args)} args`, () => {
        expect(t.translate.apply(t, test.args)).toEqual(test.expected);
      });
    });
  });
});
