import { describe, it, expect, beforeAll } from 'vitest';
import Translator from '../../../src/Translator';
import ResourceStore from '../../../src/ResourceStore.js';
import LanguageUtils from '../../../src/LanguageUtils';
import PluralResolver from '../../../src/PluralResolver';
import Interpolator from '../../../src/Interpolator';

describe('Translator', () => {
  describe('exists()', () => {
    /** @type {Translator} */
    let t;

    beforeAll(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'test_en',
            deep: {
              test: 'deep_en',
            },
          },
        },
        de: {
          translation: {
            test: 'test_de',
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
          defaultNS: 'translation',
          ns: 'translation',
          interpolation: {
            interpolateResult: true,
            interpolateDefaultValue: true,
            interpolateKey: true,
          },
        },
      );
      t.changeLanguage('en');
    });

    const tests = [
      { args: ['translation:test'], expected: true },
      { args: ['translation:test', { lngs: ['en-US', 'en'] }], expected: true },
      { args: ['translation:test', { lngs: ['de'] }], expected: true },
      { args: ['translation:test', { lng: 'de' }], expected: true },
      { args: ['translation:test', { lng: 'fr' }], expected: true },
      { args: ['translation:test', { lng: 'en-US' }], expected: true },
      { args: ['translation.test', { lng: 'en-US', nsSeparator: '.' }], expected: true },
      { args: ['translation.deep.test', { lng: 'en-US', nsSeparator: '.' }], expected: true },
      { args: ['deep.test', { lng: 'en-US', nsSeparator: '.' }], expected: true },
    ];

    tests.forEach((test) => {
      it(`correctly translates for ${JSON.stringify(test.args)} args`, () => {
        expect(t.exists.apply(t, test.args)).toEqual(test.expected);
      });
    });

    const nullishArgs = ['', undefined, null];

    nullishArgs.forEach((nullishArg) => {
      it(`should return false if a "${nullishArg}" key is passed as an argument`, () => {
        expect(t.exists(nullishArg)).toBeFalsy();
      });
    });
  });
});
