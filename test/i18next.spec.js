import i18next from '../src/i18next.js';

describe('i18next', () => {

  before(() => {
    i18next.init({
      foo: 'bar',
      debug: false
    });
    i18next.changeLanguage('en');
  });

  describe('instance creation', () => {
    describe('createInstance()', () => {
      let newInstance;
      before(() => {
        newInstance = i18next.createInstance({bar: 'foo'});
      });

      it('it should not inherit options from inital i18next', () => {
        expect(newInstance.options.foo).to.not.be.ok;
        expect(newInstance.options.bar).to.equal('foo');
      });

      it('it has own instance of resource store', () => {
        expect(newInstance.store).to.not.equal(i18next.store);
      });
    });

    describe('cloneInstance()', () => {
      let newInstance;
      before(() => {
        newInstance = i18next.cloneInstance({bar: 'foo'});
      });

      it('it should inherit options from inital i18next', () => {
        expect(newInstance.options.foo).to.equal('bar');
        expect(newInstance.options.bar).to.equal('foo');
      });

      it('it has shared instance of resource store', () => {
        expect(newInstance.store).to.equal(i18next.store);
      });

      it('it is set to same language', () => {
        expect(newInstance.language).to.equal(i18next.language);
      });

      it('it can change language independent to original', () => {
        newInstance.changeLanguage('de');
        expect(newInstance.language).to.equal('de');
        expect(i18next.language).to.equal('en');
      });
    });
  });



});
