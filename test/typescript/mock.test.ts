import { WithT } from 'i18next';

/**
 * Exercises in mocking
 */
const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};
