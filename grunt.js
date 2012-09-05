// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadTasks("buildtasks");

  grunt.initConfig({

    // meta: {
    //   handlebars: {
    //     trimPath: true,
    //     basePath: 'client/assets/templates/',
    //     extension: '.html'
    //   }
    // },

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ["index.html", "pages", "node"],

    // The lint task will run the build configuration and the application
    // JavaScript through JSHint and report any errors.  You can change the
    // options for this task, by reading this:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
    // lint: {
    //   files: [
    //     /*"build/config.js", */"client/app/**/*.js"
    //   ]
    // },

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    // jshint: {
    //   options: {
    //     scripturl: true,
    //     laxcomma: true,
    //     loopfunc: true
    //   }
    // },

    // The jst task compiles all application templates into JavaScript
    // functions with the underscore.js template function from 1.2.4.  You can
    // change the namespace and the template options, by reading this:
    // https://github.com/tbranyen/build-tasks/tree/master/jst
    //
    // The concat task depends on this file to exist, so if you decide to
    // remove this, ensure concat is updated accordingly.

    // jst: {
    //   "dist/debug/templates.js": [
    //     "app/templates/**/*.html"
    //   ]
    // },

    stylus: {
      "public/css/main.css": [
        "src/stylus/main.styl"//"client/stylus/**/*.styl"
      ]
    },

    jade: {
      "./": [
        "src/jade/index.jade"
      ],
      "pages": [
        "src/jade/pages/**/*.jade"
      ],
      "node": [
        "src/jade/node/index.jade"
      ],
      "node/pages": [
        "src/jade/node/pages/**/*.jade"
      ]
    },

    prettify: {
      "./": [
        "index.html",
        "pages/**/*.html",
        "node/**/*.html"
      ]
    },

    copy: {
      dist: {
        options: {
          basePath: "public/test/locales"
        },
        files: {
          "pages/locales/": "public/test/locales/**/*"
        }
      }
    },

    // handlebars: {
    //   "client/dist/debug/templates.js": [
    //     "client/assets/templates/**/*.html"
    //   ]
    // },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    // concat: {
    //   "client/dist/debug/require.js": [
    //     "client/assets/js/libs/almond.js",
    //     "client/dist/debug/templates.js",
    //     "client/dist/debug/require.js"
    //   ]
    // },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    mincss: {
      "public/css/index.css": [
        "public/css/bootstrap-2.0.2.css",
        "public/css/bootstrap-responsive-2.0.2.css",
        "public/css/font-awesome-2.0.css",
        "public/css/prettify.css",
        "public/css/main.css"
      ]
    },

    // Takes the built require.js file and minifies it for filesize benefits.
    // min: {
    //   "client/dist/release/require.js": [
    //     "client/dist/debug/require.js"
    //   ]
    // },

    // Running the server without specifying an action will run the defaults,
    // port: 8080 and host: 127.0.0.1.  If you would like to change these
    // defaults, simply add in the properties `port` and `host` respectively.
    //
    // Changing the defaults might look something like this:
    //
    // server: {
    //   host: "127.0.0.1", port: 9001
    //   debug: { ... can set host and port here too ...
    //  }
    //
    //  To learn more about using the server task, please refer to the code
    //  until documentation has been written.
    server: {
      files: { "favicon.ico": "client/favicon.ico" },

      folders: {
          "/": "./",
          "public": "public",
          "pages": "pages",
          "node": "node"
      }//,

      // debug: {
      //   files: { "favicon.ico": "client/favicon.ico" },

      //   folders: {
      //     "app": "client/dist/debug",
      //     "assets/js/libs": "client/dist/debug"
      //   }
      // },

      // release: {
      //   // These two options make it easier for deploying, by using whatever
      //   // PORT is available in the environment and defaulting to any IP.
      //   host: "0.0.0.0",
      //   port: process.env.PORT || 8000,

      //   files: { "favicon.ico": "client/favicon.ico" },

      //   folders: {
      //     "app": "client/dist/release",
      //     "assets/js/libs": "client/dist/release",
      //     "assets/css": "client/dist/release"
      //   }
      // }
    },

    // This task uses James Burke's excellent r.js AMD build tool.  In the
    // future other builders may be contributed as drop-in alternatives.
    //   requirejs: {
    //     // Include the main configuration file
    //     mainConfigFile: "client/app/config.js",

    //     // Output file
    //     out: "client/dist/debug/require.js",

    //     // Root application module
    //     name: "config",

    //     // Do not wrap everything in an IIFE
    //     wrap: false
    //   },

    watch: {
      jade: {
        files: "src/jade/**/*.jade",
        tasks: "build"
      },

      stylus: {
        files: "src/stylus/**/*.styl",
        tasks: "build"
      }
    }

  });

  // The default task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  grunt.registerTask("default", "clean jade prettify stylus copy");

  // The debug task is simply an alias to default to remain consistent with
  // debug/release.
  //grunt.registerTask("debug", "default");

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("build", "default mincss");

};
