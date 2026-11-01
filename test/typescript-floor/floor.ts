import i18next, { type ParseKeysWithoutVariables, type TFunction } from 'i18next';

const t = i18next.t;
export const plain: 'Plain' = t('plain');
export const greeting: 'Hello {{name}}' = t('greeting', { name: 'x' });
export const welcome: 'Welcome to {{appName}}' = t('welcome');
export const price: string = t('price', { amount: 3 });
export const item: string = t('item', { count: 2 });
export const deep: 'Deep' = t('nested.deep');
export const other: 'Other' = t('other:key');
export const fixed: string = i18next.getFixedT('en', 'translation', 'nested')('deep');

export const label = (key: ParseKeysWithoutVariables) => t(key);
export function withT(tf: TFunction) {
  return tf('plain');
}

// @ts-expect-error greeting needs its variable
t('greeting');

i18next.hydrate({ en: { translation: { plain: 'Plain' } } }, 'en');
