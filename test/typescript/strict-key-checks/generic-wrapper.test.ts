import { describe, it } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';

describe('generic wrapper without strictInterpolationChecks', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;

  it('a key-only wrapper keeps compiling', () => {
    function trGeneric<K extends ParseKeys<'interpolators'>>(key: K) {
      return t(key);
    }
    function trUnion(key: ParseKeys<'interpolators'>) {
      return t(key);
    }
    trGeneric('simple');
    trUnion('simple');
  });
});
