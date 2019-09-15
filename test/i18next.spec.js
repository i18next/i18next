import i18next from '../src/i18next.js';

describe('i18next', () => {
  before(() => {
    i18next.init({
      foo: 'bar',
      debug: false,
    });
    i18next.changeLanguage('en');
  });

  describe('instance creation', () => {
    describe('createInstance()', () => {
      let newInstance;
      before(() => {
        newInstance = i18next.createInstance({ bar: 'foo' });
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
        newInstance = i18next.cloneInstance({ bar: 'foo' });
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

    describe('create/cloneInstance()', () => {
      let instance1;
      let instance2;
      before(done => {
        instance1 = i18next.cloneInstance({ lng: 'en' }, () => {
          instance2 = instance1.cloneInstance({ lng: 'de' }, () => done());
        });
      });

      it('it should have correct lngs', () => {
        expect(instance1.language).to.equal('en');
        expect(instance1.languages).to.eql(['en', 'dev']);
        expect(instance2.language).to.equal('de');
        expect(instance2.languages).to.eql(['de', 'dev']);

        expect(instance1.translator.language).to.equal('en');
        expect(instance2.translator.language).to.equal('de');
      });
    });
  });

  describe('i18next - functions', () => {
    describe('getFixedT', () => {
      it('it should have lng, ns on t', () => {
        const t = i18next.getFixedT('de', 'common');
        expect(t.lng).to.equal('de');
        expect(t.ns).to.equal('common');
      });
      it('should handle default value', () => {
        const t = i18next.getFixedT(null, null);
        const translatedKey = t('key', 'default');
        const translatedSecondKey = t('key', { defaultValue: 'default' });
        expect(translatedKey).to.equal('default');
        expect(translatedSecondKey).to.equal('default');
      });
    });
  });
});
