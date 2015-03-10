describe('plural usage', function() {

  describe('basic usage - singular and plural form', function() {
    var resStore = {
      dev: { 'ns.2': {                      
            pluralTest: 'singular from ns.2',
            pluralTest_plural: 'plural from ns.2',
            pluralTestWithCount: '__count__ item from ns.2',
            pluralTestWithCount_plural: '__count__ items from ns.2'
        }},
      en: { },            
      'en-US': { 
        'ns.1': {                      
            pluralTest: 'singular',
            pluralTest_plural: 'plural',
            pluralTestWithCount: '__count__ item',
            pluralTestWithCount_plural: '__count__ items'
        } 
      }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore,
          ns: { namespaces: ['ns.1', 'ns.2'], defaultNs: 'ns.1'}
        }),
        function(t) { done(); });
    });

    it('it should provide correct plural or singular form', function() {
      expect(i18n.t('pluralTest', {count: 0})).to.be('plural');
      expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
      expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
      expect(i18n.t('pluralTest', {count: 7})).to.be('plural');

      expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 items');
      expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
      expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
    });

    it('it should provide correct plural or singular form for second namespace', function() {
      expect(i18n.t('ns.2:pluralTest', {count: 0})).to.be('plural from ns.2');
      expect(i18n.t('ns.2:pluralTest', {count: 1})).to.be('singular from ns.2');
      expect(i18n.t('ns.2:pluralTest', {count: 2})).to.be('plural from ns.2');
      expect(i18n.t('ns.2:pluralTest', {count: 7})).to.be('plural from ns.2');

      expect(i18n.t('ns.2:pluralTestWithCount', {count: 1})).to.be('1 item from ns.2');
      expect(i18n.t('ns.2:pluralTestWithCount', {count: 7})).to.be('7 items from ns.2');
    });

  });

  describe('fallback on count with non-plurals', function() {
    var resStore = {
      dev: { 'ns.2': {
            pluralTestWithCount: '__count__ item from ns.2'
        }},
      en: { },            
      'en-US': { 
        'ns.1': {
            pluralTestWithCount: '__count__ item'
        } 
      }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore,
          ns: { namespaces: ['ns.1', 'ns.2'], defaultNs: 'ns.1'}
        }),
        function(t) { done(); });
    });

    it('it should provide correct singular form', function() {
      expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 item');
      expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
      expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 item');
    });

    it('it should provide correct singular form for second namespace', function() {
      expect(i18n.t('ns.2:pluralTestWithCount', {count: 1})).to.be('1 item from ns.2');
      expect(i18n.t('ns.2:pluralTestWithCount', {count: 7})).to.be('7 item from ns.2');
    });

  });

  describe('Plurals with passing lng to translation function', function() {

    var resStore = {
      'nl': {
        'translation': {
            pluralTestWithCount: '__count__ item',
            pluralTestWithCount_plural: '__count__ items'
        } 
      }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
          supportedLngs: ['nl'],
          resStore: resStore
        }),
        function(t) { done(); });
    });

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore
        }),
        function(t) { done(); });
    });
    it('should return the correct string for key', function() {
      var resStore = {
        nl: {
          test: '__count__ items'
        }
      };

      expect(i18n.t('pluralTestWithCount', {count: 12, lng: 'nl'})).to.equal('12 items');
      expect(i18n.t('pluralTestWithCount', {count: 0, lng: 'nl'})).to.equal('0 items');
    });
  });

  describe('basic usage - singular and plural form on fallbacks', function() {
    var resStore = {
      'fr': { 
        'translation': {}
      },
      'en': { 
        'translation': {
            pluralTest: 'singular',
            pluralTest_plural: 'plural',
            pluralTestWithCount: '__count__ item',
            pluralTestWithCount_plural: '__count__ items'
        } 
      }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { 
        resStore: resStore,
        lng: 'fr',
        fallbackLng: 'en'
      }),
      function(t) { done(); });
    });

    it('it should provide correct plural or singular form', function() {
      expect(i18n.t('pluralTest', {count: 0})).to.be('plural');
      expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
      expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
      expect(i18n.t('pluralTest', {count: 7})).to.be('plural');

      expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 items');
      expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
      expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
    });

  });


  describe('basic usage 2 - singular and plural form in french', function() {
    var resStore = {
      dev: { 'ns.2': {                      
            pluralTest: 'singular from ns.2',
            pluralTest_plural: 'plural from ns.2',
            pluralTestWithCount: '__count__ item from ns.2',
            pluralTestWithCount_plural: '__count__ items from ns.2'
        }},
      en: { },            
      'fr': { 
        'ns.1': {                      
            pluralTest: 'singular',
            pluralTest_plural: 'plural',
            pluralTestWithCount: '__count__ item',
            pluralTestWithCount_plural: '__count__ items'
        } 
      }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
          lng: 'fr',
          resStore: resStore,
          ns: { namespaces: ['ns.1', 'ns.2'], defaultNs: 'ns.1'} 
        }),
        function(t) { done(); });
    });

    it('it should provide correct plural or singular form', function() {
      expect(i18n.t('pluralTest', {count: 0})).to.be('singular');
      expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
      expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
      expect(i18n.t('pluralTest', {count: 7})).to.be('plural');

      expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 item');
      expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
      expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
    });
  });

  describe('extended usage - multiple plural forms - ar', function() {
    var resStore = {
        dev: { translation: { } },
        ar: { translation: { 
            key: 'singular',
            key_plural_0: 'zero',
            key_plural_2: 'two',
            key_plural_3: 'few',
            key_plural_11: 'many',
            key_plural_100: 'plural'
          } 
        },            
        'ar-??': { translation: { } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { lng: 'ar', resStore: resStore }),
        function(t) { done(); });
    });

    it('it should provide correct plural forms', function() {
      expect(i18n.t('key', {count: 0})).to.be('zero');
      expect(i18n.t('key', {count: 1})).to.be('singular');
      expect(i18n.t('key', {count: 2})).to.be('two');
      expect(i18n.t('key', {count: 3})).to.be('few');
      expect(i18n.t('key', {count: 4})).to.be('few');
      expect(i18n.t('key', {count: 104})).to.be('few');
      expect(i18n.t('key', {count: 11})).to.be('many');
      expect(i18n.t('key', {count: 99})).to.be('many');
      expect(i18n.t('key', {count: 199})).to.be('many');
      expect(i18n.t('key', {count: 100})).to.be('plural');
    });
  });

  describe('extended usage - multiple plural forms - ru', function() {
    var resStore = {
        dev: { translation: { } },
        ru: { translation: { 
            key: '1,21,31',
            key_plural_2: '2,3,4',
            key_plural_5: '0,5,6'
          } 
        },            
        'ru-??': { translation: { } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { lng: 'ru', resStore: resStore }),
        function(t) { done(); });
    });

    it('it should provide correct plural forms', function() {
      expect(i18n.t('key', {count: 0})).to.be('0,5,6');
      expect(i18n.t('key', {count: 1})).to.be('1,21,31');
      expect(i18n.t('key', {count: 2})).to.be('2,3,4');
      expect(i18n.t('key', {count: 3})).to.be('2,3,4');
      expect(i18n.t('key', {count: 4})).to.be('2,3,4');
      expect(i18n.t('key', {count: 104})).to.be('2,3,4');
      expect(i18n.t('key', {count: 11})).to.be('0,5,6');
      expect(i18n.t('key', {count: 24})).to.be('2,3,4');
      expect(i18n.t('key', {count: 25})).to.be('0,5,6');
      expect(i18n.t('key', {count: 99})).to.be('0,5,6');
      expect(i18n.t('key', {count: 199})).to.be('0,5,6');
      expect(i18n.t('key', {count: 100})).to.be('0,5,6');
    });
  });

  describe('extended usage - ask for a key in a language with a different plural form', function() {
    var resStore = {
        en: { translation: {
            key:'singular_en',
            key_plural:'plural_en'
          } 
        },
        zh: { translation: { 
            key: 'singular_zh'
          }
        }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { lng: 'zh', resStore: resStore }),
        function(t) { done(); });
    });

    it('it should provide translation for passed in language with 1 item', function() {
      expect(i18n.t('key', { lng: 'en', count:1 })).to.be('singular_en');
    });

    it('it should provide translation for passed in language with 2 items', function() {
      expect(i18n.t('key', { lng: 'en', count:2 })).to.be('plural_en');
    });
  });

});