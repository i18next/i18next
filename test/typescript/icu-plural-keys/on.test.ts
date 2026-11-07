import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe("parseInterpolation: 'icu' with strictInterpolationChecks (the default)", () => {
  const t = (() => '') as unknown as TFunction;

  it('requires count for a plural key', () => {
    // @ts-expect-error count is missing
    t('item');
    expectTypeOf(t('item', { count: 2 })).toEqualTypeOf<'{count} item' | '{count} items'>();
    expectTypeOf(t('plain')).toEqualTypeOf<'Plain'>();
  });
});
