function detectLanguage() {
    var detectedLng;

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
            detectedLng = qsParm[o.detectLngQS];
        }
    }

    // get from cookie
    if (!detectedLng && typeof document !== 'undefined' && o.useCookie ) {
        var c = f.cookie.read(o.cookieName);
        if (c) detectedLng = c;
    }

    // get from navigator
    if (!detectedLng && typeof navigator !== 'undefined') {
        detectedLng =  (navigator.language) ? navigator.language : navigator.userLanguage;
    }
    
    return detectedLng;
}