import { describe, it, expectTypeOf } from 'vitest';
import type {
  InitOptions,
  InterpolationOptions,
  TOptionsBase,
  TFunctionSignature,
  ParseTReturn,
  DefaultTReturn,
  AppendKeyPrefix,
  TypeOptions,
} from 'i18next';
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-expect-error the `_` and `$` helpers are not exported since v27
import type { $FirstNamespace } from 'i18next';
// @ts-expect-error the `_` and `$` helpers are not exported since v27
import type { _InterpolationMapFromEntries } from 'i18next';
/* eslint-enable @typescript-eslint/no-unused-vars */

describe('public type surface', () => {
  it('exports the types without a `_` or `$` prefix', () => {
    expectTypeOf<TOptionsBase['count']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<DefaultTReturn<{}>>().toEqualTypeOf<string>();
    expectTypeOf<AppendKeyPrefix<'b', 'a'>>().toEqualTypeOf<'a.b'>();
    expectTypeOf<ParseTReturn<'a', { a: 'A' }>>().toEqualTypeOf<'A'>();
    expectTypeOf<TFunctionSignature<'translation', undefined>>().not.toBeNever();
  });

  it('has the v27 defaults', () => {
    expectTypeOf<TypeOptions['strictInterpolationChecks']>().toEqualTypeOf<true>();
    expectTypeOf<TypeOptions['returnEmptyString']>().toEqualTypeOf<false>();
  });

  it('no longer has the removed options', () => {
    // @ts-expect-error compatibilityJSON was removed (it had no effect since v24)
    const json: InitOptions = { compatibilityJSON: 'v4' };
    // @ts-expect-error locize-lastused declares its own option type
    const lastUsed: InitOptions = { locizeLastUsed: { projectId: 'x' } };
    // @ts-expect-error pass the literal delimiter as prefix
    const escaped: InterpolationOptions = { prefixEscaped: '\\{\\{' };
    // @ts-expect-error pass the literal delimiter as nestingPrefix
    const nestingEscaped: InterpolationOptions = { nestingPrefixEscaped: '\\$t\\(' };
    expectTypeOf([json, lastUsed, escaped, nestingEscaped]).not.toBeNever();
  });
});
