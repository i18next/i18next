//const istanbul = require( 'browserify-istanbul' );

module.exports = function(karma) {
  karma.set({
    frameworks: ['mocha', 'chai', 'sinon', 'browserify'],

    files: [
      //'vendor/external.js',
      'test/**/*.spec.js',
      { pattern: 'test/locales/**/*.json', watched: true, included: false, served: true },
    ],

    proxies: {
      '/locales': 'http://localhost:9876/base/test/locales',
    },

    reporters: ['coverage', 'coveralls', 'spec'],

    preprocessors: {
      'test/**/*.spec.js': ['browserify'],
      'src/**/*.js': ['browserify', 'coverage'],
    },

    browsers: ['HeadlessChrome'],
    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['—no-sandbox'],
      },
    },

    port: 9876,

    //logLevel: 'LOG_DEBUG',

    //singleRun: true,
    //autoWatch: false,
    //
    // client: {
    //   mocha: {
    //     reporter: 'spec', // change Karma's debug.html to the mocha web reporter
    //     ui: 'tdd'
    //   }
    // },

    // browserify configuration
    browserify: {
      debug: true,
      transform: [
        ['babelify', { presets: ['@babel/preset-env'] }],
        /*'brfs',*/ 'browserify-istanbul',
      ],
    },

    coverageReporter: {
      type: 'lcov', //'html', // disabled - erroring now, https://github.com/karma-runner/karma-coverage/issues/157
      dir: 'coverage/',
    },
  });
};
