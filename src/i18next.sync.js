var sync = {

    load: function(lngs, options, cb) {
        if (options.useLocalStorage) {
            sync._loadLocal(lngs, options, function(err, store) {
                var missingLngs = [];
                for (var i = 0, len = lngs.length; i < len; i++) {
                    if (!store[lngs[i]]) missingLngs.push(lngs[i]);
                }

                if (missingLngs.length > 0) {
                    sync._fetch(missingLngs, options, function(err, fetched) {
                        f.extend(store, fetched);
                        sync._storeLocal(fetched);

                        cb(null, store);
                    });
                } else {
                    cb(null, store);
                }
            });
        } else {
            sync._fetch(lngs, options, function(err, store){
                cb(null, store);
            });
        }
    },

    _loadLocal: function(lngs, options, cb) {
        var store = {}
          , nowMS = new Date().getTime();

        if(window.localStorage) {

            var todo = lngs.length;

            f.each(lngs, function(key, lng) {
                var local = window.localStorage.getItem('res_' + lng);

                if (local) {
                    local = JSON.parse(local);

                    if (local.i18nStamp && local.i18nStamp + options.localStorageExpirationTime > nowMS) {
                        store[lng] = local;
                    }
                }

                todo--; // wait for all done befor callback
                if (todo === 0) cb(null, store);
            });
        }
    },

    _storeLocal: function(store) {
        if(window.localStorage) {
            for (var m in store) {
                store[m].i18nStamp = new Date().getTime();
                window.localStorage.setItem('res_' + m, JSON.stringify(store[m]));
            }
        }
        return;
    },

    _fetch: function(lngs, options, cb) {
        var ns = options.ns
          , store = {};
        
        if (!options.dynamicLoad) {
            var todo = ns.namespaces.length * lngs.length
              , errors;

            // load each file individual
            f.each(ns.namespaces, function(nsIndex, nsValue) {
                f.each(lngs, function(lngIndex, lngValue) {
                    
                    // Call this once our translation has returned.
                    var loadComplete = function(err, data) {
                        if (err) {
                            errors = errors || [];
                            errors.push(err);
                        }
                        store[lngValue] = store[lngValue] || {};
                        store[lngValue][nsValue] = data;

                        todo--; // wait for all done befor callback
                        if (todo === 0) cb(errors, store);
                    };
                    
                    if(typeof options.customLoad == 'function'){
                        // Use the specified custom callback.
                        options.customLoad(lngValue, nsValue, options, loadComplete);
                    } else {
                        //~ // Use our inbuilt sync.
                        sync._fetchOne(lngValue, nsValue, options, loadComplete);
                    }
                });
            });
        } else {
            var url = applyReplacement(options.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
            // load all needed stuff once
            f.ajax({
                url: url,
                success: function(data, status, xhr) {
                    f.log('loaded: ' + url);
                    cb(null, data);
                },
                error : function(xhr, status, error) {
                    f.log('failed loading: ' + url);
                    cb('failed loading resource.json error: ' + error);
                },
                dataType: "json",
                async : options.getAsync
            });         
        }
    },

    _fetchOne: function(lng, ns, options, done) {
        var url = applyReplacement(options.resGetPath, { lng: lng, ns: ns });
        f.ajax({
            url: url,
            success: function(data, status, xhr) {
                f.log('loaded: ' + url);
                done(null, data);
            },
            error : function(xhr, status, error) {
                f.log('failed loading: ' + url);
                done(error, {});
            },
            dataType: "json",
            async : options.getAsync
        });
    },

    postMissing: function(lng, ns, key, defaultValue, lngs) {
        var payload = {};
        payload[key] = defaultValue;

        var urls = [];

        if (o.sendMissingTo === 'fallback') {
            urls.push({lng: o.fallbackLng, url: applyReplacement(o.resPostPath, { lng: o.fallbackLng, ns: ns })});
        } else if (o.sendMissingTo === 'current') {
            urls.push({lng: lng, url: applyReplacement(o.resPostPath, { lng: lng, ns: ns })});
        } else if (o.sendMissingTo === 'all') {
            for (var i = 0, l = lngs.length; i < l; i++) {
                urls.push({lng: lngs[i], url: applyReplacement(o.resPostPath, { lng: lngs[i], ns: ns })});
            }
        }

        for (var y = 0, len = urls.length; y < len; y++) {
            var item = urls[y];
            f.ajax({
                url: item.url,
                type: o.sendType,
                data: payload,
                success: function(data, status, xhr) {
                    f.log('posted missing key \'' + key + '\' to: ' + item.url);
                    resStore[item.lng][ns][key] = defaultValue;
                },
                error : function(xhr, status, error) {
                    f.log('failed posting missing key \'' + key + '\' to: ' + item.url);
                },
                dataType: "json",
                async : o.postAsync
            });
        }
    }
};
