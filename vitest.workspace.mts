// eslint-disable-next-line import/no-extraneous-dependencies
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'runtime',
      dir: './test/runtime',
    },
  },

  {
    test: {
      name: 'compatibility',
      dir: './test/compatibility',
    },
  },
]);
