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

  //= translate/translate.nonStringKeys.spec.js

  //= translate/translate.missingKey.spec.js

  //= translate/translate.nullValue.spec.js

  //= translate/translate.emptyValue.spec.js

  //= translate/translate.arrayKey.spec.js

  //= translate/translate.arrayValue.spec.js

  //= translate/translate.objectValue.spec.js

  //= translate/translate.nesting.spec.js

  describe('interpolation - replacing values inside a string', function() {

    //= translate/translate.interpolation.spec.js

    //= translate/translate.sprintf.spec.js

  });

  //= translate/translate.plurals.spec.js

  //= translate/translate.context.spec.js

  //= translate/translate.setlng.spec.js

});