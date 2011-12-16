(function($) {
	//defaults
	var o = {};
    o.interpolationPrefix = '__';
    o.interpolationSuffix = '__';
    o.pluralSuffix = '_plural';
    o.maxRecursion = 50; //used while applying reuse of strings to avoid infinite loop
    o.reusePrefix = '$t(';
    o.reuseSuffix = ')';
    o.fallbackLng = 'dev'; // see Language fallback section
    o.dicoPath = 'locales'; // see Dictionary section
    o.keyseparator = '.'; // keys passed to $.jsperanto.translate use this separator
    o.nsseparator = ':';
    o.setDollarT = true; // $.t aliases $.jsperanto.translate, nice shortcut
    o.dictionary = false; // to supply the dictionary instead of loading it using $.ajax. A (big) javascript object containing your namespaced translations
	o.lng = false; //specify a language to use
	o.pluralNotFound = ['plural_not_found', Math.random()].join(''); // used internally by translate
	o.ns = 'root';
	o.dynamicLoad = false; // set to true to load resource lng and namespace in one route
    o.sendMissing = false;

	var dictionary = false; //not yet loaded
	var currentLng = false;
	var count_of_replacement = 0;
	var languages = [];

	function init(options, cb){
		$.extend(o,options);

		// namespace
		if (typeof o.ns == 'string') {
			o.ns = { namespaces: [o.namespace], defaultNs: o.namespace};
		}

		if(!o.lng) { o.lng = detectLanguage(); }
		currentLng = o.lng;
		languages.push(currentLng);
		if (currentLng.length === 5) { languages.push(currentLng.substr(0, 2)); }
		languages.push(o.fallbackLng);

		fetch(o.lng, o.ns, o.dynamicLoad, function(err) {
			if (o.setDollarT) { 
                $.t = $.t || translate; //shortcut
                addJqueryFunct();
            } 

			if (cb) cb(translate);
		});
	}

    function addJqueryFunct() {
        $.fn.i18n = function (options) {
            return this.each(function () {

                var elements =  $(this).find('[data-i18n]');
                elements.each(function () {
                    var ele = $(this)
                      , key = ele.attr('data-i18n')
                      , val = ele.text();

                    $(this).text($.t(key, { defaultValue: val }));
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
			count_of_replacement++;
			if(count_of_replacement > o.maxRecursion){break;} // safety net for too much recursion
			var index_of_opening = translated.indexOf(o.reusePrefix);
			var index_of_end_of_closing = translated.indexOf(o.reuseSuffix,index_of_opening) + o.reuseSuffix.length;
			var token = translated.substring(index_of_opening,index_of_end_of_closing);
			var token_sans_symbols = token.replace(o.reusePrefix,"").replace(o.reuseSuffix,"");
			var translated_token = _translate(token_sans_symbols,options);
			translated = translated.replace(token,translated_token);
		}
		return translated;
	}

	function detectLanguage(){
		if(navigator){
			return (navigator.language) ? navigator.language : navigator.userLanguage;
		}else{
			return o.fallbackLng;
		}
	}

	function needsPlural(options){
		return (options.count && typeof options.count != 'string' && options.count > 1);
	}


	function translate(key, options){
		count_of_replacement = 0;
		return _translate(key, options);
	}

	/*
	options.defaultValue
	options.count
	*/
	function _translate(key, options){
		options = options || {};
		var notfound = options.defaultValue || key;

		if(!dictionary) { return notfound; } // No dictionary to translate from

		var ns = o.ns.defaultNs;
		if (key.indexOf(o.nsseparator) > -1) {
			var parts = key.split(o.nsseparator);
			ns = parts[0];
			key = parts[1];
		}

		if(needsPlural(options)){
			var optionsSansCount = $.extend({},options);
			delete optionsSansCount.count;
			optionsSansCount.defaultValue = o.pluralNotFound;
			var pluralKey = key + o.pluralSuffix;
			var translated = translate(pluralKey,optionsSansCount);
			if(translated != o.pluralNotFound){
				return applyReplacement(translated,{count:options.count});//apply replacement for count only
			}// else continue translation with original/singular key
		}

        var found;
		for (i = 0, len = languages.length; i < len; i++ ) {
            if (found) break;

			var l = languages[i];

            var keys = key.split(o.keyseparator);
            var x = 0;
            var value = dictionary[l][ns];
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

            var payload = {};
            payload[key] = notfound;

            console.log(payload);

            $.ajax({
                url: [o.dicoPath, '/add/', o.fallbackLng, '/', ns].join(''),
                type: 'POST',
                data: payload,
                success: function(data, status, xhr){

                },
                error : function(xhr, status, error){
                    
                },
                dataType: "json"
            });
        }

        return (found) ? found : notfound;
	}

	function fetch(lng, ns, dynamicLoad, cb) {
		if (o.dictionary) {
			dictionary = o.dictionary;
			cb(null);
			return;
		}
		
		if (!dynamicLoad) {

			dictionary = {};

			// load each file individual
			$.each(ns.namespaces, function(nsIndex, nsValue) {
				$.each(languages, function(lngIndex, lngValue) {
					fetchOne(lngValue, nsValue, function(err) {
						if (err) cb(err);
					});
				});
			});

		} else {

			// load all needed stuff once
			$.ajax({
				url: [o.dicoPath, '/resource.json', '?ns=', ns.namespaces.join('+'), '&lng=', languages.join('+')].join(''),
				success: function(data,status,xhr){
					dictionary = data;
					cb(null);
				},
				error : function(xhr,status,error){
					cb('failed loading resource.json error: ' + error);
				},
				dataType: "json"
			});
			
		}
	}

	function fetchOne(lng, ns, done){
		$.ajax({
			url: [o.dicoPath, '/', lng, '/', ns, '.json'].join(''),
			success: function(data,status,xhr){

				if (!dictionary[lng]) dictionary[lng] = {};
				if (!dictionary[lng][ns]) dictionary[lng][ns] = {};

				dictionary[lng][ns] = data;
				done(null);
			},
			error : function(xhr,status,error){
				done('failed ns ' + ns + ' with lng ' + lng + ' error: ' + error);
			},
			dataType: "json"
		});
	}

	function lng(){
		return currentLng;
	}

	$.i18n = $.i18n || {
		init:init,
		t:translate,
		translate:translate,
		detectLanguage : detectLanguage,
		lng : lng
	};
})(jQuery);