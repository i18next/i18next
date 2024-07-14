import { describe, it, expect } from 'vitest';
import { deepExtend, deepFind } from '../../src/utils.js';

describe('utils', () => {
  describe('#deepExtend', () => {
    it('it should overwrite if flag set', () => {
      const res = deepExtend(
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
      const res = deepExtend(
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

  describe('#deepFind', () => {
    it('finds value for a basic path', () => {
      const obj = { a: { b: { c: 1 } } };
      const value = deepFind(obj, 'a.b.c');
      expect(value).toEqual(1);
    });

    it('finds no value for a non-existent path', () => {
      const obj = { a: { b: { c: 1 } } };
      const value = deepFind(obj, 'a.b.d');
      expect(value).toEqual(undefined);
    });

    it('finds value for a key that has a dot', () => {
      const obj = { a: { b: 'zero', 'b.b': { c: 1 } } };
      const value = deepFind(obj, 'a.b.b.c');
      expect(value).toEqual(1);
      const value2 = deepFind(obj, 'a.b');
      expect(value2).toEqual('zero');
      const value3 = deepFind(obj, 'a.b.b');
      expect(value3).toEqual({ c: 1 });
    });

    it('finds value for an array index', () => {
      const obj = { a: [{ c: 1 }] };
      const value = deepFind(obj, 'a.0.c');
      expect(value).toEqual(1);
    });
  });
});
