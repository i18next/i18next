describe('i18next', function() {

  var i18n = $.i18n
    , opts;

  beforeEach(function() {
    opts = {
      lng: 'en-US',
      load: 'all',
      fallbackLng: 'dev',
      preload: [],
      lowerCaseLng: false,
      ns: 'translation',
      resGetPath: 'locales/__lng__/__ns__.json',
      dynamicLoad: false,
      useLocalStorage: false,
      sendMissing: false,
      resStore: false,
      getAsync: true,
      returnObjectTrees: false,
      debug: true,
      selectorAttr: 'data-i18n',
      postProcess: ''
    };
  });

  
  //= init.spec.js
  //= functions.basic.spec.js
  //= functions.translation.spec.js
  //= jquery.spec.js

});
