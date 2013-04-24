function init(options, cb) {
    
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = options || {};
    
    // override defaults with passed in options
    f.extend(o, options);

    // create namespace object if namespace is passed in as string
    if (typeof o.ns == 'string') {
        o.ns = { namespaces: [o.ns], defaultNs: o.ns};
    }

    // fallback namespaces
    if (typeof o.fallbackNS == 'string') {
        o.fallbackNS = [o.fallbackNS];
    }

    // escape prefix/suffix
    o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);
    o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);

    if (!o.lng) o.lng = f.detectLanguage(); 
    if (o.lng) {
        // set cookie with lng set (as detectLanguage will set cookie on need)
        if (o.useCookie) f.cookie.create(o.cookieName, o.lng, o.cookieExpirationTime);
    } else {
        o.lng =  o.fallbackLng;
        if (o.useCookie) f.cookie.remove(o.cookieName);
    }

    languages = f.toLanguages(o.lng);
    currentLng = languages[0];
    f.log('currentLng set to: ' + currentLng);

    pluralExtensions.setCurrentLng(currentLng);

    // add JQuery extensions
    if ($ && o.setJqueryExt) addJqueryFunct();

    // jQuery deferred
    var deferred;
    if ($ && $.Deferred) {
        deferred = $.Deferred();
    }

    // return immidiatly if res are passed in
    if (o.resStore) {
        resStore = o.resStore;
        if (cb) cb(translate);
        if (deferred) deferred.resolve();
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

        if (cb) cb(translate);
        if (deferred) deferred.resolve();
    });

    if (deferred) return deferred.promise();
}