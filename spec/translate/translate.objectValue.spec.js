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

  it('it should return nested string as usual', function() {
    expect(i18n.t('test.simple_en-US')).to.be('ok_from_en-US');
  });

  it('it should not fail silently on accessing an objectTree', function() {
    expect(i18n.t('test')).to.be('key \'translation:test (en-US)\' returned an object instead of string.');
  });

  describe('optional return an objectTree for UI components,...', function() {

    describe('with init flag', function() {

      var resStore = {
        dev: { translation: {
            test_dev: { res_dev: 'added __replace__' }
          } 
        },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            test_en_US: { res_en_US: 'added __replace__' }
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
        expect(i18n.t('test_en_US', { replace: 'two' })).to.eql({ 'res_en_US': 'added two' });
        expect(i18n.t('test_en_US', { replace: 'three' })).to.eql({ 'res_en_US': 'added three' });
        expect(i18n.t('test_en_US', { replace: 'four' })).to.eql({ 'res_en_US': 'added four' });

        // from fallback
        expect(i18n.t('test_dev', { replace: 'two' })).to.eql({ 'res_dev': 'added two' });
      });

    });

    describe('with flag in options', function() {
      
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            test: { res: 'added __replace__',
                    id: 0,
                    regex: /test/,
                    func: function () {},
                    template: '4',
                    title: 'About...',
                    text: 'Site description',
                    media: ['test'] 
            }
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
        expect(i18n.t('test', { returnObjectTrees: true, replace: 'two' })).to.eql({ 
          res: 'added two',
          id: 0,
          regex: resStore['en-US'].translation.test.regex,
          func: resStore['en-US'].translation.test.func,
          template: '4',
          title: 'About...',
          text: 'Site description',
          media: ['test']
        });
        //expect(i18n.t('test', { returnObjectTrees: true, replace: 'three' })).to.eql({ 'res': 'added three' });
        //expect(i18n.t('test', { returnObjectTrees: true, replace: 'four' })).to.eql({ 'res': 'added four' });
      });

    });

  });

});