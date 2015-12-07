function applyReplacement(str, replacementHash, nestedKey, options) {
    if (!str) return str;

    options = options || replacementHash; // first call uses replacement hash combined with options
    if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;

    var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
      , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped
      , keyseparator = options.keyseparator || o.keyseparator
      , unEscapingSuffix = 'HTML'+suffix;

    var hash = replacementHash.replace && typeof replacementHash.replace === 'object' ? replacementHash.replace : replacementHash;
    var replacementRegex = new RegExp([prefix, '(.+?)', '(HTML)?', suffix].join(''), 'g');
    var escapeInterpolation = options.escapeInterpolation || o.escapeInterpolation;
    return str.replace(replacementRegex, function (wholeMatch, keyMatch, htmlMatched) {
        // Check for recursive matches of object
        var objectMatching = hash;
        var keyLeaf = keyMatch;
        while (keyLeaf.indexOf(keyseparator) >= 0 && typeof objectMatching === 'object' && objectMatching) {
            var propName = keyLeaf.slice(0, keyLeaf.indexOf(keyseparator));
            keyLeaf = keyLeaf.slice(keyLeaf.indexOf(keyseparator) + 1);
            objectMatching = objectMatching[propName];
        }
        if (objectMatching && typeof objectMatching === 'object' && objectMatching.hasOwnProperty(keyLeaf)) {
                var value = objectMatching[keyLeaf];
            if (escapeInterpolation && !htmlMatched) {
                return f.escape(objectMatching[keyLeaf]);
            } else {
                return objectMatching[keyLeaf];
            }
        } else {
            return wholeMatch;
        }
    });
}

// append it to functions
f.applyReplacement = applyReplacement;

function applyReuse(translated, options) {
    var comma = ',';
    var options_open = '{';
    var options_close = '}';

    var opts = f.extend({}, options);
    delete opts.postProcess;
    delete opts.isFallbackLookup;

    while (translated.indexOf(o.reusePrefix) != -1) {
        replacementCounter++;
        if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
        var index_of_opening = translated.lastIndexOf(o.reusePrefix);
        var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
        var token = translated.substring(index_of_opening, index_of_end_of_closing);
        var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');

        if (index_of_end_of_closing <= index_of_opening) {
            f.error('there is an missing closing in following translation value', translated);
            return '';
        }

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
        translated = translated.replace(token, f.regexReplacementEscape(translated_token));
    }
    return translated;
}

function hasContext(options) {
    return (options.context && (typeof options.context == 'string' || typeof options.context == 'number'));
}

function needsPlural(options, lng) {
    return (options.count !== undefined && typeof options.count != 'string'/* && pluralExtensions.needsPlural(lng, options.count)*/);
}

function needsIndefiniteArticle(options) {
    return (options.indefinite_article !== undefined && typeof options.indefinite_article != 'string' && options.indefinite_article);
}

function exists(key, options) {
    options = options || {};

    var notFound = _getDefaultValue(key, options)
        , found = _find(key, options);

    return found !== undefined || found === notFound;
}

function translate(key, options) {
    if (!initialized) {
        f.log('i18next not finished initialization. you might have called t function before loading resources finished.')

        if (options && options.defaultValue) {
            return options.detaultValue;
        } else {
            return '';
        }
    };
    replacementCounter = 0;
    return _translate.apply(null, arguments);
}

function _getDefaultValue(key, options) {
    return (options.defaultValue !== undefined) ? options.defaultValue : key;
}

function _injectSprintfProcessor() {

    var values = [];

    // mh: build array from second argument onwards
    for (var i = 1; i < arguments.length; i++) {
        values.push(arguments[i]);
    }

    return {
        postProcess: 'sprintf',
        sprintf:     values
    };
}

