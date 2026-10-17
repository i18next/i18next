import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction, InterpolationMap } from 'i18next';

// `parseInterpolation: 'mf2'` types `t()` options from MessageFormat 2
// variables (the messages i18next-mf2 formats at runtime).

describe("parseInterpolation: 'mf2'", () => {
  const t: TFunction<'custom'> = (() => '') as never;

  it('requires variables', () => {
    t('greeting', { name: 'Ada' });
    t('greeting', { name: 42 });
    t('quoted', { name: 'Ada' });

    // @ts-expect-error missing options
    t('greeting');
    // @ts-expect-error missing variable
    t('greeting', {});
    // @ts-expect-error misspelled variable
    t('greeting', { nmae: 'Ada' });
    // @ts-expect-error wrong type
    t('greeting', { name: true });
  });

  it('types variables by their function', () => {
    t('count', { count: 3 });
    t('date', { when: new Date() });
    t('text', { value: 'x' });
    t('custom', { value: 'x' });

    // @ts-expect-error :number takes a number
    t('count', { count: 'three' });
    // @ts-expect-error :datetime takes a Date
    t('date', { when: '2026-10-17' });
    // @ts-expect-error :string takes a string
    t('text', { value: 1 });
    // @ts-expect-error interpolationFormatTypeMap: uppercase takes a string
    t('custom', { value: 1 });
  });

  it('reads .input, .local and .match', () => {
    t('plural', { count: 1 });
    t('local', { count: 2, folder: 'docs' });

    // @ts-expect-error .input {$count :number} takes a number
    t('plural', { count: 'one' });
    // @ts-expect-error $c is a local variable, count and folder are missing
    t('local', { c: 2 });
    expectTypeOf<
      keyof InterpolationMap<'.local $c = {$count :integer} {{{$c}}}'>
    >().toEqualTypeOf<'count'>();
  });

  it('requires option and markup variables', () => {
    t('options', { amount: 9.5, digits: 2 });
    t('markup', { url: 'https://example.com' });

    // @ts-expect-error missing option variable
    t('options', { amount: 9.5 });
    // @ts-expect-error missing markup variable
    t('markup', {});
  });

  it('skips quoted literals and escapes', () => {
    t('literal', { name: 'Ada' });
    t('escaped', { name: 'Ada' });

    // @ts-expect-error only name is a variable
    t('literal', { notAnArgument: 'x' });
    // @ts-expect-error only name is a variable
    t('escaped', { notAnArgument: 'x' });
  });

  it('nests dotted variables', () => {
    t('dotted', { user: { name: 'Ada' } });

    // @ts-expect-error user.name is a path
    t('dotted', { user: 'Ada' });
  });

  it('keeps keys and return types working', () => {
    expectTypeOf(t('plain')).toEqualTypeOf<'Just a plain string'>();
    expectTypeOf(t('greeting', { name: 'Ada' })).toEqualTypeOf<'Hello {$name}!'>();

    // @ts-expect-error unknown key
    t('nope');
  });
});
