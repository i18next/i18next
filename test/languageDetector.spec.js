import { createInstance } from '../src/index.js';
import { expect } from 'chai';

describe('LanguageDetector with different signatures', () => {
  describe('LanguageDetector with minimal sync signature', () => {
    let detectingLanguage = 'de-CH';
    let i18n = createInstance();
    i18n.use({
      type: 'languageDetector',
      detect: () => detectingLanguage,
    });

    describe('#init', () => {
      it('should work as usual', () => {
        i18n.init({ initImmediate: false });
        expect(i18n.language).to.eql('de-CH');
      });
    });

    describe('#changeLanguage', () => {
      it('should detect the language accordingly', () => {
        detectingLanguage = 'it';
        i18n.changeLanguage();
        expect(i18n.language).to.eql('it');
      });
    });
  });

  describe('LanguageDetector with full sync signature', () => {
    let detectingLanguage = 'de-CH';
    let cachedLng;
    let i18n = createInstance();
    i18n.use({
      type: 'languageDetector',
      init: () => {},
      detect: () => detectingLanguage,
      cacheUserLanguage: (l) => (cachedLng = l),
    });

    describe('#init', () => {
      it('should work as usual', () => {
        i18n.init({ initImmediate: false });
        expect(i18n.language).to.eql('de-CH');
        expect(cachedLng).to.eql('de-CH');
      });
    });

    describe('#changeLanguage', () => {
      it('should detect the language accordingly', () => {
        detectingLanguage = 'it';
        i18n.changeLanguage();
        expect(i18n.language).to.eql('it');
        expect(cachedLng).to.eql('it');
      });
    });
  });

  describe('LanguageDetector with async callback signature', () => {
    let detectingLanguage = 'de-CH';
    let i18n = createInstance();
    i18n.use({
      type: 'languageDetector',
      async: true,
      detect: (clb) => clb(detectingLanguage),
    });

    describe('#init', () => {
      it('should work as usual', (done) => {
        i18n.init({}, (err) => {
          expect(i18n.language).to.eql('de-CH');
          done(err);
        });
      });
    });

    describe('#changeLanguage', () => {
      it('should detect the language accordingly', (done) => {
        detectingLanguage = 'it';
        i18n.changeLanguage(undefined, (err) => {
          expect(i18n.language).to.eql('it');
          done(err);
        });
      });
    });
  });

  describe('LanguageDetector with async promise signature', () => {
    let detectingLanguage = 'de-CH';
    let cachedLng;
    let i18n = createInstance();
    i18n.use({
      type: 'languageDetector',
      async: true,
      detect: async () => Promise.resolve(detectingLanguage),
      cacheUserLanguage: async (l) => (cachedLng = l),
    });

    describe('#init', () => {
      it('should work as usual', (done) => {
        i18n.init({}, (err) => {
          expect(i18n.language).to.eql('de-CH');
          expect(cachedLng).to.eql('de-CH');
          done(err);
        });
      });
    });

    describe('#changeLanguage', () => {
      it('should detect the language accordingly', (done) => {
        detectingLanguage = 'it';
        i18n.changeLanguage(undefined, (err) => {
          expect(i18n.language).to.eql('it');
          expect(cachedLng).to.eql('it');
          done(err);
        });
      });
    });
  });
});
