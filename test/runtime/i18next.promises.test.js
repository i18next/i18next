import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

describe('i18next', () => {
  describe('promise based api', () => {
    describe('init()', () => {
      it('it should return a promise with t', () => {
        expect(i18next.init()).resolves.toBeTypeOf('function');
      });
    });

    describe('changeLanguage()', () => {
      it('it should return a promise with t', () => {
        i18next.init();
        expect(i18next.changeLanguage()).resolves.toBeTypeOf('function');
      });
    });

    describe('loadLanguages()', () => {
      it('it should return a promise', () => {
        i18next.init();
        expect(i18next.loadLanguages('en')).resolves.toBeUndefined();
      });
    });

    describe('loadNamespaces()', () => {
      it('it should return a promise', () => {
        i18next.init();
        expect(i18next.loadLanguages('common')).resolves.toBeUndefined();
      });
    });

    describe('reloadResources()', () => {
      it('it should return a promise', () => {
        i18next.init();
        expect(i18next.reloadResources()).resolves.toBeUndefined();
      });
    });
  });
});
