import { WithT, TFunction } from 'i18next';

/**
 * Exercises in mocking
 */
const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};

const translation = {
  fi: {
    article: {
      translationKey: 'translationValue',
    },
  },
};

const mockWithTAndResources: WithT<'article'> = {
  t: (key) => translation.fi.article[key as keyof typeof translation.fi.article] || key,
};

const t: TFunction<'article'> = (key) =>
  translation.fi.article[key as keyof typeof translation.fi.article] || key;
t('translationKey').trim();
