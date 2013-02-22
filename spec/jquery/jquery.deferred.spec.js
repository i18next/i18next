describe('initialise - use deferrer instead of callback', function() {

  describe('with passed in resource set', function() {

    var resStore = {
      dev: { translation: { 'simple_dev': 'ok_from_dev' } },
      en: { translation: { 'simple_en': 'ok_from_en' } },            
      'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore })).done(function(t) { done(); });
    });

    it('it should provide passed in resources for translation', function() {
      expect($.t('simple_en-US')).to.be('ok_from_en-US');
      expect($.t('simple_en')).to.be('ok_from_en');
      expect($.t('simple_dev')).to.be('ok_from_dev');
    });

  });

  describe('loading from server', function() {

    beforeEach(function(done) {
      i18n.init(opts).done(function() { done(); });
    });

    it('it should provide loaded resources for translation', function() {
      expect($.t('simple_en-US')).to.be('ok_from_en-US');
      expect($.t('simple_en')).to.be('ok_from_en');
      expect($.t('simple_dev')).to.be('ok_from_dev');
    });

  });

});