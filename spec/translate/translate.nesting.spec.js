describe('resource nesting', function() {
  var resStore = {
    dev: { translation: { nesting1: '1 $t(nesting2)' } },
    en: { translation: { nesting2: '2 $t(nesting3)' } },            
    'en-US': { translation: {  nesting3: '3' } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should translate nested value', function() {
    expect(i18n.t('nesting1')).to.be('1 2 3');
  });

  it('it should apply nested value on defaultValue', function() {
    expect(i18n.t('nesting_default', {defaultValue: '0 $t(nesting1)'})).to.be('0 1 2 3');
  });

  describe('resource nesting syntax error', function() {
    var resStore = {
      dev: { translation: { nesting1: '1 $t(nesting2' } },
      en: { translation: { nesting2: '2 $t(nesting3)' } },
      'en-US': { translation: {  nesting3: '3' } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should translate nested value', function() {
      expect(i18n.t('nesting1')).to.be('');
    });

  });

  describe('with setting new options', function() {
    var resStore = {
      dev: { translation: { 
        nesting1: '$t(nesting2, {"count": __girls__}) and __count__ boy',
        nesting1_plural: '$t(nesting2, {"count": __girls__}) and __count__ boys' 
      } },
      en: { translation: {
        nesting2: '__count__ girl',
        nesting2_plural: '__count__ girls' 
      } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should translate nested value and set new options', function() {
      expect(i18n.t('nesting1', {count: 2, girls: 3})).to.be('3 girls and 2 boys');
      expect(i18n.t('nesting1', {count: 1, girls: 3})).to.be('3 girls and 1 boy');
    });
  });

});