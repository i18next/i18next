describe('removing resources after init', function() {

  var resStore = {
    dev: { translation: { 'test': 'ok_from_dev' } },
    en: { translation: { 'test': 'ok_from_en' } },            
    'en-US': { translation: { 'test': 'ok_from_en-US' } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { 
        i18n.removeResourceBundle('en-US', 'translation');
        done(); 
      });
  });

  it('it should remove resources', function() {
    expect(i18n.t('test')).to.be('ok_from_en');
  });

});