describe('basic functionality', function() {

  describe('setting language', function() {

    beforeEach(function(done) {
      i18n.init( $.extend(opts, {
        resStore: {
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
          'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
        }
      }), function(t) { done(); } );
    });

    it('it should provide resources for set language', function(done) {
      expect(i18n.t('simpleTest')).to.be('ok_from_en-US');

      i18n.setLng('de-DE', function(t) {
          expect(t('simpleTest')).to.be('ok_from_de-DE');
          done();
      });

    });

  });

  describe('preloading multiple languages', function() {

    var spy; 

    beforeEach(function(done) {
      spy = sinon.spy(i18n.sync, '_fetchOne');
      i18n.init(opts, function(t) { done(); });
    });

    afterEach(function() {
      spy.restore();
    });

    it('it should preload resources for languages', function(done) {
      spy.reset();
      i18n.preload('de-DE', function(t) {
          expect(spy.callCount).to.be(5); // en-US, en, de-DE, de, dev
          done();
      });

    });

  });

  describe('postprocessing tranlation', function() {

    describe('having a postprocessor', function() {

      before(function(){
        i18n.addPostProcessor('myProcessor', function(val, key, opts) {
          return 'ok_from_postprocessor';
        });
      });

      beforeEach(function(done) {
        i18n.init( $.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          }
        }), function(t) { done(); } );
      });

      it('it should postprocess the translation by passing in postProcess name to t function', function() {
        expect(i18n.t('simpleTest', {postProcess: 'myProcessor'})).to.be('ok_from_postprocessor');
      });

      describe('or setting it as default on init', function() {

        beforeEach(function(done) {
          i18n.init( $.extend(opts, {
            resStore: {
              'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
              'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
            },
            postProcess: 'myProcessor'
          }), function(t) { done(); } );
        });

        it('it should postprocess the translation by default', function() {
          expect(i18n.t('simpleTest')).to.be('ok_from_postprocessor');
        });

      });

    });

  });

  describe('post missing resources', function() {

    describe('to fallback', function() {
      var server, stub; 

      beforeEach(function(done) {
        server = sinon.fakeServer.create();
        stub = sinon.stub(i18n.functions, "ajax"); 

        server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

        i18n.init( $.extend(opts, {
          sendMissing: true,
          resStore: {
            'en-US': { translation: {  } },
            'en': { translation: {  } },
            'dev': { translation: {  } }
          }
        }), function(t) { done(); } );
      });

      afterEach(function() {
        server.restore();
        stub.restore();
      });

      it('it should post missing resource to server', function() {
        i18n.t('missing');
        server.respond();
        expect(stub.calledOnce).to.be(true);
      });

    });

    describe('to all', function() {
      var server, stub; 

      beforeEach(function(done) {
        server = sinon.fakeServer.create();
        stub = sinon.stub(i18n.functions, "ajax"); 

        server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

        i18n.init( $.extend(opts, {
          sendMissing: true,
          sendMissingTo: 'all',
          resStore: {
            'en-US': { translation: {  } },
            'en': { translation: {  } },
            'dev': { translation: {  } }
          }
        }), function(t) { done(); } );
      });

      afterEach(function() {
        server.restore();
        stub.restore();
      });

      it('it should post missing resource for all lng to server', function() {
        i18n.t('missing');
        server.respond();
        expect(stub.calledThrice).to.be(true);
      });

    });

  });

});