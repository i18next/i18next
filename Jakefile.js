//     Jakefile.js v0.0.1
//     (c) 2011 Kaba AG, CC EAC
//     (by) Jan Muehlemann (jamuhl)

// Here we will document the common [jake](https://github.com/mde/jake) tasks generic to all other jake 
// files in other projects.

// ## used modules
// - __fs__ -> is all about filesystem [documentation](http://nodejs.org/docs/v0.3.1/api/fs.html)
// - __spawn__ -> a longer running app call in console normally exit with some exitcode [documentation](http://nodejs.org/docs/v0.3.1/api/child_processes.html#child_process.spawn)
// - __exec__ -> a simple version of console execution [documentation](http://nodejs.org/docs/v0.3.1/api/child_processes.html#child_process.exec)
// - __smoosh__ -> is a javascript compressing tool [documentation](https://github.com/fat/smoosh)
var fs = require('fs')
  , spawn = require('child_process').spawn
  , exec = require('child_process').exec
  , smoosh = require('smoosh');
  
// ## variables
// - __port__ -> the port on which express and socket.io is running
var port = 3000;

// # root tasks
// This are the main tasks in our project.    
// __hint:__ `jake -T` will display all avaiable tasks

// ## DOC
// run `jake doc`   
// This task will document provided modules by using [docco](http://jashkenas.github.com/docco/)
desc('Creates the documentation');
task('doc', [], function() {

    // add your docs to this array
    //
    // - __name__ will be displayed in output
    // - __files__ add your files (wildcards supported)
    // - __target__ folder where to output the docs
    var docs = [
        { name: 'backbone', 
          files: [
              'app/assets/js/backbone/*.js'
            , 'app/assets/js/backbone/base/*.js'
            , 'app/assets/js/backbone/routers/controller/*.js'
            , 'app/assets/js/backbone/routers/indexRouter.js'
            , 'app/assets/js/backbone/views/controller/*.js'
            , 'app/assets/js/bootstrap.js'
            ], 
          target: 'build/docs/client/backbone' },
        { name: 'jakefile', files: ['Jakefile.js'], target: 'build/docs/jake' },
    ];

    // __documents all items in docs array serial:__   
    // the selfcalling function next will shift the first item from the array 
    // and call the function process with itself as callback. The process 
    // function than calls the function document passing next as callback. 
    // When the callback _next_ is called it will take the next item from the array.
    (function next(e) {
        var process = function(doc, next) {
            document(doc.name, doc.files.join(' '), doc.target, next);
        };
        
        (!e && docs.length) ? process(docs.shift(), next) : console.log((e) ? e : '');
    }
    )();
});

// # client tasks
// This are tasks used to generate the clientside assets of the application
namespace('client', function () {
    
    // ## BUILD
    // run `jake client:build`   
    // or  `jake client:build[true]` for debugging output
    // will build the projects clientsources.
    desc('Builds the clientside scripts');
    task('build', [], function(debug) {
        
        // first grab all javascript files for client app
        // __hint:__ the option `{debug:true}` will return the full list - 
        // in production we would only get the _client.js_.
        var files = require('./app/assets/jsFileList').init({debug: true}).client;
                
        var readFiles = [],
            remaining = files.length;
            
        // this will read all files from filesystem in parallel
        for (i = 0, len = files.length; i < len; i++) {
            
            // as we need the index (current i) later to put the file into  
            // the right readFiles array space we put the index into a closure function.
            var read = function(index) {
                fs.readFile(files[index], 'utf8', function(err, file) {
                    if (err) console.log(('- failed to read ' + files[index]).red);
                    
                    readFiles[index] = file;
                    if (debug) console.log(('read ' + files[index]).grey)
                    remaining--;
                    
                    // go on if all files are read in
                    if (remaining === 0) {
                        process();
                    }
                });
            };
            
            read(i);
        }
        
        // process the _readFiles_ array
        var process = function() {
            
            // fist create target directory and log on error and call fail
            mkdirs(dirs('public/js'), 0755, function(err) {
                if (err) {
                    console.log('- failed to make folder public/js'.red);
                    fail('client:build - failed to make folder public/js')
                }
                
                // concate the files array
                var concate =  readFiles.join('\n\n');
                
                // replace placeholders in the concated file.
                concate = concate.replace('.#socketIoPort#.', port);
                
                // write the file to the _public/js_ folder
                fs.writeFile('./public/js/client.js', concate, 'utf8', function(err) {
                    if (err) { 
                        console.log('- failed to write public/js/client.js'.red);
                        fail('client:build - failed to write public/js/client.js')
                    } else {
                        
                        // a basic smoosh configuration object
                        smoosh.config({
                          /*"VERSION": "0.1",*/
                          "JAVASCRIPT": {
                            "DIST_DIR": "/public/js",
                            "client": [
                              "public/js/client.js",
                            ]
                          }
                        })

                        // run smoosh to get minified version of the js file
                        smoosh.build().analyze();
                        
                        console.log('+ written public/js/client.js successfully'.green);
                    }
                });
            });
        }
    });
});

