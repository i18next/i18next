import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe("parseInterpolation: 'icu' with strictInterpolationChecks: false", () => {
  const t = (() => '') as unknown as TFunction;

  it('types plural keys without count as in v26', () => {
    expectTypeOf(t('item')).toEqualTypeOf<string>();
    const label = (key: 'plain' | 'item') => t(key);
    label('item');
    expectTypeOf(t('item', { count: 2 })).toEqualTypeOf<'{count} item' | '{count} items'>();
  });
});
