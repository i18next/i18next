function preload(lngs, cb) {
    if (typeof lngs === 'string') lngs = [lngs];
    for (var i = 0, l = lngs.length; i < l; i++) {
        if (o.preload.indexOf(lngs[i]) < 0) {
            o.preload.push(lngs[i]);
        }
    }
    return init(cb);
}

function addResourceBundle(lng, ns, resources, deep, overwrite) {
    if (typeof ns !== 'string') {
        resources = ns;
        ns = o.ns.defaultNs;
    } else if (o.ns.namespaces.indexOf(ns) < 0) {
        o.ns.namespaces.push(ns);
    }

    resStore[lng] = resStore[lng] || {};
    resStore[lng][ns] = resStore[lng][ns] || {};

    if (deep) {
        f.deepExtend(resStore[lng][ns], resources, overwrite);
    } else {
        f.extend(resStore[lng][ns], resources);
    }
    if (o.useLocalStorage) {
        sync._storeLocal(resStore);
    }
}

function hasResourceBundle(lng, ns) {
    if (typeof ns !== 'string') {
        ns = o.ns.defaultNs;
    }

    resStore[lng] = resStore[lng] || {};
    var res = resStore[lng][ns] || {};

    var hasValues = false;
    for(var prop in res) {
        if (res.hasOwnProperty(prop)) {
            hasValues = true;
        }
    }

    return hasValues;
}

function getResourceBundle(lng, ns) {
    if (typeof ns !== 'string') {
        ns = o.ns.defaultNs;
    }

    resStore[lng] = resStore[lng] || {};
    return f.extend({}, resStore[lng][ns]);
}

function removeResourceBundle(lng, ns) {
    if (typeof ns !== 'string') {
        ns = o.ns.defaultNs;
    }

    resStore[lng] = resStore[lng] || {};
    resStore[lng][ns] = {};
    if (o.useLocalStorage) {
        sync._storeLocal(resStore);
    }
}

function addResource(lng, ns, key, value) {
    if (typeof ns !== 'string') {
        resource = ns;
        ns = o.ns.defaultNs;
    } else if (o.ns.namespaces.indexOf(ns) < 0) {
        o.ns.namespaces.push(ns);
    }

    resStore[lng] = resStore[lng] || {};
    resStore[lng][ns] = resStore[lng][ns] || {};

    var keys = key.split(o.keyseparator);
    var x = 0;
    var node = resStore[lng][ns];
    var origRef = node;

    while (keys[x]) {
        if (x == keys.length - 1)
            node[keys[x]] = value;
        else {
            if (node[keys[x]] == null)
                node[keys[x]] = {};

            node = node[keys[x]];
        }
        x++;
    }
    if (o.useLocalStorage) {
        sync._storeLocal(resStore);
    }
}

function addResources(lng, ns, resources) {
    if (typeof ns !== 'string') {
        resources = ns;
        ns = o.ns.defaultNs;
    } else if (o.ns.namespaces.indexOf(ns) < 0) {
        o.ns.namespaces.push(ns);
    }

    for (var m in resources) {
        if (typeof resources[m] === 'string') addResource(lng, ns, m, resources[m]);
    }
}

function setDefaultNamespace(ns) {
    o.ns.defaultNs = ns;
}

function loadNamespace(namespace, cb) {
    loadNamespaces([namespace], cb);
}

function loadNamespaces(namespaces, cb) {
    var opts = {
        dynamicLoad: o.dynamicLoad,
        resGetPath: o.resGetPath,
        getAsync: o.getAsync,
        customLoad: o.customLoad,
        ns: { namespaces: namespaces, defaultNs: ''} /* new namespaces to load */
    };

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

    // check if we have to load
    var lngNeedLoad = [];
    for (var a = 0, lenA = lngsToLoad.length; a < lenA; a++) {
        var needLoad = false;
        var resSet = resStore[lngsToLoad[a]];
        if (resSet) {
            for (var b = 0, lenB = namespaces.length; b < lenB; b++) {
                if (!resSet[namespaces[b]]) needLoad = true;
            }
        } else {
            needLoad = true;
        }

        if (needLoad) lngNeedLoad.push(lngsToLoad[a]);
    }

    if (lngNeedLoad.length) {
        i18n.sync._fetch(lngNeedLoad, opts, function(err, store) {
            var todo = namespaces.length * lngNeedLoad.length;

            // load each file individual
            f.each(namespaces, function(nsIndex, nsValue) {

                // append namespace to namespace array
                if (o.ns.namespaces.indexOf(nsValue) < 0) {
                    o.ns.namespaces.push(nsValue);
                }

                f.each(lngNeedLoad, function(lngIndex, lngValue) {
                    resStore[lngValue] = resStore[lngValue] || {};
                    resStore[lngValue][nsValue] = store[lngValue][nsValue];

                    todo--; // wait for all done befor callback
                    if (todo === 0 && cb) {
                        if (o.useLocalStorage) i18n.sync._storeLocal(resStore);
                        cb();
                    }
                });
            });
        });
    } else {
        if (cb) cb();
    }
}

function setLng(lng, options, cb) {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    } else if (!options) {
        options = {};
    }

    options.lng = lng;
    return init(options, cb);
}

function lng() {
    return currentLng;
}

function dir() {   
    var rtlLangs = [ "ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm",
        "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb",
        "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he",
        "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo",
        "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam"
    ];

    if ( rtlLangs.some( function( lang ) {
            return new RegExp( '^' + lang ).test( currentLng );
        } ) ) {
        return 'rtl';
    }
    return 'ltr';
}

function reload(cb) {
    resStore = {};
    setLng(currentLng, cb);
}

function noConflict() {
    
    window.i18next = window.i18n;

    if (conflictReference) {
        window.i18n = conflictReference;
    } else {
        delete window.i18n;
    }
}
