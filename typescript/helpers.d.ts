// Types

export type $Dictionary<T = unknown> = { [key: string]: T };

export type $SpecialObject = object | Array<string | object>;

// Types Operators

export type $MergeBy<T, K> = Omit<T, keyof K> & K;

export type $OmitArrayKeys<Arr> = Arr extends readonly any[] ? Omit<Arr, keyof any[]> : Arr;

export type $PreservedValue<Value, Fallback> = [Value] extends [never] ? Fallback : Value;

export type $NormalizeIntoArray<T extends unknown | readonly unknown[]> = T extends readonly unknown[] ? T : [T];
