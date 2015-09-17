/*global module:false*/
module.exports = function(grunt) {

  var version = require('./package.json').version;
  // before release:
  // update bower.json, package.json
  // after release:
  // add tag to repo: git tag -a 1.6.0 -m 'i18next v1.6.0'
  // push tag: git push origin 1.6.0
  // npm publish

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('gruntacular');
  grunt.loadTasks('buildtasks');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: version,
      banner: '// i18next, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Jan Mühlemann (jamuhl).\n' +
        '// Distributed under MIT license\n' +
        '// http://i18next.com\n'
    },

    clean: ['bin'],

    shell: {
      /* create phonegap projects */
      maintain: {
        command: 'plato -r -d reports/maintain/<%= grunt.template.today("yyyymmdd") %> src',
        stdout: true
      }
    },

    testacular: {
      options: {
        configFile: 'testacular.conf.js'
      },
      ci: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      all: {
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari']
      },
      dev: {
        reporters: 'dots',
        browsers: ['PhantomJS']
      }
    },

    jshint: {
      options: {
        scripturl: true,
        laxcomma: true,
        loopfunc: true,
        curly: false,
        eqeqeq: false,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          console: true,
          ActiveXObject: true,
          module: true
        }
      },
      files: [ 'bin/*.js' ]
    },

    rig: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: ['src/i18next.js'],
        dest: 'bin/i18next-latest.js'
      },
      amd: {
        src: ['src/amd.js'],
        dest: 'bin/i18next.amd-latest.js'
      },
      amdjquery: {
        src: ['src/amd.jquery.js'],
        dest: 'bin/i18next.amd.withJQuery-latest.js'
      },
      commonjsjquery: {
        src: ['src/commonjs.jquery.js'],
        dest: 'bin/i18next.commonjs.withJQuery-latest.js'
      },
      spec: {
        src: ['spec/spec.js'],
        dest: 'test/test.js'
      },
      compat: {
        src: ['spec/compat.js'],
        dest: 'test/backward/compat.js'
      },
      serverInit: {
        src: ['spec/server.init.spec.js'],
        dest: 'test/server/i18next.init.spec.js'
      },
      serverFunct: {
        src: ['spec/server.functions.spec.js'],
        dest: 'test/server/i18next.functions.spec.js'
      },
      serverTrans: {
        src: ['spec/server.translate.spec.js'],
        dest: 'test/server/i18next.translate.spec.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      // bin: {
      //   src: ['bin/i18next-latest.js'],
      //   dest: 'bin/i18next-<%= meta.version %>.min.js'
      // },
      release: {
        src: ['bin/i18next-latest.js'],
        dest: 'release/i18next-<%= meta.version %>.min.js'
      },
      amd: {
        src: ['bin/i18next.amd-latest.js'],
        dest: 'release/i18next.amd-<%= meta.version %>.min.js'
      },
      amdjquery: {
        src: ['bin/i18next.amd.withJQuery-latest.js'],
        dest: 'release/i18next.amd.withJQuery-<%= meta.version %>.min.js'
      },
      commonjsjquery: {
        src: ['bin/i18next.commonjs.withJQuery-latest.js'],
        dest: 'release/i18next.commonjs.withJQuery-<%= meta.version %>.min.js'
      },
      release_latest: {
        src: ['bin/i18next-latest.js'],
        dest: 'release/i18next-latest.min.js'
      },
      amd_latest: {
        src: ['bin/i18next.amd-latest.js'],
        dest: 'release/i18next.amd-latest.min.js'
      },
      amdjquery_latest: {
        src: ['bin/i18next.amd.withJQuery-latest.js'],
        dest: 'release/i18next.amd.withJQuery-latest.min.js'
      },
      commonjsjquery_latest: {
        src: ['bin/i18next.commonjs.withJQuery-latest.js'],
        dest: 'release/i18next.commonjs.withJQuery-latest.min.js'
      },
      release_latest_root: {
        src: ['bin/i18next-latest.js'],
        dest: './i18next.min.js'
      },
      amd_latest_root: {
        src: ['bin/i18next.amd-latest.js'],
        dest: './i18next.amd.min.js'
      },
      amdjquery_latest_root: {
        src: ['bin/i18next.amd.withJQuery-latest.js'],
        dest: './i18next.amd.withJQuery.min.js'
      },
      commonjsjquery_latest_root: {
        src: ['bin/i18next.commonjs.withJQuery-latest.js'],
        dest: './i18next.commonjs.withJQuery.min.js'
      }
    },

    copy: {
      js: {
        files: [
          { expand: true, cwd: 'bin/', src: ['*.js'], dest: 'release/',
            rename: function(dest, src) { console.log(src + ' -> ' + dest);
              if (src == 'i18next-latest.js') {
                dest += 'i18next-' + version + '.js';
              }
              if (src == 'i18next.amd-latest.js') {
                dest += 'i18next.amd-' + version + '.js';
              }
              if (src == 'i18next.amd.withJQuery-latest.js') {
                dest += 'i18next.amd.withJQuery-' + version + '.js';
              }
              if (src == 'i18next.commonjs.withJQuery-latest.js') {
                dest += 'i18next.commonjs.withJQuery-' + version + '.js';
              }
              return dest;
            }
          },
          { expand: true, cwd: 'bin/', src: ['*.js'], dest: 'release/'},
          { expand: true, cwd: 'bin/', src: ['*.js'], dest: './',
            rename: function(dest, src) { console.log(src + ' -> ' + dest);
              if (src == 'i18next-latest.js') {
                dest += 'i18next.js';
              }
              if (src == 'i18next.amd-latest.js') {
                dest += 'i18next.amd.js';
              }
              if (src == 'i18next.amd.withJQuery-latest.js') {
                dest += 'i18next.amd.withJQuery.js';
              }
              if (src == 'i18next.commonjs.withJQuery-latest.js') {
                dest += 'i18next.commonjs.withJQuery.js';
              }
              return dest;
            }
          }
        ]
      }
    },

    compress: {
      zip: {
        options: {
          archive: 'release/i18next-<%= meta.version %>.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'i18next-<%= meta.version %>.js',
              'i18next-<%= meta.version %>.min.js'
            ],
            dest: 'i18next-<%= meta.version %>/'
          }
        ]
      },
      zipamd: {
        options: {
          archive: 'release/i18next.amd-<%= meta.version %>.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'i18next.amd-<%= meta.version %>.js',
              'i18next.amd-<%= meta.version %>.min.js',
              'i18next.amd.withJQuery-<%= meta.version %>.js',
              'i18next.amd.withJQuery-<%= meta.version %>.min.js'
            ],
            dest: 'i18next.amd-<%= meta.version %>/'
          }
        ]
      }
    },

    server: {
      host: '0.0.0.0',
      index: 'test/index.html',
      files: { 'test.js': 'test/test.js' },

      folders: {
          'libs': './test/libs',
          'bin': './bin',
          'locales': './test/locales',
          'sample': './sample/static'
      }
    },

    watch: {
      lib: {
        files: 'src/*.js',
        tasks: 'rig:build'
      },

      spec: {
        files: 'spec/**/*.js',
        tasks: 'rig:spec'
      }
    }

  });

  // Default task.
  grunt.registerTask('default', ['clean', 'rig']);
  grunt.registerTask('release', ['default', 'uglify', 'copy', 'compress']);

  grunt.registerTask('test', ['testacular:dev']);
  grunt.registerTask('test:all', ['testacular:all']);

  grunt.registerTask('report', ['shell:maintain', 'testacular:ci']);


};
