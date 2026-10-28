import type {
  $OmitArrayKeys,
  $PreservedValue,
  $Dictionary,
  $SpecialObject,
  $StringKeyPathToRecord,
  $NoInfer,
  $Turtles,
} from './helpers.js';
import type {
  TypeOptions,
  Namespace,
  FlatNamespace,
  DefaultNamespace,
  TOptions,
  TOptionsBase,
} from './options.js';

/** @todo consider to replace {} with Record<string, never> */

// Type Options
type _ReturnObjects = TypeOptions['returnObjects'];
type _ReturnEmptyString = TypeOptions['returnEmptyString'];
type _ReturnNull = TypeOptions['returnNull'];
type _KeySeparator = TypeOptions['keySeparator'];
type _NsSeparator = TypeOptions['nsSeparator'];
type _PluralSeparator = TypeOptions['pluralSeparator'];
type _ContextSeparator = TypeOptions['contextSeparator'];
type _FallbackNamespace = TypeOptions['fallbackNS'];
type _Resources = TypeOptions['resources'];
type _CompatibilityJSON = TypeOptions['compatibilityJSON'];
type _InterpolationPrefix = TypeOptions['interpolationPrefix'];
type _InterpolationSuffix = TypeOptions['interpolationSuffix'];
type _UnescapePrefix = TypeOptions['unescapePrefix'];
type _UnescapeSuffix = TypeOptions['unescapeSuffix'];
type _StrictKeyChecks = TypeOptions['strictKeyChecks'];
type _EnableSelector = TypeOptions['enableSelector'];
type _ParseInterpolation = TypeOptions['parseInterpolation'];
type _InterpolationFormatTypeMap = TypeOptions['interpolationFormatTypeMap'];

type $IsResourcesDefined = [keyof _Resources] extends [never] ? false : true;
type $ValueIfResourcesDefined<Value, Fallback> = $IsResourcesDefined extends true
  ? Value
  : Fallback;
type $FirstNamespace<Ns extends Namespace> = Ns extends readonly any[] ? Ns[0] : Ns;

type Resources = $ValueIfResourcesDefined<_Resources, $Dictionary<string>>;

type PluralSuffix = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

type WithOrWithoutPlural<Key> = _CompatibilityJSON extends 'v4'
  ? Key extends `${infer KeyWithoutOrdinalPlural}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
    ? KeyWithoutOrdinalPlural | Key
    : Key extends `${infer KeyWithoutPlural}${_PluralSeparator}${PluralSuffix}`
      ? KeyWithoutPlural | Key
      : Key
  : Key;

type JoinKeys<K1, K2> = `${K1 & string}${_KeySeparator}${K2 & string}`;
type AppendNamespace<Ns, Keys> = `${Ns & string}${_NsSeparator}${Keys & string}`;

type TrimSpaces<T extends string, Acc extends string = ''> = T extends `${infer Char}${infer Rest}`
  ? Char extends ' '
    ? TrimSpaces<Rest, Acc>
    : TrimSpaces<Rest, `${Acc}${Char}`>
  : T extends ''
    ? Acc
    : never;

interface Branded<Ns extends Namespace> {
  $TFunctionBrand: $IsResourcesDefined extends true
    ? `${Ns extends readonly any[] ? Ns[0] : Ns}`
    : never;
}

/**
 * `keyof Res`, built once per resource object. TypeScript does not cache
 * `keyof` of an object type, so `keyof Res` inside a conditional that runs per
 * key (or per `t()` call) rebuilt the union of all keys every time: quadratic
 * in the namespace size. Conditional type instantiations are cached.
 */
type _KeysOf<Res> = [Res] extends [unknown] ? keyof Res : never;

/**
 * `Res[Key & keyof Res]`: a literal key is looked up directly instead of being
 * intersected with every key; a wide key (`string`, `${string}_suffix` from a
 * string context) still matches all keys it covers.
 */
type _ValueOf<Res, Key> =
  Key extends _KeysOf<Res>
    ? Res[Key]
    : _IsLiteral<Key & PropertyKey> extends true
      ? never
      : Res[Key & _KeysOf<Res>];

/** ****************************************************
 * Build all keys and key prefixes based on Resources *
 ***************************************************** */
// Do NOT add a `[Res] extends [never]` guard here: it defers these into
// conditional types, so `KeyPrefix<Ns>` no longer resolves to a literal union
// and `keyPrefix` inference widens to the whole namespace, polluting `t()`
// return types with sibling keys (#2434 regression). Guard `never` in the merge.
type KeysBuilderWithReturnObjects<Res, Key = keyof Res> =
  Key extends _KeysOf<Res>
    ? Res[Key] extends $Dictionary | readonly unknown[]
      ? | JoinKeys<Key, WithOrWithoutPlural<keyof $OmitArrayKeys<Res[Key]>>>
        | JoinKeys<Key, KeysBuilderWithReturnObjects<Res[Key]>>
      : never
    : never;

type KeysBuilderWithoutReturnObjects<Res, Key = keyof $OmitArrayKeys<Res>> =
  Key extends _KeysOf<Res>
    ? Res[Key] extends $Dictionary | readonly unknown[]
      ? JoinKeys<Key, KeysBuilderWithoutReturnObjects<Res[Key]>>
      : Key
    : never;

type KeysBuilder<Res, WithReturnObjects> = $IsResourcesDefined extends true
  ? WithReturnObjects extends true
    ? keyof Res | KeysBuilderWithReturnObjects<Res>
    : KeysBuilderWithoutReturnObjects<Res>
  : string;

type KeysWithReturnObjects = {
  [Ns in FlatNamespace]: WithOrWithoutPlural<KeysBuilder<Resources[Ns], true>>;
};
type KeysWithoutReturnObjects = {
  [Ns in FlatNamespace]: WithOrWithoutPlural<KeysBuilder<Resources[Ns], false>>;
};

type ResourceKeys<WithReturnObjects = _ReturnObjects> = WithReturnObjects extends true
  ? KeysWithReturnObjects
  : KeysWithoutReturnObjects;

/** **********************************************************************
 * Parse t function keys based on the namespace, options and key prefix *
 *********************************************************************** */
export type KeysByTOptions<TOpt extends TOptions> = TOpt['returnObjects'] extends true
  ? ResourceKeys<true>
  : ResourceKeys;

export type NsByTOptions<Ns extends Namespace, TOpt extends TOptions> = TOpt['ns'] extends Namespace
  ? TOpt['ns']
  : Ns;

type ParseKeysByKeyPrefix<Keys, KPrefix> = KPrefix extends string
  ? Keys extends `${KPrefix}${_KeySeparator}${infer Key}`
    ? Key
    : never
  : Keys;

type ParseKeysByNamespaces<Ns extends Namespace, Keys> = Ns extends readonly (infer UnionNsps)[]
  ? UnionNsps extends keyof Keys
    ? AppendNamespace<UnionNsps, Keys[UnionNsps]>
    : never
  : never;

type ParseKeysByFallbackNs<Keys extends $Dictionary> = _FallbackNamespace extends false
  ? never
  : _FallbackNamespace extends (infer UnionFallbackNs extends string)[]
    ? Keys[UnionFallbackNs]
    : Keys[_FallbackNamespace & string];

export type FilterKeysByContext<Keys, Context> = Context extends string
  ? Keys extends
      | `${infer Prefix}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
      | `${infer Prefix}${_ContextSeparator}${Context}`
    ? Prefix
    : never
  : Keys;