function _translate(potentialKeys, options) {
    if (typeof options !== 'undefined' && typeof options !== 'object') {
        if (o.shortcutFunction === 'sprintf') {
            // mh: gettext like sprintf syntax found, automatically create sprintf processor
            options = _injectSprintfProcessor.apply(null, arguments);
        } else if (o.shortcutFunction === 'defaultValue') {
            options = {
                defaultValue: options
            }
        }
    } else {
        options = options || {};
    }

    if (typeof o.defaultVariables === 'object') {
        options = f.extend({}, o.defaultVariables, options);
    }

    if (potentialKeys === undefined || potentialKeys === null || potentialKeys === '') return '';

    if (typeof potentialKeys === 'number') {
        potentialKeys = String(potentialKeys);
    }

    if (typeof potentialKeys === 'string') {
        potentialKeys = [potentialKeys];
    }

    var key = potentialKeys[0];

    if (potentialKeys.length > 1) {
        for (var i = 0; i < potentialKeys.length; i++) {
            key = potentialKeys[i];
            if (exists(key, options)) {
                break;
            }
        }
    }

    var notFound = _getDefaultValue(key, options)
        , found = _find(key, options)
        , nsseparator = options.nsseparator || o.nsseparator
        , lngs = options.lng ? f.toLanguages(options.lng, options.fallbackLng) : languages
        , ns = options.ns || o.ns.defaultNs
        , parts;

    // split ns and key
    if (key.indexOf(nsseparator) > -1) {
        parts = key.split(nsseparator);
        ns = parts[0];
        key = parts[1];
    }

    if (found === undefined && o.sendMissing && typeof o.missingKeyHandler === 'function') {
        if (options.lng) {
            o.missingKeyHandler(lngs[0], ns, key, notFound, lngs);
        } else {
            o.missingKeyHandler(o.lng, ns, key, notFound, lngs);
        }
    }

    var postProcessorsToApply,
        postProcessor,
        j;
    if (typeof o.postProcess === 'string' && o.postProcess !== '') {
        postProcessorsToApply = [o.postProcess];
    } else if (typeof o.postProcess === 'array' || typeof o.postProcess === 'object') {
        postProcessorsToApply = o.postProcess;
    } else {
        postProcessorsToApply = [];
    }

    if (typeof options.postProcess === 'string' && options.postProcess !== '') {
        postProcessorsToApply = postProcessorsToApply.concat([options.postProcess]);
    } else if (typeof options.postProcess === 'array' || typeof options.postProcess === 'object') {
        postProcessorsToApply = postProcessorsToApply.concat(options.postProcess);
    }

    if (found !== undefined && postProcessorsToApply.length) {
        for (j = 0; j < postProcessorsToApply.length; j += 1) {
            postProcessor = postProcessorsToApply[j];
            if (postProcessors[postProcessor]) {
                found = postProcessors[postProcessor](found, key, options);
            }
        }
    }

    // process notFound if function exists
    var splitNotFound = notFound;
    if (notFound.indexOf(nsseparator) > -1) {
        parts = notFound.split(nsseparator);
        splitNotFound = parts[1];
    }
    if (splitNotFound === key && o.parseMissingKey) {
        notFound = o.parseMissingKey(notFound);
    }

    if (found === undefined) {
        notFound = applyReplacement(notFound, options);
        notFound = applyReuse(notFound, options);

        if (postProcessorsToApply.length) {
            found = _getDefaultValue(key, options);
            for (j = 0; j < postProcessorsToApply.length; j += 1) {
                postProcessor = postProcessorsToApply[j];
                if (postProcessors[postProcessor]) {
                    found = postProcessors[postProcessor](found, key, options);
                }
            }
        }
    }

    return (found !== undefined) ? found : notFound;
}

