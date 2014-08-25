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

  //= functions/functions.CI.spec.js

  //= functions/functions.setlng.spec.js

  //= functions/functions.preload.spec.js

  //= functions/functions.postprocessor.spec.js

  // functions/functions.postmissing.spec.js

  //= functions/functions.objectTreeKeyHandler.spec.js


});