export type ParseKeys<
  Ns extends Namespace = DefaultNamespace,
  TOpt extends TOptions = {},
  KPrefix = undefined,
  Keys extends $Dictionary = KeysByTOptions<TOpt>,
  ActualNS extends Namespace = NsByTOptions<Ns, TOpt>,
  Context extends TOpt['context'] = TOpt['context'],
> = $IsResourcesDefined extends true
  ? FilterKeysByContext<
      | ParseKeysByKeyPrefix<Keys[$FirstNamespace<ActualNS>], KPrefix>
      | ParseKeysByNamespaces<ActualNS, Keys>
      | ParseKeysByFallbackNs<Keys>,
      Context
    >
  : string;

/** *******************************************************
 * Parse t function return type and interpolation values *
 ******************************************************** */
type ParseActualValue<Ret> = Ret extends `${_UnescapePrefix}${infer ActualValue}${_UnescapeSuffix}`
  ? TrimSpaces<ActualValue>
  : Ret;

/** Parses interpolation entries as `[variableName, formatSpecifier | never]` tuples. */
type ParseInterpolationEntries<Ret> = [_ParseInterpolation] extends [false | 'icu' | 'mf2']
  ? never
  : Ret extends `${string}${_InterpolationPrefix}${infer Value}${_InterpolationSuffix}${infer Rest}`
    ? | (Value extends `${infer ActualValue},${infer Format}`
          ? [ParseActualValue<ActualValue>, TrimSpaces<Format>]
          : [ParseActualValue<Value>, never])
      | ParseInterpolationEntries<Rest>
    : never;

/** Extracts just the variable names (kept for backward compat with ParseInterpolationValues usage). */
type ParseInterpolationValues<Ret> = ParseInterpolationEntries<Ret>[0];

/** Built-in i18next formatter name → value type mapping. */
type _BuiltInFormatTypeMap = {
  number: number;
  currency: number;
  datetime: Date;
  relativetime: number;
  list: readonly string[];
};

/** Strips inline formatting options, e.g. `currency(EUR)` → `currency`. */
type _StripFormatOptions<F> = F extends `${infer Name}(${string})` ? Name : F;

/** Resolves the type for a single interpolation entry based on name and format. */
type _ResolveEntryType<Name extends string, Format> = [Format] extends [never]
  ? Name extends 'count'
    ? number
    : string | number
  : Format extends keyof _InterpolationFormatTypeMap
    ? _InterpolationFormatTypeMap[Format]
    : _StripFormatOptions<Format> extends keyof _InterpolationFormatTypeMap
      ? _InterpolationFormatTypeMap[_StripFormatOptions<Format> & keyof _InterpolationFormatTypeMap]
      : Format extends keyof _BuiltInFormatTypeMap
        ? _BuiltInFormatTypeMap[Format]
        : _StripFormatOptions<Format> extends keyof _BuiltInFormatTypeMap
          ? _BuiltInFormatTypeMap[_StripFormatOptions<Format> & keyof _BuiltInFormatTypeMap]
          : string;

/** Local union-to-intersection (not exported from helpers). */
type _UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/** Builds a per-entry typed record from parsed interpolation entries and intersects them. */
type _InterpolationMapFromEntries<E> = _UnionToIntersection<
  E extends [infer Name extends string, infer Format]
    ? $StringKeyPathToRecord<Name, _ResolveEntryType<Name, Format>>
    : never
>;

/** *********************************************************************
 * ICU MessageFormat arguments (`parseInterpolation: 'icu'`)            *
 *********************************************************************** */
type _IcuWhitespace = ' ' | '\n' | '\t' | '\r';
type _IcuTrim<S> = S extends `${_IcuWhitespace}${infer R}`
  ? _IcuTrim<R>
  : S extends `${infer R}${_IcuWhitespace}`
    ? _IcuTrim<R>
    : S;

/**
 * Drops ICU apostrophe quoting as intl-messageformat (i18next-icu) reads it:
 * `''` is a literal apostrophe, `'{...}'` (also `'}'`, `'<'`, `'>'`, `'#'`) is
 * literal text up to the next single apostrophe.
 * Simplification: `'#` quotes everywhere here, at runtime only inside plurals.
 */
type _IcuStripQuotes<S, Acc extends string = ''> = S extends `${infer L}'${infer R}`
  ? R extends `'${infer R2}`
    ? _IcuStripQuotes<R2, `${Acc}${L}`>
    : R extends `${'{' | '}' | '<' | '>' | '#'}${string}`
      ? _IcuStripQuotes<_IcuSkipQuoted<R>, `${Acc}${L}`>
      : _IcuStripQuotes<R, `${Acc}${L}'`>
  : `${Acc}${S & string}`;
type _IcuSkipQuoted<S> = S extends `${string}'${infer R}`
  ? R extends `'${infer R2}`
    ? _IcuSkipQuoted<R2>
    : R
  : '';

/** Reads up to the `}` closing an already opened `{`; returns `[content, rest]`. */
type _IcuBlock<
  S,
  Acc extends string = '',
  Depth extends 0[] = [],
