import { describe, it, expect, beforeAll } from 'vitest';
import Translator from '../../../src/Translator';
import ResourceStore from '../../../src/ResourceStore.js';
import LanguageUtils from '../../../src/LanguageUtils';
import PluralResolver from '../../../src/PluralResolver';
import Interpolator from '../../../src/Interpolator';

describe('Translator', () => {
  describe('translate() - fallback', () => {
    /** @type {Translator} */
    let t;

    beforeAll(() => {
      const rs = new ResourceStore({
        en: {
          translation: {
            test: 'test_en',
            notInDE: 'test_notInDE_en',
            roles: { constructor: 'roles_constructor_en' },
          },
        },
        fr: {
          translation: {
            test: 'test_fr',
            notInDE: 'test_notInDE_fr',
          },
        },
        de: {
          translation: {
            test: 'test_de',
            roles: { admin: 'roles_admin_de' },
          },
        },
      });
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      t = new Translator(
        {
          resourceStore: rs,
          languageUtils: lu,
          pluralResolver: new PluralResolver(lu, { prepend: '_' }),
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
      t.changeLanguage('de');
    });

    const tests = [
      { args: ['translation:notInDE', {}], expected: 'test_notInDE_en' },
      { args: ['translation:notInDE', { fallbackLng: 'fr' }], expected: 'test_notInDE_fr' },
      // keys named like inherited methods are missing in de, not resolved to Object.prototype
      { args: ['translation:roles.constructor', {}], expected: 'roles_constructor_en' },
      { args: ['translation:roles.toString', {}], expected: 'roles.toString' },
    ];

    tests.forEach((test) => {
      it(`correctly translates for ${JSON.stringify(test.args)} args`, () => {
        expect(t.translate(...test.args)).toEqual(test.expected);
      });
    });
  });
});
