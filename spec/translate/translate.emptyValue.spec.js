describe('key with empty string value as valid option', function() {
  var resStore = {
    dev: { translation: { empty: '' } },
    en: { translation: { } },
    'en-US': { translation: { } }
  };

  beforeEach(function(done) {
    i18n.init( $.extend(opts, { resStore: resStore }),
        function(t) { done(); });
  });

  it('it should translate correctly', function() {
    expect(i18n.t('empty')).to.be('');
  });
});