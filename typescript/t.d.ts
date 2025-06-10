import type {
  $OmitArrayKeys,
  $PreservedValue,
  $Dictionary,
  $SpecialObject,
  $StringKeyPathToRecord,
  $NoInfer,
} from './helpers.js';
import type {
  TypeOptions,
  Namespace,
  FlatNamespace,
  DefaultNamespace,
  TOptions,
} from './options.js';

/** @todo consider to replace {} with Record<string, never> */
/* eslint @typescript-eslint/ban-types: ['error', { types: { "{}": false } }] */

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

/** ****************************************************
 * Build all keys and key prefixes based on Resources *
 ***************************************************** */
type KeysBuilderWithReturnObjects<Res, Key = keyof Res> = Key extends keyof Res
  ? Res[Key] extends $Dictionary | readonly unknown[]
    ?
        | JoinKeys<Key, WithOrWithoutPlural<keyof $OmitArrayKeys<Res[Key]>>>
        | JoinKeys<Key, KeysBuilderWithReturnObjects<Res[Key]>>
    : never
  : never;

type KeysBuilderWithoutReturnObjects<Res, Key = keyof $OmitArrayKeys<Res>> = Key extends keyof Res
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
type KeysByTOptions<TOpt extends TOptions> = TOpt['returnObjects'] extends true
  ? ResourceKeys<true>
  : ResourceKeys;

type NsByTOptions<Ns extends Namespace, TOpt extends TOptions> = TOpt['ns'] extends Namespace
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