> = S extends `${infer L}}${infer R}`
  ? L extends `${infer L2}{${infer R2}`
    ? _IcuBlock<`${R2}}${R}`, `${Acc}${L2}{`, [...Depth, 0]>
    : Depth extends [0, ...infer D extends 0[]]
      ? _IcuBlock<R, `${Acc}${L}}`, D>
      : [`${Acc}${L}`, R]
  : never;

/** `[name, type]` entries of every argument in a message, nested cases included. */
type _IcuEntries<S, Acc = never> = S extends `${string}{${infer R}`
  ? _IcuBlock<R> extends [infer Arg, infer Rest]
    ? _IcuEntries<Rest, Acc | _IcuArg<Arg>>
    : Acc
  : Acc;

/** Walks plural/select cases: `[selector keys, entries of all case messages]`. */
type _IcuCases<S, Keys = never, Acc = never> = S extends `${infer L}{${infer R}`
  ? _IcuBlock<R> extends [infer Msg, infer Rest]
    ? _IcuCases<Rest, Keys | _IcuTrim<L>, Acc | _IcuEntries<Msg>>
    : [Keys, Acc]
  : [Keys, Acc];

type _IcuArg<A> = A extends `${infer Name},${infer Type},${infer Cases}`
  ? _IcuTrim<Type> extends 'plural' | 'selectordinal'
    ? [_IcuTrim<Name>, _IcuFormatType<_IcuTrim<Type>>] | _IcuCases<Cases>[1]
    : _IcuTrim<Type> extends 'select'
      ? _IcuCases<Cases> extends [infer Keys, infer E]
        ? [_IcuTrim<Name>, 'other' extends Keys ? Exclude<Keys, 'other'> | (string & {}) : Keys] | E
        : never
      : [_IcuTrim<Name>, _IcuFormatType<_IcuTrim<Type>>] // `{n, number, ::currency/EUR}`
  : A extends `${infer Name},${infer Type}`
    ? [_IcuTrim<Name>, _IcuFormatType<_IcuTrim<Type>>]
    : [_IcuTrim<A>, _IcuFormatType<never>];

/** `interpolationFormatTypeMap` wins, then ICU's built-in argument types. */
type _IcuFormatType<F> = [F] extends [never]
  ? string | number
  : F extends keyof _InterpolationFormatTypeMap
    ? _InterpolationFormatTypeMap[F]
    : F extends 'number' | 'plural' | 'selectordinal'
      ? number
      : F extends 'date' | 'time'
        ? Date
        : string | number;

/**
 * Merges `[name, type]` entries into one record: a name used twice gets both
 * types, a dotted MF2 name (`$user.name`) becomes a nested object.
 */
type _ArgsFromEntries<E> =
  _UnionToIntersection<
    E extends [infer Name extends string, infer Type]
      ? Name extends `${string}.${string}`
        ? $StringKeyPathToRecord<Name, Type>
        : { [K in Name]: Type }
      : never
  > extends infer M
    ? [E] extends [never]
      ? never
      : { [K in keyof M]: M[K] }
    : never;

type _IcuArgsMap<Ret> = Ret extends string
  ? string extends Ret
    ? never
    : _ArgsFromEntries<_IcuEntries<_IcuStripQuotes<Ret>>>
  : never;

/** *********************************************************************
 * MessageFormat 2 variables (`parseInterpolation: 'mf2'`)              *
 *********************************************************************** */
/** Drops `\`-escapes (`\{`, `\}`, `\|`, `\\`), so they are neither braces nor quotes. */
type _Mf2StripEscapes<S, Acc extends string = ''> = S extends `${infer L}\\${string}${infer R}`
  ? _Mf2StripEscapes<R, `${Acc}${L}`>
  : `${Acc}${S & string}`;

/** Reads an expression up to its `}`, skipping `|quoted literals|`; returns `[body, rest]`. */
type _Mf2Expression<S, Acc extends string = ''> = S extends `${infer B}}${infer Rest}`
  ? B extends `${infer Before}|${infer Lit}`
    ? `${Lit}}${Rest}` extends `${string}|${infer After}`
      ? _Mf2Expression<After, `${Acc}${Before} `>
      : never
    : [`${Acc}${B}`, Rest]
  : never;

/** `[name, type]` entries of every variable in a message's expressions; `{{` opens a quoted pattern. */
type _Mf2Entries<S, Acc = never> = S extends `${string}{${infer R}`
  ? R extends `{${infer Pattern}`
    ? _Mf2Entries<Pattern, Acc>
    : _Mf2Expression<R> extends [infer Body, infer Rest]
      ? _Mf2Entries<Rest, Acc | _Mf2ExprEntries<_Mf2Spaces<Body>>>
      : Acc
  : Acc;

type _Mf2Space<S, C extends string> = S extends `${infer L}${C}${infer R}`
  ? _Mf2Space<`${L} ${R}`, C>
  : S;
type _Mf2Spaces<S> = _IcuTrim<_Mf2Space<_Mf2Space<_Mf2Space<S, '\n'>, '\t'>, '\r'>>;
type _Mf2Name<S> = S extends `${infer N} ${string}`
  ? _Mf2Name<N>
  : S extends `${infer N}/${string}`
    ? N
    : S;

/** `{$x :fn opt=$y}`: `$x` typed by its function, option and markup variables `string | number`. */
type _Mf2ExprEntries<Body> = Body extends `$${infer R}`
  ? R extends `${infer Name} ${infer Tail}`
    ? | [Name, _Mf2FunctionType<_IcuTrim<Tail> extends `:${infer F}` ? _Mf2Name<F> : never>]
      | _Mf2Vars<Tail>
    : [_Mf2Name<R>, _Mf2FunctionType<never>]
  : _Mf2Vars<Body>;

/** Every `$name` in a string, typed `string | number`. */
type _Mf2Vars<S, Acc = never> = S extends `${string}$${infer R}`
  ? _Mf2Vars<R, Acc | [_Mf2Name<R>, string | number]>
  : Acc;

/** `interpolationFormatTypeMap` wins, then messageformat's built-in functions. */
type _Mf2FunctionType<F> = [F] extends [never]
  ? string | number
  : F extends keyof _InterpolationFormatTypeMap
    ? _InterpolationFormatTypeMap[F]
    : F extends 'number' | 'integer' | 'currency' | 'percent' | 'offset' | 'unit' | 'math'
      ? number
      : F extends 'datetime' | 'date' | 'time'
        ? Date
        : F extends 'string'
          ? string
          : string | number;

