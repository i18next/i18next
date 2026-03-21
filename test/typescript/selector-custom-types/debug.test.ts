import { describe, it, expectTypeOf, assertType } from 'vitest';
import type { TFunction } from 'i18next';

describe('debug FilterKeys', () => {
  const t: TFunction<'ctx'> = (() => '') as never;

  it('context wine (non-existent)', () => {
    // Wine doesn't exist as a context, we'd expect this to either error or produce the base beverage
    // @ts-expect-error wine is not a valid context for dessert (which has no fallback)
    t(($) => $.dessert, { context: 'wine' });
  });

  // Check: with context 'wine', beverage (which has a standalone key) should still produce something
  it('beverage with wine context', () => {
    // beverage has a standalone key and wine-specific doesn't exist
    // At runtime this would return 'a classic beverage' (fallback)
    t(($) => $.beverage, { context: 'wine' });
  });
});
