import { describe, it, expectTypeOf, assertType } from 'vitest';
import { TFunction } from 'i18next';

describe('t defaultValue with strictKeyChecks == true', () => {
  const t = (() => '') as unknown as TFunction<'alternate'>;

  it('should resolve to the correct type when `defaultValue` is provided and key exists', () => {
    expectTypeOf(t('foobar.barfoo')).toMatchTypeOf<'barfoo'>();
    expectTypeOf(
      t('foobar.barfoo', { defaultValue: 'some default value' }),
    ).toMatchTypeOf<'barfoo'>();
    expectTypeOf(t('foobar.barfoo', 'some default value')).toMatchTypeOf<'barfoo'>();
  });

  it('should throw an error even if `defaultValue` is provided when key is missing', () => {
    // @ts-expect-error
    assertType(t('new.key'));
    // @ts-expect-error
    assertType(t('new.key', 'some default value'));
    // @ts-expect-error
    assertType(t('new.key', { defaultValue: 'some default value' }));
  });
});

describe('t defaultValue with strictKeyChecks == true and `returnObjects`', () => {
  const t = (() => '') as unknown as TFunction<'alternate'>;

  it('should work alongside `returnObjects`', () => {
    expectTypeOf(t('foobar', { returnObjects: true })).toMatchTypeOf<{
      barfoo: 'barfoo';
      deep: {
        deeper: {
          deeeeeper: 'foobar';
        };
      };
    }>();
  });
});
