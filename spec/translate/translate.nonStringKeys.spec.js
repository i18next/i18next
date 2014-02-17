describe('keys with non supported values', function() {

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
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });


  it('it should not break on null key', function() {
    expect(i18n.t(null)).to.be('');
  });

  it('it should not break on undefined key', function() {
    expect(i18n.t(undefined)).to.be('');
  });
  
});