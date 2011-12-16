var FileList = require('../utils/fileList').FileList;

var Files;

if (typeof exports !== 'undefined') {
    Files = exports;
}

Files.VERSION = '0.0.1';

Files.init = function(options) {

    var debug = options.debug || false;
    
    var sources = {
        
        libs: [
              './app/assets/js/lib/json2.js'
            , './app/assets/js/lib/jquery-1.6.4.js'
            , './app/assets/js/lib/jquery-ui-1.8.16.custom.min.js'
            , './app/assets/js/lib/underscore-1.1.7.min.js'
            , './app/assets/js/lib/backbone-0.5.3.min.js'
            , './app/assets/js/lib/ICanHaz.min.js'
            , './app/assets/js/lib/bootstrap-dropdown-1.3.1.js'
            , './src/i18next.js'
        ],
        
        ns: [
              './app/assets/js/globals.js'
        ],
                
        backbone: [
              './app/assets/js/backbone/state.js'
            , './app/assets/js/backbone/base/*.js'
            , './app/assets/js/backbone/models/*.js'
            , './app/assets/js/backbone/collections/*.js'
            , './app/assets/js/backbone/views/shared/*.js'
            , './app/assets/js/backbone/views/sidebars/*.js'
            , './app/assets/js/backbone/views/*.js'
            , './app/assets/js/backbone/views/controller/*.js'
            , './app/assets/js/backbone/routers/controller/*.js'
            , './app/assets/js/backbone/routers/*.js'
        ],
                
        bootstrap: [
              './app/assets/js/bootstrap.js'
        ], 
        
        tests: [
              './app/assets/test/*.js'
            , './app/assets/test/models/*.js'
            , './app/assets/test/collections/*.js'
            , './app/assets/test/views/*.js'
            , './app/assets/test/routers/*.js'
        ]
    };
    
    var include = function(list, sources) {
        for (i = 0, len = sources.length; i < len; i++) {
            list.include(sources[i]);
        }
    }
    
    if (debug === true) {
        
        var client = new FileList();        
        include(client, sources.libs);
        include(client, sources.ns);
        include(client, sources.backbone);
        include(client, sources.bootstrap);
        
        var testclient = new FileList();      
        include(testclient, sources.libs);
        include(testclient, sources.ns);
        include(testclient, sources.backbone);
            
        var tests = new FileList();
        include(tests, sources.tests);
        
        return {
            tests: tests.toArray(),
            testclient: testclient.toArray(),
            client: client.toArray()
        }
        
    }
    else {
        return {
            client: ['/js/client.min.js'],
            testclient: [],
            tests: []
        }
    }
    
};
