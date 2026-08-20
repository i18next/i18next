import { describe, it, expect, beforeAll } from 'vitest';
import LanguageUtils from '../../src/LanguageUtils';

describe('LanguageUtils', () => {
  describe('toResolveHierarchy()', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en' });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['fr', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['de-CH'], expected: ['de-CH', 'de', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'nb', 'en'] },
      { args: ['zh-Hant-MO'], expected: ['zh-Hant-MO', 'zh-Hant', 'zh', 'en'] },
      { args: ['de-x-custom1'], expected: ['de-x-custom1', 'de', 'en'] },
      { args: ['de-DE-x-custom1'], expected: ['de-DE-x-custom1', 'de', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() cache', () => {
    it('returns a copy of a cached hierarchy', () => {
      const cu = new LanguageUtils({ fallbackLng: 'en' });

      const first = cu.toResolveHierarchy('de', 'fr');
      const second = cu.toResolveHierarchy('de', 'fr');

      expect(second).to.eql(first);
      expect(second).not.toBe(first);
    });

    it('does not allow returned arrays to modify the cached hierarchy', () => {
      const cu = new LanguageUtils({ fallbackLng: 'en' });

      const first = cu.toResolveHierarchy('de');
      first.push('fr');

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en']);
    });

    it('caches a hierarchy when fallbackLng is an array', () => {
      const cu = new LanguageUtils({ fallbackLng: ['en'] });

      const first = cu.toResolveHierarchy('de');
      expect(Object.keys(cu.resolveHierarchyCache)).toHaveLength(1);

      const second = cu.toResolveHierarchy('de');
      expect(second).to.eql(first);
    });

    it('does not cache array or object fallbackCode values', () => {
      const cu = new LanguageUtils({ fallbackLng: 'en' });

      expect(cu.toResolveHierarchy('de', ['fr', 'en'])).to.eql(['de', 'fr', 'en']);
      expect(cu.toResolveHierarchy('de-CH', { 'de-CH': ['fr'], default: ['en'] })).to.eql([
        'de-CH',
        'de',
        'fr',
      ]);
      expect(cu.resolveHierarchyCache).to.eql({});
    });

    it('invalidates the cache when the fallbackLng array is mutated in place', () => {
      const options = { fallbackLng: ['en'] };
      const cu = new LanguageUtils(options);

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en']);
      options.fallbackLng.push('fr');

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en', 'fr']);
    });

    it('invalidates the cache when fallbackLng changes', () => {
      const options = { fallbackLng: 'en' };
      const cu = new LanguageUtils(options);

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en']);
      options.fallbackLng = 'fr';

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'fr']);
    });

    it('clears the cache', () => {
      const cu = new LanguageUtils({ fallbackLng: 'en' });

      cu.toResolveHierarchy('de');
      expect(Object.keys(cu.resolveHierarchyCache)).toHaveLength(1);

      cu.clearCache();

      expect(cu.resolveHierarchyCache).to.eql({});
    });

    it('recalculates after another option changes and the cache is cleared', () => {
      const options = { fallbackLng: 'en', load: 'all' };
      const cu = new LanguageUtils(options);

      expect(cu.toResolveHierarchy('de-CH')).to.eql(['de-CH', 'de', 'en']);
      options.load = 'languageOnly';
      cu.clearCache();

      expect(cu.toResolveHierarchy('de-CH')).to.eql(['de', 'en']);
    });

    it('does not cache a function-valued fallbackLng', () => {
      let fallbackLng = 'en';
      const cu = new LanguageUtils({ fallbackLng: () => fallbackLng });

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en']);
      fallbackLng = 'fr';

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'fr']);
      expect(cu.resolveHierarchyCache).to.eql({});
    });

    it('distinguishes fallbackCode types in cache keys', () => {
      const cu = new LanguageUtils({ fallbackLng: 'en' });

      expect(cu.toResolveHierarchy('de')).to.eql(['de', 'en']);
      expect(cu.toResolveHierarchy('de', 'undefined')).to.eql(['de', 'undefined']);
      expect(cu.toResolveHierarchy('de', false)).to.eql(['de']);
      expect(cu.toResolveHierarchy('de', 'false')).to.eql(['de', 'false']);
    });
  });

  describe('toResolveHierarchy() - extended fallback object', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: {
          de: ['de-CH', 'en'],
          'de-CH': ['fr', 'it', 'en'],
          'zh-Hans': ['zh-Hant', 'zh', 'en'],
          'zh-Hant': ['zh-Hans', 'zh', 'en'],
          ja: ['ja'],
          nb: ['no'],
          nn: ['no'],
          default: ['en'],
        },
      });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'de-CH', 'en'] },
      { args: ['de-CH'], expected: ['de-CH', 'de', 'fr', 'it', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'nb', 'no'] },
      { args: ['nn'], expected: ['nn', 'no'] },
      { args: ['zh-Hant-MO'], expected: ['zh-Hant-MO', 'zh-Hant', 'zh', 'zh-Hans', 'en'] },
      { args: ['fr'], expected: ['fr', 'en'] },
      { args: ['ja'], expected: ['ja'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - fallback function returns object', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: () => ({
          de: ['de-CH', 'en'],
          'de-CH': ['fr', 'it', 'en'],
          'zh-Hans': ['zh-Hant', 'zh', 'en'],
          'zh-Hant': ['zh-Hans', 'zh', 'en'],
          nb: ['no'],
          nn: ['no'],
          default: ['en'],
        }),
      });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'de-CH', 'en'] },
      { args: ['de-CH'], expected: ['de-CH', 'de', 'fr', 'it', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'nb', 'no'] },
      { args: ['nn'], expected: ['nn', 'no'] },
      { args: ['zh-Hant-MO'], expected: ['zh-Hant-MO', 'zh-Hant', 'zh', 'zh-Hans', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - fallback function returns string', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: () => 'en',
      });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['fr', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['de-CH'], expected: ['de-CH', 'de', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'nb', 'en'] },
      { args: ['zh-Hant-MO'], expected: ['zh-Hant-MO', 'zh-Hant', 'zh', 'en'] },
      { args: ['de-x-custom1'], expected: ['de-x-custom1', 'de', 'en'] },
      { args: ['de-DE-x-custom1'], expected: ['de-DE-x-custom1', 'de', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - fallback function returns array', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: () => ['de', 'en', 'zh'],
      });
    });

    const tests = [
      { args: ['en'], expected: ['en', 'de', 'zh'] },
      { args: ['de'], expected: ['de', 'en', 'zh'] },
      { args: ['de-AT'], expected: ['de-AT', 'de', 'en', 'zh'] },
      { args: ['zh-HK'], expected: ['zh-HK', 'zh', 'de', 'en'] },
      { args: ['zh-CN'], expected: ['zh-CN', 'zh', 'de', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - cleanCode Option', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en', cleanCode: true });
    });

    const tests = [
      { args: ['EN'], expected: ['en'] },
      { args: ['DE'], expected: ['de', 'en'] },
      { args: ['DE', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['FR', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['DE-CH'], expected: ['de-CH', 'de', 'en'] },
      { args: ['NB-NO'], expected: ['nb-NO', 'nb', 'en'] },
      { args: ['ZH-HANT-MO'], expected: ['zh-Hant-MO', 'zh-Hant', 'zh', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - lowerCaseLng Option', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en', lowerCaseLng: true });
    });

    const tests = [
      { args: ['EN'], expected: ['en'] },
      { args: ['DE'], expected: ['de', 'en'] },
      { args: ['DE', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['FR', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['DE-CH'], expected: ['de-ch', 'de', 'en'] },
      { args: ['nb-NO'], expected: ['nb-no', 'nb', 'en'] },
      { args: ['zh-Hant-MO'], expected: ['zh-hant-mo', 'zh-hant', 'zh', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - load Option: lngOnly', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en', load: 'languageOnly' });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['fr', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['de-CH'], expected: ['de', 'en'] },
      { args: ['nb-NO'], expected: ['nb', 'en'] },
      { args: ['zh-Hant-MO'], expected: ['zh', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - load Option: currentOnly', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en', load: 'currentOnly' });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de', 'fr'], expected: ['de', 'fr'] },
      { args: ['de', ['fr', 'en']], expected: ['de', 'fr', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de', 'fr'] },
      { args: ['de-CH'], expected: ['de-CH', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'en'] },
      { args: ['zh-Hant-MO'], expected: ['zh-Hant-MO', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - supportedLngs', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({ fallbackLng: 'en', supportedLngs: ['nb-NO', 'de', 'en'] });
      cu.logger.debug = false; // silence
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de', 'fr'], expected: ['de'] },
      { args: ['de', ['fr', 'en']], expected: ['de', 'en'] },
      { args: ['de', ['fr', 'de']], expected: ['de'] },
      { args: ['de-CH'], expected: ['de', 'en'] },
      { args: ['nb-NO'], expected: ['nb-NO', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('toResolveHierarchy() - non explicit supportedLngs ', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: ['en'],
        supportedLngs: ['de', 'en', 'zh'],
        nonExplicitSupportedLngs: true,
      });
    });

    const tests = [
      { args: ['en'], expected: ['en'] },
      { args: ['de'], expected: ['de', 'en'] },
      { args: ['de-AT'], expected: ['de-AT', 'de', 'en'] },
      { args: ['zh-HK'], expected: ['zh-HK', 'zh', 'en'] },
      { args: ['zh-CN'], expected: ['zh-CN', 'zh', 'en'] },
    ];

    tests.forEach((test) => {
      it(`correctly prepares resolver for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.toResolveHierarchy.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('getBestMatchFromCodes()', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: ['en'],
        supportedLngs: ['en-US', 'en', 'de-DE', 'zh-Hans', 'zh-Hant'],
      });
    });

    const tests = [
      { args: [['en']], expected: 'en' },
      { args: [['ru', 'en']], expected: 'en' },
      { args: [['en-GB']], expected: 'en' },
      { args: [['ru', 'en-GB']], expected: 'en' },
      { args: [['de-CH']], expected: 'de-DE' },
      { args: [['ru']], expected: 'en' },
      { args: [['c']], expected: 'en' },
      { args: [['e']], expected: 'en' },
      { args: [['user-id']], expected: 'en' },
      { args: [['en-AU-SA']], expected: 'en' },
      { args: [[]], expected: 'en' },
      { args: [['zh-Hant-TW']], expected: 'zh-Hant' },
      { args: [['zh-Hans-TW']], expected: 'zh-Hans' },
    ];

    tests.forEach((test) => {
      it(`correctly get best match for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.getBestMatchFromCodes.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('getBestMatchFromCodes() with dev', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: ['fr'],
        supportedLngs: ['dev', 'en', 'fr'],
      });
    });

    const tests = [
      { args: [['de']], expected: 'fr' },
      { args: [['ru', 'en']], expected: 'en' },
      { args: [['en-GB']], expected: 'en' },
      { args: [['ru', 'en-GB']], expected: 'en' },
      { args: [['de-CH']], expected: 'fr' },
      { args: [['ru']], expected: 'fr' },
      { args: [[]], expected: 'fr' },
    ];

    tests.forEach((test) => {
      it(`correctly get best match for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.getBestMatchFromCodes.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('getBestMatchFromCodes() with dev and nonExplicitSupportedLngs: true', () => {
    /** @type {LanguageUtils} */
    let cu;
    beforeAll(() => {
      cu = new LanguageUtils({
        fallbackLng: ['fr'],
        supportedLngs: ['dev', 'en', 'fr'],
        nonExplicitSupportedLngs: true,
      });
    });

    const tests = [
      { args: [['de']], expected: 'fr' },
      { args: [['ru', 'en']], expected: 'en' },
      { args: [['en-GB']], expected: 'en-GB' },
      { args: [['ru', 'en-GB']], expected: 'en-GB' },
      { args: [['de-CH']], expected: 'fr' },
      { args: [['ru']], expected: 'fr' },
      { args: [[]], expected: 'fr' },
    ];

    tests.forEach((test) => {
      it(`correctly get best match for ${JSON.stringify(test.args)} args`, () => {
        expect(cu.getBestMatchFromCodes.apply(cu, test.args)).to.eql(test.expected);
      });
    });
  });
});
