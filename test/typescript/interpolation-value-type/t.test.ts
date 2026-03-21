import { describe, it, assertType, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe('interpolationValueType', () => {
  const t: TFunction<'custom'> = (() => '') as never;

  it('should constrain interpolation values to the configured type', () => {
    // string values should be accepted
    t('greeting', { name: 'World' });

    // @ts-expect-error number should not be assignable to string
    t('greeting', { name: 42 });
  });

  it('should work with formatted values', () => {
    t('count_message', { count: 'five' });

    // @ts-expect-error number should not be assignable to string
    t('count_message', { count: 42 });
  });

  it('should work with nested key paths', () => {
    t('nested', { deep: { val: 'hello' } });
  });

  it('should not affect keys without interpolation', () => {
    expectTypeOf(t('no_interpolation')).toEqualTypeOf<'Just a plain string'>();
  });
});
