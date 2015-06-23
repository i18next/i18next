(function (root, factory) {
    if (typeof exports === 'object') {

        module.exports = factory();

    } else if (typeof define === 'function' && define.amd) {

        define([], factory);

    }
}(this, function () {

    //= i18next.shim.js

    var $ = undefined
        , i18n = {}
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

    return i18n;

}));
