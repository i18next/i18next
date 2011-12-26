(function($) {

    //defaults
    var o = {
        lng: false,
        fallbackLng: 'dev',
        ns: 'translation',
        nsseparator: ':',
        keyseparator: '.',
        
        resGetPath: 'locales/__lng__/__ns__.json',
        resPostPath: 'locales/add/__lng__/__ns__',

        resStore: false,
        useLocalStorage: true,

        dynamicLoad: false,
        sendMissing: false,

        interpolationPrefix: '__',
        interpolationSuffix: '__',
        reusePrefix: '$t(',
        reuseSuffix: ')',
        pluralSuffix: '_plural',
        pluralNotFound: ['plural_not_found', Math.random()].join(''),
        setJqueryExt: true
    };

    var resStore = false
      , currentLng = false
      , replacementCounter = 0
      , languages = [];

    function init(options, cb) {
        $.extend(o, options);

        // namespace
        if (typeof o.ns == 'string') {
            o.ns = { namespaces: [o.ns], defaultNs: o.ns};
        }

        if(!o.lng) { o.lng = detectLanguage(); }
        currentLng = o.lng;
        languages = [];
        languages.push(currentLng);
        if (currentLng.length === 5) { languages.push(currentLng.substr(0, 2)); }
        languages.push(o.fallbackLng);

        // return immidiatly if res are passed in
        if (o.resStore) {
            resStore = o.resStore;
            if (o.setJqueryExt) addJqueryFunct();
            if (cb) cb(translate);
            return;
        }

        // else load them
        sync.load(languages, o.ns, o.useLocalStorage, o.dynamicLoad, function(err, store) {
            resStore = store;
            if (o.setJqueryExt) addJqueryFunct();
            if (cb) cb(translate);
        });
    }

    function setLng(lng, cb) {
        init({lng: lng}, cb);
    }

    function addJqueryFunct() {
        // $.t shortcut
        $.t = $.t || translate;

        var parse = function(ele, key) {
            if (key.length === 0) return;

            var attr = 'text';

            if (key.indexOf('[') === 0) {
                var parts = key.split(']');
                key = parts[1];
                attr = parts[0].substr(1, parts[0].length-1);
            }

            if (key.indexOf(';') === key.length-1) {
                key = key.substr(0, key.length-2);
            }

            if (attr === 'text') {
                ele.text($.t(key, { defaultValue: ele.text() }));
            } else {
                ele.attr(attr, $.t(key, { defaultValue: ele.attr(attr) }));
            }
        };

        // fn
        $.fn.i18n = function (options) {
            return this.each(function () {

                var elements =  $(this).find('[data-i18n]');
                elements.each(function () {
                    var ele = $(this)
                      , key = ele.attr('data-i18n');

                    if (key.indexOf(';') <= key.length-1) {
                        var keys = key.split(';');

                        $.each(keys, function(m, k) {
                            parse(ele, k);
                        });

                    } else {
                        parse(ele, key);
                    }
                });
            });
        };
    }

    function applyReplacement(string,replacementHash){
        $.each(replacementHash,function(key,value){
            string = string.replace([o.interpolationPrefix,key,o.interpolationSuffix].join(''),value);
        });
        return string;
    }

    function applyReuse(translated,options){
        while (translated.indexOf(o.reusePrefix) != -1){
            replacementCounter++;
            if(replacementCounter > o.maxRecursion){break;} // safety net for too much recursion
            var index_of_opening = translated.indexOf(o.reusePrefix);
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix,index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening,index_of_end_of_closing);
            var token_sans_symbols = token.replace(o.reusePrefix,"").replace(o.reuseSuffix,"");
            var translated_token = _translate(token_sans_symbols,options);
            translated = translated.replace(token,translated_token);
        }
        return translated;
    }

    function detectLanguage() {
        if (navigator) {
            return (navigator.language) ? navigator.language : navigator.userLanguage;
        } else {
            return o.fallbackLng;
        }
    }

    function needsPlural(options){
        return (options.count && typeof options.count != 'string' && options.count > 1);
    }

    function translate(key, options){
        replacementCounter = 0;
        return _translate(key, options);
    }

    /*
    options.defaultValue
    options.count
    */
    function _translate(key, options){
        options = options || {};
        var notfound = options.defaultValue || key;

        if (!resStore) { return notfound; } // No resStore to translate from

        var ns = o.ns.defaultNs;
        if (key.indexOf(o.nsseparator) > -1) {
            var parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }

        if (needsPlural(options)) {
            var optionsSansCount = $.extend({},options);
            delete optionsSansCount.count;
            optionsSansCount.defaultValue = o.pluralNotFound;
            var pluralKey = key + o.pluralSuffix;
            var translated = translate(pluralKey,optionsSansCount);
            if (translated != o.pluralNotFound) {
                return applyReplacement(translated,{count:options.count});//apply replacement for count only
            }// else continue translation with original/singular key
        }

        var found;
        for (i = 0, len = languages.length; i < len; i++ ) {
            if (found) break;

            var l = languages[i];

            var keys = key.split(o.keyseparator);
            var x = 0;
            var value = resStore[l][ns];
            while (keys[x]) {
                value = value && value[keys[x]];
                x++;
            }
            if (value) {
                value = applyReplacement(value, options);
                value = applyReuse(value, options);
                found = value;
            }
        }

        if (!found && o.sendMissing) {
            sync.postMissing(ns, key, notfound);
        }

        return (found) ? found : notfound;
    }

    var sync = {

        load: function(lngs, ns, useLocalStorage, dynamicLoad, cb) {
            if (useLocalStorage) {
                sync._loadLocal(lngs, function(err, store) {
                    var missingLngs = [];
                    for (i = 0, len = lngs.length; i < len; i++) {
                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);
                    }

                    if (missingLngs.length > 0) {
                        sync._fetch(missingLngs, ns, dynamicLoad, function(err, fetched){
                            $.extend(store, fetched);
                            sync._storeLocal(fetched);

                            cb(null, store);
                        });
                    } else {
                        cb(null, store);
                    }
                });
            } else {
                sync._fetch(lngs, ns, dynamicLoad, function(err, store){
                    cb(null, store);
                });
            }
        },

        _loadLocal: function(lngs, cb) {
            var store = {};

            if(window.localStorage) {

                var todo = lngs.length;

                $.each(lngs, function(key, lng) {
                    var local = window.localStorage.getItem('res_' + lng);

                    if (local) {
                        store[lng] = JSON.parse(local);
                    }

                    todo--; // wait for all done befor callback
                    if (todo === 0) cb(null, store);
                });
            }
        },

        _storeLocal: function(store) {
            if(window.localStorage) {
                for (var m in store) {
                    window.localStorage.setItem('res_' + m, JSON.stringify(store[m]));
                }
            }
            return;
        },

        _fetch: function(lngs, ns, dynamicLoad, cb) {
            var store = {};
            
            if (!dynamicLoad) {

                var todo = ns.namespaces.length * lngs.length;

                // load each file individual
                $.each(ns.namespaces, function(nsIndex, nsValue) {
                    $.each(lngs, function(lngIndex, lngValue) {
                        sync._fetchOne(lngValue, nsValue, function(err, data) { 
                            store[lngValue] = store[lngValue] || {};
                            store[lngValue][nsValue] = data;

                            todo--; // wait for all done befor callback
                            if (todo === 0) cb(null, store);
                        });
                    });
                });


            } else {

                // load all needed stuff once
                $.ajax({
                    url: applyReplacement(o.resGetPath, {lng: lngs.join('+'), ns: ns.namespaces.join('+')}),
                    success: function(data, status, xhr){
                        cb(null, data);
                    },
                    error : function(xhr, status, error){
                        cb('failed loading resource.json error: ' + error);
                    },
                    dataType: "json"
                });
                
            }
        },

        _fetchOne: function(lng, ns, done) {
            $.ajax({
                url: applyReplacement(o.resGetPath, {lng: lng, ns: ns}),
                success: function(data, status, xhr){
                    done(null, data);
                },
                error : function(xhr, status, error){
                    done(error, {});
                },
                dataType: "json"
            });
        },

        postMissing: function(ns, key, defaultValue) {
            var payload = {};
            payload[key] = defaultValue;

            $.ajax({
                url: applyReplacement(o.resPostPath, {lng: o.fallbackLng, ns: ns}),
                type: 'POST',
                data: payload,
                success: function(data, status, xhr) {
                    resStore[o.fallbackLng][ns][key] = defaultValue;
                },
                error : function(xhr, status, error) {},
                dataType: "json"
            });
        }
    };

    function lng() {
        return currentLng;
    }

    $.i18n = $.i18n || {
        init: init,
        setLng: setLng,
        t: translate,
        translate: translate,
        detectLanguage: detectLanguage,
        lng: lng
    };
})(jQuery);