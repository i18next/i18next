(function() {

    // add indexOf to non ECMA-262 standard compliant browsers
    if (!Array.prototype.indexOf) {  
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {  
            "use strict";  
            if (this == null) {  
                throw new TypeError();  
            }  
            var t = Object(this);  
            var len = t.length >>> 0;  
            if (len === 0) {  
                return -1;  
            }  
            var n = 0;  
            if (arguments.length > 0) {  
                n = Number(arguments[1]);  
                if (n != n) { // shortcut for verifying if it's NaN  
                    n = 0;  
                } else if (n != 0 && n != Infinity && n != -Infinity) {  
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));  
                }  
            }  
            if (n >= len) {  
                return -1;  
            }  
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
            for (; k < len; k++) {  
                if (k in t && t[k] === searchElement) {  
                    return k;  
                }  
            }  
            return -1;  
        }
    }  

    var root = this
      , $ = root.jQuery
      , i18n = {};

    // Export the i18next object for **CommonJS**. 
    // If we're not in CommonJS, add `i18n` to the
    // global object or to jquery.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = i18n;
    } else if (typeof define === 'function' && define.amd) {
        define(i18n);
    } else {
        if ($) {
            $.i18n = $.i18n || i18n;
        } else {
            root.i18n = root.i18n || i18n;
        }
    }

    // defaults
    var o = {
        lng: undefined,
        preload: [],
        lowerCaseLng: false,
        returnObjectTrees: false,
        fallbackLng: 'dev',
        ns: 'translation',
        nsseparator: ':',
        keyseparator: '.',
        debug: false,
        
        resGetPath: 'locales/__lng__/__ns__.json',
        resPostPath: 'locales/add/__lng__/__ns__',

        getAsync: true,
        postAsync: true,

        resStore: undefined,
        useLocalStorage: false,
        localStorageExpirationTime: 7*24*60*60*1000,

        dynamicLoad: false,
        sendMissing: false,
        sendMissingTo: 'fallback', // current | all
        sendType: 'POST',

        interpolationPrefix: '__',
        interpolationSuffix: '__',
        reusePrefix: '$t(',
        reuseSuffix: ')',
        pluralSuffix: '_plural',
        pluralNotFound: ['plural_not_found', Math.random()].join(''),
        contextNotFound: ['context_not_found', Math.random()].join(''),

        setJqueryExt: true,
        useDataAttrOptions: false,
        cookieExpirationTime: undefined
    };

    // move dependent functions to a container so that
    // they can be overriden easier in no jquery environment (node.js)
    var f = {
        extend: $ ? $.extend : undefined,
        each: $ ? $.each : undefined,
        ajax: $ ? $.ajax : undefined,
        detectLanguage: detectLanguage,
        log: function(str) {
            if (o.debug) console.log(str);
        },
        cookie: {
            create: function(name,value,minutes) {
                var expires;
                if (minutes) {
                    var date = new Date();
                    date.setTime(date.getTime()+(minutes*60*1000));
                    expires = "; expires="+date.toGMTString();
                }
                else expires = "";
                document.cookie = name+"="+value+expires+"; path=/";
            },
            
            read: function(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            },
            
            remove: function(name) {
                    this.create(name,"",-1);
            }
        },
        toLanguages: function(lng) {
            var languages = [];
            if (lng.indexOf('-') === 2 && lng.length === 5) {
                var parts = lng.split('-');

                lng = o.lowerCaseLng ? 
                    parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                    parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();

                languages.push(lng);
                languages.push(lng.substr(0, 2));
            } else {
                languages.push(lng);
            }

            if (languages.indexOf(o.fallbackLng) === -1) languages.push(o.fallbackLng);

            return languages;
        }
    };

    var resStore = {}
      , currentLng
      , replacementCounter = 0
      , languages = [];

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

        if (!o.lng) o.lng = f.detectLanguage(); 
        if (o.lng) {
            // set cookie with lng set (as detectLanguage will set cookie on need)
            f.cookie.create('i18next', o.lng, o.cookieExpirationTime);
        } else {
            o.lng =  o.fallbackLng;
            f.cookie.remove('i18next');
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
            return deferred;
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

        return deferred;
    }

    function preload(lngs, cb) {
        if (typeof lngs === 'string') lngs = [lngs];
        for (var i = 0, l = lngs.length; i < l; i++) {
            if (o.preload.indexOf(lngs[i]) < 0) {
                o.preload.push(lngs[i]);
            }
        }
        return init(cb);
    }

    function setLng(lng, cb) {
        return init({lng: lng}, cb);
    }

    function addJqueryFunct() {
        // $.t shortcut
        $.t = $.t || translate;

        function parse(ele, key, options) {
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

            var optionsToUse;
            if (attr === 'html') {
                optionsToUse = $.extend({ defaultValue: ele.html() }, options);
                ele.html($.t(key, optionsToUse));
            } 
            else if (attr === 'text') {
                optionsToUse = $.extend({ defaultValue: ele.text() }, options);
                ele.text($.t(key, optionsToUse));
            } else {
                optionsToUse = $.extend({ defaultValue: ele.attr(attr) }, options);
                ele.attr(attr, $.t(key, optionsToUse));
            }
        }

        function localize(ele, options) {
            var key = ele.attr('data-i18n');
            if (!key) return;

            if (!options && o.useDataAttrOptions === true) {
                options = ele.data("i18n-options");
            }
            options = options || {};

            if (key.indexOf(';') <= key.length-1) {
                var keys = key.split(';');

                $.each(keys, function(m, k) {
                    parse(ele, k, options);
                });

            } else {
                parse(ele, k, options);
            }

            if (o.useDataAttrOptions === true) ele.data("i18n-options", options);
        }

        // fn
        $.fn.i18n = function (options) {
            return this.each(function() {
                // localize element itself
                localize($(this), options);

                // localize childs
                var elements =  $(this).find('[data-i18n]');
                elements.each(function() { 
                    localize($(this), options);
                });
            });
        };
    }

    function applyReplacement(str, replacementHash, nestedKey) {
        if (str.indexOf(o.interpolationPrefix) < 0) return str;

        f.each(replacementHash, function(key, value) {
            if (typeof value === 'object') {
                str = applyReplacement(str, value, key);
            } else {
                str = str.replace(new RegExp([o.interpolationPrefix, nestedKey ? nestedKey + '.' + key : key, o.interpolationSuffix].join(''), 'g'), value);
            }
        });
        return str;
    }

    function applyReuse(translated, options){
        var opts = f.extend({}, options);
        delete opts.postProcess;

        while (translated.indexOf(o.reusePrefix) != -1) {
            replacementCounter++;
            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
            var index_of_opening = translated.indexOf(o.reusePrefix);
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening, index_of_end_of_closing);
            var token_sans_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');
            var translated_token = _translate(token_sans_symbols, opts);
            translated = translated.replace(token, translated_token);
        }
        return translated;
    }

    function hasContext(options) {
        return (options.context && typeof options.context == 'string');
    }

    function needsPlural(options) {
        return (options.count !== undefined && typeof options.count != 'string' && options.count !== 1);
    }

    function translate(key, options){
        replacementCounter = 0;
        return _translate(key, options);
    }

    function _translate(key, options){
        options = options || {};

        var optionsSansCount, translated
          , notfound = options.defaultValue || key
          , lngs = languages;

        if (options.lng) {
            lngs = f.toLanguages(options.lng);

            if (!resStore[lngs[0]]) {
                var oldAsync = o.getAsync;
                o.getAsync = false;

                i18n.sync.load(lngs, o, function(err, store) {
                    f.extend(resStore, store);
                    o.getAsync = oldAsync;
                });
            }
        }

        if (!resStore) { return notfound; } // no resStore to translate from

        var ns = o.ns.defaultNs;
        if (key.indexOf(o.nsseparator) > -1) {
            var parts = key.split(o.nsseparator);
            ns = parts[0];
            key = parts[1];
        }

        if (hasContext(options)) {
            optionsSansCount = f.extend({}, options);
            delete optionsSansCount.context;
            optionsSansCount.defaultValue = o.contextNotFound;

            var contextKey = ns + ':' + key + '_' + options.context;
            
            translated = translate(contextKey, optionsSansCount);
            if (translated != o.contextNotFound) {
                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
            } // else continue translation with original/nonContext key
        }

        if (needsPlural(options)) {
            optionsSansCount = f.extend({}, options);
            delete optionsSansCount.count;
            optionsSansCount.defaultValue = o.pluralNotFound;

            var pluralKey = ns + ':' + key + o.pluralSuffix;
            var pluralExtension = pluralExtensions.get(currentLng, options.count);
            if (pluralExtension >= 0) { 
                pluralKey = pluralKey + '_' + pluralExtension; 
            } else if (pluralExtension === 1) {
                pluralKey = ns + ':' + key; // singular
            }
            
            translated = translate(pluralKey, optionsSansCount);
            if (translated != o.pluralNotFound) {
                return applyReplacement(translated, { count: options.count }); // apply replacement for count only
            } // else continue translation with original/singular key
        }

        var found;
        var keys = key.split(o.keyseparator);
        for (var i = 0, len = lngs.length; i < len; i++ ) {
            if (found) break;

            var l = lngs[i];

            var x = 0;
            var value = resStore[l] && resStore[l][ns];
            while (keys[x]) {
                value = value && value[keys[x]];
                x++;
            }
            if (value) {
                if (typeof value === 'string') {
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else if (Object.prototype.toString.apply(value) === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {
                    value = value.join('\n');
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                } else {
                    if (!o.returnObjectTrees && !options.returnObjectTrees) {
                        value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' + 
                                'returned a object instead of string.';
                        f.log(value);
                    } else {
                        for (var m in value) {
                            // apply translation on childs
                            value[m] = _translate(key + '.' + m, options);
                        }
                    }
                }
                found = value;
            }
        }

        if (!found && o.sendMissing) {
            if (options.lng) {
                sync.postMissing(options.lng, ns, key, notfound, lngs);
            } else {
                sync.postMissing(o.lng, ns, key, notfound, lngs);
            }
        }

        if (found && options.postProcess) {
            if (postProcessors[options.postProcess]) {
                found = postProcessors[options.postProcess](found, key, options);
            }
        }

        if (!found) {
            notfound = applyReplacement(notfound, options);
            notfound = applyReuse(notfound, options);
        }

        return (found) ? found : notfound;
    }

    function detectLanguage() {
        var detectedLng;

        // get from qs
        var qsParm = [];
        (function() {
            var query = window.location.search.substring(1);
            var parms = query.split('&');
            for (var i=0; i<parms.length; i++) {
                var pos = parms[i].indexOf('=');
                if (pos > 0) {
                    var key = parms[i].substring(0,pos);
                    var val = parms[i].substring(pos+1);
                    qsParm[key] = val;
                }
            }
        })();
        if (qsParm.setLng) {
            detectedLng = qsParm.setLng;
        }

        // get from cookie
        if (!detectedLng) {
            var c = f.cookie.read('i18next');
            if (c) detectedLng = c;
        }

        // get from navigator
        if (!detectedLng && navigator) {
            detectedLng =  (navigator.language) ? navigator.language : navigator.userLanguage;
        }
        
        return detectedLng;
    }

    function lng() {
        return currentLng;
    }

    var sync = {

        load: function(lngs, options, cb) {
            if (options.useLocalStorage) {
                sync._loadLocal(lngs, options, function(err, store) {
                    var missingLngs = [];
                    for (var i = 0, len = lngs.length; i < len; i++) {
                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);
                    }

                    if (missingLngs.length > 0) {
                        sync._fetch(missingLngs, options, function(err, fetched){
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
                        sync._fetchOne(lngValue, nsValue, options, function(err, data) {
                            if (err) {
                                errors = errors || [];
                                errors.push(err);
                            }
                            store[lngValue] = store[lngValue] || {};
                            store[lngValue][nsValue] = data;

                            todo--; // wait for all done befor callback
                            if (todo === 0) cb(errors, store);
                        });
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

    // definition http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
    var pluralExtensions = {

        rules: {
            "ach": {
                "name": "Acholi", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "af": {
                "name": "Afrikaans", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ak": {
                "name": "Akan", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "am": {
                "name": "Amharic", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "an": {
                "name": "Aragonese", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ar": {
                "name": "Arabic", 
                "numbers": [
                    0, 
                    1, 
                    2, 
                    3, 
                    11, 
                    100
                ], 
                "plurals": function(n) { return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5); }
            }, 
            "arn": {
                "name": "Mapudungun", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "ast": {
                "name": "Asturian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ay": {
                "name": "Aymar\u00e1", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "az": {
                "name": "Azerbaijani", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "be": {
                "name": "Belarusian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "bg": {
                "name": "Bulgarian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "bn": {
                "name": "Bengali", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "bo": {
                "name": "Tibetan", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "br": {
                "name": "Breton", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "bs": {
                "name": "Bosnian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "ca": {
                "name": "Catalan", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "cgg": {
                "name": "Chiga", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "cs": {
                "name": "Czech", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
            }, 
            "csb": {
                "name": "Kashubian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "cy": {
                "name": "Welsh", 
                "numbers": [
                    3, 
                    1, 
                    2, 
                    8
                ], 
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3); }
            }, 
            "da": {
                "name": "Danish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "de": {
                "name": "German", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "dz": {
                "name": "Dzongkha", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "el": {
                "name": "Greek", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "en": {
                "name": "English", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "eo": {
                "name": "Esperanto", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "es": {
                "name": "Spanish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "es_ar": {
                "name": "Argentinean Spanish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "et": {
                "name": "Estonian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "eu": {
                "name": "Basque", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "fa": {
                "name": "Persian", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "fi": {
                "name": "Finnish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "fil": {
                "name": "Filipino", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "fo": {
                "name": "Faroese", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "fr": {
                "name": "French", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "fur": {
                "name": "Friulian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "fy": {
                "name": "Frisian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ga": {
                "name": "Irish", 
                "numbers": [
                    3, 
                    1, 
                    2, 
                    7, 
                    11
                ], 
                "plurals": function(n) { return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;}
            }, 
            "gd": {
                "name": "Scottish Gaelic", 
                "numbers": [
                    20, 
                    1, 
                    2, 
                    3
                ], 
                "plurals": function(n) { return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3); }
            }, 
            "gl": {
                "name": "Galician", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "gu": {
                "name": "Gujarati", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "gun": {
                "name": "Gun", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "ha": {
                "name": "Hausa", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "he": {
                "name": "Hebrew", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "hi": {
                "name": "Hindi", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "hr": {
                "name": "Croatian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "hu": {
                "name": "Hungarian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "hy": {
                "name": "Armenian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ia": {
                "name": "Interlingua", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "id": {
                "name": "Indonesian", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "is": {
                "name": "Icelandic", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n%10!=1 || n%100==11); }
            }, 
            "it": {
                "name": "Italian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ja": {
                "name": "Japanese", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "jbo": {
                "name": "Lojban", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "jv": {
                "name": "Javanese", 
                "numbers": [
                    0, 
                    1
                ], 
                "plurals": function(n) { return Number(n !== 0); }
            }, 
            "ka": {
                "name": "Georgian", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "kk": {
                "name": "Kazakh", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "km": {
                "name": "Khmer", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "kn": {
                "name": "Kannada", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ko": {
                "name": "Korean", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "ku": {
                "name": "Kurdish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "kw": {
                "name": "Cornish", 
                "numbers": [
                    4, 
                    1, 
                    2, 
                    3
                ], 
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3); }
            }, 
            "ky": {
                "name": "Kyrgyz", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "lb": {
                "name": "Letzeburgesch", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ln": {
                "name": "Lingala", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "lo": {
                "name": "Lao", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "lt": {
                "name": "Lithuanian", 
                "numbers": [
                    10, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "lv": {
                "name": "Latvian", 
                "numbers": [
                    0, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2); }
            }, 
            "mai": {
                "name": "Maithili", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "mfe": {
                "name": "Mauritian Creole", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "mg": {
                "name": "Malagasy", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "mi": {
                "name": "Maori", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "mk": {
                "name": "Macedonian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n==1 || n%10==1 ? 0 : 1); }
            }, 
            "ml": {
                "name": "Malayalam", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "mn": {
                "name": "Mongolian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "mnk": {
                "name": "Mandinka", 
                "numbers": [
                    0, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(0 ? 0 : n==1 ? 1 : 2); }
            }, 
            "mr": {
                "name": "Marathi", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ms": {
                "name": "Malay", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "mt": {
                "name": "Maltese", 
                "numbers": [
                    2, 
                    1, 
                    11, 
                    20
                ], 
                "plurals": function(n) { return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3); }
            }, 
            "nah": {
                "name": "Nahuatl", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "nap": {
                "name": "Neapolitan", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "nb": {
                "name": "Norwegian Bokmal", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ne": {
                "name": "Nepali", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "nl": {
                "name": "Dutch", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "nn": {
                "name": "Norwegian Nynorsk", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "no": {
                "name": "Norwegian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "nso": {
                "name": "Northern Sotho", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "oc": {
                "name": "Occitan", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "or": {
                "name": "Oriya", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "pa": {
                "name": "Punjabi", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "pap": {
                "name": "Papiamento", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "pl": {
                "name": "Polish", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "pms": {
                "name": "Piemontese", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ps": {
                "name": "Pashto", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "pt": {
                "name": "Portuguese", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "pt_br": {
                "name": "Brazilian Portuguese", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "rm": {
                "name": "Romansh", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ro": {
                "name": "Romanian", 
                "numbers": [
                    2, 
                    1, 
                    20
                ], 
                "plurals": function(n) { return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2); }
            }, 
            "ru": {
                "name": "Russian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "sah": {
                "name": "Yakut", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "sco": {
                "name": "Scots", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "se": {
                "name": "Northern Sami", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "si": {
                "name": "Sinhala", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "sk": {
                "name": "Slovak", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
            }, 
            "sl": {
                "name": "Slovenian", 
                "numbers": [
                    5, 
                    1, 
                    2, 
                    3
                ], 
                "plurals": function(n) { return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
            }, 
            "so": {
                "name": "Somali", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "son": {
                "name": "Songhay", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "sq": {
                "name": "Albanian", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "sr": {
                "name": "Serbian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "su": {
                "name": "Sundanese", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "sv": {
                "name": "Swedish", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "sw": {
                "name": "Swahili", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "ta": {
                "name": "Tamil", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "te": {
                "name": "Telugu", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "tg": {
                "name": "Tajik", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "th": {
                "name": "Thai", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "ti": {
                "name": "Tigrinya", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "tk": {
                "name": "Turkmen", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "tr": {
                "name": "Turkish", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "tt": {
                "name": "Tatar", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "ug": {
                "name": "Uyghur", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "uk": {
                "name": "Ukrainian", 
                "numbers": [
                    5, 
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            }, 
            "ur": {
                "name": "Urdu", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "uz": {
                "name": "Uzbek", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "vi": {
                "name": "Vietnamese", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "wa": {
                "name": "Walloon", 
                "numbers": [
                    1, 
                    2
                ], 
                "plurals": function(n) { return Number(n > 1); }
            }, 
            "wo": {
                "name": "Wolof", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }, 
            "yo": {
                "name": "Yoruba", 
                "numbers": [
                    2, 
                    1
                ], 
                "plurals": function(n) { return Number(n != 1); }
            }, 
            "zh": {
                "name": "Chinese", 
                "numbers": [
                    1
                ], 
                "plurals": function(n) { return 0; }
            }
        },

        // for demonstration only sl and ar is added but you can add your own pluralExtensions
        addRule: function(lng, obj) {
            pluralExtensions.rules[lng] = obj;    
        },

        setCurrentLng: function(lng) {
            if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {
                var parts = lng.split('-');

                pluralExtensions.currentRule = {
                    lng: lng,
                    rule: pluralExtensions.rules[parts[0]]
                };
            }
        },

        get: function(lng, count) {
            var parts = lng.split('-');

            function getResult(l, c) {
                var ext;
                if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
                    ext = pluralExtensions.currentRule.rule; 
                } else {
                    ext = pluralExtensions.rules[l];
                }
                if (ext) {
                    var i = ext.plurals(c);
                    var number = ext.numbers[i];
                    if (ext.numbers.length === 2) {
                        if (number === 2) { 
                            number = 1;
                        } else if (number === 1) {
                            number = -1;
                        }
                    } //console.log(count + '-' + number);
                    return number;
                } else {
                    return c === 1 ? '1' : '-1';
                }
            }
                        
            return getResult(parts[0], count);
        }

    };

    var postProcessors = {};
    var addPostProcessor = function(name, fc) {
        postProcessors[name] = fc;
    };

    // public api interface
    i18n.init = init;
    i18n.setLng = setLng;
    i18n.preload = preload;
    i18n.t = translate;
    i18n.translate = translate;
    i18n.detectLanguage = f.detectLanguage;
    i18n.pluralExtensions = pluralExtensions;
    i18n.sync = sync;
    i18n.functions = f;
    i18n.lng = lng;
    i18n.addPostProcessor = addPostProcessor;
    i18n.options = o;

})();