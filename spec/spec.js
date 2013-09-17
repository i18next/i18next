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
      parseMissingKey: '',
      interpolationPrefix: '__',
      interpolationSuffix: '__',
      shortcutFunction: 'sprintf'
    };
  });

  
  //= init.spec.js
  //= functions.spec.js
  //= translate.spec.js
  //= jquery.spec.js

});
