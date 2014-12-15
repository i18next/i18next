describe('getting resources after init', function() {

  var resStore = {
    dev: { translation: { 'test': 'ok_from_dev' } },
    en: { translation: { 'test': 'ok_from_en' } },            
    'en-US': { translation: { 'test': 'ok_from_en-US' } }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }), function() {
        done();
    });
  });

  it('it should return resources for existing bundle', function() {
    var devTranslation = i18n.getResourceBundle('dev', 'translation');
    var enTranslation = i18n.getResourceBundle('en', 'translation');
    var enUSTranslation = i18n.getResourceBundle('en-US', 'translation');
    expect(devTranslation.test).to.be('ok_from_dev');
    expect(enTranslation.test).to.be('ok_from_en');
    expect(enUSTranslation.test).to.be('ok_from_en-US');
  });

  it('it should return empty object for non-existing bundle', function() {
    var nonExisting = i18n.getResourceBundle('en-GB', 'translation');
    expect(Object.keys(nonExisting).length).to.be(0);
  });

  it('it should use default namespace when namespace argument is left out', function() {
    var enTranslation = i18n.getResourceBundle('en');
    expect(enTranslation.test).to.be('ok_from_en');
  });

  it('it should return a clone of the resources', function() {
    var enTranslation = i18n.getResourceBundle('en');
    enTranslation.test = 'ok_from_en_changed';
    expect(enTranslation.test).to.be('ok_from_en_changed');
    expect(resStore.en.translation.test).to.be('ok_from_en');
  });

});
