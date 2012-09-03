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