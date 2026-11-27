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

  it('looks a missing key up once without debug', async () => {
    const instance = i18next.createInstance();
    await instance.init({ lng: 'en', resources: { en: { translation: { a: { b: 'b' } } } } });
    const resolve = vi.spyOn(instance.translator, 'resolve');

    expect(instance.t('a.missing')).toBe('a.missing');
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it('still warns about flat JSON with debug', async () => {
    const warn = vi.fn();
    const instance = i18next.createInstance();
    await instance.use({ type: 'logger', log() {}, warn, error() {} }).init({
      lng: 'en',
      debug: true,
      // with the default `true` the flat key is found on the first lookup
      ignoreJSONStructure: false,
      resources: { en: { translation: { 'a.b': 'flat' } } },
    });
    warn.mockClear();

    instance.t('a.b');
    expect(warn.mock.calls.flat(2).join(' ')).toContain('flat JSON format');
  });
});
