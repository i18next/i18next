import { defineWorkspace } from 'vitest/config';

/**
 * See CONTRIBUTING.md for more information
 */
export default defineWorkspace([
  {
    test: {
      name: 'local',
      dir: './test/local',
    },
  },
]);
