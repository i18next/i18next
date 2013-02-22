describe('resource string is null', function() {
  var resStore = {
    dev: { translation: { key1: null, key2: { key3: null } } },
    en: { translation: { } },            
    'en-US': { translation: { } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, returnObjectTrees: true }),
      function(t) { done(); });
  });

  it('it should translate value', function() {
    expect(i18n.t('key1')).to.be(null);
    expect(i18n.t('key2')).to.eql({ key3: null });
  });
});