/** Names declared by `.local $name = ...` (local, not passed in). */
type _Mf2Locals<S, Acc = never> = S extends `${string}.local${infer R}`
  ? _Mf2Locals<R, Acc | (_IcuTrim<R> extends `$${infer N}=${string}` ? _IcuTrim<N> : never)>
  : Acc;
/** `.match $a $b`: selectors, normally also declared by `.input` or `.local`. */
type _Mf2Selectors<S> = S extends `${string}.match${infer R}`
  ? _Mf2Vars<_Mf2Spaces<R extends `${infer Sel}{${string}` ? Sel : R>>
  : never;

type _Mf2ArgsMap<Ret> = Ret extends string
  ? string extends Ret
    ? never
    : _Mf2StripEscapes<Ret> extends infer S
      ? _ArgsFromEntries<
          Exclude<
            _Mf2Entries<S> | _Mf2Selectors<S>,
            [_IcuTrim<S> extends `.${string}` ? _Mf2Locals<S> : never, unknown]
          >
        >
      : never
  : never;

export type InterpolationMap<Ret> = [_ParseInterpolation] extends ['icu']
  ? $PreservedValue<_IcuArgsMap<Ret>, Record<string, unknown>>
  : [_ParseInterpolation] extends ['mf2']
    ? $PreservedValue<_Mf2ArgsMap<Ret>, Record<string, unknown>>
    : $PreservedValue<
        _InterpolationMapFromEntries<ParseInterpolationEntries<Ret>>,
        Record<string, unknown>
      >;

type ParseTReturnPlural<
  Res,
  Key,
  KeyWithPlural = `${Key & string}${_PluralSeparator}${PluralSuffix}`,
> = _ValueOf<Res, KeyWithPlural | Key>;

type ParseTReturnPluralOrdinal<
  Res,
  Key,
  KeyWithOrdinalPlural = `${Key &
    string}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`,
> = _ValueOf<Res, KeyWithOrdinalPlural | Key>;

type ParseTReturnWithFallback<Key, Val> = Val extends ''
  ? _ReturnEmptyString extends true
    ? ''
    : Key
  : Val extends null
    ? _ReturnNull extends true
      ? null
      : Key
    : Val;

type ParseTReturn<Key, Res, TOpt extends TOptions = {}> = ParseTReturnWithFallback<
  Key,
  Key extends `${infer K1}${_KeySeparator}${infer RestKey}`
    ? ParseTReturn<RestKey, _ValueOf<Res, K1>, TOpt>
    : // Process plurals only if count is provided inside options
      TOpt['count'] extends number
      ? TOpt['ordinal'] extends boolean
        ? ParseTReturnPluralOrdinal<Res, Key>
        : ParseTReturnPlural<Res, Key>
      : // otherwise access plain key without adding plural and ordinal suffixes
        Res extends readonly unknown[]
        ? Key extends `${infer NKey extends number}`
          ? Res[NKey]
          : never
        : _ValueOf<Res, Key>
>;

type TReturnOptionalNull = _ReturnNull extends true ? null : never;
type TReturnOptionalObjects<TOpt extends { returnObjects?: unknown }> = _ReturnObjects extends true
  ? $SpecialObject | string
  : TOpt['returnObjects'] extends true
    ? $SpecialObject
    : string;
type DefaultTReturn<TOpt extends { returnObjects?: unknown }> =
  TReturnOptionalObjects<TOpt> | TReturnOptionalNull;

export type KeyWithContext<Key, TOpt extends TOptions> = TOpt['context'] extends string
  ? `${Key & string}${_ContextSeparator}${TOpt['context']}`
  : Key;

export type ContextOfKey<
  Key extends string,
  Ns extends Namespace = DefaultNamespace,
  TOpt extends TOptions = {},
  KPrefix = undefined,
  Keys extends $Dictionary = KeysByTOptions<TOpt>,
  ActualNS extends Namespace = NsByTOptions<Ns, TOpt>,
  ActualKeys =
    | ParseKeysByKeyPrefix<Keys[$FirstNamespace<ActualNS>], KPrefix>
    | ParseKeysByNamespaces<ActualNS, Keys>
    | ParseKeysByFallbackNs<Keys>,
> = $IsResourcesDefined extends true
  ? Key extends ActualKeys
    ? string
    : ActualKeys extends
          | `${Key}${_ContextSeparator}${infer Context}${_PluralSeparator}${PluralSuffix}`
          | `${Key}${_ContextSeparator}${infer Context}`
      ? Context
      : never
  : string;

// helper that maps the configured fallbackNS value to the matching resources slice
type FallbackResourcesOf<FallbackNS, R> = FallbackNS extends readonly (infer FN)[]
  ? R[FN & keyof R]
  : [FallbackNS] extends [false]
    ? never
    : R[Extract<FallbackNS, keyof R> & keyof R];

/* reuse the parse helpers as top-level aliases (no nested type declarations) */
type _PrimaryParse<
  ActualKey,
  PrimaryNS extends keyof Resources,
  TOpt extends TOptions,
> = ParseTReturn<ActualKey, Resources[PrimaryNS], TOpt>;

type _FallbackParse<ActualKey, FallbackNS, TOpt extends TOptions> = [
  FallbackResourcesOf<FallbackNS, Resources>,
] extends [never]
  ? never
  : ParseTReturn<ActualKey, FallbackResourcesOf<FallbackNS, Resources>, TOpt>;

export type TFunctionReturn<
  Ns extends Namespace,
  Key,
  TOpt extends TOptions,
  ActualNS extends Namespace = NsByTOptions<Ns, TOpt>,
  ActualKey = KeyWithContext<Key, TOpt>,
> = $IsResourcesDefined extends true
  ? ActualKey extends `${infer Nsp}${_NsSeparator}${infer RestKey}`
    ? ParseTReturn<RestKey, Resources[Nsp & keyof Resources], TOpt>
    : $FirstNamespace<ActualNS> extends infer PrimaryNS
      ? [PrimaryNS] extends [keyof Resources]
        ? [_PrimaryParse<ActualKey, PrimaryNS & keyof Resources, TOpt>] extends [never]
          ? [_FallbackParse<ActualKey, _FallbackNamespace, TOpt>] extends [never]
            ? DefaultTReturn<TOpt>
            : _FallbackParse<ActualKey, _FallbackNamespace, TOpt>
          : _PrimaryParse<ActualKey, PrimaryNS & keyof Resources, TOpt>
        : never
      : never
  : DefaultTReturn<TOpt>;