// # functions

// ### function pathDepth
// will return a string seperator with length depending on '/' count   
var pathDepth = function(str) {
    var deep = (str.split("/").length - 1) * 2;
    var sep = '';
    for (i = 0; i < deep; i++) {
        sep += ' ';
    }
    return sep;
}

// ### function dirs
// will generate an array of folders out of a string   
// __Example:__   
// passing `root/sub1/sub2` will result in   
// `{'root','root/sub1','root/sub1/sub2'}`
var dirs = function(path) {
    var parts = path.split('/')
      , arr = [];
    for (i = 0, y = 0, len = parts.length; i < len; i++) {
        var dir = parts[0];
        for (z = 1; z <= y; z++) {
            dir +=  '/' + parts[z];
        }
        arr.push(dir);
        y++;
    }
    return arr;
};

// ### function mkdirs
// will create the folders provided in the _dirs_ array   
// __hint:__ mode is permission set on folder as digit (like in chmod)
var mkdirs = function(dirs, mode, cb){
    
    var createIfNotExists = function(dir, mode, cb) {
        fs.stat(dir, function(err, stat) {
            if (stat && stat.isDirectory()) {
                cb()
            } else {
                fs.mkdir(dir, mode, cb);
            }
        });
    };
    
    // creates all folder in dirs serial
    (function next(e) {
        (!e && dirs.length) ? createIfNotExists(dirs.shift(), mode, next) : cb((e) ? e : undefined);
    })(null);
};

// ### function document
// will document passed in source string and copy docs to output folder.
var document = function(name, source, target, cb) {
    
    // first it will create the target folder and only callback on error   
    // __hint:__ the function _dirs_ will generate an array out of the target string. 
    mkdirs(dirs(target), 0755, function(err) {
        if (err) cb(err)
        
        // __execute docco__ on success `docco myFile1 myFile2`
        var docco = exec('docco ' + source, function (err, stdout, stderr) {
            
            // on error log it and pass error to callback
            if (err !== null) {
                console.log(('+  failed to document ' + name + ' files').red);
                cb(err);
            } 
            
            // else __move the files__ from the _docs folder_ to target folder `mv source target`
            else {
                var move = exec('mv docs/* ' + target, function (err, stdout, stderr) {
                    
                    // on error log it and pass error to callback
                    if (err !== null) {
                        console.log(('+  failed to move ' + name + ' documentation').red);
                        cb(error);
                    } 
                    
                    // else __remove the docs folder__ to have an empty one for next run `rm -rf folder`
                    else {
                        var remove = exec('rm -rf docs', function (err, stdout, stderr) {
                            
                            // on error log it and pass error to callback
                            if (err !== null) {
                                console.log('+  failed to remove docs folder'.red);
                                cb(error);
                            } 
                            
                            // else __log success and callback__
                            else {
                                console.log(('+  documented ' + name + ' files successfully').green);
                                cb();
                            }
                        });
                    }
                });
            }
        });
    });
};


// ### function document
// will extend the string object to append a _stylize function_ which will 
// style the console output.   
// __Example:__   
// `console.log('my string'.blue)`
function stylize(str, style) {
    
    // define the styles
    var styles = {
    //styles
    'bold'      : [1,  22], 'italic'    : [3,  23],
    'underline' : [4,  24], 'inverse'   : [7,  27],
    //grayscales
    'white'     : [37, 39], 'grey'      : [90, 39],
    'black'     : [90, 39],
    //colors
    'blue'      : [34, 39], 'cyan'      : [36, 39],
    'green'     : [32, 39], 'magenta'   : [35, 39],
    'red'       : [31, 39], 'yellow'    : [33, 39]
    };
    return '\033[' + styles[style][0] + 'm' + str + '\033[' + styles[style][1] + 'm';
}

['bold', 'underline', 'italic',
 'inverse', 'grey', 'yellow',
 'red', 'green', 'blue',
 'white', 'cyan', 'magenta'].forEach(function (style) {

    String.prototype.__defineGetter__(style, function () {
        return stylize(this, style);
    });

});
