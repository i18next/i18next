import { describe, it, expect } from 'vitest';
import i18next from '../../src/i18next.js';

// CLDR gives French (and es, it, pt) a "many" category for exact millions; files with only _one and _other
// used to show the raw key for 1000000. A missing plural form now falls back to _other in the same language.
const make = async (options) => {
  const i = i18next.createInstance();
  await i.init({ lng: 'fr', ...options });
  return i;
};

describe('plural fallback to the "other" form', () => {
  it('uses _other when the selected form (_many) is missing', async () => {
    const i = await make({
      resources: {
        fr: { translation: { file_one: '{{count}} fichier', file_other: '{{count}} fichiers' } },
      },
    });
    expect(new Intl.PluralRules('fr').select(1000000)).toBe('many');
    expect(i.t('file', { count: 1000000 })).toBe('1000000 fichiers');
    expect(i.t('file', { count: 1 })).toBe('1 fichier');
    expect(i.exists('file', { count: 1000000 })).toBe(true);
  });

  it('prefers the same language over the fallback language', async () => {
    const i = await make({
      fallbackLng: 'en',
      resources: {
        fr: { translation: { file_one: '{{count}} fichier', file_other: '{{count}} fichiers' } },
        en: {
          translation: {
            file_one: '{{count}} file',
            file_other: '{{count}} files',
            only_one: 'one en',
            only_other: 'other en',
          },
        },
      },
    });
    expect(i.t('file', { count: 1000000 })).toBe('1000000 fichiers');
    // a language without any form of the key still goes to the fallback language
    expect(i.t('only', { count: 1000000 })).toBe('other en');
  });

  it('keeps the plain key before _other (key + key_other)', async () => {
    const i = await make({
      resources: { fr: { translation: { file: 'un fichier', file_other: 'des fichiers' } } },
    });
    expect(i.t('file', { count: 1000000 })).toBe('un fichier');
  });

  it('uses the context form first: key_ctx_other, then key_other', async () => {
    const i = await make({
      resources: {
        fr: {
          translation: {
            friend_male_one: 'un ami',
            friend_male_other: 'des amis',
            guest_one: 'un invité',
            guest_other: 'des invités',
            guest_female_one: 'une invitée',
          },
        },
      },
    });
    expect(i.t('friend', { count: 1000000, context: 'male' })).toBe('des amis');
    expect(i.t('guest', { count: 1000000, context: 'female' })).toBe('des invités');
  });

  it('uses _ordinal_other for a missing ordinal form', async () => {
    const i = await make({
      lng: 'en',
      resources: {
        en: {
          translation: { place_ordinal_one: '{{count}}st', place_ordinal_other: '{{count}}th' },
        },
      },
    });
    expect(i.t('place', { count: 2, ordinal: true })).toBe('2th');
    expect(i.t('place', { count: 1, ordinal: true })).toBe('1st');
  });

  it('uses defaultValue_other after the plain defaultValue', async () => {
    const i = await make({ resources: { fr: { translation: {} } } });
    expect(
      i.t('file', { count: 1000000, defaultValue_one: 'un', defaultValue_other: 'plusieurs' }),
    ).toBe('plusieurs');
    expect(
      i.t('file', { count: 1000000, defaultValue: 'plain', defaultValue_other: 'plusieurs' }),
    ).toBe('plain');
  });
});
