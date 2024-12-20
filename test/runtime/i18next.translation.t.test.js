import { describe, it, expect, beforeAll } from 'vitest';
import i18next from '../../src/i18next.js';

describe('i18next t default returns', () => {
  /** @type {import('i18next').i18n} */
  let i18n;
  beforeAll(() => {
    i18n = i18next.createInstance();
    i18n.init({
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            key: 'normal',
            keyNull: null,
            keyEmpty: '',
          },
        },
      },
    });
  });

  it('it should not return null values by default', () => {
    expect(i18n.t('key')).to.equal('normal');
    expect(i18n.t('keyNull')).to.equal('keyNull');
    expect(i18n.t('keyEmpty')).to.equal('');
  });

  it('it should not return Object prototype stuff', () => {
    expect(i18n.t('constructor')).to.equal('constructor');
    expect(i18n.t('constructor_test')).to.equal('constructor_test');
    expect(i18n.t('hasOwnProperty')).to.equal('hasOwnProperty');
    expect(i18n.t('__defineGetter__')).to.equal('__defineGetter__');
    expect(i18n.t('__defineSetter__')).to.equal('__defineSetter__');
    expect(i18n.t('__lookupGetter__')).to.equal('__lookupGetter__');
    expect(i18n.t('__lookupSetter__')).to.equal('__lookupSetter__');
    expect(i18n.t('__proto__')).to.equal('__proto__');
  });

  it('it should not crash for undefined or null keys', () => {
    expect(i18n.t(null)).to.equal('');
    expect(i18n.t(undefined)).to.equal('');
    expect(i18n.t()).to.equal('');
  });
});
