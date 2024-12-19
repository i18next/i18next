import { describe, it, expectTypeOf, assertType } from 'vitest';
import { TFunction } from 'i18next';

describe('basic usage with strictKeyChecks == true', () => {
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

describe('basic array access with strictKeyChecks == true', () => {
  const t = (() => '') as unknown as TFunction<['arrayKeys']>;

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
    // @ts-expect-error
    assertType(t('arrayOfStrings.2'));
    // @ts-expect-error
    assertType(t('arrayOfObjects.0.food'));
    // @ts-expect-error
    assertType(t('arrayOfObjects.0.fizz'));
    // @ts-expect-error
    assertType(t('arrayOfObjects.2'));
    // @ts-expect-error
    assertType(t('arrayOfObjects.2.bar'));
    // @ts-expect-error
    assertType(t('arrayOfObjects.2.sub.deep'));
    // @ts-expect-error
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

describe('interpolation values with strictKeyChecks == true', () => {
  const t = (() => '') as unknown as TFunction<['interpolators']>;

  it('should allow anything when key is a string', () => {
    expectTypeOf(t('just_a_string', { asd: '', beep: 'boop' }));
  });

  it('simple key', () => {
    expectTypeOf(t('simple', { olim: 'yes' })).toEqualTypeOf<'This is {{olim}}'>();

    // @ts-expect-error because nope isn't a valid key
    expectTypeOf(t('simple', { nope: 'yes' })).toEqualTypeOf<'This is {{olim}}'>();
  });

  it('simple key (multiple)', () => {
    type Expected = 'This has {{more}} than {{one}}';
    expectTypeOf(t('simple_multiple_keys', { more: '', one: '' })).toEqualTypeOf<Expected>();

    // @ts-expect-error one of the required keys is missing
    expectTypeOf(t('simple_multiple_keys', { less: '', one: '' })).toEqualTypeOf<Expected>();
  });

  it('keypath', () => {
    expectTypeOf(
      t('keypath', { out: { there: 'yes' } }),
    ).toEqualTypeOf<'Give me one day {{out.there}}'>();

    expectTypeOf(
      t('keypath_with_format', { out: { there: 'yes' } }),
    ).toEqualTypeOf<'Give me one day {{out.there, format}}'>();
  });

  it('keypath deep', () => {
    type Expected = '{{living.in.the}} in the sun';

    expectTypeOf(t('keypath_deep', { living: { in: { the: 'yes' } } })).toEqualTypeOf<Expected>();

    expectTypeOf(
      // @ts-expect-error one of the required keys is missing
      t('keypath_deep', { suffering: { in: { the: 'yes' } } }),
    ).toEqualTypeOf<Expected>();
  });
});
