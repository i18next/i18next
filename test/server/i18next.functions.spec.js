// i18next, v1.7.5
// Copyright (c)2014 Jan Mühlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
//////////////////////
// HINT
//
// you need to replace '_fetchOne' with 'fetchOne' to use this on server
//

var i18n = require('../index')
  , expect = require('expect.js')
  , sinon = require('sinon');

describe('i18next.functions', function() {

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
  
      i18n.setLng('CIMode', function(t) {
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
  
      i18n.setLng('de-DE', function(t) {
          expect(t('simpleTest')).to.be('ok_from_de-DE');
          done();
      });
  
    });
  
    it('should be possible to call setLng multiple times to get specialized callbacks', function(done) {
      i18n.setLng('de-DE', { fixLng: true }, function(deDE) {
          expect(deDE.lng).to.be('de-DE');
  
          i18n.setLng('en-US', { fixLng: true }, function(enUS) {
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

  // functions/functions.postmissing.spec.js

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


});