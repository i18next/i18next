import { describe, it, expectTypeOf } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';
import i18next from 'i18next';

// projects that cannot turn on strict null checks still get typed keys
describe('strictNullChecks: false', () => {
  it('accepts keys without a namespace prefix', () => {
    const t = (() => '') as unknown as TFunction<'common'>;
    expectTypeOf(t('title')).toEqualTypeOf<'Title'>();
    expectTypeOf(t('nested.key')).toEqualTypeOf<'nested key'>();
    expectTypeOf(t('nested.deeper.leaf')).toEqualTypeOf<'deeper leaf'>();
    expectTypeOf(t('greeting', { name: 'Ann' })).toEqualTypeOf<'Hello {{name}}'>();
    expectTypeOf(i18next.t('title')).toEqualTypeOf<'Title'>();
    expectTypeOf(i18next.t('other:label')).toEqualTypeOf<'Other label'>();
    // @ts-expect-error not a key
    t('nope');
    // @ts-expect-error not a key
    i18next.t('nested.nope');
  });

  it('applies a key prefix', () => {
    const fixed = i18next.getFixedT(null, 'common', 'nested');
    expectTypeOf(fixed('key')).toEqualTypeOf<'nested key'>();
    expectTypeOf(fixed('deeper.leaf')).toEqualTypeOf<'deeper leaf'>();
    // @ts-expect-error not a key under the prefix
    fixed('title');
  });

  it('lists the same keys as with strict null checks', () => {
    type Plain =
      'title' | 'greeting' | 'nested.key' | 'nested.deeper.leaf' | 'friend' | 'friend_male';
    expectTypeOf<ParseKeys<'common'>>().toEqualTypeOf<Plain>();
    // react-i18next's Trans passes `{ context: undefined }`
    expectTypeOf<ParseKeys<'common', { context: undefined }>>().toEqualTypeOf<Plain>();
    expectTypeOf<ParseKeys<'common', { context: 'male' }>>().toEqualTypeOf<'friend'>();
  });

  it('applies a context', () => {
    const t = (() => '') as unknown as TFunction<'common'>;
    expectTypeOf(t('friend', { context: 'male' })).toEqualTypeOf<'A boyfriend'>();
    expectTypeOf(t('friend', { context: undefined })).toEqualTypeOf<'A friend'>();
  });
});
