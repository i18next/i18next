describe('preloading multiple languages', function() {

  var spy; 

  beforeEach(function(done) {
    spy = sinon.spy(i18n.sync, '_fetchOne');
    i18n.init(i18n.functions.extend(opts, { 
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
      if (i18n.sync.resStore) i18n.sync.resStore = {}; // to reset for test on server!
      i18n.setLng('de-DE',
        function(t) { done(); });
    });

    it('it should reload the preloaded languages', function() {
      expect(spy.callCount).to.be(4); // de-DE, de, fr, dev
    });

  });

});