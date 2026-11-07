import { describe, it, expectTypeOf } from 'vitest';
import type { KeyPrefix, ParseKeys, TFunction } from 'i18next';
import i18next from 'i18next';

describe('keySeparator: false', () => {
  it('offers only flat keys', () => {
    expectTypeOf<ParseKeys<'flat'>>().toEqualTypeOf<
      'nested.c' | 'nested.d.e' | 'isfalsey' | 'Hello. World' | 'greet'
    >();
    // a nested object has no flat keys of its own, and no `nestedfalsec`-style keys
    expectTypeOf<ParseKeys<'deep'>>().toEqualTypeOf<'plain'>();
    expectTypeOf<ParseKeys<'deep', { returnObjects: true }>>().toEqualTypeOf<'nested' | 'plain'>();
  });

  it('does not split a key at the text "false"', () => {
    const t = (() => '') as unknown as TFunction<'flat'>;
    expectTypeOf(t('isfalsey')).toEqualTypeOf<'A value'>();
    expectTypeOf(t('nested.c')).toEqualTypeOf<'flat nested.c'>();
    expectTypeOf(t('greet', { name: 'Ann' })).toEqualTypeOf<'Hi {{name}}'>();
    const deep = (() => '') as unknown as TFunction<'deep'>;
    // @ts-expect-error not a key
    deep('nestedfalsec');
  });

  it('types a key prefix the way getFixedT() joins it, with a dot', () => {
    // what comes before a dot ('Hello' from 'Hello. World' too: the runtime joins 'Hello' and ' World')
    expectTypeOf<KeyPrefix<'flat'>>().toEqualTypeOf<'nested' | 'nested.d' | 'Hello' | undefined>();
    const fixed = i18next.getFixedT('en', 'flat', 'nested');
    expectTypeOf(fixed('c')).toEqualTypeOf<'flat nested.c'>();
    expectTypeOf(fixed('d.e')).toEqualTypeOf<'flat nested.d.e'>();
    const fixedDeeper = i18next.getFixedT('en', 'flat', 'nested.d');
    expectTypeOf(fixedDeeper('e')).toEqualTypeOf<'flat nested.d.e'>();
  });
});
