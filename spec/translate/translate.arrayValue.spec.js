describe('resource string as array', function() {
  var resStore = {
    dev: { translation: { testarray: ["title", "text"] } },
    en: { translation: { } },            
    'en-US': { translation: { } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should translate nested value', function() {
    expect(i18n.t('testarray')).to.be('title\ntext');
  });
});