import { describe, it, expect, vi } from 'vitest';
import i18next from '../../../src/i18next.js';
import { looksLikeObjectPath } from '../../../src/utils.js';

vi.mock('../../../src/utils.js', async (importOriginal) => {
  const utils = await importOriginal();
  return { ...utils, looksLikeObjectPath: vi.fn(utils.looksLikeObjectPath) };
});

describe('Translator lookups', () => {
  it('runs the natural-language check only for a key with the namespace separator', async () => {
    const instance = i18next.createInstance();
    await instance.init({
      lng: 'en',
      resources: {
        en: { translation: { section: { key: 'nested' }, 'test: with a sentence': 'natural' } },
      },
    });

    looksLikeObjectPath.mockClear();
    expect(instance.t('section.key')).toBe('nested');
    expect(looksLikeObjectPath).not.toHaveBeenCalled();

    expect(instance.t('test: with a sentence')).toBe('natural');
    expect(looksLikeObjectPath).toHaveBeenCalled();
  });
});
