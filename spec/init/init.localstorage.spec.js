describe('using localStorage', function() {

  var spy; 

  before(function() {
    window.localStorage.removeItem('res_en-US');
    window.localStorage.removeItem('res_en');
    window.localStorage.removeItem('res_dev');
  });

  beforeEach(function(done) {
    spy = sinon.spy(i18n.sync, '_fetchOne');
    i18n.init(i18n.functions.extend(opts, { 
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