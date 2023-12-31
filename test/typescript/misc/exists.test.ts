import { describe, it, expectTypeOf } from 'vitest';
import i18next, { TOptions } from 'i18next';

describe('exists', () => {
  it('should accept a string or an array of string as first parameter', () => {
    // i18next.exists('friend');
    // i18next.exists(['friend', 'tree']);
    expectTypeOf(i18next.exists).parameter(0).toEqualTypeOf<string | string[]>();
  });

  it('should accept `TOptions` as second parameter', () => {
    // i18next.exists('friend', { myVar: 'someValue' });
    // i18next.exists(['friend', 'tree'], { myVar: 'someValue' });
    expectTypeOf(i18next.exists).parameter(1).toEqualTypeOf<TOptions | undefined>();
  });

  it('should return boolean', () => {
    expectTypeOf(i18next.exists).returns.toBeBoolean();
  });
});
