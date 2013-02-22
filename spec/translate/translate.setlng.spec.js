describe('with passed in languages different from set one', function() {

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
        preload: ['de-DE'] }),
      function(t) { done(); });
  });

  it('it should provide translation for passed in language', function() {
    expect(i18n.t('simple_de', { lng: 'de-DE' })).to.be('ok_from_de');
  });

  describe('with language not preloaded', function() {

    it('it should provide translation for passed in language after loading file sync', function() {
      var expectedValue = i18n.clientVersion ? 'simple_fr' : 'ok_from_fr';
      expect(i18n.t('simple_fr', { lng: 'fr' })).to.be(expectedValue);
    });

  });

});