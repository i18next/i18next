import { describe, it, expectTypeOf } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';

describe('strictInterpolationChecks with strictKeyChecks', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;

  it('requires the options for a string with variables', () => {
    expectTypeOf(t('simple', { olim: 'yes' })).toEqualTypeOf<'This is {{olim}}'>();
    expectTypeOf(
      t('simple_multiple_keys', { more: '', one: '' }),
    ).toEqualTypeOf<'This has {{more}} than {{one}}'>();

    // @ts-expect-error options are required for a string with variables
    t('simple');
    // @ts-expect-error missing variable
    t('simple_multiple_keys', { more: '' });
    // @ts-expect-error misspelled variable
    t('simple', { olmi: 'yes' });
  });

  it('applies to t(key, defaultValue)', () => {
    expectTypeOf(
      t('simple', 'some default value', { olim: 'yes' }),
    ).toEqualTypeOf<'This is {{olim}}'>();
    // @ts-expect-error options are required for a string with variables
    t('simple', 'some default value');
  });

  it('leaves a string without variables alone', () => {
    expectTypeOf(t('just_a_string')).toEqualTypeOf<string>();
    expectTypeOf(t('just_a_string', 'some default value')).toEqualTypeOf<string>();
  });

  it('a key-only generic wrapper no longer compiles', () => {
    // With a generic key the variables of its string are unknown inside the
    // wrapper, so the call cannot leave the options out.
    function tr<K extends ParseKeys<'interpolators'>>(key: K) {
      // @ts-expect-error the options of a generic key cannot be left out
      return t(key);
    }
    tr('just_a_string');
  });
});
