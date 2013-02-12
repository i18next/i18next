describe('adding resources after init', function() {

  var resStore = {
    dev: { translation: { 'simple_dev': 'ok_from_dev' } },
    en: { translation: { 'simple_en': 'ok_from_en' } }//,            
    //'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
  };
  
  beforeEach(function(done) {
    i18n.init( $.extend(opts, { resStore: resStore }),
      function(t) { 
        i18n.addResourceBundle('en-US', 'translation', { 'simple_en-US': 'ok_from_en-US' });
        done(); 
      });
  });

  it('it should provide passed in resources for translation', function() {
    expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
    expect(i18n.t('simple_en')).to.be('ok_from_en');
    expect(i18n.t('simple_dev')).to.be('ok_from_dev');
  });

});