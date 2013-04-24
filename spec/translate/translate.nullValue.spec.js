describe('resource string is null', function() {
  var resStore = {
    dev: { translation: { key1: null, key2: { key3: null } } },
    en: { translation: { } },            
    'en-US': { translation: { } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, returnObjectTrees: true, fallbackOnNull: false }),
      function(t) { done(); });
  });

  it('it should translate value', function() {
    expect(i18n.t('key1')).to.be(null);
    expect(i18n.t('key2')).to.eql({ key3: null });
  });

  describe('with option fallbackOnNull = true', function() {
    var resStore = {
      dev: { translation: { key1: 'fallbackKey1', key2: { key3: 'fallbackKey3' } } },
      en: { translation: { } },            
      'en-US': { translation: { key1: null, key2: { key3: null } } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnNull: true}),
        function(t) { done(); });
    });

    it('it should translate to fallback value', function() {
      expect(i18n.t('key1')).to.be('fallbackKey1');
      expect(i18n.t('key2.key3')).to.eql('fallbackKey3');
    });

  });


});