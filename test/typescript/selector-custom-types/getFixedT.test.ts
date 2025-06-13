import { describe, it, assertType, expectTypeOf } from 'vitest';
import i18next, { TFunction } from 'i18next';

describe('getFixedT', () => {
  it('returns a `TFunction`', () => {
    assertType<TFunction<'custom', 'foo'>>(i18next.getFixedT(null, null, 'foo'));
  });

  it('throws an error when providing `keyPrefix` and nothing else', () => {
    // @ts-expect-error
    assertType(i18next.getFixedT(null, null, 'xxx'));
  });

  describe('should work with `namespace` and `keyPrefix`', () => {
    const t = i18next.getFixedT(null, 'alternate', 'foobar.deep');

    it('should retrieve deep key', () => {
      expectTypeOf(t('deeper.deeeeeper')).toEqualTypeOf<'foobar'>();
    });

    it('should work with `returnObjects`', () => {
      // t2('deeper').deeeeeper; // i18next would say: "key 'deeper (en)' returned an object instead of string."
      expectTypeOf(t('deeper', { returnObjects: true })).toEqualTypeOf<{
        deeeeeper: 'foobar';
      }>();
    });

    it('should throw an error if key does not exist', () => {
      // @ts-expect-error
      assertType(t6('xxx'));
    });
  });

  it('should work when providing only language', () => {
    const t = i18next.getFixedT('en');

    expectTypeOf(t('foo')).toEqualTypeOf<'foo'>();

    // t3('alternate:foobar.deep.deeper.deeeeeper');
    expectTypeOf(t('foobar.deep.deeper.deeeeeper', { ns: 'alternate' })).toEqualTypeOf<'foobar'>();
  });

  it('should work when providing `language`,`namespace` and `keyPrefix`', () => {
    const t = i18next.getFixedT('en', 'alternate', 'foobar');
    expectTypeOf(t('barfoo')).toEqualTypeOf<'barfoo'>();
  });

  it('should work when providing just `language`', () => {
    const t = i18next.getFixedT('en');

    expectTypeOf(t('bar')).toEqualTypeOf<'bar'>();

    expectTypeOf(t('foobar.barfoo', { ns: 'alternate' })).toEqualTypeOf<'barfoo'>();
    expectTypeOf(t('fallbackKey')).toEqualTypeOf<never>();

    // @ts-expect-error
    assertType(t('alternate:foobar.barfoo'));
    // @ts-expect-error
    assertType(t('foobar.barfoo'));
  });
});
