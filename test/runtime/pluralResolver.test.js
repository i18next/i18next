import { describe, it, expect, beforeAll, vitest } from 'vitest';
import PluralResolver from '../../src/PluralResolver';
import LanguageUtils from '../../src/LanguageUtils';

describe('PluralResolver', () => {
  describe('getRule()', () => {
    /** @type {PluralResolver} */
    let pr;
    beforeAll(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, {});
    });

    it('correctly returns getRule for a supported locale', () => {
      const expected = {
        resolvedOptions: () => {},
        select: () => {},
      };
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue(expected);

      const locale = 'en';

      expect(pr.getRule(locale)).toStrictEqual(expected);
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });

    it('correctly returns getRule for an unsupported locale', () => {
      pr.clearCache();
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockImplementation(() => {
        throw Error('mock error');
      });

      const locale = 'en';

      expect(pr.getRule(locale)).toBeUndefined();
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });
  });

  describe('needsPlural()', () => {
    /** @type {PluralResolver} */
    let pr;
    beforeAll(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, {});
    });

    it('correctly returns needsPlural for locale with more than one plural form', () => {
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue({
        resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }),
      });

      const locale = 'en';

      expect(pr.needsPlural(locale)).toBeTruthy();
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });

    it('correctly returns needsPlural for locale with just one plural form', () => {
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue({
        resolvedOptions: () => ({ pluralCategories: ['other'] }),
      });

      const locale = 'ja';

      expect(pr.needsPlural(locale)).toBeFalsy();
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });
  });

  describe('getSuffix()', () => {
    /** @type {PluralResolver} */
    let pr;
    beforeAll(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns suffix for a supported locale', () => {
      const locale = 'en';
      const count = 10.5;
      const expected = 'other';

      const selectStub = vitest.fn().mockReturnValue(expected);
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue({
        select: selectStub,
      });

      expect(pr.getSuffix(locale, count)).to.equal(`_${expected}`);
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );
      expect(selectStub).toHaveBeenCalledOnce();
      expect(selectStub).toHaveBeenCalledWith(count);

      pluralRulesSpy.mockReset();
    });

    it('correctly returns suffix for an unsupported locale', () => {
      const locale = 'non-existent';

      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockImplementation(() => {
        throw Error('mock error');
      });

      expect(pr.getSuffix(locale, 10.5)).toEqual('');
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });
  });

  describe('getPluralFormsOfKey()', () => {
    /** @type {PluralResolver} */
    let pr;
    beforeAll(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns plural forms for a given key', () => {
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue({
        resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }),
      });

      const locale = 'en';

      expect(pr.getPluralFormsOfKey(locale, 'key')).toStrictEqual(['key_one', 'key_other']);
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });
  });

  describe('getSuffixes()', () => {
    /** @type {PluralResolver} */
    let pr;
    beforeAll(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns plural suffixes for a given key', () => {
      const pluralRulesSpy = vitest.spyOn(Intl, 'PluralRules').mockReturnValue({
        resolvedOptions: () => ({
          pluralCategories: ['zero', 'one', 'two', 'few', 'many', 'other'],
        }),
      });

      const locale = 'en';

      expect(pr.getSuffixes(locale)).toStrictEqual([
        '_zero',
        '_one',
        '_two',
        '_few',
        '_many',
        '_other',
      ]);
      expect(pluralRulesSpy).toHaveBeenCalledOnce();
      expect(pluralRulesSpy).toHaveBeenCalledWith(
        locale,
        expect.objectContaining({ type: expect.any(String) }),
      );

      pluralRulesSpy.mockReset();
    });
  });

  describe('shouldUseIntlApi()', () => {
    /** @type {LanguageUtils} */
    let lu;
    beforeAll(() => {
      lu = new LanguageUtils({ fallbackLng: 'en' });
    });

    const tests = [
      { compatibilityJSON: 'v1', expected: false },
      { compatibilityJSON: 'v2', expected: false },
      { compatibilityJSON: 'v3', expected: false },
      { compatibilityJSON: 'v4', expected: true },
      { expected: true },
    ];

    tests.forEach(({ compatibilityJSON, expected }) => {
      it(`correctly returns shouldUseIntlApi for compatibilityJSON set to ${compatibilityJSON}`, () => {
        const pr = new PluralResolver(lu, { compatibilityJSON });

        expect(pr.shouldUseIntlApi()).to.equal(expected);
      });
    });
  });
});