function _find(key, options) {
    options = options || {};

    var optionWithoutCount, translated
        , notFound = _getDefaultValue(key, options)
        , lngs = languages;

    if (!resStore) { return notFound; } // no resStore to translate from

    // CI mode
    if (lngs[0].toLowerCase() === 'cimode') return notFound;

    // passed in lng
    if (options.lngs) lngs = options.lngs;
    if (options.lng) {
        lngs = f.toLanguages(options.lng, options.fallbackLng);

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
    var nsseparator = options.nsseparator || o.nsseparator;
    if (key.indexOf(nsseparator) > -1) {
        var parts = key.split(nsseparator);
        ns = parts[0];
        key = parts[1];
    }

    if (hasContext(options)) {
        optionWithoutCount = f.extend({}, options);
        delete optionWithoutCount.context;
        optionWithoutCount.defaultValue = o.contextNotFound;

        var contextKey = ns + nsseparator + key + '_' + options.context;

        translated = translate(contextKey, optionWithoutCount);
        if (translated != o.contextNotFound) {
            return applyReplacement(translated, { context: options.context }); // apply replacement for context only
        } // else continue translation with original/nonContext key
    }

    if (needsPlural(options, lngs[0])) {
        optionWithoutCount = f.extend({ lngs: [lngs[0]]}, options);
        delete optionWithoutCount.count;
        optionWithoutCount._origLng = optionWithoutCount._origLng || optionWithoutCount.lng || lngs[0];
        delete optionWithoutCount.lng;
        optionWithoutCount.defaultValue = o.pluralNotFound;

        var pluralKey;
        if (!pluralExtensions.needsPlural(lngs[0], options.count)) {
            pluralKey = ns + nsseparator + key;
        } else {
            pluralKey = ns + nsseparator + key + o.pluralSuffix;
            var pluralExtension = pluralExtensions.get(lngs[0], options.count);
            if (pluralExtension >= 0) {
                pluralKey = pluralKey + '_' + pluralExtension;
            } else if (pluralExtension === 1) {
                pluralKey = ns + nsseparator + key; // singular
            }
        }

        translated = translate(pluralKey, optionWithoutCount);

        if (translated != o.pluralNotFound) {
            return applyReplacement(translated, {
                count: options.count,
                interpolationPrefix: options.interpolationPrefix,
                interpolationSuffix: options.interpolationSuffix
            }); // apply replacement for count only
        } else if (lngs.length > 1) {
            // remove failed lng
            var clone = lngs.slice();
            clone.shift();
            options = f.extend(options, { lngs: clone });
            options._origLng = optionWithoutCount._origLng;
            delete options.lng;
            // retry with fallbacks
            translated = translate(ns + nsseparator + key, options);
            if (translated != o.pluralNotFound) return translated;
        } else {
            optionWithoutCount.lng = optionWithoutCount._origLng;
            delete optionWithoutCount._origLng;
            translated = translate(ns + nsseparator + key, optionWithoutCount);

            return applyReplacement(translated, {
                count: options.count,
                interpolationPrefix: options.interpolationPrefix,
                interpolationSuffix: options.interpolationSuffix
            });
        }
    }

    if (needsIndefiniteArticle(options)) {
        var optionsWithoutIndef = f.extend({}, options);
        delete optionsWithoutIndef.indefinite_article;
        optionsWithoutIndef.defaultValue = o.indefiniteNotFound;
        // If we don't have a count, we want the indefinite, if we do have a count, and needsPlural is false
        var indefiniteKey = ns + nsseparator + key + (((options.count && !needsPlural(options, lngs[0])) || !options.count) ? o.indefiniteSuffix : "");
        translated = translate(indefiniteKey, optionsWithoutIndef);
        if (translated != o.indefiniteNotFound) {
            return translated;
        }
    }

    var found;
    var keyseparator = options.keyseparator || o.keyseparator;
    var keys = key.split(keyseparator);
    for (var i = 0, len = lngs.length; i < len; i++ ) {
        if (found !== undefined) break;

        var l = lngs[i];

        var x = 0;
        var value = resStore[l] && resStore[l][ns];
        while (keys[x]) {
            value = value && value[keys[x]];
            x++;
        }
        if (value !== undefined && (!o.showKeyIfEmpty || value !== '')) {
            var valueType = Object.prototype.toString.apply(value);
            if (typeof value === 'string') {
                value = applyReplacement(value, options);
                value = applyReuse(value, options);
            } else if (valueType === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {
                value = value.join('\n');
                value = applyReplacement(value, options);
                value = applyReuse(value, options);
            } else if (value === null && o.fallbackOnNull === true) {
                value = undefined;
            } else if (value !== null) {
                if (!o.returnObjectTrees && !options.returnObjectTrees) {
                    if (o.objectTreeKeyHandler && typeof o.objectTreeKeyHandler == 'function') {
                        value = o.objectTreeKeyHandler(key, value, l, ns, options);
                    } else {
                        value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +
                            'returned an object instead of string.';
                        f.log(value);
                    }
                } else if (valueType !== '[object Number]' && valueType !== '[object Function]' && valueType !== '[object RegExp]') {
                    var copy = (valueType === '[object Array]') ? [] : {}; // apply child translation on a copy
                    f.each(value, function(m) {
                        copy[m] = _translate(ns + nsseparator + key + keyseparator + m, options);
                    });
                    value = copy;
                }
            }

            if (typeof value === 'string' && value.trim() === '' && o.fallbackOnEmpty === true)
                value = undefined;

            found = value;
        }
    }

    if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length > 0))) {
        // set flag for fallback lookup - avoid recursion
        options.isFallbackLookup = true;

        if (o.fallbackNS.length) {

            for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {
                found = _find(o.fallbackNS[y] + nsseparator + key, options);

                if (found || (found==="" && o.fallbackOnEmpty === false)) {
                    /* compare value without namespace */
                    var foundValue = found.indexOf(nsseparator) > -1 ? found.split(nsseparator)[1] : found
                      , notFoundValue = notFound.indexOf(nsseparator) > -1 ? notFound.split(nsseparator)[1] : notFound;

                    if (foundValue !== notFoundValue) break;
                }
            }
        } else {
            options.ns = o.ns.defaultNs;
            found = _find(key, options); // fallback to default NS
        }
        options.isFallbackLookup = false;
    }

    return found;
}
