// extend function
function extend( ns, ns_string ) {  
    var parts = ns_string.split('.'),  
        parent = ns,  
        pl, i;  
    if (parts[0] == "myApp") {  
        parts = parts.slice(1);  
    }  
    pl = parts.length;  
    for (i = 0; i < pl; i++) {  
        //create a property if it doesnt exist  
        if (typeof parent[parts[i]] == 'undefined') {  
            parent[parts[i]] = {};  
        }  
        parent = parent[parts[i]];  
    }  
    return parent;  
}

// root namespace
var myApp = myApp = myApp || {};
myApp.app = {};