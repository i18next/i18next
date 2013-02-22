describe('accessing tree values', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        test: { 'simple_en-US': 'ok_from_en-US' }
      } 
    }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
      resStore: resStore }
    ), function(t) { done(); });
  });

  it('it should return nested string', function() {
    expect(i18n.t('test.simple_en-US')).to.be('ok_from_en-US');
  });

  it('it should not fail silently on accessing a objectTree', function() {
    expect(i18n.t('test')).to.be('key \'translation:test (en-US)\' returned a object instead of string.');
  });

  describe('optional return an objectTree for UI components,...', function() {

    describe('with init flag', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            test: { res: 'added __replace__' }
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          returnObjectTrees: true,
          resStore: resStore }
          ), function(t) { done(); });
      });

      it('it should return objectTree applying options', function() {
        expect(i18n.t('test', { replace: 'two' })).to.eql({ 'res': 'added two' });
        expect(i18n.t('test', { replace: 'three' })).to.eql({ 'res': 'added three' });
        expect(i18n.t('test', { replace: 'four' })).to.eql({ 'res': 'added four' });
      });

    });

    describe('with flag in options', function() {
      
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            test: { res: 'added __replace__' }
          } 
        }
      };

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          returnObjectTrees: false,
          resStore: resStore }),
          function(t) { done(); } );
      });

      it('it should return objectTree', function() {
        expect(i18n.t('test', { returnObjectTrees: true, replace: 'two' })).to.eql({ 'res': 'added two' });
        expect(i18n.t('test', { returnObjectTrees: true, replace: 'three' })).to.eql({ 'res': 'added three' });
        expect(i18n.t('test', { returnObjectTrees: true, replace: 'four' })).to.eql({ 'res': 'added four' });
      });

    });

  });

});