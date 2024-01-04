import { describe, it, expect } from 'vitest';
import * as utils from '../../src/utils.js';

describe('utils', () => {
  describe('#deepExtend', () => {
    it('it should overwrite if flag set', () => {
      const res = utils.deepExtend(
        {
          some: 'thing',
        },
        {
          some: 'else',
        },
        true,
      );

      expect(res).toEqual({ some: 'else' });
    });

    it('it should not overwrite', () => {
      const res = utils.deepExtend(
        {
          some: 'thing',
        },
        {
          some: 'else',
        },
        false,
      );

      expect(res).toEqual({ some: 'thing' });
    });
  });
});