export type TFunctionDetailedResult<T = string, TOpt extends TOptions = {}> = {
  /**
   * The plain used key
   */
  usedKey: string;
  /**
   * The translation result.
   */
  res: T;
  /**
   * The key with context / plural
   */
  exactUsedKey: string;
  /**
   * The used language for this translation.
   */
  usedLng: string;
  /**
   * The used namespace for this translation.
   */
  usedNS: string;
  /**
   * The parameters used for interpolation.
   */
  usedParams: InterpolationMap<T> & { count?: TOpt['count'] };
};

type TFunctionProcessReturnValue<Ret, DefaultValue> = Ret extends string | $SpecialObject | null
  ? Ret
  : [DefaultValue] extends [never]
    ? Ret
    : DefaultValue;

type TFunctionReturnOptionalDetails<Ret, TOpt extends TOptions> = TOpt['returnDetails'] extends true
  ? TFunctionDetailedResult<Ret, TOpt>
  : Ret;

type AppendKeyPrefix<Key, KPrefix> = KPrefix extends string
  ? `${KPrefix}${_KeySeparator}${Key & string}`
  : Key;

/**
 * Resolves the effective key prefix by preferring a per-call `keyPrefix` from
 * options over the interface-level `KPrefix` (set via getFixedT's 3rd argument).
 */
type EffectiveKPrefix<KPrefix, TOpt> = TOpt extends { keyPrefix: infer OptKP extends string }
  ? OptKP
  : KPrefix;

/** `parseInterpolation: 'icu'` or `'mf2'`: messages are typed by their arguments. */
type _ParsesMessageFormat = [_ParseInterpolation] extends ['icu'] | ['mf2'] ? true : false;

/**
 * `t()` options are optional, except for a message with arguments under
 * `parseInterpolation: 'icu'` or `'mf2'` (on a missing one, i18next-icu renders
 * the raw message and i18next-mf2 a `{$name}` fallback). The conditional
 * resolves eagerly; a generic one here would break inference.
 */
type _KeyAndOptions<Key, Ret, Opts> = _ParsesMessageFormat extends true
  ? [key: Key | Key[], options: Opts] | [key: (Key | Key[]) & _IfOptionalOptions<Ret>]
  : [key: Key | Key[], options?: Opts];
/** `unknown` when options may be left out, else a type naming the missing arguments. */
type _IfOptionalOptions<Ret> = _ParsesMessageFormat extends true
  ? {} extends InterpolationMap<Ret>
    ? unknown
    : { 'pass these arguments as t() options': InterpolationMap<Ret> }
  : unknown;
/** Options parameter of a selector overload: required for a message with arguments. */
type _SelectorOptionsArg<Ret, Opts> =
  unknown extends _IfOptionalOptions<Ret> ? [options?: Opts] : [options: Opts];

/** ************************
 * T function declaration *
 ************************* */

