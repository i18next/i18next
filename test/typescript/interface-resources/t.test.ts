import { describe, it, expectTypeOf } from 'vitest';
import type { KeyPrefix, ParseKeys, TFunction } from 'i18next';
import type { Nested } from './i18next';

describe('resources typed with named interfaces', () => {
  it('give the same keys as type aliases', () => {
    expectTypeOf<ParseKeys<'iface'>>().toEqualTypeOf<ParseKeys<'alias'>>();
    expectTypeOf<ParseKeys<'iface', { returnObjects: true }>>().toEqualTypeOf<
      ParseKeys<'alias', { returnObjects: true }>
    >();
    expectTypeOf<KeyPrefix<'iface'>>().toEqualTypeOf<KeyPrefix<'alias'>>();
    expectTypeOf<'nested.key' | 'nested.deeper.leaf'>().toMatchTypeOf<ParseKeys<'iface'>>();
  });

  it('type t() for nested keys', () => {
    const t = (() => '') as unknown as TFunction<'iface'>;
    expectTypeOf(t('key')).toEqualTypeOf<'top key'>();
    expectTypeOf(t('nested.key')).toEqualTypeOf<'nested key'>();
    expectTypeOf(t('nested.deeper.leaf')).toEqualTypeOf<'deeper leaf'>();
    expectTypeOf(t('nested', { returnObjects: true })).toEqualTypeOf<Nested>();
    // @ts-expect-error not a key
    t('nested.nope');
    // @ts-expect-error an object needs returnObjects, as with type aliases
    t('nested');
  });
});

describe('strict mode keeps resolving other value types as before', () => {
  it('keeps Date and functions as leaves and accepts an `any` key prefix', () => {
    const t = (() => '') as unknown as TFunction<'loose'>;
    t('when');
    t('fn');
    expectTypeOf(t('label')).toEqualTypeOf<'Label'>();
    const anyPrefix = (() => '') as unknown as TFunction<'iface', any>;
    anyPrefix('key');
  });
});
