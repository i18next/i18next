var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');
var fs = require('fs');
fs.createReadStream('../release/i18next-latest.js').pipe(fs.createWriteStream('static/i18next-latest.js'));

// Serve up static folder
var serve = serveStatic('static', {'index': ['index.html']});

// Create server
var server = http.createServer(function (req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done)
});

// Listen
server.listen(3000);

console.log('Sample server started on http://localhost:3000/');