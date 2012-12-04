function applyReplacement(str, replacementHash, nestedKey) {
    if (str.indexOf(o.interpolationPrefix) < 0) return str;

    f.each(replacementHash, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            str = applyReplacement(str, value, nestedKey ? nestedKey + '.' + key : key);
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

    if (!resStore) { return notfound; } // no resStore to translate from

    var optionWithoutCount, translated
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

    var ns = options.ns || o.ns.defaultNs;
    if (key.indexOf(o.nsseparator) > -1) {
        var parts = key.split(o.nsseparator);
        ns = parts[0];
        key = parts[1];
    }

    if (hasContext(options)) {
        optionWithoutCount = f.extend({}, options);
        delete optionWithoutCount.context;
        optionWithoutCount.defaultValue = o.contextNotFound;

        var contextKey = ns + ':' + key + '_' + options.context;
        
        translated = translate(contextKey, optionWithoutCount);
        if (translated != o.contextNotFound) {
            return applyReplacement(translated, { context: options.context }); // apply replacement for context only
        } // else continue translation with original/nonContext key
    }

    if (needsPlural(options)) {
        optionWithoutCount = f.extend({}, options);
        delete optionWithoutCount.count;
        optionWithoutCount.defaultValue = o.pluralNotFound;

        var pluralKey = ns + ':' + key + o.pluralSuffix;
        var pluralExtension = pluralExtensions.get(currentLng, options.count);
        if (pluralExtension >= 0) { 
            pluralKey = pluralKey + '_' + pluralExtension; 
        } else if (pluralExtension === 1) {
            pluralKey = ns + ':' + key; // singular
        }
        
        translated = translate(pluralKey, optionWithoutCount);
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
        if (value !== undefined) {
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
                        value[m] = _translate(ns + ':' + key + '.' + m, options);
                    }
                }
            }
            found = value;
        }
    }

    if (found === undefined && o.sendMissing) {
        if (options.lng) {
            sync.postMissing(options.lng, ns, key, notfound, lngs);
        } else {
            sync.postMissing(o.lng, ns, key, notfound, lngs);
        }
    }

    var postProcessor = options.postProcess || o.postProcess;
    if (found !== undefined && postProcessor) {
        if (postProcessors[postProcessor]) {
            found = postProcessors[postProcessor](found, key, options);
        }
    }

    if (found === undefined) {
        notfound = applyReplacement(notfound, options);
        notfound = applyReuse(notfound, options);
    }

    return (found !== undefined) ? found : notfound;
}