interface TFunctionStrict<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> extends Branded<Ns> {
  <
    const Key extends ParseKeys<Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, EffectiveKPrefix<KPrefix, TOpt>>, TOpt>,
  >(
    key: Key | Key[],
    options: TOpt &
      InterpolationMap<Ret> & {
        context?: Key extends string
          ? unknown extends TOpt['context']
            ? TOpt['context']
            : ContextOfKey<Key, Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>>
          : never;
      },
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
  <
    const Key extends ParseKeys<Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, EffectiveKPrefix<KPrefix, TOpt>>, TOpt>,
  >(
    key: (Key | Key[]) & _IfOptionalOptions<$NoInfer<Ret>>,
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
  <
    const Key extends ParseKeys<Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, EffectiveKPrefix<KPrefix, TOpt>>, TOpt>,
  >(
    key: Key | Key[],
    defaultValue: string,
    options?: TOpt &
      InterpolationMap<Ret> & {
        context?: Key extends string
          ? unknown extends TOpt['context']
            ? TOpt['context']
            : ContextOfKey<Key, Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>>
          : never;
      },
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
}

interface TFunctionNonStrict<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> extends Branded<Ns> {
  <
    const Key extends ParseKeys<Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, EffectiveKPrefix<KPrefix, TOpt>>, TOpt>,
    const ActualOptions extends Omit<TOpt, 'context'> &
      InterpolationMap<Ret> & {
        context?: Key extends string
          ? unknown extends TOpt['context']
            ? TOpt['context']
            : ContextOfKey<Key, Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>>
          : never;
      } = TOpt &
      InterpolationMap<Ret> & {
        context?: Key extends string
          ? unknown extends TOpt['context']
            ? TOpt['context']
            : ContextOfKey<Key, Ns, TOpt, EffectiveKPrefix<KPrefix, TOpt>>
          : never;
      },
    DefaultValue extends string = never,
  >(
    // `[key, defaultValue, options?]` is written as two tuples: on a failed call,
    // TypeScript elaborates the error against the last of the equally matching
    // members, and TypeScript 7 sorts a 3-element tuple last, so a wrong options
    // object was reported as "not assignable to type 'string'" instead of the
    // missing or mistyped argument.
    ...args:
      | [key: string | string[], options: TOpt & $Dictionary & { defaultValue: DefaultValue }]
      | [key: string | string[], defaultValue: DefaultValue]
      | [key: string | string[], defaultValue: DefaultValue, options: TOpt & $Dictionary]
      | _KeyAndOptions<Key, $NoInfer<Ret>, ActualOptions>
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, DefaultValue>, TOpt>;
}

type TFunctionSignature<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> = _EnableSelector extends true | 'optimize' | 'strict'
  ? TFunctionSelector<Ns, KPrefix, GetSource<Ns, KPrefix>>
  : _StrictKeyChecks extends true
    ? TFunctionStrict<Ns, KPrefix>
    : TFunctionNonStrict<Ns, KPrefix>;

export interface TFunction<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> extends TFunctionSignature<Ns, KPrefix> {}

export type KeyPrefix<Ns extends Namespace> = ResourceKeys<true>[$FirstNamespace<Ns>] | undefined;

/**
 * Strict variant: every namespace (primary included) is exposed under its own
 * key on `$`. The flattened-primary form (`Resources[Ns[0]] &`) is dropped, so
 * `$.foo` no longer typechecks when `foo` is a key in the primary namespace —
 * callers must write `$.primary.foo`. Applied uniformly to single- and
 * multi-ns hooks under `enableSelector: 'strict'`.
 */
type _NsResourceStrict<Ns extends Namespace> = Ns extends readonly any[]
  ? PickNamespaces<Resources, Ns[number]>
  : PickNamespaces<Resources, Ns & keyof Resources>;

/** The raw (unfiltered) resource object for a given namespace. */
export type NsResource<Ns extends Namespace> = [_EnableSelector] extends ['strict']
  ? _NsResourceStrict<Ns>
  : Ns extends readonly [keyof Resources, any, ...any]
    ? Resources[Ns[0]] & PickNamespaces<Resources, Ns[number]>
    : Resources[$FirstNamespace<Ns>];

/** A selector function that can be used as `keyPrefix` to scope `t()` to a sub-tree of the resource. */
export type KeyPrefixSelector<Ns extends Namespace> = (src: NsResource<Ns>) => object;

/**
 * The type of a selector function accepted by `t()` for a given namespace and optional key prefix.
 * Use this instead of `Parameters<TFunction<Ns>>[0]` for a stable, readable type.
 *
 * @example
 * ```ts
 * import type { SelectorParam } from 'i18next';
 *
 * interface CmpProps {
 *   i18nKey: SelectorParam<'myNamespace'>;
 * }
 * ```
 */
export type SelectorParam<Ns extends Namespace = DefaultNamespace, KPrefix = undefined> = (
  src: Select<GetSource<Ns, KPrefix>, undefined>,
) => string;

/// ////////////// ///
///  ↆ selector ↆ  ///
/// ////////////// ///

declare const $PluralBrand: unique symbol;
/** Marks a value as coming from a plural-form key, requiring `count` in the selector options. */
type PluralValue<T extends string> = T & { readonly [$PluralBrand]: typeof $PluralBrand };

declare const $SelectorKeyBrand: unique symbol;
/**
 * A branded string produced by {@link keyFromSelector}.
 * Can be passed directly to `t()` when the selector API is enabled.
 */
export type SelectorKey = string & { readonly [$SelectorKeyBrand]: typeof $SelectorKeyBrand };

/**
 * Type-safe signature for {@link keyFromSelector}.
 * Constrains the selector callback against the default namespace's resources
 * (same source that `t()` uses for selectors without explicit `ns`).
 * When resources are not defined, accepts any selector.
 */
export type KeyFromSelectorFn = <
  Ns extends Namespace = DefaultNamespace,
  KPrefix extends KeyPrefix<Ns> = undefined,
>(
  selector: (src: Select<GetSource<Ns, KPrefix>, undefined>) => any,
  opts?: { ns?: Ns; keyPrefix?: KPrefix },
) => SelectorKey;

/** Recursively strips the {@link PluralValue} brand from a type (handles nested objects for `returnObjects`). */
type DeepUnwrapPlural<T> =
  T extends PluralValue<infer U>
    ? U
    : T extends readonly any[]
      ? { [I in keyof T]: DeepUnwrapPlural<T[I]> }
      : T extends object
        ? { [K in keyof T]: DeepUnwrapPlural<T[K]> }
        : T;

type NsArg<Ns extends Namespace> = Ns[number] | readonly Ns[number][];

interface TFunctionSelector<Ns extends Namespace, KPrefix, Source> extends Branded<Ns> {
  // ── Pre-computed key(s) from keyFromSelector ────────────────────────────────
  // Accepts a branded `SelectorKey` (or array of them) produced by `keyFromSelector`.
  // Return-type precision is traded for the flexibility of decoupled key creation.
  // Placed first so that the more general selector overloads (below) are last —
  // TypeScript's `Parameters<>` utility resolves against the last call signature.
  <const Opts extends SelectorOptions<Ns[number]> = SelectorOptions<Ns[number]>>(
    key: SelectorKey | SelectorKey[],
    ...args: [options?: Opts & $Dictionary]
  ): DefaultTReturn<Opts>;

  // ── Array of selectors with explicit `ns` ───────────────────────────────────
  <
    Target extends ConstrainTarget<Opts>,
    const NewNs extends NsArg<Ns> & Namespace,
    const Opts extends SelectorOptions<NewNs>,
    NewSrc extends GetSource<NewNs, KPrefix>,
  >(
    selectors: readonly SelectorFn<NewSrc, ApplyTarget<Target, Opts>, Opts>[],
    options: Opts & InterpolationMap<Target> & { ns: NewNs },
  ): SelectorReturn<Target, Opts>;

  // ── Single selector with explicit `ns` ──────────────────────────────────────
  <
    Target extends ConstrainTarget<Opts>,
    const NewNs extends NsArg<Ns> & Namespace,
    const Opts extends SelectorOptions<NewNs>,
    NewSrc extends GetSource<NewNs, KPrefix>,
  >(
    selector: SelectorFn<NewSrc, ApplyTarget<Target, Opts>, Opts>,
    options: Opts &
      InterpolationMap<DeepUnwrapPlural<Target>> & {
        ns: NewNs;
      } & (Target extends PluralValue<string> ? { count: number } : {}),
  ): SelectorReturn<Target, Opts>;

  // ── Array of selectors with default `ns` ─────────────────────────────────────
  // Captures the selector tuple as `const Fns` so TypeScript preserves each
  // element's exact return type.  The union of return types is then extracted
  // via a distributive `infer`, which correctly handles mixed PluralValue<T> and
  // plain-string callbacks that would otherwise cause TypeScript to "lock in" the
  // type from the first element.
  <
    const Fns extends readonly ((src: Select<Source, Opts['context']>) => string | object)[],
    const Opts extends SelectorOptions<Ns[number]> = SelectorOptions<Ns[number]>,
  >(
    selectors: Fns,
    ...args: _SelectorOptionsArg<
      DeepUnwrapPlural<Fns[number] extends (...args: any[]) => infer R ? R : never>,
      Opts &
        InterpolationMap<
          DeepUnwrapPlural<Fns[number] extends (...args: any[]) => infer R ? R : never>
        >
    >
  ): SelectorReturn<Fns[number] extends (...args: any[]) => infer R ? R : never, Opts>;

  // ── Single selector with context + returnObjects ────────────────────────────
  // More specific than the general context overload below. Captures `Context` as
  // a const generic and uses `const Fn` + `ReturnType<Fn>` so FilterKeys sees the
  // concrete context and the callback's object/array shape is preserved (#2398).
  // Without this, `ConstrainTarget` / `ApplyTarget` collapse to `unknown` when
  // `returnObjects: true`.
  <
    const Context extends string,
    const Fn extends (src: Select<Source, Context>) => any,
    const Opts extends SelectorOptions<Ns[number]> & {
      context: Context;
      returnObjects: true;
    } = SelectorOptions<Ns[number]> & { context: Context; returnObjects: true },
  >(
    selector: Fn,
    options: Opts & InterpolationMap<DeepUnwrapPlural<ReturnType<Fn>>>,
  ): SelectorReturn<ReturnType<Fn>, Opts>;

  // ── Single selector with context — bypasses count enforcement ────────────────
  // When `context` is present in options, `Target` is derived from the
  // context-filtered source (third mapped type of FilterKeys), which does NOT
  // apply the PluralValue brand.  A separate overload avoids the circular
  // inference that would otherwise occur when `Opts['context']` sits inside the
  // conditional rest tuple of the overload below.
  <
    Target extends ConstrainTarget<Opts>,
    const NewNs extends NsArg<Ns> = Ns[number],
    const Opts extends SelectorOptions<NewNs> & { context: string } = SelectorOptions<NewNs> & {
      context: string;
    },
  >(
    selector: SelectorFn<Source, ApplyTarget<Target, Opts>, Opts>,
    options: Opts & InterpolationMap<Target>,
  ): SelectorReturn<Target, Opts>;

  // ── Single selector with defaultValue — preserves literal type of DV ────────
  // `const Opts` loses literal precision for `defaultValue` when inferred
  // through a conditional rest tuple (TypeScript limitation).  This dedicated
  // overload captures `DV` from a regular (non-conditional) parameter position,
  // preserving its literal type.  Count enforcement for plural keys is achieved
  // via a conditional intersection on the options parameter.
  <
    const Fn extends (src: Select<Source, undefined>) => ConstrainTarget<Opts>,
    const DV extends string,
    const Opts extends SelectorOptions<Ns[number]> = SelectorOptions<Ns[number]>,
  >(
    selector: Fn,
    options: Opts & { defaultValue: DV } & (ReturnType<Fn> extends PluralValue<string>
        ? { count: number }
        : {}) &
      InterpolationMap<DeepUnwrapPlural<ReturnType<Fn>>>,
  ): SelectorReturn<ReturnType<Fn>, Opts, DV>;

  // ── Single selector without context — enforces count for plural keys ──────────
  // Uses `const Fn` to capture the selector's exact return type independently of
  // `Opts`, breaking the circular dependency between `Target` inference and the
  // conditional rest tuple.  `ReturnType<Fn>` drives both the plural check and
  // the return type; `Opts` is inferred later from the resolved rest args.
  <
    const Fn extends (src: Select<Source, undefined>) => ConstrainTarget<Opts>,
    const Opts extends SelectorOptions<Ns[number]> = SelectorOptions<Ns[number]>,
  >(
    selector: Fn,
    ...args: ReturnType<Fn> extends PluralValue<string>
      ? [options: Opts & { count: number } & InterpolationMap<DeepUnwrapPlural<ReturnType<Fn>>>]
      : _SelectorOptionsArg<ReturnType<Fn>, Opts & InterpolationMap<ReturnType<Fn>>>
  ): SelectorReturn<ReturnType<Fn>, Opts>;
}

interface SelectorOptions<Ns = Namespace>
  extends Omit<TOptionsBase, 'ns' | 'nsSeparator'>, $Dictionary {
  ns?: Ns;
}

type SelectorReturn<
  Target,
  Opts extends { defaultValue?: unknown; returnObjects?: boolean },
  DV = Opts['defaultValue'],
> = $IsResourcesDefined extends true
  ? TFunctionReturnOptionalDetails<ProcessReturnValue<DeepUnwrapPlural<Target>, DV>, Opts>
  : DefaultTReturn<Opts>;

interface SelectorFn<Source, Target, Opts extends SelectorOptions<unknown>> {
  (translations: Select<Source, Opts['context']>): Target;
}

type ApplyKeyPrefix<
  T extends [any],
  KPrefix,
> = KPrefix extends `${infer Head}${_KeySeparator}${infer Tail}`
  ? ApplyKeyPrefix<[T[0][Head]], Tail>
  : T[0][KPrefix & string];

type ApplyTarget<
  Target,
  Opts extends { returnObjects?: unknown },
> = Opts['returnObjects'] extends true ? unknown : Target;

type ConstrainTarget<Opts extends SelectorOptions<any>> = _ReturnObjects extends true
  ? unknown
  : Opts['returnObjects'] extends true
    ? unknown
    : $IsResourcesDefined extends false
      ? unknown
      : string;

type ProcessReturnValue<Target, DefaultValue> = $Turtles extends Target
  ? string
  : [DefaultValue] extends [never]
    ? Target
    : unknown extends DefaultValue
      ? Target
      : Target | DefaultValue;

type PickNamespaces<T, K extends keyof any> = {
  [P in K as P extends keyof T ? P : never]: T[P & keyof T];
};

/** Extracts the sub-tree returned by a selector function used as keyPrefix. */
type SelectorReturnSource<KPrefix, Fallback> = KPrefix extends (...args: any[]) => infer R
  ? R extends object
    ? R
    : Fallback
  : Fallback;

type GetSource<Ns extends Namespace, KPrefix, Res = NsResource<Ns>> = KPrefix extends (
  ...args: any[]
) => any
  ? SelectorReturnSource<KPrefix, Res>
  : KPrefix extends keyof Res
    ? Res[KPrefix]
    : undefined extends KPrefix
      ? Res
      : ApplyKeyPrefix<[Res], KPrefix>;

type Select<T, Context> = $IsResourcesDefined extends false
  ? $Turtles
  : [_EnableSelector] extends ['optimize']
    ? T
    : FilterKeys<T, Context>;

/**
 * Context-variant keys that are actually present (not JSON-union phantoms typed
 * as optional `undefined`, e.g. `transKey1_withContext?: undefined`).
 */
type _DefinedContextKeys<T, Pattern extends string> = {
  [P in keyof T as P extends Pattern ? ([T[P]] extends [undefined] ? never : P) : never]: true;
};

/**
 * Keys of T whose value is not `undefined` (JSON-union phantoms are typed as
 * optional `undefined`), built once per object.
 */
type _DefinedKeys<T> = [T] extends [unknown]
  ? keyof { [P in keyof T as [T[P]] extends [undefined] ? never : P]: true }
  : never;

/**
 * For every defined key, the prefixes K before each context separator, as
 * `[all, bases]`: `all` has every K with a defined key `${K}${_ContextSeparator}...`,
 * `bases` only those where the rest is not just a plural suffix. Jumps from one
 * separator occurrence to the next (so the recursion depth is the number of
 * separators, not the key length, which can be a whole sentence) and resumes one
 * character after the match, so overlapping occurrences (`a___b` with `__`) count.
 */
type _ContextPrefixesOf<
  P,
  Head extends string = '',
  All = never,
  Bases = never,
> = P extends `${infer B}${_ContextSeparator}${string}`
  ? P extends `${B}${infer FromSep}`
    ? FromSep extends `${infer C}${infer Rest}`
      ? _ContextPrefixesOf<
          Rest,
          `${Head}${B}${C}`,
          All | `${Head}${B}`,
          FromSep extends
            | `${_PluralSeparator}${PluralSuffix}`
            | `${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
            ? Bases
            : Bases | `${Head}${B}`
        >
      : [All, Bases]
    : [All, Bases]
  : [All, Bases];

/**
 * The context prefixes of an object, built once per object (conditional type
 * instantiations are cached): scanning all keys for every key was quadratic
 * in the object size, TS2589 at about 1,000 keys with context variants.
 */
type _ContextPrefixes<T> = [T] extends [unknown]
  ? _ContextPrefixesOf<_DefinedKeys<T> & string>
  : never;
type _AllContextPrefixes<T> = [T] extends [unknown] ? _ContextPrefixes<T>[0] : never;
type _ContextBases<T> = [T] extends [unknown] ? _ContextPrefixes<T>[1] : never;

/** Whether a string type is a single literal (not `string` or a `${string}` pattern). */
type _IsLiteral<S extends PropertyKey> = {} extends Record<S, unknown> ? false : true;

/**
 * Whether T has a defined key matching Pattern: literal keys are looked up, a
 * pattern with a wide member scans the keys.
 */
type _HasDefinedKey<T, Pattern extends string> = [
  false extends (Pattern extends unknown ? _IsLiteral<Pattern> : never)
    ? keyof _DefinedContextKeys<T, Pattern>
    : Extract<Pattern, _DefinedKeys<T>>,
] extends [never]
  ? false
  : true;

type _HasContextVariant<T, K extends string, Context> = string extends Context
  ? _IsLiteral<K> extends true
    ? K extends _AllContextPrefixes<T>
      ? true
      : false
    : _HasDefinedKey<T, `${K}${_ContextSeparator}${string}`>
  : _HasDefinedKey<
      T,
      | `${K}${_ContextSeparator}${Context & string}`
      | `${K}${_ContextSeparator}${Context & string}${_PluralSeparator}${PluralSuffix}`
    >;

/** Checks whether key K has **any** context variant in T (excluding pure plural suffixes). */
type _IsContextualKey<T, K extends string> =
  _IsLiteral<K> extends true
    ? K extends _ContextBases<T>
      ? true
      : false
    : [
          Exclude<
            keyof _DefinedContextKeys<T, `${K}${_ContextSeparator}${string}`>,
            | `${K}${_PluralSeparator}${PluralSuffix}`
            | `${K}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
          >,
        ] extends [never]
      ? false
      : true;

/**
 * Distributes {@link FilterKeysObject} over unions so heterogeneous JSON array
 * element types (each object literal in the array) are filtered independently,
 * then re-unified. Without distribution, `keyof (A | B)` is only the common keys
 * and context variants that exist on a single element are invisible, which
 * produced partial element unions for `returnObjects` + `context` (#2398).
 */
type FilterKeys<T, Context> = [T] extends [readonly any[]]
  ? { [I in keyof T]: FilterKeys<T[I], Context> }
  : T extends any
    ? FilterKeysObject<T, Context>
    : never;

type FilterKeysObject<T, Context> = {
  // Mapped type 1: object-valued keys (recurse) + plain leaf keys (non-plural, non-context)
  [
    K in keyof T as [keyof T[K]] extends [never]
      ? never // nothing to select (empty object, null, undefined, optional or unknown)
      : T[K] extends object
        ? K
        : [Context] extends [string]
          ? K extends
              | `${string}${_ContextSeparator}${Context}`
              | `${string}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
            ? never // context keys handled by mapped type 3
            : K extends `${string}${_PluralSeparator}${PluralSuffix}`
              ? never // plural keys handled by mapped type 2
              : K extends string
                ? _HasContextVariant<T, K, Context> extends true
                  ? never // context variant exists, drop base key (type 3 handles it)
                  : _IsContextualKey<T, K> extends true
                    ? never // key has context variants but not for this context
                    : K // no context variants at all, keep base key
                : K
          : K extends `${string}${_PluralSeparator}${PluralSuffix}`
            ? never
            : K
  ]: T[K] extends object ? FilterKeys<T[K], Context> : T[K];
} & {
  // Mapped type 2: plural collapsing (active regardless of context)
  [
    K in keyof T as T[K] extends object
      ? never
      : [Context] extends [string]
        ? K extends
            | `${string}${_ContextSeparator}${Context}`
            | `${string}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
          ? never // context keys handled by mapped type 3
          : K extends
                | `${infer Prefix}${_PluralSeparator}${PluralSuffix}`
                | `${infer Prefix}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
            ? Prefix
            : never
        : K extends
              | `${infer Prefix}${_PluralSeparator}${PluralSuffix}`
              | `${infer Prefix}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
          ? Prefix
          : never
  ]: T[K] extends object ? FilterKeys<T[K], Context> : PluralValue<T[K] & string>;
} & {
  // Mapped type 3: context key collapsing (skip JSON-union phantoms typed as `undefined`)
  [
    K in keyof T as T[K] extends object
      ? never
      : [keyof T[K]] extends [never]
        ? never
        : [Context] extends [string]
          ? K extends
              | `${infer Prefix}${_ContextSeparator}${Context}`
              | `${infer Prefix}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
            ? Prefix
            : never
          : never
  ]: T[K] extends object ? FilterKeys<T[K], Context> : T[K];
};
