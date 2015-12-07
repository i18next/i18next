// i18next, v1.11.2
// Copyright (c)2015 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
var i18n = require('../index')
  , expect = require('expect.js')
  , sinon = require('sinon');

describe('i18next.translate', function() {

  var opts;

  beforeEach(function() {
    opts = {
      lng: 'en-US',
      fallbackLng: 'dev',
      fallbackNS: [],
      fallbackToDefaultNS: false,
      fallbackOnNull: true,
      fallbackOnEmpty: false,
      load: 'all',
      preload: [],
      supportedLngs: [],
      lowerCaseLng: false,
      ns: 'translation',
      resGetPath: 'test/locales/__lng__/__ns__.json',
      resSetPath: 'test/locales/__lng__/new.__ns__.json',
      saveMissing: false,
      resStore: false,
      returnObjectTrees: false,
      interpolationPrefix: '__',
      interpolationSuffix: '__',
      postProcess: '',
      parseMissingKey: '',
      debug: false,
      objectTreeKeyHandler: null,
      lngWhitelist: null
    };
  });

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
  
    it('it should stringify first on number key', function() {
      expect(i18n.t(1)).to.be(i18n.t('1'));
      expect(i18n.t(1.1)).to.be(i18n.t('1.1'));
    });   
    
  });

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

  describe('resource string is null', function() {
    var resStore = {
      dev: { translation: { key1: null, key2: { key3: null } } },
      en: { translation: { } },            
      'en-US': { translation: { } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, returnObjectTrees: true, fallbackOnNull: false }),
        function(t) { done(); });
    });
  
    it('it should translate value', function() {
      expect(i18n.t('key1')).to.be(null);
      expect(i18n.t('key2')).to.eql({ key3: null });
    });
  
    describe('with option fallbackOnNull = true', function() {
      var resStore = {
        dev: { translation: { key1: 'fallbackKey1', key2: { key3: 'fallbackKey3' } } },
        en: { translation: { } },            
        'en-US': { translation: { key1: null, key2: { key3: null } } }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnNull: true}),
          function(t) { done(); });
      });
  
      it('it should translate to fallback value', function() {
        expect(i18n.t('key1')).to.be('fallbackKey1');
        expect(i18n.t('key2.key3')).to.eql('fallbackKey3');
      });
  
    });
  
  
  });

  describe('key with empty string value as valid option', function() {
    var resStore = {
      dev: { translation: { empty: '' } },
      en: { translation: { } },
      'en-US': { translation: { } }
    };
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { done(); });
    });
  
    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('');
    });
  
    describe('missing on unspecific', function() {
      var resStore = {
        dev: { translation: { empty: 'text' } },
        en: { translation: { } },
        'en-US': { translation: { empty: '' } }
      };
  
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en' }),
            function(t) { done(); });
      });
  
      it('it should translate correctly', function() {
        expect(i18n.t('empty')).to.be('text');
      });
    });
  
    describe('on specific language', function() {
      var resStore = {
        dev: { translation: { empty: 'text' } },
        en: { translation: { } },
        'en-US': { translation: { empty: '' } }
      };
  
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) { done(); });
      });
  
      it('it should translate correctly', function() {
        expect(i18n.t('empty')).to.be('');
      });
    });
  });
  
  describe('key with empty string set to fallback if empty', function() {
    var resStore = {
      dev: { translation: { empty: '' } },
      en: { translation: { } },
      'en-US': { translation: { } }
    };
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnEmpty: true }),
          function(t) { done(); });
    });
  
    it('it should translate correctly', function() {
      expect(i18n.t('empty')).to.be('empty');
    });
  
    describe('missing on unspecific', function() {
      var resStore = {
        dev: { translation: { empty: 'text' } },
        en: { translation: { } },
        'en-US': { translation: { empty: '' } }
      };
  
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en', fallbackOnEmpty: true }),
            function(t) { done(); });
      });
  
      it('it should translate correctly', function() {
        expect(i18n.t('empty')).to.be('text');
      });
    });
  
    describe('on specific language', function() {
      var resStore = {
        dev: { translation: { empty: 'text' } },
        en: { translation: { } },
        'en-US': { translation: { empty: '' } }
      };
  
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackOnEmpty: true }),
            function(t) { done(); });
      });
  
      it('it should translate correctly', function() {
        expect(i18n.t('empty')).to.be('text');
      });
    });
  });

  describe('resource key as array', function() {
    var resStore = {
      dev: { translation: { existing1: 'hello _name_', existing2: 'howdy __name__' } },
      en: { translation: { } },
      'en-US': { translation: { } }
    };
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });
  
    describe('when none of the keys exist', function() {
      it('return the same value as translating the last non-existent key', function() {
        expect(i18n.t(['nonexistent1', 'nonexistent2'], {name: "Joe"})).to.equal(i18n.t('nonexistent2', {name: "Joe"}));
      });
    });
  
    describe('when one of the keys exist', function() {
      it('return the same value as translating the one existing key', function() {
        expect(i18n.t(['nonexistent1', 'existing2'], {name: "Joe"})).to.equal(i18n.t('existing2', {name: "Joe"}));
      });
    });
  
    describe('when two or more of the keys exist', function() {
      it('return the same value as translating the first existing key', function() {
        expect(i18n.t(['nonexistent1', 'existing2', 'existing1'], {name: "Joe"})).to.equal(i18n.t('existing2', {name: "Joe"}));
      });
    });
  });

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
  
  describe('resource nesting with multiple namespaces and fallbackNS', function() {
    var resStore = {
      dev: { translation1: { nesting1: '1 $t(nesting2)' } },
      en: { translation: { nesting2: '2 $t(nesting3)' } },
      'en-US': { translation: {  nesting3: '3' } }
    };
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
        resStore: resStore,
        ns: { namespaces: ['translation1', 'translation'], defaultNs: 'translation1'},
        fallbackNS: ['translation']
      }), function(t) { done(); });
    });
  
    it('it should translate nested value', function() {
      expect(i18n.t('translation1:nesting1')).to.be('1 2 3');
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
            interpolationTest3: 'added __child.one__ __child.two__',
            interpolationTest4: 'added __child.grandChild.three__'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });
    
      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
        expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
        expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}})).to.be('added 3');
      });
    
      it('it should replace passed in key/values in replace member', function() {
        expect(i18n.t('interpolationTest1', { replace: {toAdd: 'something'} })).to.be('added something');
        expect(i18n.t('interpolationTest2', { replace: {toAdd: 'something'} })).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { replace: { child: { one: '1', two: '2'}} })).to.be('added 1 2');
        expect(i18n.t('interpolationTest4', { replace: { child: { grandChild: { three: '3'}}} })).to.be('added 3');
      });
    
      it("it should not escape HTML", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '<html>'})).to.be('added <html>');
      });
    
      it('it should replace passed in key/values on defaultValue', function() {
        expect(i18n.t('interpolationTest5', {defaultValue: 'added __toAdd__', toAdd: 'something'})).to.be('added something');
      });
    
      it("it should escape dollar signs in replacement values", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&');
      });
    
    });
    
    describe('default i18next way - different prefix/suffix', function() {
    
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added *toAdd*',
            interpolationTest2: 'added *toAdd* *toAdd* twice',
            interpolationTest3: 'added *child.one* *child.two*',
            interpolationTest4: 'added *child.grandChild.three*'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore,
          interpolationPrefix: '*',
          interpolationSuffix: '*'
        }), function(t) { done(); });
      });
    
      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
        expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
        expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}})).to.be('added 3');
      });
    
      it('it should replace passed in key/values on defaultValue', function() {
        expect(i18n.t('interpolationTest5', {defaultValue: 'added *toAdd*', toAdd: 'something'})).to.be('added something');
      });
    
    });
    
    describe('default i18next way - different prefix/suffix via options', function() {
    
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added *toAdd*',
            interpolationTest2: 'added *toAdd* *toAdd* twice',
            interpolationTest3: 'added *child.one* *child.two*',
            interpolationTest4: 'added *child.grandChild.three*',
            interpolationTest5: 'added *count*',
            interpolationTest5_plural: 'added *count*'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore
        }), function(t) { done(); });
      });
    
      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something');
        expect(i18n.t('interpolationTest2', {toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 1 2');
        expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 3');
        expect(i18n.t('interpolationTest5', { count: 3, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 3');
      });
    
      it('it should replace passed in key/values on defaultValue', function() {
        expect(i18n.t('interpolationTest6', {defaultValue: 'added *toAdd*', toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something');
      });
    
    });
    
    describe('default i18next way - with escaping interpolated arguments per default', function () {
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added __toAdd__',
            interpolationTest5: 'added __toAddHTML__',
            interpolationTest6: 'added __child.oneHTML__',
            interpolationTest7: 'added __toAddHTML__ __toAdd__',
            interpolationTest8: 'added __toAdd1__ __toAdd2__',
          } 
        }
      };
    
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore,
          escapeInterpolation: true
        }), function(t) { done(); });
      });
    
      it("it should escape HTML", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '<html>'})).to.be('added &lt;html&gt;');
      });
    
      it("it should not escape when HTML is suffixed", function() {
        expect(i18n.t('interpolationTest5', {toAdd: '<html>'})).to.be('added <html>');
        expect(i18n.t('interpolationTest6', { child: { one: '<1>'}})).to.be('added <1>');
      });
    
      it("should not accept interpolations from inside interpolations", function() {
          expect(i18n.t('interpolationTest8', { toAdd1: '__toAdd2HTML__', toAdd2: '<html>'})).to.be('added __toAdd2HTML__ &lt;html&gt;');
      });
    
      it("it should support both escaping and not escaping HTML", function() {
        expect(i18n.t('interpolationTest7', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html> &lt;html&gt;');
      });
    
      it("it should escape dollar signs in replacement values", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&amp;');
      });
    
    });
    
    describe('default i18next way - with escaping interpolated arguments per default via options', function () {
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added __toAdd__',
            interpolationTest5: 'added __toAddHTML__',
            interpolationTest6: 'added __child.oneHTML__',
            interpolationTest7: 'added __toAddHTML__ __toAdd__'
          } 
        }
      };
    
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore
        }), function(t) { done(); });
      });
    
      it("it should escape HTML", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '<html>', escapeInterpolation: true})).to.be('added &lt;html&gt;');
      });
    
      it("it should not escape when HTML is suffixed", function() {
        expect(i18n.t('interpolationTest5', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html>');
        expect(i18n.t('interpolationTest6', { child: { one: '<1>', escapeInterpolation: true}})).to.be('added <1>');
      });
    
      it("it should support both escaping and not escaping HTML", function() {
        expect(i18n.t('interpolationTest7', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html> &lt;html&gt;');
      });
    
      it("it should escape dollar signs in replacement values", function() {
        expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&amp;');
      });
    
    });

    describe('using sprintf', function() {
    
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'The first 4 letters of the english alphabet are: %s, %s, %s and %s',
            interpolationTest2: 'Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s',
            interpolationTest3: 'The last letter of the english alphabet is %s',
            interpolationTest4: 'Water freezes at %d degrees'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });
    
      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {postProcess: 'sprintf', sprintf: ['a', 'b', 'c', 'd']})).to.be('The first 4 letters of the english alphabet are: a, b, c and d');
        expect(i18n.t('interpolationTest2', {postProcess: 'sprintf', sprintf: { users: [{name: 'Dolly'}, {name: 'Molly'}, {name: 'Polly'}] } })).to.be('Hello Dolly, Molly and Polly');
      });
    
      it('it should recognize the sprintf syntax and automatically add the sprintf processor', function() {
        expect(i18n.t('interpolationTest1', 'a', 'b', 'c', 'd')).to.be('The first 4 letters of the english alphabet are: a, b, c and d');
        expect(i18n.t('interpolationTest3', 'z')).to.be('The last letter of the english alphabet is z');
        expect(i18n.t('interpolationTest4', 0)).to.be('Water freezes at 0 degrees');
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
        i18n.init(i18n.functions.extend(opts, { 
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
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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
      i18n.init(i18n.functions.extend(opts, { 
          preload: ['de-DE'] }),
        function(t) { done(); });
    });
  
    it('it should provide translation for passed in language', function() {
      expect(i18n.t('simple_de', { lng: 'de-DE' })).to.be('ok_from_de');
    });
  
    describe('with language not preloaded', function() {
  
      it('it should provide translation for passed in language after loading file sync', function() {
        var expectedValue = i18n.clientVersion ? 'simple_fr' : 'ok_from_fr';
        expect(i18n.t('simple_fr', { lng: 'fr' })).to.be(expectedValue);
      });
  
    });
  
  });

});