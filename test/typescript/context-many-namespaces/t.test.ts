import { describe, it, expectTypeOf, assertType } from 'vitest';
import type { TFunction } from 'i18next';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Status = 'active' | 'inactive';
declare const status: Status;
declare const wrongStatus: Status | 'archived';

// https://github.com/i18next/i18next/issues/2482
describe('context with several large namespaces', () => {
  const t = (() => '') as TFunction<['ns0', 'ns1', 'ns2', 'ns3', 'ns4']>;

  it('checks each key on its own path (no TS2589 for a union of keys)', () => {
    const key = 'ns1:group00.status' as `ns1:group${Digit}${Digit}.status`;
    expectTypeOf(t(key, { context: status })).toEqualTypeOf<Status>();
    // @ts-expect-error 'archived' has no key
    assertType(t(key, { context: wrongStatus }));
  });

  it('rejects a context value without a key in the first namespace', () => {
    expectTypeOf(t('group42.status', { context: status })).toEqualTypeOf<Status>();
    // @ts-expect-error 'archived' has no key
    assertType(t('group42.status', { context: wrongStatus }));
  });

  it('rejects a context value without a key in a namespace named by its prefix', () => {
    expectTypeOf(t('ns2:group42.status', { context: status })).toEqualTypeOf<Status>();
    // @ts-expect-error 'archived' has no key
    assertType(t('ns2:group42.status', { context: wrongStatus }));
  });

  it('rejects a context value without a key under a key prefix', () => {
    const tp = (() => '') as TFunction<['ns0', 'ns1', 'ns2', 'ns3', 'ns4'], 'group42'>;
    expectTypeOf(tp('status', { context: status })).toEqualTypeOf<Status>();
    // @ts-expect-error 'archived' has no key
    assertType(tp('status', { context: wrongStatus }));
  });

  it('takes the ordinal plural forms of a context', () => {
    assertType<string>(t('group42.place', { context: 'first', ordinal: true, count: 1 }));
  });

  it('checks a key of the fallback namespace', () => {
    assertType<string>(t('shared', { context: 'on' as 'on' | 'off' }));
    // @ts-expect-error 'maybe' has no key
    assertType(t('shared', { context: 'on' as 'on' | 'maybe' }));
  });

  it('takes any context for a key that also exists without one', () => {
    assertType<string>(t('plain', { context: 'special' as 'special' | 'other' }));
  });

  it('does not take any context for a key that is an object', () => {
    // @ts-expect-error 'other' has no key, and 'box' is an object
    assertType(t('box', { context: 'special' as 'special' | 'other' }));
  });

  it('finds a key with a key separator in a segment', () => {
    assertType<string>(t('a.b.c', { context: 'x' }));
  });
});
