describe('resource is missing', function() {
  var resStore = {
    dev: { translation: { } },
    en: { translation: { } },            
    'en-US': { translation: { } }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should return key', function() {
    expect(i18n.t('missing')).to.be('missing');
  });

  it('it should return default value if set', function() {
    expect(i18n.t('missing', { defaultValue: 'defaultOfMissing'})).to.be('defaultOfMissing');
  });

  describe('with namespaces', function() {

    it('it should return key', function() {
      expect(i18n.t('translate:missing')).to.be('translate:missing');
    });

    it('it should return default value if set', function() {
      expect(i18n.t('translate:missing', { defaultValue: 'defaultOfMissing'})).to.be('defaultOfMissing');
    });

    describe('and function parseMissingKey set', function() {
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          parseMissingKey: function(key) {
            var ret = key;

            if (ret.indexOf(':')) {
               ret = ret.substring(ret.lastIndexOf(':')+1, ret.length);
            }

            if (ret.indexOf('.')) {
              ret = ret.substring(ret.lastIndexOf('.')+1, ret.length);
            }

            return ret;
          } 
        }), function(t) { done(); });
      });

      it('it should parse key', function() {
        expect(i18n.t('translate:missing')).to.be('missing');
        expect(i18n.t('translate:somenesting.missing')).to.be('missing');
      });

      it('it should return default value if set', function() {
        expect(i18n.t('translate:missing', { defaultValue: 'defaultOfMissing'})).to.be('defaultOfMissing');
      });

    });

  });

});