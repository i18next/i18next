function detectLanguage() {
    var detectedLng;
    var whitelist = o.lngWhitelist || [];
    var userLngChoices = [];

    // get from qs
    var qsParm = [];
    if (typeof window !== 'undefined') {
        (function() {
            var query = window.location.search.substring(1);
            var params = query.split('&');
            for (var i=0; i<params.length; i++) {
                var pos = params[i].indexOf('=');
                if (pos > 0) {
                    var key = params[i].substring(0,pos);
                    if (key == o.detectLngQS) {
                        userLngChoices.push(params[i].substring(pos+1));
                    }
                }
            }
        })();
    }

    // get from cookie
    if (o.useCookie && typeof document !== 'undefined') {
        var c = f.cookie.read(o.cookieName);
        if (c) userLngChoices.push(c);
    }

    // get from localStorage
    if (o.detectLngFromLocalStorage && typeof window !== 'undefined' && window.localStorage) {
        var lang = f.localStorage.getItem('i18next_lng');
        if (lang) {
            userLngChoices.push(lang);
        }
    }

    // get from navigator
    if (typeof navigator !== 'undefined') {
        if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
            for (var i=0;i<navigator.languages.length;i++) {
                userLngChoices.push(navigator.languages[i]);
            }
        }
        if (navigator.userLanguage) {
            userLngChoices.push(navigator.userLanguage);
        }
        if (navigator.language) {
            userLngChoices.push(navigator.language);
        }
    }

    (function() {
        for (var i=0;i<userLngChoices.length;i++) {
            var lng = userLngChoices[i];

            if (lng.indexOf('-') > -1) {
                var parts = lng.split('-');
                lng = o.lowerCaseLng ?
                    parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                    parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();
            }

            if (whitelist.length === 0 || whitelist.indexOf(lng) > -1) {
                detectedLng = lng;
                break;
            }
        }
    })();

    //fallback
    if (!detectedLng){
      detectedLng = o.fallbackLng[0];
    }
    
    return detectedLng;
}
