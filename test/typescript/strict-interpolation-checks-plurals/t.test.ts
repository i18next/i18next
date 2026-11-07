import { describe, it, expectTypeOf } from 'vitest';
import i18next from 'i18next';
import type { ParseKeys, ParseKeysWithoutVariables, TFunction } from 'i18next';

describe('strictInterpolationChecks with plural keys', () => {
  const t = (() => '') as unknown as TFunction<'app'>;

  it('requires count for a plural key whose forms use it', () => {
    expectTypeOf(t('item', { count: 2 })).toEqualTypeOf<'{{count}} item' | '{{count}} items'>();
    expectTypeOf(t('place', { count: 2, ordinal: true })).toEqualTypeOf<
      '{{count}}st place' | '{{count}}th place'
    >();
    expectTypeOf(t('nested.file', { count: 2 })).toEqualTypeOf<'A file' | '{{count}} files'>();

    // @ts-expect-error `item_one` and `item_other` use `count`
    t('item');
    // @ts-expect-error the ordinal forms use `count`
    t('place');
    // @ts-expect-error `nested.file_other` uses `count`
    t('nested.file');
    // @ts-expect-error also with a default value
    t('item', 'some default value');
    t('item', 'some default value', { count: 2 });
  });

  it('leaves a plural key alone whose forms have no variables', () => {
    expectTypeOf(t('apple')).toEqualTypeOf<string>();
    expectTypeOf(t('apple', 'some default value')).toEqualTypeOf<string>();
  });

  it('checks a key with its own value against that value', () => {
    // without `count`, t() returns `both`, not one of its plural forms
    expectTypeOf(t('both')).toEqualTypeOf<'Both'>();
    expectTypeOf(t('both', { count: 2 })).toEqualTypeOf<'Both' | '{{count}} of both'>();
    function label(key: 'plain' | 'both' | 'item') {
      // @ts-expect-error `item` needs `count`
      return t(key);
    }
    label('both');
  });

  it('a wrapper over a union with a plural key fails like one without it', () => {
    function withoutPlural(key: 'greeting' | 'plain') {
      // @ts-expect-error `greeting` needs `name`
      return t(key);
    }
    function withPlural(key: 'greeting' | 'plain' | 'item') {
      // @ts-expect-error `greeting` needs `name`, `item` needs `count`
      return t(key);
    }
    function pluralOnly(key: 'plain' | 'item') {
      // @ts-expect-error `item` needs `count`
      return t(key);
    }
    function ordinalOnly(key: 'plain' | 'place') {
      // @ts-expect-error the ordinal forms of `place` need `count`
      return t(key);
    }
    function allKeys(key: ParseKeys<'app'>) {
      // @ts-expect-error `greeting` needs `name`
      return t(key);
    }
    function withPluralDefault(key: 'plain' | 'item') {
      // @ts-expect-error `item` needs `count`
      return t(key, 'some default value');
    }
    function withoutVariables(key: 'plain' | 'apple') {
      return t(key);
    }
    withoutPlural('plain');
    withPlural('plain');
    pluralOnly('plain');
    ordinalOnly('plain');
    allKeys('plain');
    withPluralDefault('plain');
    withoutVariables('apple');
  });

  it('a call with options needs count as well', () => {
    expectTypeOf(t('item', { count: 2, defaultValue: 'x' })).toEqualTypeOf<
      '{{count}} item' | '{{count}} items'
    >();
    t('item', 'some default value', { count: 2 });
    t('apple', { defaultValue: 'x' });
    t('both', { defaultValue: 'x' });

    // @ts-expect-error `item_other` uses `count`
    t('item', { defaultValue: 'x' });
    // @ts-expect-error `item_other` uses `count`
    t('item', {});
    // @ts-expect-error `item_other` uses `count`
    t('item', 'some default value', {});
    // @ts-expect-error the ordinal forms use `count`
    t('place', { ordinal: true });

    function withPlural(key: 'plain' | 'item') {
      // @ts-expect-error `item` needs `count`
      return t(key, { defaultValue: 'x' });
    }
    function withVariables(key: 'greeting' | 'item') {
      // @ts-expect-error `item` needs `count`
      t(key, { name: 'x' });
      return t(key, { name: 'x', count: 2 });
    }
    const withoutVariables = (key: ParseKeysWithoutVariables<'app'>) =>
      t(key, { defaultValue: 'x' });
    withPlural('plain');
    withVariables('greeting');
    withoutVariables('plain');

    const tm = (() => '') as unknown as TFunction<['app', 'other']>;
    // @ts-expect-error `app:item` needs `count`
    tm('app:item', { defaultValue: 'x' });
    // @ts-expect-error `item` in `app` needs `count`
    tm('item', { ns: 'app', defaultValue: 'x' });
    tm('item', { ns: 'app', count: 2 });
  });

  it('a wrapper over the keys of several namespaces fails as well', () => {
    const tm = (() => '') as unknown as TFunction<['app', 'other']>;
    expectTypeOf(tm('app:item', { count: 2 })).toEqualTypeOf<
      '{{count}} item' | '{{count}} items'
    >();
    // @ts-expect-error `app:item` needs `count`
    tm('app:item');
    function prefixed(key: 'app:plain' | 'app:item') {
      // @ts-expect-error `app:item` needs `count`
      return tm(key);
    }
    function allKeys(key: ParseKeys<['app', 'other']>) {
      // @ts-expect-error `greeting` needs `name`
      return tm(key);
    }
    prefixed('app:plain');
    allKeys('other:hello');
  });

  it('ParseKeysWithoutVariables leaves out the plural keys that need count', () => {
    expectTypeOf<ParseKeysWithoutVariables<'app'>>().toEqualTypeOf<
      'plain' | 'apple' | 'apple_one' | 'apple_other' | 'both' | 'nested.label' | 'nested.file_one'
    >();
    const label = (key: ParseKeysWithoutVariables<'app'>) => t(key);
    label('apple');
    // @ts-expect-error `place` needs `count`
    label('place');
  });

  it('applies to getFixedT with a key prefix', () => {
    const fixed = i18next.getFixedT(null, 'app', 'nested');
    expectTypeOf(fixed('label')).toEqualTypeOf<'Label'>();
    expectTypeOf(fixed('file', { count: 2 })).toEqualTypeOf<'A file' | '{{count}} files'>();
    // @ts-expect-error `file_other` uses `count`
    fixed('file');
    // @ts-expect-error `file_other` uses `count`
    fixed('file', { defaultValue: 'x' });
    function nestedLabel(key: 'label' | 'file') {
      // @ts-expect-error `file` needs `count`
      return fixed(key);
    }
    const nested = (key: ParseKeysWithoutVariables<'app', 'nested'>) => fixed(key);
    nestedLabel('label');
    nested('label');
  });
});
