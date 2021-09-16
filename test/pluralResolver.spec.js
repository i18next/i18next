import PluralResolver from '../src/PluralResolver';
import LanguageUtils from '../src/LanguageUtils';

describe('PluralResolver', () => {
  describe('getRule()', () => {
    let pr;

    before(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, {});
    });

    it('correctly returns getRule for a supported locale', () => {
      const expected = {
        resolvedOptions: () => {},
        select: () => {},
      };
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns(expected);

      const locale = 'en';

      expect(pr.getRule(locale)).to.deep.equal(expected);
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });

    it('correctly returns getRule for an unsupported locale', () => {
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').throws();

      const locale = 'en';

      expect(pr.getRule(locale)).to.be.undefined;
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });
  });

  describe('needsPlural()', () => {
    let pr;

    before(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, {});
    });

    it('correctly returns needsPlural for locale with more than one plural form', () => {
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns({
        resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }),
      });

      const locale = 'en';

      expect(pr.needsPlural(locale)).to.be.true;
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });

    it('correctly returns needsPlural for locale with just one plural form', () => {
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns({
        resolvedOptions: () => ({ pluralCategories: ['other'] }),
      });

      const locale = 'ja';

      expect(pr.needsPlural(locale)).to.be.false;
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });
  });

  describe('getSuffix()', () => {
    let pr;

    before(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns suffix for a supported locale', () => {
      const locale = 'en';
      const count = 10.5;
      const expected = 'other';

      const selectStub = sinon.stub().returns(expected);
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns({
        select: selectStub,
      });

      expect(pr.getSuffix(locale, count)).to.equal(`_${expected}`);
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;
      expect(selectStub.calledOnceWith(count)).to.be.true;

      pluralRulesStub.restore();
    });

    it('correctly returns suffix for an unsupported locale', () => {
      const locale = 'non-existent';

      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').throws();

      expect(pr.getSuffix(locale, 10.5)).to.equal('');
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });
  });

  describe('getPluralFormsOfKey()', () => {
    let pr;

    before(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns plural forms for a given key', () => {
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns({
        resolvedOptions: () => ({ pluralCategories: ['one', 'other'] }),
      });

      const locale = 'en';

      expect(pr.getPluralFormsOfKey(locale, 'key')).to.deep.equal(['key_one', 'key_other']);
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });
  });

  describe('getSuffixes()', () => {
    let pr;

    before(() => {
      const lu = new LanguageUtils({ fallbackLng: 'en' });
      pr = new PluralResolver(lu, { prepend: '_' });
    });

    it('correctly returns plural suffixes for a given key', () => {
      const pluralRulesStub = sinon.stub(Intl, 'PluralRules').returns({
        resolvedOptions: () => ({
          pluralCategories: ['zero', 'one', 'two', 'few', 'many', 'other'],
        }),
      });

      const locale = 'en';

      expect(pr.getSuffixes(locale)).to.deep.equal([
        '_zero',
        '_one',
        '_two',
        '_few',
        '_many',
        '_other',
      ]);
      expect(pluralRulesStub.calledOnceWith(locale)).to.be.true;

      pluralRulesStub.restore();
    });
  });

  describe('shouldUseIntlApi()', () => {
    let lu;

    before(() => {
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
