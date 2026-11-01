import i18next, { keyFromSelector } from 'i18next';

const t = i18next.t;
export const plain: 'Plain' = t(($) => $.plain);
export const greeting: string = t(($) => $.greeting, { name: 'x' });
export const item: string = t(($) => $.item, { count: 2 });
export const deep: 'Deep' = t(($) => $.nested.deep);
export const key: string = keyFromSelector(($) => $.nested.deep);

// @ts-expect-error a plural key needs count
t(($) => $.item);
