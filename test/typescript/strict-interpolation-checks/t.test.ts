import { describe, it, expectTypeOf } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';

describe('strictInterpolationChecks with strictKeyChecks', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;
  const tc = (() => '') as unknown as TFunction<'custom'>;

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

  it('a key-only wrapper over a key type no longer compiles', () => {
    // Inside the wrapper the key is a type, not a literal: the variables of its
    // string are unknown, so the call cannot leave the options out. The same
    // holds for a generic key and for the union of a namespace's keys when one
    // of its strings has variables.
    function trGeneric<K extends ParseKeys<'custom'>>(key: K) {
      // @ts-expect-error the options of a generic key cannot be left out
      return tc(key);
    }
    function trUnion(key: ParseKeys<'custom'>) {
      // @ts-expect-error `qux` is 'some {{val, number}}'
      return tc(key);
    }
    trGeneric('foo');
    trUnion('foo');
  });
});
