// i18next, v1.6.1pre
// Copyright (c)2013 Jan Mühlemann (jamuhl).
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
      preload: [],
      lowerCaseLng: false,
      ns: 'translation',
      fallbackToDefaultNS: false,
      fallbackOnNull: true,
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
      interpolationPrefix: '__',
      interpolationSuffix: '__'
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
  
      describe('adding resources after init', function() {
      
        var resStore = {
          dev: { translation: { 'simple_dev': 'ok_from_dev' } },
          en: { translation: { 'simple_en': 'ok_from_en' } }//,            
          //'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
        };
        
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
          i18n.init(opts, function(t) { cbT = t; done(); });
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
  
    });
  
  });
  describe('basic functionality', function() {
  
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
    
        i18n.setLng('de-DE', function(t) {
            expect(t('simpleTest')).to.be('ok_from_de-DE');
            done();
        });
    
      });
    
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
          expect(i18n.t('notFound', {defaultValue: 'not processed', postProcess: 'myProcessor'})).to.be('ok_from_postprocessor');
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
        var server, stub; 
    
        beforeEach(function(done) {
          server = sinon.fakeServer.create();
          stub = sinon.stub(i18n.functions, "ajax"); 
    
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
        });
    
        it('it should post missing resource to server', function() {
          i18n.t('missing');
          server.respond();
          expect(stub.calledOnce).to.be(true);
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
  
  });
  describe('translation functionality', function() {
  
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
    
      describe('with setting new options', function() {
        var resStore = {
          dev: { translation: { nesting1_plural: '$t(nesting2, {"count": __girls__}) and __count__ boys' } },
          en: { translation: { nesting2_plural: '__count__ girls' } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) { done(); });
        });
    
        it('it should translate nested value and set new options', function() {
          expect(i18n.t('nesting1', {count: 2, girls: 3})).to.be('3 girls and 2 boys');
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
      
        it('it should replace passed in key/values on defaultValue', function() {
          expect(i18n.t('interpolationTest5', {defaultValue: 'added __toAdd__', toAdd: 'something'})).to.be('added something');
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
          i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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
                  pluralTest_negative: 'negative from ns.2',
                  pluralTestWithCount: '__count__ item from ns.2',
                  pluralTestWithCount_plural: '__count__ items from ns.2',
                  pluralTestWithCount_negative: '__count__ no items from ns.2'
            }},
          en: { },            
          'en-US': { 
            'ns.1': {                      
                  pluralTest: 'singular',
                  pluralTest_plural: 'plural',
                  pluralTest_negative: 'negative',
                  pluralTestWithCount: '__count__ item',
                  pluralTestWithCount_plural: '__count__ items',
                  pluralTestWithCount_negative: '__count__ no items'
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
          expect(i18n.t('pluralTest', {count: 0})).to.be('negative');
          expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
          expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
          expect(i18n.t('pluralTest', {count: 7})).to.be('plural');
    
          expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 no items');
          expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
          expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
        });
    
        it('it should provide correct plural or singular form for second namespace', function() {
          expect(i18n.t('ns.2:pluralTest', {count: 0})).to.be('negative from ns.2');
          expect(i18n.t('ns.2:pluralTest', {count: 1})).to.be('singular from ns.2');
          expect(i18n.t('ns.2:pluralTest', {count: 2})).to.be('plural from ns.2');
          expect(i18n.t('ns.2:pluralTest', {count: 7})).to.be('plural from ns.2');
    
          expect(i18n.t('ns.2:pluralTestWithCount', {count: 1})).to.be('1 item from ns.2');
          expect(i18n.t('ns.2:pluralTestWithCount', {count: 7})).to.be('7 items from ns.2');
        });
      });
    
      describe('basic usage 2 - singular and plural form in french', function() {
        var resStore = {
          dev: { 'ns.2': {                      
                  pluralTest: 'singular from ns.2',
                  pluralTest_plural: 'plural from ns.2',
                  pluralTest_negative: 'negative from ns.2',
                  pluralTestWithCount: '__count__ item from ns.2',
                  pluralTestWithCount_plural: '__count__ items from ns.2'
                  pluralTestWithCount_negative: '__count__ no items from ns.2'
            }},
          en: { },            
          'fr': { 
            'ns.1': {                      
                  pluralTest: 'singular',
                  pluralTest_plural: 'plural',
                  pluralTest_negative: 'negative',
                  pluralTestWithCount: '__count__ item',
                  pluralTestWithCount_plural: '__count__ items'
                  pluralTestWithCount_negative: '__count__ no items'
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
          expect(i18n.t('pluralTest', {count: 0})).to.be('negative');
          expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
          expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
          expect(i18n.t('pluralTest', {count: 7})).to.be('plural');
    
          expect(i18n.t('pluralTestWithCount', {count: 0})).to.be('0 no item');
          expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
          expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
        });
      });
    
      describe('extended usage - multiple plural forms - ar', function() {
        var resStore = {
            dev: { translation: { } },
            ar: { translation: { 
                key: 'singular',
                key_negative: 'zero',
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
                key_negative: '0',
                key_plural_2: '2,3,4',
                key_plural_5: '5,6'
              } 
            },            
            'ru-??': { translation: { } }
        };
        
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, { lng: 'ru', resStore: resStore }),
            function(t) { done(); });
        });
    
        it('it should provide correct plural forms', function() {
            expect(i18n.t('key', {count: 0})).to.be('0');
            expect(i18n.t('key', {count: 1})).to.be('1,21,31');
            expect(i18n.t('key', {count: 2})).to.be('2,3,4');
            expect(i18n.t('key', {count: 3})).to.be('2,3,4');
            expect(i18n.t('key', {count: 4})).to.be('2,3,4');
            expect(i18n.t('key', {count: 104})).to.be('2,3,4');
            expect(i18n.t('key', {count: 11})).to.be('5,6');
            expect(i18n.t('key', {count: 24})).to.be('2,3,4');
            expect(i18n.t('key', {count: 25})).to.be('5,6');
            expect(i18n.t('key', {count: 99})).to.be('5,6');
            expect(i18n.t('key', {count: 199})).to.be('5,6');
            expect(i18n.t('key', {count: 100})).to.be('5,6');
    
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
    
    
      describe('extended - read options from data attribute', function() {
    
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
    
    });
  
  });

});