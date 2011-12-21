var fs = require('fs')
  , md = require('./lib/markdown')
  , prettify = require('./lib/prettify');


// ## BUILD
// run `jake build`   
// will build the projects clientsources.
desc('Builds the index html');
task('build', [], function(watch) {
    parse();
}, true);

desc('Builds the index html on change');
task('watch', [], function(watch) {
    var running;

    parse();

    fs.watch('./source', function(event, filename) {
        if (running) clearTimeout(running);
  
        running = setTimeout(function() {
            parse();
        }, 100);
    });

}, true);

var parse = function() {
      fs.readFile('./source/layout.html', 'utf8', function(err, layout) {
        if (err) console.log(err);

        if (layout) {
            
            fs.readFile('./source/content.md', 'utf8', function(err, content) {
                if (err) console.log(err);

                if (content) {
                    
                    // parse markdown
                    var parsedMarkdown = md.encode(content);

                    // join with layout
                    var indexFile = layout.replace('[[content]]', parsedMarkdown);

                    // prettify code
                    indexFile = indexFile.replace(/<pre><code>[^<]+<\/code><\/pre>/g,
                        function applyHighlight(code) {
                        code = code.match(/<code>([\s\S]+)<\/code>/)[1];
                        code = prettify.prettyPrintOne(code);
                        return "<pre><code>" + code + "</code></pre>";
                    });

                    // save
                    fs.writeFile('index.html', indexFile,'utf8', function(err) {
                        if (err) console.log(err);

                        if (!err) console.log('file written');
                    });
                }
            });
        }
    });  
};