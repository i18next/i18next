import { describe, it, expectTypeOf } from 'vitest';
import i18next from 'i18next';

describe('main', () => {
  it('should accept null translations with returnNull set to true in config', () => {
    expectTypeOf(i18next.t('nullKey')).toBeNull();
  });

  it('should accept empty string translations with returnEmptyString set to true in config', () => {
    expectTypeOf(i18next.t('empty string with {{val}}')).toEqualTypeOf<''>();
  });
});
