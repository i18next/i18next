describe('Initialisation', function() {

  describe('with passed in resource set', function() {

    var resStore = {
      dev: { translation: { 'simple_dev': 'ok_from_dev' } },
      en: { translation: { 'simple_en': 'ok_from_en' } },            
      'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      i18n.init( $.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should provide passed in resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

  });

  describe('loading from server', function() {

    describe('with static route', function() {

      beforeEach(function(done) {
        i18n.init(opts, function(t) { done(); });
      });

      it('it should provide loaded resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_dev');
      });

    });

    describe('with dynamic route', function() {

      beforeEach(function(done) {

        var res = {
          dev: { translation: { 'simple_dev': 'ok_from_dev' } },
          en: { translation: { 'simple_en': 'ok_from_en' } },
          'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        };

        var server = sinon.fakeServer.create();
        server.autoRespond = true;

        server.respondWith([200, { "Content-Type": "application/json" }, JSON.stringify(res)]);

        i18n.init( $.extend(opts, { 
            resGetPath: 'locales/resources.json?lng=__lng__&ns=__ns__',
            dynamicLoad: true }),
          function(t) { server.restore(); done(); });
      });

      it('it should provide loaded resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_dev');
      });

    });

  });

  describe('advanced initialisation options', function() {

    describe('setting load', function() {

      describe('to current', function() {

        var spy; 

        beforeEach(function(done) {
          spy = sinon.spy(i18n.sync, '_fetchOne');
          i18n.init($.extend(opts, { 
              load: 'current' }),
            function(t) { done(); });
        });

        afterEach(function() {
          spy.restore();
        });

        it('it should load only current and fallback language', function() {
          expect(spy.callCount).to.be(2); // en-US, en
        });

        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).not.to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });

      });

      describe('to unspecific', function() {

        var spy; 

        beforeEach(function(done) {
          spy = sinon.spy(i18n.sync, '_fetchOne');
          i18n.init($.extend(opts, { 
              load: 'unspecific' }),
            function(t) { done(); });
        });

        afterEach(function() {
          spy.restore();
        });

        it('it should load only unspecific and fallback language', function() {
          expect(spy.callCount).to.be(2); // en-US, en
        });

        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).not.to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });

        it('it should return unspecific language', function() {
          expect(i18n.lng()).to.be('en');
        });

      });

    });

    describe('with fallback language set to false', function() {

      var spy; 

      beforeEach(function(done) {
        spy = sinon.spy(i18n.sync, '_fetchOne');
        i18n.init($.extend(opts, { 
            fallbackLng: false }),
          function(t) { done(); });
      });

      afterEach(function() {
        spy.restore();
      });

      it('it should load only specific and unspecific languages', function() {
        expect(spy.callCount).to.be(2); // en-US, en
      });

      it('it should provide loaded resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).not.to.be('ok_from_dev');
      });

    });

    describe('preloading multiple languages', function() {

      var spy; 

      beforeEach(function(done) {
        spy = sinon.spy(i18n.sync, '_fetchOne');
        i18n.init($.extend(opts, { 
            preload: ['fr', 'de-DE'] }),
          function(t) { done(); });
      });

      afterEach(function() {
        spy.restore();
      });

      it('it should load additional languages', function() {
        expect(spy.callCount).to.be(6); // en-US, en, de-DE, de, fr, dev
      });

      describe('changing the language', function() {

        beforeEach(function(done) {
          spy.reset();
          i18n.setLng('de-DE',
            function(t) { done(); });
        });

        it('it should reload the preloaded languages', function() {
          expect(spy.callCount).to.be(4); // de-DE, de, fr, dev
        });

      });

    });

    describe('with synchronous flag', function() {

      beforeEach(function() {
        i18n.init( $.extend(opts, { getAsync: false }) );
      });

      it('it should provide loaded resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_dev');
      });

    });

    describe('with namespace', function() {

      describe('with one namespace set', function() {

        beforeEach(function(done) {
          i18n.init( $.extend(opts, { ns: 'ns.special'} ),
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
          i18n.init( $.extend(opts, { ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
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

        });

        describe('with using localStorage', function() {

          var spy; 

          before(function() {
            window.localStorage.removeItem('res_en-US');
            window.localStorage.removeItem('res_en');
            window.localStorage.removeItem('res_dev');
          });

          beforeEach(function(done) {
            spy = sinon.spy(i18n.sync, '_fetchOne');
            i18n.init($.extend(opts, { 
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
              i18n.init($.extend(opts, { 
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

    describe('using function provided in callback\'s argument', function() {

      var cbT;

      beforeEach(function(done) {
        i18n.init(opts, function(t) { cbT = t; done(); });
      });

      it('it should provide loaded resources for translation', function() {
        expect(cbT('simple_en-US')).to.be('ok_from_en-US');
        expect(cbT('simple_en')).to.be('ok_from_en');
        expect(cbT('simple_dev')).to.be('ok_from_dev');
      });

    });

    describe('using localStorage', function() {

      var spy; 

      before(function() {
        window.localStorage.removeItem('res_en-US');
        window.localStorage.removeItem('res_en');
        window.localStorage.removeItem('res_dev');
      });

      beforeEach(function(done) {
        spy = sinon.spy(i18n.sync, '_fetchOne');
        i18n.init($.extend(opts, { 
          useLocalStorage: true 
        }), function(t) { done(); });
      });

      afterEach(function() {
        spy.restore();
      });

      it('it should load language', function() {
        expect(spy.callCount).to.be(3); // en-US, en, de-DE, de, fr, dev
      });

      describe('on later init', function() {

        beforeEach(function(done) {
          spy.reset();
          i18n.init(function(t) { done(); });
        });

        it('it should not reload language', function() {
          expect(spy.callCount).to.be(0); // de-DE, de, fr, dev
        });

        describe('on later init - after caching duration', function() {

          beforeEach(function(done) {
            spy.reset();

            // exipred
            var local = window.localStorage.getItem('res_en-US');
            local = JSON.parse(local);
            local.i18nStamp = 0;
            window.localStorage.setItem('res_en-US', JSON.stringify(local));

            i18n.init(function(t) { done(); });
          });

          it('it should reload language', function() {
            expect(spy.callCount).to.be(1); // de-DE, de, fr, dev
          });

        });

      });

    });

    describe('with lowercase flag', function() {

      describe('default behaviour will uppercase specifc country part.', function() {

        beforeEach(function() {
          i18n.init( $.extend(opts, { 
            lng: 'en-us',
            resStore: {
              'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
            }
          }, function(t) { done(); }) );
        });

        it('it should translate the uppercased lng value', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        });

        it('it should get uppercased set language', function() {
          expect(i18n.lng()).to.be('en-US');
        });

      });

      describe('overridden behaviour will accept lowercased country part.', function() {

        beforeEach(function() {
          i18n.init( $.extend(opts, { 
            lng: 'en-us',
            lowerCaseLng: true,
            resStore: {
              'en-us': { translation: { 'simple_en-us': 'ok_from_en-us' } }
            }
          }, function(t) { done(); }) );
        });

        it('it should translate the lowercase lng value', function() {
          expect(i18n.t('simple_en-us')).to.be('ok_from_en-us');
        });

        it('it should get lowercased set language', function() {
          expect(i18n.lng()).to.be('en-us');
        });

      });

    });

  });

});