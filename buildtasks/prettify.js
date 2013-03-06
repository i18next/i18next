/*
 * Grunt Task File
 * ---------------
 *
 * Task: Jade 
 * Description: Compiles Jade templates into HTML
 * Dependencies: None
 *
 */
var prettify = require('./lib/prettify')
  , path = require('path');

module.exports = function(grunt) {


  var _ = grunt.util._;

  var config = grunt.config;
  var file = grunt.file;
  var log = grunt.log;

  // Compiles Jade templates into HTML. Each input file is renamed with a '.html'
  // extension. The task name specifies the output directory. Options are
  // specified via 'jadeopts'.
  grunt.registerMultiTask('prettify', 'Compile Jade templates into HTML.', function() {
    var self = this;

    var options = config('jadeopts') || {};
    grunt.verbose.writeflags(options, 'Options');

    var files = file.expand(this.data);
    grunt.verbose.writeflags(files, 'Files');

    files.forEach(function (filepath) {
      var opts = _.extend(options, {filename: filepath}); console.log(filepath);
      var html = parse(file.read(filepath), opts);

      file.write(filepath, html);

      log.writeln('File prittified"' + filepath + '" created.');
    });
  });

  function parse(src, options) {
    var prettifyFn = function(scr, options) {
      return src.replace(/<pre><code>[^<]+<\/code><\/pre>/g,
        function applyHighlight(code) {
          code = code.match(/<code>([\s\S]+)<\/code>/)[1];
          code = prettify.prettyPrintOne(code);
          return "<pre><code>" + code + "</code></pre>";
        });
    };
    return prettifyFn();
  }

};