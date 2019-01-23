import i18next from '../src/i18next.js';

describe('i18next', () => {
  describe('promise based api', () => {
    describe('init()', () => {
      it('it should return a promise', done => {
        i18next.init().then(t => {
          expect(typeof t).to.equal('function');
          done();
        });
      });
    });

    describe('changeLanguage()', () => {
      it('it should return a promise', done => {
        i18next.init();
        i18next.changeLanguage().then(t => {
          expect(typeof t).to.equal('function');
          done();
        });
      });
    });

    describe('loadLanguages()', () => {
      it('it should return a promise', done => {
        i18next.init();
        i18next.loadLanguages('en').then(() => {
          done();
        });
      });
    });

    describe('loadNamespaces()', () => {
      it('it should return a promise', done => {
        i18next.init();
        i18next.loadNamespaces('common').then(() => {
          done();
        });
      });
    });

    describe('reloadResources()', () => {
      it('it should return a promise', done => {
        i18next.init();
        i18next.reloadResources().then(() => {
          done();
        });
      });
    });
  });
});
