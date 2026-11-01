import { describe, it, expectTypeOf } from 'vitest';
import type { ParseKeys, TFunction } from 'i18next';

describe('nsSeparator: false', () => {
  it('has no ns-prefixed keys', () => {
    expectTypeOf<ParseKeys<['a', 'b']>>().toEqualTypeOf<'isfalsey' | 'plain'>();
  });

  it('does not split a key that contains "false"', () => {
    const t = (() => '') as unknown as TFunction<'a'>;
    expectTypeOf(t('isfalsey')).toEqualTypeOf<'A value'>();
    expectTypeOf(t('plain')).toEqualTypeOf<'P'>();
  });
});
