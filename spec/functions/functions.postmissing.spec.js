describe('post missing resources', function() {

  describe('to fallback', function() {
    var server, stub; 

    beforeEach(function(done) {
      server = sinon.fakeServer.create();
      stub = sinon.stub(i18n.functions, "ajax"); 

      server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

      i18n.init(i18n.functions.extend(opts, {
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

      i18n.init(i18n.functions.extend(opts, {
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