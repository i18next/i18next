export type $MergeBy<T, K> = Omit<T, keyof K> & K;
export type $Dictionary<T = any> = { [key: string]: T };
export type $OmitArrayKeys<Arr> = Arr extends readonly any[] ? Omit<Arr, keyof any[]> : Arr;
export type $PreservedValue<Value, Fallback> = [Value] extends [never] ? Fallback : Value;
export type $SpecialObject = object | Array<string | object>;
