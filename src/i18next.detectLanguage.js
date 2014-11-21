function detectLanguage() {
    var detectedLng;
    var whitelist = o.lngWhitelist || [];
    var userLngChoices = [];

    // get from qs
    var qsParm = [];
    if (typeof window !== 'undefined') {
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
        if (qsParm[o.detectLngQS]) {
            userLngChoices.push(qsParm[o.detectLngQS]);
        }
    }

    // get from cookie
    if (o.useCookie && typeof document !== 'undefined') {
        var c = f.cookie.read(o.cookieName);
        if (c) userLngChoices.push(c);
    }

    // get from localStorage
    if (o.detectLngFromLocalStorage && typeof window !== 'undefined' && window.localStorage) {
        userLngChoices.push(window.localStorage.getItem('i18next_lng'));
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

    for (var i=0;i<userLngChoices.length;i++) {
        if (whitelist.indexOf(userLngChoices[i]) > -1) {
            detectedLng = userLngChoices[i];
            break;
        }
    }

    //fallback
    if (!detectedLng){
      detectedLng = o.fallbackLng[0];
    }
    
    return detectedLng;
}
