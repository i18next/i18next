import type {
  $OmitArrayKeys,
  $PreservedValue,
  $Dictionary,
  $SpecialObject,
  $StringKeyPathToRecord,
  $NoInfer,
  $Prune,
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
type _UseSelector = TypeOptions['useSelector'];

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

/** ************************
 * T function declaration *
 ************************* */

interface TFunctionStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined>
  extends Branded<Ns> {
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

interface TFunctionNonStrict<Ns extends Namespace = DefaultNamespace, KPrefix = undefined>
  extends Branded<Ns> {
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

type TFunctionSignature<
  Ns extends Namespace = DefaultNamespace,
  KPrefix = undefined,
> = _UseSelector extends true
  ? TFunction.Selector<Ns, KPrefix, Selector.GetSource<Ns, KPrefix>>
  : _StrictKeyChecks extends true
    ? TFunctionStrict<Ns, KPrefix>
    : TFunctionNonStrict<Ns, KPrefix>;

export interface TFunction<Ns extends Namespace = DefaultNamespace, KPrefix = undefined>
  extends TFunctionSignature<Ns, KPrefix> {}

export type KeyPrefix<Ns extends Namespace> = _UseSelector extends true
  ? keyof _Resources[$FirstNamespace<Ns> & keyof _Resources] | undefined
  : ResourceKeys<true>[$FirstNamespace<Ns>] | undefined;

export declare namespace TFunction {
  interface Selector<Ns extends Namespace, KPrefix, Source> extends Branded<Ns> {
    /** Overload: namespace override */
    <
      Target extends Selector.ConstrainTarget<Options>,
      const Options extends Selector.SelectorOptions,
      NsOverride extends Namespace,
      SourceOverride extends Selector.GetSource<NsOverride, KPrefix>,
    >(
      selector: Selector.SelectorFn<SourceOverride, Selector.ApplyTarget<Target, Options>, Options>,
      options: Options & InterpolationMap<Target> & { ns: NsOverride },
    ): TFunctionReturnOptionalDetails<
      Selector.ProcessReturnValue<$NoInfer<Target>, Options['defaultValue']>,
      Options
    >;
    /** Overload: no namespace override */
    <
      Target extends Selector.ConstrainTarget<Options>,
      const Options extends Selector.SelectorOptions,
    >(
      selector: Selector.SelectorFn<Source, Selector.ApplyTarget<Target, Options>, Options>,
      options?: Options & InterpolationMap<Target>,
    ): TFunctionReturnOptionalDetails<
      Selector.ProcessReturnValue<$NoInfer<Target>, Options['defaultValue']>,
      Options
    >;
  }
}

/**
 * 1. KPrefix cannot be a path -- it must be a shallow key
 *
 *    - There might be a way to support this, but in my early experiments came with a significant
 *    compile-time cost
 *
 *    - This is reflected in the signature of `getFixed` when `useSelector` is true
 *
 * 2. Namespace change must happen explicitly via options
 *
 *    - The reason for this is also performance related. Adding support for switching namespaces like
 *      that would require us to always instantiate all namespaces, even if users never actually use
 *      them
 *
 *    - This seemed to align with the best practices that i18next describes in their docs, and since
 *    this is a new feature, it seems like an opportunity to nudge users toward that usage anyway
 *
 * 3. Default value must be explicitly passed via options
 *
 *    - There might be a way to support this, to be honest I didn't spend a lot of time here since I
 *      wasn't sure how popular this feature is in userland. If you'd like me to give it another try
 *      I'm open to doing spending another cycle on it.
 *
 * 4. "Strict" semantics by default (`useSelector: true` implies strict)
 *
 *    A. Providing a default value turns the return type into a union that includes the default value
 *
 *    B. Similarly, `null` keys are prevented by path access. If a user has that setting turned on,
 *       it might affect runtime behavior, but there isn't a straight-forward way to allow users to
 *       access keys that don't exist on the object, so I'm not sure it makes sense to support this
 *       at the type-level
 *
 *    C. Same applies to applying types for fallback namespaces. Users can still use fallback namespaces
 *       to "catch" lookups that misfire at runetime, but applying that logic at the type-level when
 *       using selectors would require either:
 *
 *       A.) changing thte proxy object's type to allow arbitrary property access at
 *           any level (which is possible, but comes at the cost of making navigation of the data structure
 *           less intuitive); or,
 *
 *       B.) updating the return type of all translations to be a union of the accessed
 *           property _or_ the fallback value, which would likely be an unpopular design desicion
 */

export declare namespace Selector {
  type SelectorOptions = Omit<TOptionsBase, 'ns'> & $Dictionary;

  interface SelectorFn<Source, Target, Options extends SelectorOptions> {
    (translations: Selector.FilterKeys<Source, Options['context']>): Target;
  }

  type GetSource<
    Ns extends Namespace,
    KPrefix,
  > = KPrefix extends keyof Resources[$FirstNamespace<Ns>]
    ? Resources[$FirstNamespace<Ns>][KPrefix]
    : Resources[$FirstNamespace<Ns>];

  type ConstrainTarget<Options extends SelectorOptions> = _ReturnObjects extends true
    ? unknown
    : Options['returnObjects'] extends true
      ? unknown
      : string;

  type ApplyTarget<Target, Options extends SelectorOptions> = Options['returnObjects'] extends true
    ? unknown
    : Target;

  type ProcessReturnValue<Target, DefaultValue> = [DefaultValue] extends [never]
    ? Target
    : unknown extends DefaultValue
      ? Target
      : Target | DefaultValue;

  type RegularKeys<T, K extends keyof T, Context> = T[K] extends object
    ? K
    : Context extends string
      ? never
      : K;

  type ContextKeys<T, K extends keyof T, Context> = T[K] extends object
    ? never
    : Context extends string
      ? K extends
          | `${infer Prefix}${_ContextSeparator}${Context}`
          | `${infer Prefix}${_ContextSeparator}${Context}${_PluralSeparator}${PluralSuffix}`
        ? Prefix
        : never
      : never;

  type PluralKeys<T, K extends keyof T, Context = undefined> = T[K] extends object
    ? never
    : Context extends string
      ? never
      : _CompatibilityJSON extends 'v4'
        ? K extends
            | `${infer Prefix}${_PluralSeparator}${PluralSuffix}`
            | `${infer Prefix}${_PluralSeparator}ordinal${_PluralSeparator}${PluralSuffix}`
          ? Prefix
          : never
        : K extends `${infer Prefix}${_PluralSeparator}${PluralSuffix}`
          ? Prefix
          : never;

  type FilterArray<T, Context> = { [I in keyof T]: FilterKeys<T[I], Context> };

  type FilterKeys<T, Context> = never | T extends readonly any[]
    ? FilterArray<T, Context>
    : $Prune<
        {
          [K in keyof T as PluralKeys<T, K, Context>]: T[K] extends readonly any[]
            ? FilterArray<T[K], Context>
            : T[K] extends object
              ? FilterKeys<T[K], Context>
              : T[K];
        } & {
          [K in keyof T as RegularKeys<T, K, Context>]: T[K] extends readonly any[]
            ? FilterArray<T[K], Context>
            : T[K] extends object
              ? FilterKeys<T[K], Context>
              : T[K];
        } & {
          [K in keyof T as ContextKeys<T, K, Context>]: T[K] extends readonly any[]
            ? FilterArray<T[K], Context>
            : T[K] extends object
              ? FilterKeys<T[K], Context>
              : T[K];
        }
      >;
}
