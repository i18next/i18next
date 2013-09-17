function preload(lngs, cb) {
    if (typeof lngs === 'string') lngs = [lngs];
    for (var i = 0, l = lngs.length; i < l; i++) {
        if (o.preload.indexOf(lngs[i]) < 0) {
            o.preload.push(lngs[i]);
        }
    }
    return init(cb);
}

function addResourceBundle(lng, ns, resources) {
    if (typeof ns !== 'string') {
        resources = ns;
        ns = o.ns.defaultNs;
    } else if (o.ns.namespaces.indexOf(ns) < 0) {
        o.ns.namespaces.push(ns);
    }

    resStore[lng] = resStore[lng] || {};
    resStore[lng][ns] = resStore[lng][ns] || {};

    f.extend(resStore[lng][ns], resources);
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
    }
    options.lng = lng;
    return init(options, cb);
}

function lng() {
    return currentLng;
}