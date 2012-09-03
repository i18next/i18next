/*global module:false*/
module.exports = function(grunt) {

  var version = '1.5.n_pre';

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: version,
      banner: '// Backbone.Marionette, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' + 
        '// Distributed under MIT license\n' + 
        '// http://github.com/derickbailey/backbone.marionette'
    },

    clean: ["bin"],

    lint: {
      files: ['bin/i18next-latest.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/i18next.js'],
        dest: 'bin/i18next-latest.js'
      }/*,
      amd: {
        src: ['<banner:meta.banner>', 'src/amd.js'],
        dest: 'lib/amd/backbone.marionette.js'
      }*/
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'bin/i18next-<%= meta.version %>.min.js'
      }/*,
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'lib/amd/backbone.marionette.min.js'
      }*/
    },

    jshint: {
      options: {
        scripturl: true,
        laxcomma: true,
        loopfunc: true,
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        $: true
      }
    },

    uglify: {},

    copy: {
      js: {
        options: { 
          basePath: "bin",
          processName: function(filename) {
            if (filename == "i18next-latest.js") {
              filename = "i18next-" + version + ".js";
            }
            return filename;
          } 
      },
        files: {
          "bin": "bin/i18next-latest.js"
        }
      }
    },

    compress: {
      zip: {
        options: {
          mode: "zip",
          basePath: "bin",
          level: 1
        },
        files: {
          "release/i18next-<%= meta.version %>.zip": "bin/*"
        }
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'clean rig min copy compress');

};