import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

describe('strictInterpolationChecks without strictKeyChecks', () => {
  const t = (() => '') as unknown as TFunction<'interpolators'>;

  it('requires the options for a string with variables', () => {
    expectTypeOf(t('simple', { olim: 'yes' })).toEqualTypeOf<'This is {{olim}}'>();
    // @ts-expect-error options are required for a string with variables
    t('simple');
    // @ts-expect-error missing variable
    t('simple', {});
  });

  it('t(key, defaultValue) accepts any key, as in this mode', () => {
    // Without strictKeyChecks a default value makes any key valid, so a known
    // key with variables cannot be told apart from an unknown one here.
    t('simple', 'some default value');
    t('not_a_key', 'some default value');
  });

  it('a wrapper over a union with a plural key fails', () => {
    const tp = (() => '') as unknown as TFunction<'plurals'>;
    tp('item', { count: 2 });
    // @ts-expect-error `item` needs `count`
    tp('item');
    function label(key: 'plain' | 'item') {
      // @ts-expect-error `item` needs `count`
      return tp(key);
    }
    label('plain');

    // @ts-expect-error `item` needs `count`
    tp('item', {});
    // a default value makes any key valid in this mode, see above
    tp('item', { defaultValue: 'x' });
  });
});