type FilterKeysByContext<Keys, Context> = Context extends string
  ? Keys extends
      | `${infer Prefix}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
      | `${infer Prefix}${_ContextSeparator}${Context}`
    ? Prefix
    : never
  : Keys;

type ParseKeys<
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

type ParseInterpolationValues<Ret> =
  Ret extends `${string}${_InterpolationPrefix}${infer Value}${_InterpolationSuffix}${infer Rest}`
    ?
        | (Value extends `${infer ActualValue},${string}`
            ? ParseActualValue<ActualValue>
            : ParseActualValue<Value>)
        | ParseInterpolationValues<Rest>
    : never;

type InterpolationMap<Ret> = $PreservedValue<
  $StringKeyPathToRecord<ParseInterpolationValues<Ret>, unknown>,
  Record<string, unknown>
>;

type ParseTReturnPlural<
  Res,
  Key,
  KeyWithPlural = `${Key & string}${_PluralSeparator}${PluralSuffix}`,
> = Res[(KeyWithPlural | Key) & keyof Res];

type ParseTReturnPluralOrdinal<
  Res,
  Key,
  KeyWithOrdinalPlural = `${Key &
    string}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`,
> = Res[(KeyWithOrdinalPlural | Key) & keyof Res];

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
    ? ParseTReturn<RestKey, Res[K1 & keyof Res], TOpt>
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
        : Res[Key & keyof Res]
>;

type TReturnOptionalNull = _ReturnNull extends true ? null : never;
type TReturnOptionalObjects<TOpt extends TOptions> = _ReturnObjects extends true
  ? $SpecialObject | string
  : TOpt['returnObjects'] extends true
    ? $SpecialObject
    : string;
type DefaultTReturn<TOpt extends TOptions> = TReturnOptionalObjects<TOpt> | TReturnOptionalNull;

export type KeyWithContext<Key, TOpt extends TOptions> = TOpt['context'] extends string
  ? `${Key & string}${_ContextSeparator}${TOpt['context']}`
  : Key;

export type TFunctionReturn<
  Ns extends Namespace,
  Key,
  TOpt extends TOptions,
  ActualNS extends Namespace = NsByTOptions<Ns, TOpt>,
  ActualKey = KeyWithContext<Key, TOpt>,
> = $IsResourcesDefined extends true
  ? ActualKey extends `${infer Nsp}${_NsSeparator}${infer RestKey}`
    ? ParseTReturn<RestKey, Resources[Nsp & keyof Resources], TOpt>
    : ParseTReturn<ActualKey, Resources[$FirstNamespace<ActualNS>], TOpt>
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

type Atom = string | number | boolean | symbol | bigint | globalThis.Function;
type Absorb<T, Else = string> = unknown extends T ? Else : [T] extends [never] ? Else : T;
type GetOne<T extends [any], K extends keyof any> = T[0][K];
type Get<T extends [any], K extends keyof any> = Walk<T, K>;

type Walk<T extends [any], K extends keyof any> = K extends `${infer A}${_KeySeparator}${infer B}`
  ? Walk<[T[0][A]], B>
  : Absorb<T[0][K]>;

type PathOf<T extends [any], K = never> = PathsAtLevel<T, K>;
type PathsAtLevel<T extends [any], K> = (
  K & `${string}${_KeySeparator}` extends never ? K : K & `${string}${_KeySeparator}`
) extends infer P
  ? P extends `${infer A}${_KeySeparator}${infer B}`
    ? `${A}${_KeySeparator}${PathsAtLevel<[T[0][A]], B> & string}`
    : P extends keyof T[0]
      ? K
      : T[0] extends Atom
        ? never
        : keyof T[0]
  : never;

/** ************************
 * T function declaration *
 ************************* */

interface TFunctionStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined> {
  $TFunctionBrand: $IsResourcesDefined extends true ? `${$FirstNamespace<Ns>}` : never;
  <
    const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
  >(
    key: Key | Key[],
    options?: TOpt & InterpolationMap<Ret>,
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
  <
    const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
  >(
    key: Key | Key[],
    defaultValue: string,
    options?: TOpt & InterpolationMap<Ret>,
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
}

interface TFunctionNonStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined> {
  $TFunctionBrand: $IsResourcesDefined extends true ? `${$FirstNamespace<Ns>}` : never;
  <
    const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
    const TOpt extends TOptions,
    Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
    const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>,
    DefaultValue extends string = never,
  >(
    ...args:
      | [key: Key | Key[], options?: ActualOptions]
      | [key: string | string[], options: TOpt & $Dictionary & { defaultValue: DefaultValue }]
      | [key: string | string[], defaultValue: DefaultValue, options?: TOpt & $Dictionary]
  ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, DefaultValue>, TOpt>;
}

export type TFunctionSignature<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> = _ReturnObjects extends true
  ? _StrictKeyChecks extends true
    ? TFunction.LazyStrict<Ns, KPrefix>
    : TFunction.LazyNonStrict<Ns, KPrefix>
  : _StrictKeyChecks extends true
    ? TFunctionStrict<Ns, KPrefix>
    : TFunctionNonStrict<Ns, KPrefix>;

export interface TFunction<Ns extends Namespace = DefaultNamespace, KPrefix = undefined>
  extends TFunctionSignature<Ns, KPrefix> {}

export type KeyPrefix<Ns extends Namespace> = ResourceKeys<true>[$FirstNamespace<Ns>] | undefined;

declare namespace TFunction {
  /**
   * ## {@link LazyStrict `TFunction.LazyStrict`}
   *
   * This signature is nearly identical to {@link TFunctionStrict `TFunctionStrict`},
   * with 2 notable differences:
   *
   * 1. This signature adds a new property {@link $Trans `$Trans`} that contains the set of
   *    available translations
   *
   * 2. This signature adds a new overload that is "lazy" (as in, not eager). The algorithm
   *    it uses is responsive to user input, and computes auto-completions a level at a time,
   *    rather than pre-computing all possible paths ahead of time.
   *
   * See also:
   * - {@link LazyNonStrict `TFunction.LazyNonStrict`}
   */
  interface LazyStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined> {
    <Key extends string>(key: PathOf<[this['$Trans']], Key>): Get<[this['$Trans']], Key>;
    $Trans: GetOne<[_Resources], this['$TFunctionBrand']>;
    /** This property was copy-pasted from {@link TFunctionStrict} */
    $TFunctionBrand: $IsResourcesDefined extends true ? `${$FirstNamespace<Ns>}` : never;
    /** This overload was copy-pasted from {@link TFunctionStrict} */
    <
      const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
      const TOpt extends TOptions,
      Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
    >(
      key: Key | Key[],
      options?: TOpt & InterpolationMap<Ret>,
    ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
    /** This overload was copy-pasted from `TFunctionStrict` */
    <
      const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
      const TOpt extends TOptions,
      Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
    >(
      key: Key | Key[],
      defaultValue: string,
      options?: TOpt & InterpolationMap<Ret>,
    ): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, never>, TOpt>;
  }

  /**
   * ## {@link LazyNonStrict `TFunction.LazyNonStrict`}
   *
   * This signature is nearly identical to {@link TFunctionNonStrict `TFunctionNonStrict`},
   * with 2 notable differences:
   *
   * 1. This signature adds a new property {@link $Trans `$Trans`} that contains the set of
   *    available translations
   *
   * 2. This signature adds a new overload that is "lazy" (as in, not eager). The algorithm
   *    it uses is responsive to user input, and computes auto-completions a level at a time,
   *    rather than pre-computing all possible paths ahead of time.
   *
   * See also:
   * - {@link LazyStrict `TFunction.LazyStrict`}
   */
  interface LazyNonStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined> {
    <Key extends string>(key: PathOf<[this['$Trans']], Key>): Get<[this['$Trans']], Key>;
    $Trans: GetOne<[_Resources], this['$TFunctionBrand']>;
    /** This property was copy-pasted from {@link TFunctionNonStrict} */
    $TFunctionBrand: $IsResourcesDefined extends true ? `${$FirstNamespace<Ns>}` : never;
    /** This overload was copy-pasted from {@link TFunctionNonStrict} */
    <
      const Key extends ParseKeys<Ns, TOpt, KPrefix> | TemplateStringsArray,
      const TOpt extends TOptions,
      Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>,
      const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>,
      DefaultValue extends string = never,
    >(
      ...args:
        | [key: Key | Key[], options?: ActualOptions]
        | [key: string | string[], options: TOpt & $Dictionary & { defaultValue: DefaultValue }]
        | [key: string | string[], defaultValue: DefaultValue, options?: TOpt & $Dictionary]
    ): TFunctionReturnOptionalDetails<
      TFunctionProcessReturnValue<$NoInfer<Ret>, DefaultValue>,
      TOpt
    >;
  }
}
