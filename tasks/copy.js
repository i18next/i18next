/**
 * Task: copy
 * Description: Copy files into another directory
 * Contributor: @ctalkington
 */

module.exports = function(grunt) {
  var fs = require("fs");
  var path = require("path");

  // TODO: ditch this when grunt v0.4 is released
  grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var kindOf = grunt.util.kindOf;

  grunt.registerMultiTask("copy", "Copy files into another directory.", function() {
    var options = grunt.helper("options", this, {
      basePath: null,
      flatten: false,
      processName: false,
      processContent: false,
      processContentExclude: []
    });

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    if (options.basePath !== null) {
      options.basePath = path.normalize(options.basePath);
      options.basePath = _(options.basePath).trim(path.sep);
    }

    grunt.verbose.writeflags(options, "Options");

    this.files.forEach(function(file) {
      var srcFiles = grunt.file.expandFiles(file.src);

      if (grunt.file.exists(file.dest) === false) {
        grunt.file.mkdir(file.dest);
      }

      var filename = "";
      var relative = "";
      var destFile = "";

      grunt.log.write("Copying file(s)" + ' to "' + file.dest + '"...');

      srcFiles.forEach(function(srcFile) {
        filename = path.basename(srcFile);
        relative = path.dirname(srcFile);
        relative = path.normalize(relative);

        if (options.flatten) {
          relative = "";
        } else if (options.basePath !== null && options.basePath.length > 1) {
          relative = _(relative).chain().strRightBack(options.basePath).trim(path.sep).value();
        }

        if (options.processName && kindOf(options.processName) === "function") {
          filename = options.processName(filename);
        }

        // make paths outside grunts working dir relative
        relative = relative.replace(/\.\.(\/|\\)/g, "");

        destFile = path.join(file.dest, relative, filename);

        grunt.file.copy(srcFile, destFile, copyOptions);
      });

      grunt.log.ok();
    });
  });
};