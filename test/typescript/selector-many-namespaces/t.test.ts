import { describe, it, expectTypeOf } from 'vitest';
import type { TFunction } from 'i18next';

declare const t: TFunction<'ns0'>;

describe('t with many wide namespaces', () => {
  // Assigning one TFunction to a different instantiation (or passing it to a
  // generic, as `<Trans t={t} />` does) makes TypeScript compare TFunction over
  // a generic namespace. That comparison must not expand into every namespace's
  // keys at once, which fails with TS2590 ("Expression produces a union type
  // that is too complex to represent") for resources of this size.
  it('assigns a t function to a wider key prefix', () => {
    const widened: TFunction<'ns0', string> = t;
    expectTypeOf(widened).toBeFunction();
  });
});
