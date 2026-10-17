import { describe, it, expectTypeOf } from 'vitest';
import i18next from 'i18next';
import type { TFunction, InterpolationMap } from 'i18next';

// `parseInterpolation: 'icu'` types `t()` options from ICU MessageFormat
// arguments (the messages i18next-icu formats at runtime).

describe("parseInterpolation: 'icu'", () => {
  const t: TFunction<'custom'> = (() => '') as never;

  it('requires plain arguments', () => {
    t('greeting', { name: 'Ada' });
    t('greeting', { name: 42 });
    t('spaced', { name: 'Ada' });
    t('tags', { name: 'Ada' });

    // @ts-expect-error missing argument
    t('greeting');
    // @ts-expect-error missing argument
    t('greeting', {});
    // @ts-expect-error misspelled argument
    t('greeting', { nmae: 'Ada' });
    // @ts-expect-error wrong type
    t('greeting', { name: true });
  });

  it('requires a number for plural and selectordinal, ignores #', () => {
    t('rows', { count: 1 });
    t('hash', { count: 0 });
    t('ordinal', { place: 3 });

    // @ts-expect-error count must be a number
    t('rows', { count: '1' });
    // @ts-expect-error missing count
    t('hash');
    // @ts-expect-error place must be a number
    t('ordinal', { place: 'third' });
  });

  it('types select as its case keys plus string for other', () => {
    t('gender', { gender: 'male' });
    t('gender', { gender: 'female' });
    t('gender', { gender: 'diverse' });
    t('gender', { gender: String('dynamic') });

    expectTypeOf<InterpolationMap<'{g, select, a {A} b {B} other {C}}'>['g']>().toEqualTypeOf<
      'a' | 'b' | (string & {})
    >();

    // @ts-expect-error selector must be a string
    t('gender', { gender: 1 });
  });

  it('requires arguments nested in cases', () => {
    t('nested', { gender: 'male', name: 'Ada', count: 2 });

    // @ts-expect-error missing nested count
    t('nested', { gender: 'male', name: 'Ada' });
    // @ts-expect-error missing nested name
    t('nested', { gender: 'male', count: 2 });
  });

  it('types number, date and time arguments', () => {
    t('price', { amount: 9.5 });
    t('typed', { n: 1, d: new Date(), t: new Date() });

    // @ts-expect-error amount must be a number
    t('price', { amount: '9.50' });
    // @ts-expect-error d must be a Date
    t('typed', { n: 1, d: '2026-10-17', t: new Date() });
  });

  it('skips quoted text', () => {
    t('quoted', { name: 'Ada' });

    // @ts-expect-error `'{literal}'` is text, but name is still required
    t('quoted', { literal: 'x' });
  });

  it('keeps keys, i18next options and return types working', () => {
    expectTypeOf(t('plain')).toEqualTypeOf<'Just a plain string'>();
    expectTypeOf(t('greeting', { name: 'Ada' })).toEqualTypeOf<'Hello {name}!'>();
    t('greeting', { name: 'Ada', lng: 'de' });
    t('rows', { count: 2, ns: 'custom' });
    t('deep.inner', { value: 1 });
    t('welcome', { ns: 'other', user: 'Ada' });

    // @ts-expect-error unknown key
    t('nope');
    // @ts-expect-error misspelled argument in another namespace
    t('welcome', { ns: 'other', usr: 'Ada' });
  });

  it('works with keyPrefix and namespaces', () => {
    const tDeep: TFunction<'custom', 'deep'> = (() => '') as never;
    tDeep('inner', { value: 'x' });
    // @ts-expect-error missing argument behind a keyPrefix
    tDeep('inner', {});

    const tOther: TFunction<['other', 'custom']> = (() => '') as never;
    tOther('welcome', { user: 'Ada' });
    tOther('custom:greeting', { name: 'Ada' });
    // @ts-expect-error missing argument in the primary namespace
    tOther('welcome', { name: 'Ada' });
  });

  it('applies to getFixedT and i18n.t', () => {
    const fixed = i18next.getFixedT(null, 'custom');
    fixed('greeting', { name: 'Ada' });
    // @ts-expect-error missing argument (getFixedT)
    fixed('greeting');

    const fixedDeep = i18next.getFixedT(null, 'custom', 'deep');
    fixedDeep('inner', { value: 1 });
    // @ts-expect-error missing argument (getFixedT with keyPrefix)
    fixedDeep('inner', {});

    i18next.t('greeting', { name: 'Ada' });
    // @ts-expect-error misspelled argument (i18n.t)
    i18next.t('greeting', { nmae: 'Ada' });
  });

  it('keeps returnObjects and returnDetails working', () => {
    expectTypeOf(t('deep', { returnObjects: true })).toEqualTypeOf<{ inner: 'Inner {value}' }>();
    const details = t('greeting', { name: 'Ada', returnDetails: true });
    expectTypeOf(details.usedParams.name).toEqualTypeOf<string | number>();
  });
});
