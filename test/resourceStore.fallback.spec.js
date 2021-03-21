import ResourceStore from '../src/ResourceStore.js';

describe('ResourceStore', () => {
  describe('nestedFlatFallback', () => {
    it('it should find the resource in various flat/nested combinations', () => {
      const data = {
        en: {
          translation: {
            a: {
              nested: 'a nested value',
            },
            'a.flat': 'a flat value',
            'b.flat': {
              nested: 'mix value',
              more: {
                nesting: 'deep',
                'flat.again': 'deep flat',
              },
              more2: {
                'flat.again': 'deep flat',
                deeper: {
                  key: 'very deep',
                },
              },
            },
            str: 'whatever',
          },
        },
      };
      const rs = new ResourceStore(data);
      expect(rs.toJSON()).to.equal(data);

      let ret = rs.getResource('en', 'translation', 'a.nested');
      expect(ret).to.equal('a nested value');

      ret = rs.getResource('en', 'translation', 'a.flat');
      expect(ret).to.equal('a flat value');

      ret = rs.getResource('en', 'translation', 'b.flat.nested');
      expect(ret).to.equal('mix value');

      ret = rs.getResource('en', 'translation', 'b.flat.more.nesting');
      expect(ret).to.equal('deep');

      ret = rs.getResource('en', 'translation', 'b.flat.more.flat.again');
      expect(ret).to.equal('deep flat');

      ret = rs.getResource('en', 'translation', 'b.flat.more2.flat.again');
      expect(ret).to.equal('deep flat');

      ret = rs.getResource('en', 'translation', 'b.flat.more2.deeper.key');
      expect(ret).to.equal('very deep');

      ret = rs.getResource('en', 'translation', 'a.wrong');
      expect(ret).to.equal(undefined);

      ret = rs.getResource('en', 'translation', 'str.wrong');
      expect(ret).to.equal(undefined);
    });
  });
});
