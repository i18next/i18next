import * as utils from '../src/utils';

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

      expect(res).to.eql({
        some: 'else',
      });
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

      expect(res).to.eql({
        some: 'thing',
      });
    });
  });
});
