import { describe, it, expect } from 'vitest';
import keysFromSelector from '../../src/selector.js';

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

  describe('namespace resolution', () => {
    it('prepends namespace with nsSeparator when first segment matches a namespace in ns array', () => {
      // Regression: previously produced "ns2.description.part1" (no namespace split),
      // causing extractFromKey to look up the wrong key and emit a missingKey warning.
      const keys = keysFromSelector(($) => $.ns2.description.part1, {
        ns: ['ns1', 'ns2'],
      });
      expect(keys).toEqual('ns2:description.part1');
    });

    it('prepends namespace with nsSeparator when ns is a single string', () => {
      const keys = keysFromSelector(($) => $.myNS.greeting, {
        ns: 'myNS',
      });
      expect(keys).toEqual('myNS:greeting');
    });

    it('does not prepend nsSeparator when first segment is not in the ns list', () => {
      // "translation" is the default NS but not in the provided list — treat as plain key
      const keys = keysFromSelector(($) => $.someKey.nested, {
        ns: ['ns1', 'ns2'],
      });
      expect(keys).toEqual('someKey.nested');
    });

    it('does not prepend nsSeparator when no ns option is provided', () => {
      const keys = keysFromSelector(($) => $.ns1.description, {});
      expect(keys).toEqual('ns1.description');
    });

    it('respects a custom nsSeparator', () => {
      const keys = keysFromSelector(($) => $.ns1.a.b, {
        ns: ['ns1'],
        nsSeparator: '|',
      });
      expect(keys).toEqual('ns1|a.b');
    });

    it('respects custom keySeparator together with nsSeparator', () => {
      const keys = keysFromSelector(($) => $.ns1.a.b, {
        ns: ['ns1'],
        nsSeparator: '|',
        keySeparator: '/',
      });
      expect(keys).toEqual('ns1|a/b');
    });

    it('does not apply namespace logic when nsSeparator is falsy', () => {
      // nsSeparator: false disables namespace splitting entirely
      const keys = keysFromSelector(($) => $.ns1.a.b, {
        ns: ['ns1'],
        nsSeparator: false,
      });
      expect(keys).toEqual('ns1.a.b');
    });

    it('handles a single-segment path that matches a namespace without mangling it', () => {
      // Only one segment — nothing after the namespace to separate, leave as-is
      const keys = keysFromSelector(($) => $.ns1, {
        ns: ['ns1'],
      });
      expect(keys).toEqual('ns1');
    });
  });
});
