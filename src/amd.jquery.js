(function (root, factory) {
    if (typeof exports === 'object') {

      var jquery = require('jquery');

      module.exports = factory(jquery);

    } else if (typeof define === 'function' && define.amd) {

      define(['jquery'], factory);

    }
}(this, function ($) {

    //= i18next.shim.js

    var i18n = {}
        , resStore = {}
        , currentLng
        , replacementCounter = 0
        , languages = []
        , initialized = false
        , sync = {};

    //= i18next.sync.js
    //= i18next.defaults.js
    //= i18next.helpers.js
    //= i18next.init.js
    //= i18next.functions.js
    //= i18next.jquery.js
    //= i18next.nojquery.js
    //= i18next.translate.js
    //= i18next.detectLanguage.js
    //= i18next.plurals.js
    //= i18next.postProcessor.js
    //= i18next.postProcessor.sprintf.js
    //= i18next.api.js

    $.i18n = i18n;
    $.t = i18n.t;

    return i18n;

}));
