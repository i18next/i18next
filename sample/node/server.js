var express = require('express')
  , app = express.createServer()
  , stylus = require('stylus')
  , nib = require('nib')
  , utils = require('./app/utils/utils');


// merge options from siteConf with passed in arguments
options = utils.getConfig();

// stylus compile
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', !options.debug)
        .use(nib())
        .import('nib');
}

// express
app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(stylus.middleware({
        src: __dirname + '/app/assets', 
        dest: __dirname + '/public',
        compile: compile })
        );   
    
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/app/views');

    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express['static'](__dirname + '/public')); 
});
    
// routes
require('./app/routes').actions(app, options);

// start host
var port = options.port || 3000;
console.log('\nStarting server on port ' + port);

if (!module.parent) {
    app.listen(port);
}