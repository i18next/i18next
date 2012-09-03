describe('translation functionality', function() {

  describe('resource string as array', function() {
    var resStore = {
      dev: { translation: { testarray: ["title", "text"] } },
      en: { translation: { } },            
      'en-US': { translation: { } }
    };
    
    beforeEach(function(done) {
      i18n.init( $.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should translate nested value', function() {
      expect(i18n.t('testarray')).to.be('title\ntext');
    });
  });

  describe('accessing nested values', function() {

    beforeEach(function(done) {
      i18n.init(opts, function(t) { done(); } );
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
          i18n.init( $.extend(opts, { 
            returnObjectTrees: true,
            resStore: resStore }
            ), function(t) { done(); });
        });

        it('it should return objectTree applying options', function() {
          expect(i18n.t('test', { replace: 'two' })).to.eql({ 'res': 'added two' });
        });

      });

      describe('with flag in options', function() {

        beforeEach(function(done) {
          i18n.init($.extend(opts, { returnObjectTrees: false }),
            function(t) { done(); } );
        });

        it('it should return objectTree', function() {
          expect(i18n.t('test', { returnObjectTrees: true })).to.eql({ 'simple_en-US': 'ok_from_en-US' });
        });

      });

    });

  });

  describe('resource nesting', function() {
    var resStore = {
      dev: { translation: { nesting1: '1 $t(nesting2)' } },
      en: { translation: { nesting2: '2 $t(nesting3)' } },            
      'en-US': { translation: {  nesting3: '3' } }
    };
    
    beforeEach(function(done) {
      i18n.init( $.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should translate nested value', function() {
      expect(i18n.t('nesting1')).to.be('1 2 3');
    });

    it('it should apply nested value on defaultValue', function() {
      expect(i18n.t('nesting_default', {defaultValue: '0 $t(nesting1)'})).to.be('0 1 2 3');
    });
  });

  describe('interpolation - replacing values inside a string', function() {

    describe('default i18next way', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added __toAdd__',
            interpolationTest2: 'added __toAdd__ __toAdd__ twice',
            interpolationTest3: 'added __child.one__ __child.two__'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
        expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
      });

      it('it should replace passed in key/values on defaultValue', function() {
        expect(i18n.t('interpolationTest4', {defaultValue: 'added __toAdd__', toAdd: 'something'})).to.be('added something');
      });

    });

    describe('using sprintf', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'The first 4 letters of the english alphabet are: %s, %s, %s and %s',
            interpolationTest2: 'Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {postProcess: 'sprintf', sprintf: ['a', 'b', 'c', 'd']})).to.be('The first 4 letters of the english alphabet are: a, b, c and d');
        expect(i18n.t('interpolationTest2', {postProcess: 'sprintf', sprintf: { users: [{name: 'Dolly'}, {name: 'Molly'}, {name: 'Polly'}] } })).to.be('Hello Dolly, Molly and Polly');
      });
      
    });

  });

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
        i18n.init( $.extend(opts, { 
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

    describe('extended usage - multiple plural forms', function() {
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
        i18n.init( $.extend(opts, { lng: 'ar', resStore: resStore }),
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

  });

  describe('context usage', function() {

    describe('basic usage', function() {
      var resStore = {
          dev: { 'ns.2': { 
              friend_context: 'A friend from ns2',
              friend_context_male: 'A boyfriend from ns2',
              friend_context_female: 'A girlfriend from ns2'
            }
          },
          en: { 'ns.1': { 
              friend_context: 'A friend',
              friend_context_male: 'A boyfriend',
              friend_context_female: 'A girlfriend'
            } 
          },            
          'en-US': { translation: { } }
      };

      beforeEach(function(done) {
        i18n.init( $.extend(opts, { 
            resStore: resStore, 
            ns: { namespaces: ['ns.1', 'ns.2'], defaultNs: 'ns.1'} 
          }),
          function(t) { done(); });
      });

      it('it should provide correct context form', function() {
        expect(i18n.t('friend_context')).to.be('A friend');
        expect(i18n.t('friend_context', {context: ''})).to.be('A friend');
        expect(i18n.t('friend_context', {context: 'male'})).to.be('A boyfriend');
        expect(i18n.t('friend_context', {context: 'female'})).to.be('A girlfriend');
      });

      it('it should provide correct context form for second namespace', function() {
        expect(i18n.t('ns.2:friend_context')).to.be('A friend from ns2');
        expect(i18n.t('ns.2:friend_context', {context: ''})).to.be('A friend from ns2');
        expect(i18n.t('ns.2:friend_context', {context: 'male'})).to.be('A boyfriend from ns2');
        expect(i18n.t('ns.2:friend_context', {context: 'female'})).to.be('A girlfriend from ns2');
      });
    });

    describe('extended usage - in combination with plurals', function() {
      var resStore = {
          dev: { translation: { } },
          en: { translation: { 
              friend_context: '__count__ friend',
              friend_context_male: '__count__ boyfriend',
              friend_context_female: '__count__ girlfriend',
              friend_context_plural: '__count__ friends',
              friend_context_male_plural: '__count__ boyfriends',
              friend_context_female_plural: '__count__ girlfriends'
            } 
          },            
          'en-US': { translation: { } }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should provide correct context with plural forms', function() {
        expect(i18n.t('friend_context', { count: 1 })).to.be('1 friend');
        expect(i18n.t('friend_context', {context: '', count: 1 })).to.be('1 friend');
        expect(i18n.t('friend_context', {context: 'male', count: 1 })).to.be('1 boyfriend');
        expect(i18n.t('friend_context', {context: 'female', count: 1 })).to.be('1 girlfriend');
        
        expect(i18n.t('friend_context', { count: 10 })).to.be('10 friends');
        expect(i18n.t('friend_context', {context: '', count: 10 })).to.be('10 friends');
        expect(i18n.t('friend_context', {context: 'male', count: 10 })).to.be('10 boyfriends');
        expect(i18n.t('friend_context', {context: 'female', count: 10 })).to.be('10 girlfriends');
      });

    });

  });

  describe('with passed in languages different from set one', function() {

    beforeEach(function(done) {
      i18n.init($.extend(opts, { 
          preload: ['de-DE'] }),
        function(t) { done(); });
    });

    it('it should provide translation for passed in language', function() {
      expect(i18n.t('simple_de', { lng: 'de-DE' })).to.be('ok_from_de');
    });

    describe('with language not preloaded', function() {

      it('it should provide translation for passed in language after loading file sync', function() {
        expect(i18n.t('simple_fr', { lng: 'fr' })).to.be('ok_from_fr');
      });

    });

  });

});