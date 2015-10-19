// i18next, v1.10.3
// Copyright (c)2015 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
describe('i18next', function() {

  var i18n = $.i18n
    , opts;

  beforeEach(function() {
    opts = {
      lng: 'en-US',
      load: 'all',
      fallbackLng: 'dev',
      fallbackNS: [],
      fallbackOnNull: true,
      fallbackOnEmpty: false,
      preload: [],
      lowerCaseLng: false,
      ns: 'translation',
      fallbackToDefaultNS: false,
      resGetPath: 'locales/__lng__/__ns__.json',
      dynamicLoad: false,
      useLocalStorage: false,
      sendMissing: false,
      resStore: false,
      getAsync: true,
      returnObjectTrees: false,
      debug: false,
      selectorAttr: 'data-i18n',
      postProcess: '',
      parseMissingKey: '',
      interpolationPrefix: '__',
      interpolationSuffix: '__',
      defaultVariables: false,
      shortcutFunction: 'sprintf',
      objectTreeKeyHandler: null,
      lngWhitelist: null
    };
  });

  
  describe('Initialisation', function() {
  
    describe('with passed in resource set', function() {
    
      var resStore = {
        dev: { translation: { 'simple_dev': 'ok_from_dev' } },
        en: { translation: { 'simple_en': 'ok_from_en' } },            
        'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });
    
      it('it should provide passed in resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_dev');
      });
    
    });
    
    describe('loading from server', function() {
    
      describe('with static route', function() {
    
        beforeEach(function(done) {
          i18n.init(opts, function(t) { done(); });
        });
    
        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });
    
      });
    
      describe('with dynamic route', function() {
    
        beforeEach(function(done) {
    
          var res = {
            dev: { translation: { 'simple_dev': 'ok_from_dev' } },
            en: { translation: { 'simple_en': 'ok_from_en' } },
            'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
          };
    
          var server = sinon.fakeServer.create();
          server.autoRespond = true;
    
          server.respondWith([200, { "Content-Type": "application/json" }, JSON.stringify(res)]);
    
          i18n.init(i18n.functions.extend(opts, { 
              resGetPath: 'locales/resources.json?lng=__lng__&ns=__ns__',
              dynamicLoad: true }),
            function(t) { server.restore(); done(); });
        });
    
        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });
    
      });
    
    });
  
    describe('advanced initialisation options', function() {
  
      describe('setting fallbackLng', function() {
      
        var resStore = {
          dev1: { translation: { 'simple_dev1': 'ok_from_dev1' } },
          en: { translation: { 'simple_en': 'ok_from_en' } },
          'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackLng: 'dev1' }),
            function(t) { done(); });
        });
      
        it('it should provide passed in resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev1')).to.be('ok_from_dev1');
        });
      
      });
      
      describe('multiple fallbackLng', function() {
      
        var resStore = {
          dev1: { translation: { 'simple_dev1': 'ok_from_dev1', 'simple_dev': 'ok_from_dev1' } },
          dev2: { translation: { 'simple_dev2': 'ok_from_dev2', 'simple_dev': 'ok_from_dev2' } },
          en: { translation: { 'simple_en': 'ok_from_en' } },
          'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore, fallbackLng: ['dev1', 'dev2'] }),
            function(t) { done(); });
        });
      
        it('it should provide passed in resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          // in one
          expect(i18n.t('simple_dev1')).to.be('ok_from_dev1');
          expect(i18n.t('simple_dev2')).to.be('ok_from_dev2');
          // in both
          expect(i18n.t('simple_dev')).to.be('ok_from_dev1');
        });
      
      });
  
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
  
      describe('getting resources after init', function() {
      
        var resStore = {
          dev: { translation: { 'test': 'ok_from_dev' } },
          en: { translation: { 'test': 'ok_from_en' } },            
          'en-US': { translation: { 'test': 'ok_from_en-US' } }
        };
      
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }), function() {
              done();
          });
        });
      
        it('it should return resources for existing bundle', function() {
          var devTranslation = i18n.getResourceBundle('dev', 'translation');
          var enTranslation = i18n.getResourceBundle('en', 'translation');
          var enUSTranslation = i18n.getResourceBundle('en-US', 'translation');
          expect(devTranslation.test).to.be('ok_from_dev');
          expect(enTranslation.test).to.be('ok_from_en');
          expect(enUSTranslation.test).to.be('ok_from_en-US');
        });
      
        it('it should return empty object for non-existing bundle', function() {
          var nonExisting = i18n.getResourceBundle('en-GB', 'translation');
          expect(Object.keys(nonExisting).length).to.be(0);
        });
      
        it('it should use default namespace when namespace argument is left out', function() {
          var enTranslation = i18n.getResourceBundle('en');
          expect(enTranslation.test).to.be('ok_from_en');
        });
      
        it('it should return a clone of the resources', function() {
          var enTranslation = i18n.getResourceBundle('en');
          enTranslation.test = 'ok_from_en_changed';
          expect(enTranslation.test).to.be('ok_from_en_changed');
          expect(resStore.en.translation.test).to.be('ok_from_en');
        });
      
      });
  
      describe('removing resources after init', function() {
      
        var resStore = {
          dev: { translation: { 'test': 'ok_from_dev' } },
          en: { translation: { 'test': 'ok_from_en' } },            
          'en-US': { translation: { 'test': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) { 
              i18n.removeResourceBundle('en-US', 'translation');
              done(); 
            });
        });
      
        it('it should remove resources', function() {
          expect(i18n.t('test')).to.be('ok_from_en');
        });
      
      });
  
      describe('setting load', function() {
      
        describe('to current', function() {
      
          var spy; 
      
          beforeEach(function(done) {
            spy = sinon.spy(i18n.sync, '_fetchOne');
            i18n.init(i18n.functions.extend(opts, { 
                load: 'current' }),
              function(t) { done(); });
          });
      
          afterEach(function() {
            spy.restore();
          });
      
          it('it should load only current and fallback language', function() {
            expect(spy.callCount).to.be(2); // en-US, en
          });
      
          it('it should provide loaded resources for translation', function() {
            expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
            expect(i18n.t('simple_en')).not.to.be('ok_from_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_dev');
          });
      
        });
      
        describe('to unspecific', function() {
      
          var spy; 
      
          beforeEach(function(done) {
            spy = sinon.spy(i18n.sync, '_fetchOne');
            i18n.init(i18n.functions.extend(opts, { 
                load: 'unspecific' }),
              function(t) { done(); });
          });
      
          afterEach(function() {
            spy.restore();
          });
      
          it('it should load only unspecific and fallback language', function() {
            expect(spy.callCount).to.be(2); // en-US, en
          });
      
          it('it should provide loaded resources for translation', function() {
            expect(i18n.t('simple_en-US')).not.to.be('ok_from_en-US');
            expect(i18n.t('simple_en')).to.be('ok_from_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_dev');
          });
      
          it('it should return unspecific language', function() {
            expect(i18n.lng()).to.be('en');
          });
      
        });
      
      });
      
      describe('with fallback language set to false', function() {
      
        var spy; 
      
        beforeEach(function(done) {
          spy = sinon.spy(i18n.sync, '_fetchOne');
          i18n.init(i18n.functions.extend(opts, { 
              fallbackLng: false }),
            function(t) { done(); });
        });
      
        afterEach(function() {
          spy.restore();
        });
      
        it('it should load only specific and unspecific languages', function() {
          expect(spy.callCount).to.be(2); // en-US, en
        });
      
        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).not.to.be('ok_from_dev');
        });
      
      });
  
      describe('preloading multiple languages', function() {
      
        var spy; 
      
        beforeEach(function(done) {
          spy = sinon.spy(i18n.sync, '_fetchOne');
          i18n.init(i18n.functions.extend(opts, { 
              preload: ['fr', 'de-DE'] }),
            function(t) { done(); });
        });
      
        afterEach(function() {
          spy.restore();
        });
      
        it('it should load additional languages', function() {
          expect(spy.callCount).to.be(6); // en-US, en, de-DE, de, fr, dev
        });
      
        describe('changing the language', function() {
      
          beforeEach(function(done) {
            spy.reset();
            if (i18n.sync.resStore) i18n.sync.resStore = {}; // to reset for test on server!
            i18n.setLng('de-DE',
              function(t) { done(); });
          });
      
          it('it should reload the preloaded languages', function() {
            expect(spy.callCount).to.be(4); // de-DE, de, fr, dev
          });
      
        });
      
      });
  
      describe('with synchronous flag', function() {
      
        beforeEach(function() {
          i18n.init(i18n.functions.extend(opts, { getAsync: false }) );
        });
      
        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });
      
      });
  
      describe('with namespace', function() {
      
        describe('with one namespace set', function() {
      
          beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, { ns: 'ns.special'} ),
              function(t) { done(); });
          });
      
          it('it should provide loaded resources for translation', function() {
            expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
            expect(i18n.t('simple_en')).to.be('ok_from_special_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');
          });
      
        });
      
        describe('with more than one namespace set', function() {
      
          beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, { ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
              function(t) { done(); });
          });
      
          it('it should provide loaded resources for translation', function() {
            // default ns
            expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
            expect(i18n.t('simple_en')).to.be('ok_from_special_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');
      
            // ns prefix
            expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_common_en-US');
            expect(i18n.t('ns.common:simple_en')).to.be('ok_from_common_en');
            expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_common_dev');
      
            // ns in options
            expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_common_en-US');
            expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_common_en');
            expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_common_dev');
          });
      
          describe('and fallbacking to default namespace', function() {
            var resStore = {
              dev: { 'ns.special': { 'simple_dev': 'ok_from_dev' } },
              en: { 'ns.special': { 'simple_en': 'ok_from_en' } },
              'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
            };
      
            beforeEach(function(done) {
              i18n.init(i18n.functions.extend(opts, {
                fallbackToDefaultNS: true,
                resStore: resStore,
                ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
                function(t) { done(); });
            });
      
            it('it should fallback to default ns', function() {
              // default ns fallback lookup
              expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_en-US');
              expect(i18n.t('ns.common:simple_en')).to.be('ok_from_en');
              expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_dev');
      
              // ns in options
              expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_en-US');
              expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_en');
              expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_dev');
            });
      
          });
      
          describe('and fallbacking to set namespace', function() {
            var resStore = {
              dev: {
                'ns.special': { 'simple_dev': 'ok_from_dev' },
                'ns.fallback': { 'simple_fallback': 'ok_from_fallback' }
              },
              en: { 'ns.special': { 'simple_en': 'ok_from_en' } },
              'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
            };
      
            beforeEach(function(done) {
              i18n.init(i18n.functions.extend(opts, {
                fallbackNS: 'ns.fallback',
                resStore: resStore,
                ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
                function(t) { done(); });
            });
      
            it('it should fallback to set fallback namespace', function() {
              expect(i18n.t('ns.common:simple_fallback')).to.be('ok_from_fallback');
            });
      
          });
      
          describe('and fallbacking to multiple set namespace', function() {
            var resStore = {
              dev: {
                'ns.common': {},
                'ns.special': { 'simple_dev': 'ok_from_dev' },
                'ns.fallback1': {
                  'simple_fallback': 'ok_from_fallback1',
                  'simple_fallback1': 'ok_from_fallback1'
                }
              },
              en: {
                'ns.special': { 'simple_en': 'ok_from_en' },
                'ns.fallback2': {
                  'simple_fallback': 'ok_from_fallback2',
                  'simple_fallback2': 'ok_from_fallback2'
                }
              },
              'en-US': { 'ns.special': { 'simple_en-US': 'ok_from_en-US' } }
            };
      
            beforeEach(function(done) {
              i18n.init(i18n.functions.extend(opts, {
                fallbackNS: ['ns.fallback1', 'ns.fallback2'],
                resStore: resStore,
                ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
                function(t) { done(); });
            });
      
            it('it should fallback to set fallback namespace', function() {
              expect(i18n.t('ns.common:simple_fallback')).to.be('ok_from_fallback1'); /* first wins */
              expect(i18n.t('ns.common:simple_fallback1')).to.be('ok_from_fallback1');
              expect(i18n.t('ns.common:simple_fallback2')).to.be('ok_from_fallback2');
            });
      
            describe('and post missing', function() {
      
              var spy;
      
              beforeEach(function(done) {
                i18n.init(i18n.functions.extend(opts, {
                  fallbackNS: ['ns.fallback1', 'ns.fallback2'],
                  resStore: resStore,
                  sendMissing: true, /* must be changed to saveMissing */
                  ns: { namespaces: ['ns.common', 'ns.special', 'ns.fallback'], defaultNs: 'ns.special'} } ),
                  function(err, t) { 
                    spy = sinon.spy(i18n.options, 'missingKeyHandler');
                    t('ns.common:notExisting');
                    done();
                  });
              });
      
              afterEach(function() {
                spy.restore();
              });
      
              it('it should post only to origin namespace', function() {
                expect(spy.callCount).to.be(1);
                expect(spy.args[0][0]).to.be('en-US');
                expect(spy.args[0][1]).to.be('ns.common');
                expect(spy.args[0][2]).to.be('notExisting');
                expect(spy.args[0][3]).to.be('ns.common:notExisting');
              });
      
            });
      
          });
      
        });
      
        describe('with reloading additional namespace', function() {
      
          describe('without using localStorage', function() {
            beforeEach(function(done) {
              i18n.init(opts,
                function(t) {
                  i18n.setDefaultNamespace('ns.special');
                  i18n.loadNamespaces(['ns.common', 'ns.special'], done);
                });
            });
      
            it('it should provide loaded resources for translation', function() {
              // default ns
              expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
              expect(i18n.t('simple_en')).to.be('ok_from_special_en');
              expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');
      
              // ns prefix
              expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_common_en-US');
              expect(i18n.t('ns.common:simple_en')).to.be('ok_from_common_en');
              expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_common_dev');
      
              // ns in options
              expect(i18n.t('simple_en-US', { ns: 'ns.common' })).to.be('ok_from_common_en-US');
              expect(i18n.t('simple_en', { ns: 'ns.common' })).to.be('ok_from_common_en');
              expect(i18n.t('simple_dev', { ns: 'ns.common' })).to.be('ok_from_common_dev');
            });
      
            it('it should add the new namespaces to the namespace array', function() {
              expect(i18n.options.ns.namespaces).to.contain('ns.common');
              expect(i18n.options.ns.namespaces).to.contain('ns.special');
            });
      
            describe('and fallbackToDefaultNS turned on', function() {
      
              beforeEach(function(done) {
                i18n.init(i18n.functions.extend(opts, {
                    ns: 'ns.common',
                    fallbackToDefaultNS: true
                  }),
                  function(t) {
                    i18n.loadNamespaces(['ns.special'], done);
                  });
              });
      
              it('it should fallback to default namespace', function() {
                expect(i18n.t('ns.special:test.fallback_en')).to.be('ok_from_common_en-fallback');
                expect(i18n.t('ns.special:test.fallback_dev')).to.be('ok_from_common_dev-fallback');
              });
      
            });
      
          });
      
          describe('with using localStorage', function() {
      
            var spy;
      
            before(function() {
              if (typeof window !== 'undefined') { // safe use on server
                window.localStorage.removeItem('res_en-US');
                window.localStorage.removeItem('res_en');
                window.localStorage.removeItem('res_dev');
              }
            });
      
            beforeEach(function(done) {
              spy = sinon.spy(i18n.sync, '_fetchOne');
              i18n.init(i18n.functions.extend(opts, {
                useLocalStorage: true
              }), function(t) {
                i18n.setDefaultNamespace('ns.special');
                i18n.loadNamespaces(['ns.common', 'ns.special'], done);
              });
            });
      
            afterEach(function() {
              spy.restore();
            });
      
            it('it should load language', function() {
              expect(spy.callCount).to.be(9); // en-US, en, de-DE, de, fr, dev * 3 namespaces (translate, common, special)
            });
      
            describe('on later reload of namespaces', function() {
      
              beforeEach(function(done) {
                spy.reset();
                i18n.init(i18n.functions.extend(opts, {
                  useLocalStorage: true,
                  ns: 'translation'
                }), function(t) {
                  i18n.setDefaultNamespace('ns.special');
                  i18n.loadNamespaces(['ns.common', 'ns.special'], done);
                });
              });
      
              it('it should not reload language', function() {
                expect(spy.callCount).to.be(0);
              });
      
            });
      
          });
      
        });
      
      });
  
      describe('using localStorage', function() {
      
        var spy; 
      
        before(function() {
          window.localStorage.removeItem('res_en-US');
          window.localStorage.removeItem('res_en');
          window.localStorage.removeItem('res_dev');
        });
      
        beforeEach(function(done) {
          spy = sinon.spy(i18n.sync, '_fetchOne');
          i18n.init(i18n.functions.extend(opts, { 
            useLocalStorage: true 
          }), function(t) { done(); });
        });
      
        afterEach(function() {
          spy.restore();
        });
      
        it('it should load language', function() {
          expect(spy.callCount).to.be(3); // en-US, en, de-DE, de, fr, dev
        });
      
        describe('on later init', function() {
      
          beforeEach(function(done) {
            spy.reset();
            i18n.init(function(t) { done(); });
          });
      
          it('it should not reload language', function() {
            expect(spy.callCount).to.be(0); // de-DE, de, fr, dev
          });
      
          describe('on later init - after caching duration', function() {
      
            beforeEach(function(done) {
              spy.reset();
      
              // exipred
              var local = window.localStorage.getItem('res_en-US');
              local = JSON.parse(local);
              local.i18nStamp = 0;
              window.localStorage.setItem('res_en-US', JSON.stringify(local));
      
              i18n.init(function(t) { done(); });
            });
      
            it('it should reload language', function() {
              expect(spy.callCount).to.be(1); // de-DE, de, fr, dev
            });
      
          });
      
        });
      
      });
  
      describe('using function provided in callback\'s argument', function() {
      
        var cbT;
      
        beforeEach(function(done) {
          i18n.init(opts, function(err, t) { cbT = t; done(); });
        });
      
        it('it should provide loaded resources for translation', function() {
          expect(cbT('simple_en-US')).to.be('ok_from_en-US');
          expect(cbT('simple_en')).to.be('ok_from_en');
          expect(cbT('simple_dev')).to.be('ok_from_dev');
        });
      
      });
      
      describe('with lowercase flag', function() {
      
        describe('default behaviour will uppercase specifc country part.', function() {
      
          beforeEach(function() {
            i18n.init(i18n.functions.extend(opts, {
              lng: 'en-us',
              resStore: {
                'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
              }
            }, function(t) { done(); }) );
          });
      
          it('it should translate the uppercased lng value', function() {
            expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          });
      
          it('it should get uppercased set language', function() {
            expect(i18n.lng()).to.be('en-US');
          });
      
        });
      
        describe('overridden behaviour will accept lowercased country part.', function() {
      
          beforeEach(function() {
            i18n.init(i18n.functions.extend(opts, {
              lng: 'en-us',
              lowerCaseLng: true,
              resStore: {
                'en-us': { translation: { 'simple_en-us': 'ok_from_en-us' } }
              }
            }, function(t) { done(); }) );
          });
      
          it('it should translate the lowercase lng value', function() {
            expect(i18n.t('simple_en-us')).to.be('ok_from_en-us');
          });
      
          it('it should get lowercased set language', function() {
            expect(i18n.lng()).to.be('en-us');
          });
      
        });
      
      });
  
      describe('with language whitelist', function() {
      
        var resStore = {
          'zh-CN':  { translation: { 'string_one': 'good_zh-CN' } },
          en:       { translation: { 'string_one': 'good_en' } },
          zh:       { translation: { 'string_one': 'BAD_zh' } },
          'en-US':  { translation: { 'string_one': 'BAD_en-ZH' } }
        };
      
        it('should degrade UNwhitelisted 2-part lang code (en-US) to WHITELISTED 1-part (en)', function() {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore, lngWhitelist: ['en', 'zh-CN'], lng: 'en-US' }));
          expect(i18n.lng()).to.be('en');
          expect(i18n.t('string_one')).to.be('good_en');
        });
      
        it('should NOT degrade WHITELISTED 2-part lang code (zh-CN) to UNwhitelisted 1-part (en)', function() {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore, lngWhitelist: ['en', 'zh-CN'], lng: 'zh-CN' }));
          expect(i18n.lng()).to.be('zh-CN');
          expect(i18n.t('string_one')).to.be('good_zh-CN');
        });
      
      });
  
    });
  
  });
  describe('basic functionality', function() {
  
    describe('CI mode', function() {
    
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          }
        }), function(t) { done(); } );
      });
    
      it('it should provide resources for set language', function(done) {
        expect(i18n.t('simpleTest')).to.be('ok_from_en-US');
    
        i18n.setLng('CIMode', function(err, t) {
            expect(t('simpleTest')).to.be('simpleTest');
            done();
        });
    
      });
    
    });
  
    describe('setting language', function() {
    
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          }
        }), function(t) { done(); } );
      });
    
      it('it should provide resources for set language', function(done) {
        expect(i18n.t('simpleTest')).to.be('ok_from_en-US');
    
        i18n.setLng('de-DE', function(err, t) {
            expect(t('simpleTest')).to.be('ok_from_de-DE');
            done();
        });
    
      });
    
      it('should be possible to call setLng multiple times to get specialized callbacks', function(done) {
        i18n.setLng('de-DE', { fixLng: true }, function(err, deDE) {
            expect(deDE.lng).to.be('de-DE');
    
            i18n.setLng('en-US', { fixLng: true }, function(err, enUS) {
                expect(deDE.lng).to.be('de-DE');
                expect(enUS.lng).to.be('en-US');
    
                expect(deDE('simpleTest')).to.be('ok_from_de-DE');
                expect(enUS('simpleTest')).to.be('ok_from_en-US');
    
                done();
            });
        });
      })
    
    });
  
    describe('preloading multiple languages', function() {
    
      var spy; 
    
      beforeEach(function(done) {
        spy = sinon.spy(i18n.sync, '_fetchOne');
        i18n.init(opts, function(t) { done(); });
      });
    
      afterEach(function() {
        spy.restore();
      });
    
      it('it should preload resources for languages', function(done) {
        spy.reset();
        if (i18n.sync.resStore) i18n.sync.resStore = {}; // to reset for test on server!
        i18n.preload('de-DE', function(t) {
          expect(spy.callCount).to.be(5); // en-US, en, de-DE, de, dev
          done();
        });
    
      });
    
    });
  
    describe('postprocessing tranlation', function() {
    
      describe('having a postprocessor', function() {
    
        before(function(){
          i18n.addPostProcessor('myProcessor', function(val, key, opts) {
            return 'ok_from_postprocessor';
          });
          i18n.addPostProcessor('myProcessor2', function(val, key, opts) {
            return val + ' ok' ;
          });
        });
    
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
            resStore: {
              'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
              'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
            }
          }), function(t) { done(); } );
        });
    
        it('it should postprocess the translation by passing in postProcess name to t function', function() {
          expect(i18n.t('simpleTest', {postProcess: 'myProcessor'})).to.be('ok_from_postprocessor');
        });
    
        it('it should postprocess on default value', function() {
          expect(i18n.t('notFound1', {defaultValue: 'defaultValue', postProcess: 'myProcessor2'})).to.be('defaultValue ok');
        });
    
        it('it should postprocess on missing value', function() {
          expect(i18n.t('notFound2', {postProcess: 'myProcessor2'})).to.be('notFound2 ok');
        });
    
        it('it should postprocess with multiple post processors', function() {
          expect(i18n.t('simpleTest', {postProcess: ['myProcessor', 'myProcessor2']})).to.be('ok_from_postprocessor ok');
        });
    
        describe('or setting it as default on init', function() {
    
          beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, {
              resStore: {
                'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
                'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
              },
              postProcess: 'myProcessor'
            }), function(t) { done(); } );
          });
    
          it('it should postprocess the translation by default', function() {
            expect(i18n.t('simpleTest')).to.be('ok_from_postprocessor');
          });
    
        });
    
      });
    
    });
  
    describe('post missing resources', function() {
    
      describe('to fallback', function() {
        var server, stub, spy; 
    
        beforeEach(function(done) {
          server = sinon.fakeServer.create();
          stub = sinon.stub(i18n.functions, "ajax");
          spy = sinon.spy(i18n.options, 'missingKeyHandler');
    
    
          server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);
    
          i18n.init(i18n.functions.extend(opts, {
            sendMissing: true,
            resStore: {
              'en-US': { translation: {  } },
              'en': { translation: {  } },
              'dev': { translation: {  } }
            }
          }), function(t) { done(); } );
        });
    
        afterEach(function() {
          server.restore();
          stub.restore();
          spy.restore();
        });
    
        it('it should post missing resource to server', function() {
          i18n.t('missing');
          server.respond();
          expect(stub.calledOnce).to.be(true);
        });
    
        it('it should post missing resource to server when language is passed in', function() {
          i18n.t('missing_en', { lng: 'en' });
          server.respond();
          expect(stub.calledOnce).to.be(true);
        });
    
        it('it should call with right arguments', function() {
          i18n.t('missing');
          expect(spy.args[0][0]).to.be('en-US');
          expect(spy.args[0][1]).to.be('translation');
          expect(spy.args[0][2]).to.be('missing');
          expect(spy.args[0][3]).to.be('missing');
        });
    
        describe('with fallbackLng set to false', function() {
           
          beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, {
              lng: 'de',
              sendMissing: true,
              fallbackLng: false,
              sendMissingTo: 'fallback',
              resStore: {
                'en-US': { translation: {  } },
                'en': { translation: {  } },
                'dev': { translation: {  } }
              }
            }), function(t) { done(); } );
          });
    
          it('it should post missing resource to server', function() {
            i18n.t('missing');
            server.respond();
            expect(stub.calledOnce).to.be(true);
          });
    
          it('it should call post missing with right arguments', function() {
            i18n.t('missing');
            expect(spy.args[0][0]).to.be('de');
            expect(spy.args[0][1]).to.be('translation');
            expect(spy.args[0][2]).to.be('missing');
            expect(spy.args[0][3]).to.be('missing');
          });
    
          it('it should call ajax with right arguments', function() {
            i18n.t('missing');
            expect(stub.args[0][0].url).to.be('locales/add/de/translation');
          });
    
        });
    
      });
    
      describe('to current', function() {
        var server, stub; 
    
        beforeEach(function(done) {
          server = sinon.fakeServer.create();
          stub = sinon.stub(i18n.functions, "ajax"); 
    
          server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);
    
          i18n.init(i18n.functions.extend(opts, {
            sendMissing: true,
            sendMissingTo: 'current',
            //fallbackLng: false,
            resStore: {
              'en-US': { translation: {  } },
              'en': { translation: {  } },
              'dev': { translation: {  } }
            }
          }), function(t) { done(); } );
        });
    
        afterEach(function() {
          server.restore();
          stub.restore();
        });
    
        it('it should post missing resource for all lng to server', function() {
          i18n.t('missing');
          server.respond();
          expect(stub.calledOnce).to.be(true);
        });
    
        it('it should call ajax with right arguments', function() {
          i18n.t('missing2');
          expect(stub.args[0][0].url).to.be('locales/add/en-US/translation');
        });
    
      });
    
      describe('to all', function() {
        var server, stub; 
    
        beforeEach(function(done) {
          server = sinon.fakeServer.create();
          stub = sinon.stub(i18n.functions, "ajax"); 
    
          server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);
    
          i18n.init(i18n.functions.extend(opts, {
            sendMissing: true,
            sendMissingTo: 'all',
            resStore: {
              'en-US': { translation: {  } },
              'en': { translation: {  } },
              'dev': { translation: {  } }
            }
          }), function(t) { done(); } );
        });
    
        afterEach(function() {
          server.restore();
          stub.restore();
        });
    
        it('it should post missing resource for all lng to server', function() {
          i18n.t('missing');
          server.respond();
          expect(stub.calledThrice).to.be(true);
        });
    
      });
    
    });
  
    describe('using objectTreeKeyHandler', function() {
    
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          objectTreeKeyHandler: function(key, value, lng, ns, opts) {
            return i18n.t(key + '.a');
          },
          resStore: {
            'en-US': { translation: { 'simpleTest': { a: 'a value', b: 'b value' } } }
          },
          returnObjectTrees: false
        }), function(t) { done(); } );
      });
    
      it('it should apply objectTreeKeyHandler', function() {
        expect(i18n.t('simpleTest')).to.be('a value');
      });
    
    });
  
    describe('Global variable conflict', function () {
    
      it('it should rename global "window.i18n" to "window.i18next"' + 
        ' and restore window.i18n conflicting reference', function () {
    
        window.i18n.noConflict();
    
        expect(window.i18n.isFakeConflictingLib).to.be(true);
        expect(window.i18next).to.be.an(Object);
        expect(window.i18next.t).to.be.a(Function);
      });
    });
  
  });
  describe('translation functionality', function() {
  
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
  
    describe('Check for existence of keys', function() {
        var resStore = {
            dev: { translation: { iExist: '' } },
            en: { translation: { } },
            'en-US': { translation: { } }
        };
    
        beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
                function(t) { done(); });
        });
    
        it('it should exist', function() {
            expect(i18n.exists('iExist')).to.be(true);
        });
    
        it('it should not exist', function() {
            expect(i18n.exists('iDontExist')).to.be(false);
        });
    
        describe('missing on unspecific', function() {
            var resStore = {
                dev: { translation: { iExist: 'text' } },
                en: { translation: { } },
                'en-US': { translation: { empty: '' } }
            };
    
            beforeEach(function(done) {
                i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en' }),
                    function(t) { done(); });
            });
    
            it('it should exist', function() {
                expect(i18n.exists('iExist')).to.be(true);
            });
    
            it('it should not exist', function() {
                expect(i18n.exists('iDontExist')).to.be(false);
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
              interpolationTest3: 'The last letter of the english alphabet is %s'
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
        });
        
      });
  
      describe('with default variables', function() {
      
        var defaultVariables = {
          name: 'John'
        };
      
        beforeEach(function(done) {
          i18n.init(
            i18n.functions.extend(opts, { defaultVariables: defaultVariables }),
            function(t) { done(); }
          );
        });
      
        it('it should use default variable', function() {
          expect(i18n.t('Hello __name__')).to.be('Hello John');
        });
      
        it('it should replace default variable', function() {
          expect(i18n.t('Hello __name__', {name: 'Ben'})).to.be('Hello Ben');
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
  
    describe('indefinite article usage', function() {
      describe('basic usage - singular, plural and indefinite', function() {
        var resStore = {
          dev: {
            'ns.2': {
              thing: '__count__ thing from ns.2',
              thing_plural: '__count__ things from ns.2',
              thing_indefinite: 'A thing from ns.2',
              thing_plural_indefinite: 'Some things from ns.2'
            },
            'ns.3': {
              thing: '__count__ things',
              thing_indefinite: 'A thing',
              thing_plural_indefinite: 'Some things'
            }
          },
          en: { },
          'en-US': {
            'ns.1': {
              thing: '__count__ thing',
              thing_plural: '__count__ things',
              thing_indefinite: 'A thing'
            }
          }
        };
    
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
            resStore: resStore,
            ns: { namespaces: ['ns.1', 'ns.2', 'ns.3'], defaultNs: 'ns.1'}
          }), function(t) { done(); });
        });
    
        it('it should provide the indefinite article when requested for singular forms', function() {
          expect(i18n.t('thing')).to.be('__count__ thing');
          expect(i18n.t('thing', {indefinite_article: true})).to.be('A thing');
          expect(i18n.t('thing', {count:1})).to.be('1 thing');
          expect(i18n.t('thing', {count:5})).to.be('5 things');
          expect(i18n.t('thing', {count:1, indefinite_article: true})).to.be('A thing');
          expect(i18n.t('thing', {count:5, indefinite_article: true})).to.be('5 things');
        });
    
        it('it should provide the indefinite article when requested for singular forms for second namespace', function() {
          expect(i18n.t('ns.2:thing', {count:1})).to.be('1 thing from ns.2');
          expect(i18n.t('ns.2:thing', {count:5})).to.be('5 things from ns.2');
          expect(i18n.t('ns.2:thing', {count:1, indefinite_article: true})).to.be('A thing from ns.2');
          expect(i18n.t('ns.2:thing', {count:5, indefinite_article: true})).to.be('Some things from ns.2');
        });
    
        it('it should provide the right indefinite translations from the third namespace', function() {
          expect(i18n.t('ns.3:thing', {count:5})).to.be('5 things');
          expect(i18n.t('ns.3:thing', {count:1, indefinite_article: true})).to.be('A thing');
          expect(i18n.t('ns.3:thing', {count:5, indefinite_article: true})).to.be('Some things')
        });
      });
    
      describe('extended usage - indefinite articles in languages with different plural forms', function() {
        var resStore = {
          dev: {
            translation: {
            }
          },
          zh: {
            translation: {
              key: "__count__ thing",
              key_indefinite: "a thing"
            }
          }
        };
    
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
            lng: 'zh',
            resStore: resStore
          }), function(t) { done(); });
        });
    
        it('it should provide the correct indefinite articles', function() {
          expect(i18n.t('key', {count: 1})).to.be('1 thing');
          expect(i18n.t('key', {count: 5})).to.be('5 thing');
          expect(i18n.t('key', {count: 1, indefinite_article: true})).to.be('a thing');
          expect(i18n.t('key', {count: 5, indefinite_article: true})).to.be('a thing');
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
  
  });
  describe('jQuery integration / specials', function() {
  
    describe('initialise - use deferrer instead of callback', function() {
    
      describe('with passed in resource set', function() {
    
        var resStore = {
          dev: { translation: { 'simple_dev': 'ok_from_dev' } },
          en: { translation: { 'simple_en': 'ok_from_en' } },            
          'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore })).done(function(t) { done(); });
        });
    
        it('it should provide passed in resources for translation', function() {
          expect($.t('simple_en-US')).to.be('ok_from_en-US');
          expect($.t('simple_en')).to.be('ok_from_en');
          expect($.t('simple_dev')).to.be('ok_from_dev');
        });
    
      });
    
      describe('loading from server', function() {
    
        beforeEach(function(done) {
          i18n.init(opts).done(function() { done(); });
        });
    
        it('it should provide loaded resources for translation', function() {
          expect($.t('simple_en-US')).to.be('ok_from_en-US');
          expect($.t('simple_en')).to.be('ok_from_en');
          expect($.t('simple_dev')).to.be('ok_from_dev');
        });
    
      });
    
    });
  
    describe('use translation function shortcut $.t', function() {
    
      beforeEach(function(done) {
        i18n.init(opts, function(t) { done(); });
      });
    
      it('it should provide translation via $.t', function() {
        expect($.t('simple_en-US')).to.be('ok_from_en-US');
        expect($.t('simple_en')).to.be('ok_from_en');
        expect($.t('simple_dev')).to.be('ok_from_dev');
      });
    
    });
  
    describe('using bindings $([selector].i18n())', function() {
        
      describe('basic - setting text', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="simpleTest"></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set text of elements inside selector having data-i18n attribute', function() {
          $('#container').i18n();
          expect($('#testBtn').text()).to.be('ok_from_en-US');
        });
    
        it('it should set text of element itself if having data-i18n attribute', function() {
          $('#testBtn').i18n();
          expect($('#testBtn').text()).to.be('ok_from_en-US');
        });
    
      });
    
      describe('extended - setting other attributes', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set text of elements inside selector having data-i18n attribute', function() {
          $('#container').i18n();
          expect($('#testBtn').text()).to.be('ok_from_en-US');
        });
    
        it('it should set attributes of elements inside selector having data-i18n attribute', function() {
          $('#container').i18n();
          expect($('#testBtn').attr('title')).to.be('ok_from_en-US');
        });
        
      });
    
      describe('extended - empty key -> double ;;', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;;simpleTest"></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set text of elements inside selector having data-i18n attribute', function() {
          $('#container').i18n();
          expect($('#testBtn').text()).to.be('ok_from_en-US');
        });
    
        it('it should set attributes of elements inside selector having data-i18n attribute', function() {
          $('#container').i18n();
          expect($('#testBtn').attr('title')).to.be('ok_from_en-US');
        });
        
      });
    
      describe('extended - pass in options', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set text with passed in options', function() {
          $('#container').i18n({ replace: 'replaced' });
          expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
        });
        
      });
    
      describe('extended - render inner html', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container" data-i18n="[html]simpleTest"></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set inner html', function() {
          $('#container').i18n();
          expect($('#inner').html()).to.be('test');
        });
        
      });
    
      describe('extended - set data attribute', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': 'someData' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container" data-i18n="[data-test]simpleTest"></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set data', function() {
          $('#container').i18n();
          expect($('#container').data('test')).to.be('someData');
          expect($('#container').attr('data-test')).to.be('someData');
        });
        
      });
    
      describe('extended - append html', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container" data-i18n="[append]simpleTest"><div></div></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should append html', function() {
          $('#container').i18n();
          expect($('#container').html()).to.be('<div></div><div id="inner">test</div>');
        });
        
      });
    
      describe('extended - prepend html', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container" data-i18n="[prepend]simpleTest"><div></div></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should append html', function() {
          $('#container').i18n();
          expect($('#container').html()).to.be('<div id="inner">test</div><div></div>');
        });
        
      });
    
      describe('extended - with target set to inner element', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': 'test' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container" data-i18n-target="#inner" data-i18n="[html]simpleTest"><div id="inner"></div></div>');
    
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) {  done(); });
        });
    
        it('it should set inner html', function() {
          $('#container').i18n();
          expect($('#inner').html()).to.be('test');
        });
        
      });
    
    
      describe('extended - write/read options from data attribute', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { 
            resStore: resStore,
            useDataAttrOptions: true
          }),
            function(t) {
              $('#container').i18n({ replace: 'replaced' });
              $('#testBtn').text('');
              done(); 
            });
        });
    
        it('it should set text with attributes options', function() {
          $('#container').i18n(); // without option
          expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
        });
        
      });
    
      describe('extended - read options from data attribute', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest" data-i18n-options={"replace":"replaced"}></button></div>');
    
          i18n.init(i18n.functions.extend(opts, { 
            resStore: resStore,
            useDataAttrOptions: true
          }),
            function(t) {
              done(); 
            });
        });
    
        it('it should set text with attributes options', function() {
          $('#container').i18n(); // without option
          expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
        });
        
      });
    
      describe('extended - read key from inner content', function() {
    
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { translation: { 'simpleTest2': 'ok_from_en-US' } }
        };
        
        beforeEach(function(done) {
          setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '>simpleTest2</button></div>');
    
          i18n.init(i18n.functions.extend(opts, { 
            resStore: resStore
          }),
            function(t) {
              done(); 
            });
        });
    
        it('it should read key from inner content', function() {
          $('#container').i18n(); // without option
          expect($('#testBtn').text()).to.be('ok_from_en-US');
        });
        
      });
    
    });
  
  });

});