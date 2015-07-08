describe('with namespace', function() {

  describe('with one namespace set', function() {

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { ns: 'ns.special'} ),
        function(t) { done(); });
    });

    it('it should provide loaded resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_special_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');
    });

  });

  describe('with more than one namespace set', function() {

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
        function(t) { done(); });
    });

    it('it should provide loaded resources for translation', function() {
      // default ns
      expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_special_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');

      // ns prefix
      expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_common_en-US');
      expect(i18n.t('ns.common:simple_en')).to.be('ok_from_common_en');
      expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_common_dev');

      // ns in options
      expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_common_en-US');
      expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_common_en');
      expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_common_dev');
    });

    describe('and fallbacking to default namespace', function() {
      var resStore = {
        dev: { 'ns.special': { 'simple_dev': 'ok_from_dev' } },
        en: { 'ns.special': { 'simple_en': 'ok_from_en' } },
        'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
      };

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          fallbackToDefaultNS: true,
          resStore: resStore,
          ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
          function(t) { done(); });
      });

      it('it should fallback to default ns', function() {
        // default ns fallback lookup
        expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('ns.common:simple_en')).to.be('ok_from_en');
        expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_dev');

        // ns in options
        expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_en-US');
        expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_en');
        expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_dev');
      });

    });

    describe('and fallbacking to set namespace', function() {
      var resStore = {
        dev: {
          'ns.special': { 'simple_dev': 'ok_from_dev' },
          'ns.fallback': { 'simple_fallback': 'ok_from_fallback' }
        },
        en: { 'ns.special': { 'simple_en': 'ok_from_en' } },
        'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
      };

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          fallbackNS: 'ns.fallback',
          resStore: resStore,
          ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
          function(t) { done(); });
      });

      it('it should fallback to set fallback namespace', function() {
        expect(i18n.t('ns.common:simple_fallback')).to.be('ok_from_fallback');
      });

    });

    describe('and fallbacking to multiple set namespace', function() {
      var resStore = {
        dev: {
          'ns.common': {},
          'ns.special': { 'simple_dev': 'ok_from_dev' },
          'ns.fallback1': {
            'simple_fallback': 'ok_from_fallback1',
            'simple_fallback1': 'ok_from_fallback1'
          }
        },
        en: {
          'ns.special': { 'simple_en': 'ok_from_en' },
          'ns.fallback2': {
            'simple_fallback': 'ok_from_fallback2',
            'simple_fallback2': 'ok_from_fallback2'
          }
        },
        'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
      };

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          fallbackNS: ['ns.fallback1', 'ns.fallback2'],
          resStore: resStore,
          ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
          function(t) { done(); });
      });

      it('it should fallback to set fallback namespace', function() {
        expect(i18n.t('ns.common:simple_fallback')).to.be('ok_from_fallback1'); /* first wins */
        expect(i18n.t('ns.common:simple_fallback1')).to.be('ok_from_fallback1');
        expect(i18n.t('ns.common:simple_fallback2')).to.be('ok_from_fallback2');
      });

      describe('and post missing', function() {

        var spy;

        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
            fallbackNS: ['ns.fallback1', 'ns.fallback2'],
            resStore: resStore,
            sendMissing: true, /* must be changed to saveMissing */
            ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
            function(err, t) { 
              spy = sinon.spy(i18n.options, 'missingKeyHandler');
              t('ns.common:notExisting');
              done();
            });
        });

        afterEach(function() {
          spy.restore();
        });

        it('it should post only to origin namespace', function() {
          expect(spy.callCount).to.be(1);
          expect(spy.args[0][0]).to.be('en-US');
          expect(spy.args[0][1]).to.be('ns.common');
          expect(spy.args[0][2]).to.be('notExisting');
          expect(spy.args[0][3]).to.be('ns.common:notExisting');
        });

      });

    });

  });

  describe('with reloading additional namespace', function() {

    describe('without using localStorage', function() {
      beforeEach(function(done) {
        i18n.init(opts,
          function(t) {
            i18n.setDefaultNamespace('ns.special');
            i18n.loadNamespaces(['ns.common', 'ns.special'], done);
          });
      });

      it('it should provide loaded resources for translation', function() {
        // default ns
        expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_special_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');

        // ns prefix
        expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_common_en-US');
        expect(i18n.t('ns.common:simple_en')).to.be('ok_from_common_en');
        expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_common_dev');

        // ns in options
        expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_common_en-US');
        expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_common_en');
        expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_common_dev');
      });

      it('it should add the new namespaces to the namespace array', function() {
        expect(i18n.options.ns.namespaces).to.contain('ns.common');
        expect(i18n.options.ns.namespaces).to.contain('ns.special');
      });

      describe('and fallbackToDefaultNS turned on', function() {

        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
              ns: 'ns.common',
              fallbackToDefaultNS: true
            }),
            function(t) {
              i18n.loadNamespaces(['ns.special'], done);
            });
        });

        it('it should fallback to default namespace', function() {
          expect(i18n.t('ns.special:test.fallback_en')).to.be('ok_from_common_en-fallback');
          expect(i18n.t('ns.special:test.fallback_dev')).to.be('ok_from_common_dev-fallback');
        });

      });

    });

    describe('with using localStorage', function() {

      var spy;

      before(function() {
        if (typeof window !== 'undefined') { // safe use on server
          window.localStorage.removeItem('res_en-US');
          window.localStorage.removeItem('res_en');
          window.localStorage.removeItem('res_dev');
        }
      });

      beforeEach(function(done) {
        spy = sinon.spy(i18n.sync, '_fetchOne');
        i18n.init(i18n.functions.extend(opts, {
          useLocalStorage: true
        }), function(t) {
          i18n.setDefaultNamespace('ns.special');
          i18n.loadNamespaces(['ns.common', 'ns.special'], done);
        });
      });

      afterEach(function() {
        spy.restore();
      });

      it('it should load language', function() {
        expect(spy.callCount).to.be(9); // en-US, en, de-DE, de, fr, dev * 3 namespaces (translate, common, special)
      });

      describe('on later reload of namespaces', function() {

        beforeEach(function(done) {
          spy.reset();
          i18n.init(i18n.functions.extend(opts, {
            useLocalStorage: true,
            ns: 'translation'
          }), function(t) {
            i18n.setDefaultNamespace('ns.special');
            i18n.loadNamespaces(['ns.common', 'ns.special'], done);
          });
        });

        it('it should not reload language', function() {
          expect(spy.callCount).to.be(0);
        });

      });

    });

  });

});
