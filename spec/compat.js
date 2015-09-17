import i18n from '../../src/i18next.js';
import * as utils from '../../src/utils';

i18n.functions = {
  extend: utils.extend
};

describe('i18next', function() {

  var opts;

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


  //= init.spec.js
  //= functions.spec.js
  //= translate.spec.js

});
