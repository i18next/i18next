describe('adding resources after init', function() {

  var resStore = {
    dev: { translation: { 'simple_dev': 'ok_from_dev' } },
    en: { translation: { 'simple_en': 'ok_from_en' } }//,            
    //'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
  };

  describe('resources', function() {

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { 
          i18n.addResource('en-US', 'translation', 'some.deep.thing', 'ok_from_en-US');
          done(); 
        });
    });

    it('it should provide passed in resources for translation', function() {
      expect(i18n.t('some.deep.thing')).to.be('ok_from_en-US');
    });

    describe('multiple resources', function() {

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { 
            i18n.addResources('en-US', 'translation', { 
              'some.other.deep.thing': 'ok_from_en-US_1',
              'some.other.deep.deeper.thing': 'ok_from_en-US_2' 
            });
            done(); 
          });
      });

      it('it should add the new namespace to the namespace array', function() {
        expect(i18n.t('some.other.deep.thing')).to.be('ok_from_en-US_1');
        expect(i18n.t('some.other.deep.deeper.thing')).to.be('ok_from_en-US_2');
      });

    });

  });

  describe('bundles', function() {
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { 
          i18n.addResourceBundle('en-US', 'translation', { 'simple_en-US': 'ok_from_en-US' });
          done(); 
        });
    });

    it('it should provide passed in resources for translation', function() {
      expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
      expect(i18n.t('simple_en')).to.be('ok_from_en');
      expect(i18n.t('simple_dev')).to.be('ok_from_dev');
    });

    describe('with a additional namespace', function() {

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { 
            i18n.addResourceBundle('en-US', 'newNamespace', { 'simple_en-US': 'ok_from_en-US' });
            done(); 
          });
      });

      it('it should add the new namespace to the namespace array', function() {
        expect(i18n.options.ns.namespaces).to.contain('newNamespace');
      });

    });

    describe('with using deep switch', function() {

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { 
            i18n.addResourceBundle('en-US', 'translation', { 'deep': { 'simple_en-US_1': 'ok_from_en-US_1' }});
            i18n.addResourceBundle('en-US', 'translation', { 'deep': { 'simple_en-US_2': 'ok_from_en-US_2' }}, true);
            done(); 
          });
      });

      it('it should add the new namespace to the namespace array', function() {
        expect(i18n.t('deep.simple_en-US_1')).to.be('ok_from_en-US_1');
        expect(i18n.t('deep.simple_en-US_2')).to.be('ok_from_en-US_2');
      });

    });

    describe('check if exists', function() {

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { 
            i18n.addResourceBundle('en-US', 'translation', { 'deep': { 'simple_en-US_1': 'ok_from_en-US_1' }});
            i18n.addResourceBundle('en-US', 'translation', { 'deep': { 'simple_en-US_2': 'ok_from_en-US_2' }}, true);
            done(); 
          });
      });

      it('it should return true for existing bundle', function() {
        expect(i18n.hasResourceBundle('en-US', 'translation')).to.be.ok();
      });

      it('it should return false for non-existing bundle', function() {
        expect(i18n.hasResourceBundle('de-CH', 'translation')).to.not.be.ok();
      });

    });

  });

});