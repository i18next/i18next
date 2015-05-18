// Testacular configuration
// Generated on Wed Mar 06 2013 09:24:16 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  {pattern: 'test/locales/**/*.json', watched: true, included: false, served: true},
  'test/libs/jquery-1.9.1.min.js',
  'test/libs/sinon-1.3.4.js',
  'test/libs/expect.js',
  'test/libs/jsfixtures.js',
  'test/libs/fake.conflict.lib.js',
  'bin/i18next-latest.js',
  'test/test.js'
  
];


// list of files to exclude
exclude = [
  
];


preprocessors = {
  '**/bin/i18next-latest.js': 'coverage'
};


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];

coverageReporter = {
  type : 'html',
  dir : 'reports/coverage/'
};

// web server port
port = 9876;


// cli runner port
runnerPort = 9100;

proxies =  {
  '/locales': 'http://localhost:9876/base/test/locales'
};


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [
  'Chrome',
  'ChromeCanary',
  'Firefox',
  'Safari',
  'Opera',
  'PhantomJS'
];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
