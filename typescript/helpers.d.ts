export type $MergeBy<T, K> = Omit<T, keyof K> & K;
export type $Dictionary<T = unknown> = { [key: string]: T };
export type $OmitArrayKeys<Arr> = Arr extends readonly any[] ? Omit<Arr, keyof any[]> : Arr;
export type $PreservedValue<Value, Fallback> = [Value] extends [never] ? Fallback : Value;
export type $SpecialObject = object | Array<string | object>;
export type $PrependIfDefined<T extends string, S extends string> = T extends '' ? T : `${S}${T}`;
export type $ConcatArray<T, S extends string, U = never> = T extends readonly [
  infer F extends string,
  ...infer R extends string[],
]
  ? `${F}${$PrependIfDefined<$ConcatArray<R, S, ''>, S>}`
  : U;
