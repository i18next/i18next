import { describe, it, expectTypeOf, assertType } from 'vitest';
import { TFunction } from 'i18next';

describe('t', () => {
  describe('main', () => {
    const t = (() => '') as TFunction<['main']>;

    it('works with simple usage', () => {
      expectTypeOf(t('arrayOfStrings.0')).toEqualTypeOf<'zero'>();
      expectTypeOf(t('arrayOfStrings.1')).toEqualTypeOf<'one'>();

      expectTypeOf(t('readonlyArrayOfStrings.0')).toEqualTypeOf<'readonly zero'>();
      expectTypeOf(t('readonlyArrayOfStrings.1')).toEqualTypeOf<'readonly one'>();

      expectTypeOf(t('arrayOfObjects.0.foo')).toEqualTypeOf<'bar'>();
      expectTypeOf(t('arrayOfObjects.1.fizz')).toEqualTypeOf<'buzz'>();

      expectTypeOf(t('arrayOfObjects.2.0.test')).toEqualTypeOf<'success'>();
      expectTypeOf(t('arrayOfObjects.2.0.sub.deep')).toEqualTypeOf<'still success'>();
    });

    it('should throw an error when key is not present', () => {
      // @ts-expect-error expected error
      assertType(t('arrayOfStrings.2'));

      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.0.food'));
      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.0.fizz'));

      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.2'));

      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.2.bar'));
      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.2.sub.deep'));
      // @ts-expect-error expected error
      assertType(t('arrayOfObjects.2.test'));
    });

    it('should work with `returnObjects`', () => {
      expectTypeOf(t('arrayOfStrings', { returnObjects: true })).toBeArray();
      expectTypeOf(t('arrayOfObjects', { returnObjects: true })).toEqualTypeOf<
        [{ foo: 'bar' }, { fizz: 'buzz' }, [{ test: 'success'; sub: { deep: 'still success' } }]]
      >();
      expectTypeOf(t('arrayOfObjects.0', { returnObjects: true })).toEqualTypeOf<{ foo: 'bar' }>();
    });

    it('should work with const keys', () => {
      const alternateTranslationKeys = ['arrayOfStrings.0', 'arrayOfObjects.0.foo'] as const;

      const result = alternateTranslationKeys.map((value) => t(value));

      assertType<string[]>(result);
    });
  });

  it('should work with context', () => {
    const t = (() => '') as TFunction<'ctx'>;

    expectTypeOf(t('dessert.0.dessert', { context: 'cake' })).toEqualTypeOf<'a nice cake'>();

    // context + plural
    expectTypeOf(t('dessert.0.dessert', { context: 'muffin', count: 3 })).toMatchTypeOf<string>();
  });

  it('should process ordinal plurals', () => {
    const t = (() => '') as TFunction<'ord'>;

    expectTypeOf(t('ord.0.place', { ordinal: true, count: 1 })).toBeString();
    expectTypeOf(t('ord.0.place', { ordinal: true, count: 2 })).toBeString();
    expectTypeOf(t('ord.0.place', { ordinal: true, count: 3 })).toBeString();
    expectTypeOf(t('ord.0.place', { ordinal: true, count: 4 })).toBeString();
  });
});
