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
    if (i18n.sync.resStore) i18n.sync.resStore = {}; // to reset for test on server!
    i18n.preload('de-DE', function(t) {
      expect(spy.callCount).to.be(5); // en-US, en, de-DE, de, dev
      done();
    });

  });

});