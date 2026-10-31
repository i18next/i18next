import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe('strictInterpolationChecks with the selector API', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;

  it('requires the options for a string with variables', () => {
    expectTypeOf(t(($) => $.simple, { olim: 'yes' })).toEqualTypeOf<'This is {{olim}}'>();
    expectTypeOf(
      t(($) => $.simple, { olim: 'yes', defaultValue: 'other default value' }),
    ).toEqualTypeOf<'This is {{olim}}' | 'other default value'>();

    // @ts-expect-error options are required for a string with variables
    t(($) => $.simple);
    // @ts-expect-error missing variable
    t(($) => $.simple, { defaultValue: 'other default value' });
    // @ts-expect-error misspelled variable
    t(($) => $.simple, { olmi: 'yes' });
  });

  it('applies to an array of selectors', () => {
    t([($) => $.simple, ($) => $.simple_multiple_keys], { olim: '', more: '', one: '' });
    // @ts-expect-error options are required for a string with variables
    t([($) => $.simple, ($) => $.simple_multiple_keys]);
    // @ts-expect-error missing variable
    t([($) => $.simple, ($) => $.simple_multiple_keys], { olim: '' });
  });

  it('leaves a string without variables alone', () => {
    expectTypeOf(t(($) => $.just_a_string)).toEqualTypeOf<string>();
  });
});
