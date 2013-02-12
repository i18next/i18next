describe('use translation function shortcut $.t', function() {

  beforeEach(function(done) {
    i18n.init(opts, function(t) { done(); });
  });

  it('it should provide translation via $.t', function() {
    expect($.t('simple_en-US')).to.be('ok_from_en-US');
    expect($.t('simple_en')).to.be('ok_from_en');
    expect($.t('simple_dev')).to.be('ok_from_dev');
  });

});