// i18next, v1.10.3
// Copyright (c)2015 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
//////////////////////
// HINT
//
// you need to replace '_fetchOne' with 'fetchOne' to use this on server
// fix line 351 'sendMissing' -> 'saveMissing'
//


var i18n = require('../index')
  , expect = require('expect.js')
  , sinon = require('sinon');

describe('i18next.init', function() {

  var opts;

  beforeEach(function(done) {
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
      sendMissingTo: 'fallback',
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

    i18n.init(opts, function(t) {
      i18n.sync.resStore = {};
      done();
    });
  });

  // init/init.load.spec.js

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

    // init/init.syncFlag.spec.js

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

    // init/init.localstorage.spec.js

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

  });

});