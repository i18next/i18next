function _extend(target, source) {
    if (!source || typeof source === 'function') {
        return target;
    }
    
    for (var attr in source) { target[attr] = source[attr]; }
    return target;
}

function _each(object, callback, args) {
    var name, i = 0,
        length = object.length,
        isObj = length === undefined || typeof object === "function";

    if (args) {
        if (isObj) {
            for (name in object) {
                if (callback.apply(object[name], args) === false) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if (callback.apply(object[i++], args) === false) {
                    break;
                }
            }
        }

    // A special, fast, case for the most common use of each
    } else {
        if (isObj) {
            for (name in object) {
                if (callback.call(object[name], name, object[name]) === false) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if (callback.call(object[i], i, object[i++]) === false) {
                    break;
                }
            }
        }
    }

    return object;
}

function _ajax(options) {

    // v0.5.0 of https://github.com/goloroden/http.js
    var getXhr = function (callback) {
        // Use the native XHR object if the browser supports it.
        if (window.XMLHttpRequest) {
            return callback(null, new XMLHttpRequest());
        } else if (window.ActiveXObject) {
            // In Internet Explorer check for ActiveX versions of the XHR object.
            try {
                return callback(null, new ActiveXObject("Msxml2.XMLHTTP"));
            } catch (e) {
                return callback(null, new ActiveXObject("Microsoft.XMLHTTP"));
            }
        }

        // If no XHR support was found, throw an error.
        return callback(new Error());
    };

    var encodeUsingUrlEncoding = function (data) {
        if(typeof data === 'string') {
            return data;
        }

        var result = [];
        for(var dataItem in data) {
            if(data.hasOwnProperty(dataItem)) {
                result.push(encodeURIComponent(dataItem) + '=' + encodeURIComponent(data[dataItem]));
            }
        }

        return result.join('&');
    };

    var utf8 = function (text) {
        text = text.replace(/\r\n/g, '\n');
        var result = '';

        for(var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);

            if(c < 128) {
                    result += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                    result += String.fromCharCode((c >> 6) | 192);
                    result += String.fromCharCode((c & 63) | 128);
            } else {
                    result += String.fromCharCode((c >> 12) | 224);
                    result += String.fromCharCode(((c >> 6) & 63) | 128);
                    result += String.fromCharCode((c & 63) | 128);
            }
        }

        return result;
    };

    var base64 = function (text) {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        text = utf8(text);
        var result = '',
                chr1, chr2, chr3,
                enc1, enc2, enc3, enc4,
                i = 0;

        do {
            chr1 = text.charCodeAt(i++);
            chr2 = text.charCodeAt(i++);
            chr3 = text.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if(isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if(isNaN(chr3)) {
                enc4 = 64;
            }

            result +=
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
        } while(i < text.length);

        return result;
    };

    var mergeHeaders = function () {
        // Use the first header object as base.
        var result = arguments[0];

        // Iterate through the remaining header objects and add them.
        for(var i = 1; i < arguments.length; i++) {
            var currentHeaders = arguments[i];
            for(var header in currentHeaders) {
                if(currentHeaders.hasOwnProperty(header)) {
                    result[header] = currentHeaders[header];
                }
            }
        }

        // Return the merged headers.
        return result;
    };

    var ajax = function (method, url, options, callback) {
        // Adjust parameters.
        if(typeof options === 'function') {
            callback = options;
            options = {};
        }

        // Set default parameter values.
        options.cache = options.cache || false;
        options.data = options.data || {};
        options.headers = options.headers || {};
        options.jsonp = options.jsonp || false;
        options.async = options.async === undefined ? true : options.async;

        // Merge the various header objects.
        var headers = mergeHeaders({
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }, ajax.headers, options.headers);

        // Encode the data according to the content-type.
        var payload;
        if (headers['content-type'] === 'application/json') {
            payload = JSON.stringify(options.data);
        } else {
            payload = encodeUsingUrlEncoding(options.data);            
        }

        // Specially prepare GET requests: Setup the query string, handle caching and make a JSONP call
        // if neccessary.
        if(method === 'GET') {
            // Setup the query string.
            var queryString = [];
            if(payload) {
                queryString.push(payload);
                payload = null;
            }

            // Handle caching.
            if(!options.cache) {
                queryString.push('_=' + (new Date()).getTime());
            }

            // If neccessary prepare the query string for a JSONP call.
            if(options.jsonp) {
                queryString.push('callback=' + options.jsonp);
                queryString.push('jsonp=' + options.jsonp);
            }

            // Merge the query string and attach it to the url.
            queryString = '?' + queryString.join('&');
            url += queryString !== '?' ? queryString : '';

            // Make a JSONP call if neccessary.
            if(options.jsonp) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                head.appendChild(script);                
                return;
            }
        }

        // Since we got here, it is no JSONP request, so make a normal XHR request.
        getXhr(function (err, xhr) {
            if(err) return callback(err);

            // Open the request.
            xhr.open(method, url, options.async);

            // Set the request headers.
            for(var header in headers) {
                if(headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }

            // Handle the request events.
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4) {
                    var data = xhr.responseText || '';

                    // If no callback is given, return.
                    if(!callback) {
                        return;
                    }

                    // Return an object that provides access to the data as text and JSON.
                    callback(xhr.status, {
                        text: function () {
                            return data;
                        },

                        json: function () {
                            return JSON.parse(data);
                        }
                    });
                }
            };

            // Actually send the XHR request.
            xhr.send(payload);
        });
    };

    // Define the external interface.
    var http = {
        authBasic: function (username, password) {
            ajax.headers['Authorization'] = 'Basic ' + base64(username + ':' + password);
        },

        connect: function (url, options, callback) {
            return ajax('CONNECT', url, options, callback);            
        },

        del: function (url, options, callback) {
            return ajax('DELETE', url, options, callback);            
        },

        get: function (url, options, callback) {
            return ajax('GET', url, options, callback);
        },

        head: function (url, options, callback) {
            return ajax('HEAD', url, options, callback);
        },

        headers: function (headers) {
            ajax.headers = headers || {};
        },

        isAllowed: function (url, verb, callback) {
            this.options(url, function (status, data) {
                callback(data.text().indexOf(verb) !== -1);
            });
        },

        options: function (url, options, callback) {
            return ajax('OPTIONS', url, options, callback);
        },

        patch: function (url, options, callback) {
            return ajax('PATCH', url, options, callback);            
        },

        post: function (url, options, callback) {
            return ajax('POST', url, options, callback);            
        },
        
        put: function (url, options, callback) {
            return ajax('PUT', url, options, callback);            
        },

        trace: function (url, options, callback) {
            return ajax('TRACE', url, options, callback);
        }
    };


    var methode = options.type ? options.type.toLowerCase() : 'get';

    http[methode](options.url, {async: options.async}, function (status, data) {
        if (status === 200) {
            options.success(data.json(), status, null);
        } else {
            options.error(data.text(), status, null);
        }
    });
}

var _cookie = {
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
};

var cookie_noop = {
    create: function(name,value,minutes) {},
    read: function(name) { return null; },
    remove: function(name) {}
};



// move dependent functions to a container so that
// they can be overriden easier in no jquery environment (node.js)
var f = {
    extend: $ ? $.extend : _extend,
    each: $ ? $.each : _each,
    ajax: $ ? $.ajax : _ajax,
    cookie: typeof document !== 'undefined' ? _cookie : cookie_noop,
    detectLanguage: detectLanguage,
    log: function(str) {
        if (o.debug && typeof console !== "undefined") console.log(str);
    },
    toLanguages: function(lng) {
        var languages = [];
        if (typeof lng === 'string' && lng.indexOf('-') > -1) {
            var parts = lng.split('-');

            lng = o.lowerCaseLng ? 
                parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
                parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();

            if (o.load !== 'unspecific') languages.push(lng);
            if (o.load !== 'current') languages.push(parts[0]);
        } else {
            languages.push(lng);
        }

        if (languages.indexOf(o.fallbackLng) === -1 && o.fallbackLng) languages.push(o.fallbackLng);

        return languages;
    }
};