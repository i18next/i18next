import i18next from 'i18next';

/**
 * Exercises in mocking
 */
const mockWithT: i18next.WithT = {
  t: (key: string, options: any) => key,
};
