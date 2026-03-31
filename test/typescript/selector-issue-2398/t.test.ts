import { describe, it } from 'vitest';
import type { TFunction } from 'i18next';

// Reproduces https://github.com/i18next/i18next/issues/2398 (Problem 1)
//
// When a JSON array has objects with different key sets (one with a context
// variant like `transKey1_withContext`, one without), TypeScript merges all
// keys into a single element type. The selector overload with `context` then
// loses `transKey1` from the inferred return type, producing:
//   ({ transKey2: string } | { transKey1: string; transKey2: string })[]
// instead of:
//   { transKey1: string; transKey2: string }[]
//
// Root cause: FilterKeys works correctly when tested directly. The issue is
// in the context-specific selector overload (TFunctionSelector) where
// `Target` is inferred via `SelectorFn<Source, ApplyTarget<Target, Opts>, Opts>`.
// With `returnObjects: true`, `ApplyTarget` resolves to `unknown`, so TypeScript
// cannot infer a specific `Target` from the callback. The non-context overloads
// solve this with `const Fn` + `ReturnType<Fn>`, but that approach breaks
// namespace-ordering checks when applied to the context overload (because `Fn`'s
// parameter depends on `Opts['context']`, creating an inference dependency).

describe('issue #2398 - returnObjects + context + array with selector', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = (() => []) as unknown as TFunction;

  it.todo('should return full object shape for all array elements, not a union of partial types');
  // When fixed, replace the .todo above with:
  // it('should return full object shape for all array elements', () => {
  //   const result = t(($) => $.transWithArray, {
  //     returnObjects: true,
  //     context: 'withContext',
  //   });
  //   expectTypeOf(result[0]).toHaveProperty('transKey1');
  //   expectTypeOf(result[0]).toHaveProperty('transKey2');
  // });
});
