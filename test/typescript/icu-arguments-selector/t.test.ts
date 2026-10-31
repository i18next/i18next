import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe("parseInterpolation: 'icu' with enableSelector", () => {
  const t: TFunction<'custom'> = (() => '') as never;

  it('types ICU arguments of selected keys', () => {
    t(($) => $.greeting, { name: 'Ada' });
    t(($) => $.rows, { count: 2 });
    t(($) => $.gender, { gender: 'male', quote: 'hi' });
    t(($) => $.deep.inner, { value: 1 });
    t(($) => $.welcome, { ns: 'other', user: 'Ada' });
    expectTypeOf(t(($) => $.plain)).toEqualTypeOf<'Just a plain string'>();

    // @ts-expect-error missing options
    t(($) => $.greeting);
    // @ts-expect-error misspelled argument
    t(($) => $.greeting, { nmae: 'Ada' });
    // @ts-expect-error count must be a number
    t(($) => $.rows, { count: 'two' });
    // @ts-expect-error missing nested argument
    t(($) => $.gender, { gender: 'male' });
  });

  it('works with a selector keyPrefix', () => {
    const tDeep: TFunction<'custom', 'deep'> = (() => '') as never;
    tDeep(($) => $.inner, { value: 'x' });
    // @ts-expect-error missing argument behind a keyPrefix
    tDeep(($) => $.inner, {});
  });

  it('applies to selector arrays, explicit ns and defaultValue', () => {
    t([($) => $.greeting, ($) => $.plain], { name: 'Ada' });
    // @ts-expect-error missing options (selector array)
    t([($) => $.greeting, ($) => $.plain]);
    // @ts-expect-error misspelled argument (selector array)
    t([($) => $.greeting, ($) => $.plain], { nmae: 'Ada' });

    // @ts-expect-error missing argument (explicit ns)
    t(($) => $.welcome, { ns: 'other' });

    t(($) => $.greeting, { defaultValue: 'Hi', name: 'Ada' });
    // @ts-expect-error missing argument (defaultValue)
    t(($) => $.greeting, { defaultValue: 'Hi' });
  });

  it('keeps literal types for a selector array with defaultValue', () => {
    expectTypeOf(
      t([($) => $.plain, ($) => $.deep.inner], { defaultValue: 'fallback', value: 1 }),
    ).toEqualTypeOf<'Just a plain string' | 'Inner {value}' | 'fallback'>();
  });
});
