function init(options, cb) {

    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = options || {};

    // override defaults with passed in options
    f.extend(o, options);
    delete o.fixLng; /* passed in each time */

    // override functions: .log(), .detectLanguage(), etc
    if (o.functions) {
        delete o.functions;
        f.extend(f, options.functions);
    }

    // create namespace object if namespace is passed in as string
    if (typeof o.ns == 'string') {
        o.ns = { namespaces: [o.ns], defaultNs: o.ns};
    }

    // fallback namespaces
    if (typeof o.fallbackNS == 'string') {
        o.fallbackNS = [o.fallbackNS];
    }

    // fallback languages
    if (typeof o.fallbackLng == 'string' || typeof o.fallbackLng == 'boolean') {
        o.fallbackLng = [o.fallbackLng];
    }

    // escape prefix/suffix
    o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);
    o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);

    if (!o.lng) o.lng = f.detectLanguage();

    languages = f.toLanguages(o.lng);
    currentLng = languages[0];
    f.log('currentLng set to: ' + currentLng);

    if (o.useCookie && f.cookie.read(o.cookieName) !== currentLng){ //cookie is unset or invalid
        f.cookie.create(o.cookieName, currentLng, o.cookieExpirationTime, o.cookieDomain);
    }
    if (o.detectLngFromLocalStorage && typeof document !== 'undefined' && window.localStorage) {
        f.localStorage.setItem('i18next_lng', currentLng);
    }

    var lngTranslate = translate;
    if (options.fixLng) {
        lngTranslate = function(key, options) {
            options = options || {};
            options.lng = options.lng || lngTranslate.lng;
            return translate(key, options);
        };
        lngTranslate.lng = currentLng;
    }

    pluralExtensions.setCurrentLng(currentLng);

    // add JQuery extensions
    if ($ && o.setJqueryExt) {
        addJqueryFunct && addJqueryFunct();
    } else {
       addJqueryLikeFunctionality && addJqueryLikeFunctionality();
    }

    // jQuery deferred
    var deferred;
    if ($ && $.Deferred) {
        deferred = $.Deferred();
    }

    // return immidiatly if res are passed in
    if (o.resStore) {
        resStore = o.resStore;
        initialized = true;
        if (cb) cb(null, lngTranslate);
        if (deferred) deferred.resolve(lngTranslate);
        if (deferred) return deferred.promise();
        return;
    }

    // languages to load
    var lngsToLoad = f.toLanguages(o.lng);
    if (typeof o.preload === 'string') o.preload = [o.preload];
    for (var i = 0, l = o.preload.length; i < l; i++) {
        var pres = f.toLanguages(o.preload[i]);
        for (var y = 0, len = pres.length; y < len; y++) {
            if (lngsToLoad.indexOf(pres[y]) < 0) {
                lngsToLoad.push(pres[y]);
            }
        }
    }

    // else load them
    i18n.sync.load(lngsToLoad, o, function(err, store) {
        resStore = store;
        initialized = true;

        if (cb) cb(err, lngTranslate);
        if (deferred) (!err ? deferred.resolve : deferred.reject)(err || lngTranslate);
    });

    if (deferred) return deferred.promise();
}

function isInitialized() {
    return initialized;
}
