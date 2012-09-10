/*global module:false*/
module.exports = function(grunt) {

  var version = '1.5.6_pre';

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadTasks("buildtasks");

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: version,
      banner: '// i18next, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Jan Mühlemann (jamuhl).\n' + 
        '// Distributed under MIT license\n' + 
        '// http://i18next.com'
    },

    clean: ["bin"],

    lint: {
      files: ['bin/i18next-latest.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/i18next.js'],
        dest: 'bin/i18next-latest.js'
      },
      spec: {
        src: ['spec/spec.js'],
        dest: 'test/test.js'
      }
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
          "bin": "bin/i18next-latest.js",
          "release": "bin/i18next-latest.js"
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
    },

    server: {
      index: "test/index.html",
      files: { "test.js": "test/test.js" },

      folders: {
          "libs": "./test/libs",
          "bin": "./bin",
          "locales": "./test/locales"
      }
    },

    watch: {
      lib: {
        files: "src/*.js",
        tasks: "rig"
      },

      spec: {
        files: "spec/*.js",
        tasks: "rig"
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'clean rig min copy compress');

};