describe('using sprintf', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        test: 'hi'
      } 
    }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore, shortcutFunction: 'defaultValue' }),
      function(t) { done(); });
  });


  it('it should recognize the defaultValue syntax set as shortcutFunction', function() {
    expect(i18n.t('notFound', 'second param defaultValue')).to.be('second param defaultValue');
  });
  
});