describe('with passed in languages different from set one', function() {

  beforeEach(function(done) {
    i18n.init($.extend(opts, { 
        preload: ['de-DE'] }),
      function(t) { done(); });
  });

  it('it should provide translation for passed in language', function() {
    expect(i18n.t('simple_de', { lng: 'de-DE' })).to.be('ok_from_de');
  });

  describe('with language not preloaded', function() {

    it('it should provide translation for passed in language after loading file sync', function() {
      expect(i18n.t('simple_fr', { lng: 'fr' })).to.be('ok_from_fr');
    });

  });

});