function applyReplacement(str, replacementHash, nestedKey, options) {
    if (!str) return str;
    
    options = options || replacementHash; // first call uses replacement hash combined with options
    if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;

    var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
      , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped;

    f.each(replacementHash, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            str = applyReplacement(str, value, nestedKey ? nestedKey + o.keyseparator + key : key, options);
        } else {
            str = str.replace(new RegExp([prefix, nestedKey ? nestedKey + o.keyseparator + key : key, suffix].join(''), 'g'), value);
        }
    });
    return str;
}

// append it to functions
f.applyReplacement = applyReplacement;

function applyReuse(translated, options) {
    var comma = ',';
    var options_open = '{';
    var options_close = '}';

    var opts = f.extend({}, options);
    delete opts.postProcess;

    while (translated.indexOf(o.reusePrefix) != -1) {
        replacementCounter++;
        if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
        var index_of_opening = translated.lastIndexOf(o.reusePrefix);
        var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
        var token = translated.substring(index_of_opening, index_of_end_of_closing);
        var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');


        if (token_without_symbols.indexOf(comma) != -1) {
            var index_of_token_end_of_closing = token_without_symbols.indexOf(comma);
            if (token_without_symbols.indexOf(options_open, index_of_token_end_of_closing) != -1 && token_without_symbols.indexOf(options_close, index_of_token_end_of_closing) != -1) {
                var index_of_opts_opening = token_without_symbols.indexOf(options_open, index_of_token_end_of_closing);
                var index_of_opts_end_of_closing = token_without_symbols.indexOf(options_close, index_of_opts_opening) + options_close.length;
                try {
                    opts = f.extend(opts, JSON.parse(token_without_symbols.substring(index_of_opts_opening, index_of_opts_end_of_closing)));
                    token_without_symbols = token_without_symbols.substring(0, index_of_token_end_of_closing);
                } catch (e) {
                }
            }
        }

        var translated_token = _translate(token_without_symbols, opts);
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

function needsNegative(options) {
    return (options.count !== undefined && typeof options.count === 'number' && options.count === 0);
}

function translate(key, options){
    replacementCounter = 0;
    return _translate(key, options);
}

function exists(key, options) {
    options = options || {};

    var notFound = options.defaultValue || key
        , found = _find(key, options);

    return found !== undefined || found === notFound;
}

function _translate(key, options){
    options = options || {};

    var notFound = options.defaultValue || key
        , found = _find(key, options)
        , lngs = options.lng ? f.toLanguages(options.lng) : languages
        , ns = options.ns || o.ns.defaultNs;

    if (found === undefined && o.sendMissing) {
        if (options.lng) {
            sync.postMissing(lngs[0], ns, key, notfound, lngs);
        } else {
            sync.postMissing(o.lng, ns, key, notFound, lngs);
        }
    }

    var postProcessor = options.postProcess || o.postProcess;
    if (found !== undefined && postProcessor) {
        if (postProcessors[postProcessor]) {
            found = postProcessors[postProcessor](found, key, options);
        }
    }

    if (found === undefined) {
        notFound = applyReplacement(notFound, options);
        notFound = applyReuse(notFound, options);

        if (postProcessor && postProcessors[postProcessor]) {
            found = postProcessors[postProcessor](found, key, options);
        }
    }

    return (found !== undefined) ? found : notFound;
}

function _find(key, options){
    options = options || {};

    if (!resStore) { return notfound; } // no resStore to translate from

    var optionWithoutCount, translated
        , notFound = options.defaultValue || key
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

        var contextKey = ns + o.nsseparator + key + '_' + options.context;

        translated = translate(contextKey, optionWithoutCount);
        if (translated != o.contextNotFound) {
            return applyReplacement(translated, { context: options.context }); // apply replacement for context only
        } // else continue translation with original/nonContext key
    }

    if (needsNegative(options)) {
        optionWithoutCount = f.extend({}, options);
        delete optionWithoutCount.count;
        optionWithoutCount.defaultValue = o.negativeNotFound;

        var negativeKey = ns + o.nsseparator + key + o.negativeSuffix;

        translated = translate(negativeKey, optionWithoutCount);
        if (translated != o.negativeNotFound) {
            return applyReplacement(translated, {
                count: options.count,
                interpolationPrefix: options.interpolationPrefix,
                interpolationSuffix: options.interpolationSuffix
            }); // apply replacement for count only
        } // else continue translation with original/singular key

    }
    else if (needsPlural(options)) {
        optionWithoutCount = f.extend({}, options);
        delete optionWithoutCount.count;
        optionWithoutCount.defaultValue = o.pluralNotFound;

        var pluralKey = ns + o.nsseparator + key + o.pluralSuffix;
        var pluralExtension = pluralExtensions.get(currentLng, options.count);
        if (pluralExtension >= 0) {
            pluralKey = pluralKey + '_' + pluralExtension;
        } else if (pluralExtension === 1) {
            pluralKey = ns + o.nsseparator + key; // singular
        }

        translated = translate(pluralKey, optionWithoutCount);
        if (translated != o.pluralNotFound) {
            return applyReplacement(translated, {
                count: options.count,
                interpolationPrefix: options.interpolationPrefix,
                interpolationSuffix: options.interpolationSuffix
            }); // apply replacement for count only
        } // else continue translation with original/singular key
    }

    var found;
    var keys = key.split(o.keyseparator);
    for (var i = 0, len = lngs.length; i < len; i++ ) {
        if (found !== undefined) break;

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
            } else if (value === null && o.fallbackOnNull === true) {
                value = undefined;
            } else if (value !== null) {
                if (!o.returnObjectTrees && !options.returnObjectTrees) {
                    value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +
                        'returned a object instead of string.';
                    f.log(value);
                } else {
                    var copy = {}; // apply child translation on a copy
                    for (var m in value) {
                        // apply translation on childs
                        copy[m] = _translate(ns + o.nsseparator + key + o.keyseparator + m, options);
                    }
                    value = copy;
                }
            }
            found = value;
        }
    }

    if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length))) { 
        // set flag for fallback lookup - avoid recursion
        options.isFallbackLookup = true;

        if (o.fallbackNS.length) {

            for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {
                found = _translate(o.fallbackNS[y] + o.nsseparator + key, options);
                
                if (found) {
                    /* compare value without namespace */
                    var foundValue = found.indexOf(o.nsseparator) > -1 ? found.split(o.nsseparator)[1] : found
                      , notFoundValue = notFound.indexOf(o.nsseparator) > -1 ? notFound.split(o.nsseparator)[1] : notFound;

                    if (foundValue !== notFoundValue) break;
                }
            }
        } else {
            found = _translate(key, options); // fallback to default NS
        }
    }

    return found;
}
