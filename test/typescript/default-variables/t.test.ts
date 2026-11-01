import { describe, it, expectTypeOf } from 'vitest';
import type { ParseKeysWithoutVariables, TFunction } from 'i18next';

describe('defaultVariables, interpolationFormatSeparator and ParseKeysWithoutVariables', () => {
  const t = (() => '') as unknown as TFunction<'app'>;

  it('makes the declared default variables optional', () => {
    expectTypeOf(t('welcome')).toEqualTypeOf<'Welcome to {{appName}}'>();
    expectTypeOf(t('greeting')).toEqualTypeOf<'Hello {{user.name}} from {{appName}}'>();
    expectTypeOf(t('welcome', { appName: 'Other' })).toEqualTypeOf<'Welcome to {{appName}}'>();
    // @ts-expect-error a default variable keeps its type when it is passed
    t('welcome', { appName: new Date() });
  });

  it('still requires the other variables', () => {
    expectTypeOf(t('mixed', { count: 2 })).toEqualTypeOf<'{{appName}}: {{count}} new'>();
    // @ts-expect-error `count` is not a default variable
    t('mixed');
  });

  it('reads the format after the configured separator', () => {
    expectTypeOf(t('price', { amount: 3 })).toEqualTypeOf<'Costs {{amount; currency}}'>();
    // @ts-expect-error `currency` takes a number
    t('price', { amount: 'three' });
  });

  it('ParseKeysWithoutVariables keeps the keys t() takes without options', () => {
    expectTypeOf<ParseKeysWithoutVariables<'app'>>().toEqualTypeOf<
      'title' | 'welcome' | 'greeting' | 'nested.label'
    >();
    expectTypeOf<ParseKeysWithoutVariables<'app', 'nested'>>().toEqualTypeOf<'label'>();

    const label = (key: ParseKeysWithoutVariables<'app'>) => t(key);
    label('title');
    // @ts-expect-error `item` needs `count`
    label('item');
    // @ts-expect-error `nested.hint` needs `who`
    label('nested.hint');

    const tn = (() => '') as unknown as TFunction<'app', 'nested'>;
    const nestedLabel = (key: ParseKeysWithoutVariables<'app', 'nested'>) => tn(key);
    nestedLabel('label');
  });
});
