import ResourceStore from '../src/ResourceStore.js';

describe('ResourceStore', () => {
  describe('constructor', () => {
    it('it should set empty data if not passing them in', () => {
      let rs = new ResourceStore();
      expect(rs.toJSON()).to.eql({});
    });

    it('it should set data if passing them in', () => {
      const data = {
        en: {
          translation: {
            test: 'test',
          },
        },
      };
      let rs = new ResourceStore(data);
      expect(rs.toJSON()).to.equal(data);
    });
  });

  describe('resource manipulation', () => {
    let rs;

    describe('can add resources', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it adds resouces by addResource', () => {
        // basic key
        rs.addResource('de', 'translation', 'test', 'test');
        expect(rs.getResource('de', 'translation', 'test')).to.equal('test');

        // dotted key
        rs.addResource('de', 'translation', 'nest.test', 'test_nest');
        expect(rs.getResource('de', 'translation', 'nest.test')).to.equal('test_nest');

        // using first param fullDot
        rs.addResource('de.translation.nest.fullDot', 'test_fullDot');
        expect(rs.getResource('de.translation.nest.fullDot')).to.equal('test_fullDot');

        // setting object
        rs.addResource('de.translation.nest.object', { something: 'deeper' });
        expect(rs.getResource('de.translation.nest.object.something')).to.equal('deeper');

        // getting object
        expect(rs.getResource('de.translation.nest.object')).to.eql({ something: 'deeper' });
      });

      it("it should emit 'added' event on addResource call", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResource('fr', 'translation', 'hi', 'salut');
        expect(spy.calledWithExactly('fr', 'translation', 'hi', 'salut')).to.be.true;
      });

      it("it should not emit 'added' event on addResource call with silent option", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResource('fr', 'translation', 'hi', 'salut', { silent: true });
        expect(spy.notCalled).to.be.true;
      });

      it("it should emit 'added' event on addResources call", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResources('fr', 'translation', {
          hi: 'salut',
          hello: 'bonjour',
        });
        expect(spy.calledOnce).to.be.true;
      });

      it("it should not emit 'added' event on addResources call with silent option", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResources(
          'fr',
          'translation',
          {
            hi: 'salut',
            hello: 'bonjour',
          },
          { silent: true },
        );
        expect(spy.notCalled).to.be.true;
      });

      it("it should emit 'added' event on addResourceBundle call", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResourceBundle(
          'fr',
          'translation',
          {
            hi: 'salut',
            hello: 'bonjour',
          },
          true,
          true,
        );
        expect(spy.calledOnce).to.be.true;
      });

      it("it should not emit 'added' event on addResourceBundle call with silent option", () => {
        const spy = sinon.spy();
        rs.on('added', spy);
        rs.addResourceBundle(
          'fr',
          'translation',
          {
            hi: 'salut',
            hello: 'bonjour',
          },
          true,
          true,
          { silent: true },
        );
        expect(spy.notCalled).to.be.true;
      });
    });

    describe('can extend resources bundle', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it adds resouces by addResourceBundle', () => {
        rs.addResourceBundle('en', 'translation', { something: 'deeper' });
        expect(rs.getResource('en', 'translation')).to.eql({ something: 'deeper', test: 'test' });

        // dotty
        rs.addResourceBundle('en.translation', { something1: 'deeper1' });
        expect(rs.getResource('en.translation')).to.eql({
          something: 'deeper',
          something1: 'deeper1',
          test: 'test',
        });
      });

      it('without polluting the prototype by __proto__', () => {
        const malicious_payload = '{"__proto__":{"vulnerable":"Polluted"}}';
        rs.addResourceBundle('en', 'translation', JSON.parse(malicious_payload), true, true);
        expect({}.vulnerable).to.eql(undefined);
      });

      it('without polluting the prototype by constructor', () => {
        const malicious_payload = '{"constructor": {"prototype": {"polluted": "yes"}}}';
        rs.addResourceBundle('en', 'translation', JSON.parse(malicious_payload), true);
        expect({}.polluted).to.eql(undefined);
      });
    });

    describe('can check resources bundle', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it checks resouces by hasResourceBundle', () => {
        expect(rs.hasResourceBundle('en', 'translation')).to.be.ok;
        expect(rs.hasResourceBundle('en', 'notExisting')).to.not.be.ok;
      });
    });

    describe('can get resources bundle', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it get resouces by getResourceBundle', () => {
        expect(rs.getResourceBundle('en', 'translation')).to.be.eql({ test: 'test' });
      });
    });

    describe('can remove resources bundle', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it removes resouces by removeResourceBundle', () => {
        rs.removeResourceBundle('en', 'translation');
        expect(rs.getResourceBundle('en', 'translation')).to.be.not.ok;
      });
    });

    describe('can get data by language', () => {
      beforeEach(() => {
        const data = { en: { translation: { test: 'test' } } };
        rs = new ResourceStore(data);
      });

      it('it gets data by getDataByLanguage', () => {
        expect(rs.getDataByLanguage('en')).to.be.eql({ translation: { test: 'test' } });
      });
    });
  });
});
