import { describe, it } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';

describe('generic wrapper without strictInterpolationChecks', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;

  it('a key-only wrapper keeps compiling', () => {
    function tr<K extends ParseKeys<'interpolators'>>(key: K) {
      return t(key);
    }
    tr('simple');
    tr('just_a_string');
  });
});
