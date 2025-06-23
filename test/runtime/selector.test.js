import { describe, it, expect } from 'vitest';
import { keysFromSelector } from '../../src/selector.js';

describe('keysFromSelector', () => {
  describe('example-based test suite', () => {
    it('handles identity function', () => {
      const keys = keysFromSelector(($) => $);
      expect(keys).toEqual('');
    });

    it('tracks property access with default key separator', () => {
      const keys = keysFromSelector(($) => $.a.b.c);
      expect(keys).toEqual('a.b.c');
    });

    it('works with array indices', () => {
      const keys = keysFromSelector(($) => $[0][1][2]);
      expect(keys).toEqual('0.1.2');
    });

    it('supports custom keySeparator option', () => {
      const keys = keysFromSelector(($) => $[0][1][2], { keySeparator: '...' });
      expect(keys).toEqual('0...1...2');
    });
  });
});
