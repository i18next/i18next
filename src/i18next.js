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
        useLocalStorage: true,

        dynamicLoad: false,
        sendMissing: false,
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
        }
    };

    var resStore
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

        languages = [];
        if (o.lng.indexOf('-') === 2 && o.lng.length === 5) {
            var parts = o.lng.split('-');

            o.lng = o.lowerCaseLng ? 
                parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();

            languages.push(o.lng);
            languages.push(o.lng.substr(0, 2));
        } else {
            languages.push(o.lng);
        }

        if (languages.indexOf(o.fallbackLng) === -1) languages.push(o.fallbackLng);
        currentLng = o.lng;
        f.log('currentLng set to: ' + currentLng);

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

        // else load them
        i18n.sync.load(languages, o, function(err, store) {
            resStore = store;
            if (cb) cb(translate);
            if (deferred) deferred.resolve();
        });

        return deferred;
    }

    function setLng(lng, cb) {
        init({lng: lng}, cb);
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
        while (translated.indexOf(o.reusePrefix) != -1) {
            replacementCounter++;
            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
            var index_of_opening = translated.indexOf(o.reusePrefix);
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening, index_of_end_of_closing);
            var token_sans_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');
            var translated_token = _translate(token_sans_symbols,options);
            translated = translated.replace(token,translated_token);
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
          , notfound = options.defaultValue || key;

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

            var contextKey = key + '_' + options.context;
            
            translated = translate(contextKey, optionsSansCount);
            if (translated != o.contextNotFound) {
                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
            } // else continue translation with original/nonContext key
        }

        if (needsPlural(options)) {
            optionsSansCount = f.extend({}, options);
            delete optionsSansCount.count;
            optionsSansCount.defaultValue = o.pluralNotFound;

            var pluralKey = key + o.pluralSuffix;
            var pluralExtension = pluralExtensions.get(currentLng, options.count);
            if (pluralExtension !== 'other') { pluralKey = pluralKey + '_' + pluralExtension; }
            
            translated = translate(pluralKey, optionsSansCount);
            if (translated != o.pluralNotFound) {
                return applyReplacement(translated, { count: options.count }); // apply replacement for count only
            } // else continue translation with original/singular key
        }

        var found;
        var keys = key.split(o.keyseparator);
        for (var i = 0, len = languages.length; i < len; i++ ) {
            if (found) break;

            var l = languages[i];

            var x = 0;
            var value = resStore[l][ns];
            while (keys[x]) {
                value = value && value[keys[x]];
                x++;
            }
            if (value) {
                if (typeof value !== 'string') {
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
                } else {
                    value = applyReplacement(value, options);
                    value = applyReuse(value, options);
                }
                found = value;
            }
        }

        if (!found && o.sendMissing) {
            sync.postMissing(ns, key, notfound);
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
                sync._loadLocal(lngs, function(err, store) {
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

        _loadLocal: function(lngs, cb) {
            var store = {};

            if(window.localStorage) {

                var todo = lngs.length;

                f.each(lngs, function(key, lng) {
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

        _fetch: function(lngs, options, cb) {
            var ns = options.ns
              , store = {};
            
            if (!options.dynamicLoad) {
                var todo = ns.namespaces.length * lngs.length
                  , errors;

                // load each file individual
                f.each(ns.namespaces, function(nsIndex, nsValue) {
                    f.each(lngs, function(lngIndex, lngValue) {
                        sync._fetchOne(lngValue, nsValue, function(err, data) {
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
                var url = applyReplacement(o.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
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
                    async : o.getAsync
                });         
            }
        },

        _fetchOne: function(lng, ns, done) {
            var url = applyReplacement(o.resGetPath, { lng: lng, ns: ns });
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
                async : o.getAsync
            });
        },

        postMissing: function(ns, key, defaultValue) {
            var payload = {};
            payload[key] = defaultValue;

            var url = applyReplacement(o.resPostPath, { lng: o.fallbackLng, ns: ns });
            f.ajax({
                url: url,
                type: o.sendType,
                data: payload,
                success: function(data, status, xhr) {
                    f.log('posted missing key \'' + key + '\' to: ' + url);
                    resStore[o.fallbackLng][ns][key] = defaultValue;
                },
                error : function(xhr, status, error) {
                    f.log('failed posting missing key \'' + key + '\' to: ' + url);
                },
                dataType: "json",
                async : o.postAsync
            });
        }
    };

    // definition http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
    var pluralExtensions = {
        
        rules: {
            'sl': function (n) {
                return n % 100 === 1 ? 'one' : n % 100 === 2 ? 'two' : n % 100 === 3 || n % 100 === 4 ? 'few' : 'other';
            },
            'ar': function (n) {
                return n === 0 ? 'zero' : n === 1 ? 'one' : n === 2 ? 'two' : n % 100 >= 3 && n % 100 <= 10 ? 'few' : n % 100 >= 11 && n % 100 <= 99 ? 'many' : 'other';
            }
        },

        // for demonstration only sl and ar is added but you can add your own pluralExtensions
        addRule: function(lng, fc) {
            pluralExtensions.rules[lng] = fc;    
        },

        get: function(lng, count) {
            var parts = lng.split('-');

            function getResult(l, c) {
                if (pluralExtensions.rules[l]) {
                    return pluralExtensions.rules[l](c);
                } else {
                    return c === 1 ? 'one' : 'other';
                }
            }
                        
            if (parts.length === 2) {
                return getResult(parts[0], count);
            } else {
                return getResult(lng, count);
            }
        }

    };

    // public api interface
    i18n.init = init;
    i18n.setLng = setLng;
    i18n.t = translate;
    i18n.translate = translate;
    i18n.detectLanguage = f.detectLanguage;
    i18n.pluralExtensions = pluralExtensions;
    i18n.sync = sync;
    i18n.functions = f;
    i18n.lng = lng;
    i18n.options = o;

})();