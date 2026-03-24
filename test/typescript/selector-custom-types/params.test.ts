import { describe, it, expectTypeOf } from 'vitest';
import { TFunction } from 'i18next';

describe('Parameters<TFunction>', () => {
  it('should resolve first parameter to a callable type', () => {
    type FirstParam = Parameters<TFunction<['custom']>>[0];
    // Parameters<> resolves against the last overload (TS limitation).
    // After reordering, the last overload is the general selector, so
    // the first parameter should be a function, not SelectorKey.
    expectTypeOf<FirstParam>().toBeFunction();
  });

  it('should allow extracting parameters from TFunction with default namespace', () => {
    type FirstParam = Parameters<TFunction>[0];
    expectTypeOf<FirstParam>().toBeFunction();
  });
});
