/**
 * Grunt Contrib Helpers
 * Description: help make things consistent across tasks.
 * Contributor: @tkellen
 */

module.exports = function(grunt) {
  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  // Helper for consistent options key access across contrib tasks.
  grunt.registerHelper("options", function(data, defaults) {
    var _ = grunt.util._;
    var namespace = data.nameArgs.split(":");
    var task = grunt.config(_.flatten([namespace, "options"]));
    var global_subtask = namespace.length > 1 ? grunt.config(_.flatten(["options", namespace])) : {};
    var global = grunt.config(["options", namespace[0]]);

    return _.defaults({}, task, global_subtask, global, defaults || {});
  });

  // TODO: ditch this when grunt v0.4 is released
  // Temporary helper for normalizing files object
  grunt.registerHelper("normalizeMultiTaskFiles", function(data, target) {
    var prop, obj;
    var files = [];
    if (grunt.util.kindOf(data) === 'object') {
      if ('src' in data || 'dest' in data) {
        obj = {};
        if ('src' in data) { obj.src = data.src; }
        if ('dest' in data) { obj.dest = data.dest; }
        files.push(obj);
      } else if (grunt.util.kindOf(data.files) === 'object') {
        for (prop in data.files) {
          files.push({src: data.files[prop], dest: prop});
        }
      } else if (Array.isArray(data.files)) {
        data.files.forEach(function(obj) {
          var prop;
          if ('src' in obj || 'dest' in obj) {
            files.push(obj);
          } else {
            for (prop in obj) {
              files.push({src: obj[prop], dest: prop});
            }
          }
        });
      }
    } else {
      files.push({src: data, dest: target});
    }

    // Process each normalized file object as a template.
    files.forEach(function(obj) {
      // Process src as a template (recursively, if necessary).
      if ('src' in obj) {
        obj.src = grunt.util.recurse(obj.src, function(src) {
          if (typeof src !== 'string') { return src; }
          return grunt.template.process(src);
        });
      }
      if ('dest' in obj) {
        // Process dest as a template.
        obj.dest = grunt.template.process(obj.dest);
      }
    });

    return files;
  });
};