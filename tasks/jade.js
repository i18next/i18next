/*
 * Grunt Task File
 * ---------------
 *
 * Task: Jade 
 * Description: Compiles Jade templates into HTML
 * Dependencies: None
 *
 */
var jade = require('jade')
  , path = require('path')
  , _ = require('underscore');

module.exports = function(grunt) {

  var config = grunt.config;
  var file = grunt.file;
  var log = grunt.log;

  // Compiles Jade templates into HTML. Each input file is renamed with a '.html'
  // extension. The task name specifies the output directory. Options are
  // specified via 'jadeopts'.
  grunt.registerMultiTask('jade', 'Compile Jade templates into HTML.', function() {
    var self = this;

    var options = config('jadeopts') || {};
    grunt.verbose.writeflags(options, 'Options');

    var files = file.expand(this.data);
    grunt.verbose.writeflags(files, 'Files');

    files.forEach(function (filepath) {
      var opts = _.extend(options, {filename: filepath});
      var html = grunt.helper('jade', file.read(filepath), opts);

      var basename = path.basename(filepath);
      var extname = path.extname(filepath);
      var htmlname = basename.substring(0, basename.length - extname.length) + '.html';
      
      var outpath = path.join(self.target, htmlname);
      file.write(outpath, html);

      log.writeln('File "' + outpath + '" created.');
    });
  });

  grunt.registerHelper('jade', function(src, options) {
    var jadeFn = jade.compile(src, options);
    return jadeFn();
  });

};
