import { describe, it, expect } from 'vitest';
import { keysFromSelector } from '../../src/selector.js';

const defaultOptions = {
  nsSeparator: ':',
};

describe('keysFromSelector', () => {
  describe('example-based test suite', () => {
    it('handles identity function', () => {
      const keys = keysFromSelector(($) => $, defaultOptions);
      expect(keys).toEqual('');
    });

    it('tracks property access with default key separator', () => {
      const keys = keysFromSelector(($) => $.a.b.c, defaultOptions);
      expect(keys).toEqual('a.b.c');
    });

    it('works with array indices', () => {
      const keys = keysFromSelector(($) => $[0][1][2], defaultOptions);
      expect(keys).toEqual('0.1.2');
    });

    it('tracks property access with default namespace separator', () => {
      const keys = keysFromSelector(($) => $['ns:'].a.b.c, defaultOptions);
      expect(keys).toEqual('ns:a.b.c');
    });

    it('works with custom namespace separator', () => {
      const keys = keysFromSelector(($) => $['ns::'].a.b.c, { nsSeparator: '::' });
      expect(keys).toEqual('ns::a.b.c');
    });
  });
});
