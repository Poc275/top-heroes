// Karma configuration
// Generated on Thu Feb 16 2017 19:38:23 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // included: false means do NOT add to the browser in a <script> tag
    files: [
        'node_modules/crypto-js/crypto-js.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-aria/angular-aria.min.js',
        'node_modules/angular-material/angular-material.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        'node_modules/angular-file-upload/dist/angular-file-upload.js',
        'node_modules/socket.io-client/dist/socket.io.js',
        'public/javascripts/app.js',
        'public/javascripts/routes.js',
        'public/javascripts/services/AuthFactory.js',
        'public/javascripts/services/CardsFactory.js',
        'public/javascripts/services/SocketFactory.js',
        'public/javascripts/services/UserFactory.js',
        'public/javascripts/services/gravatar.js',
        'public/javascripts/controllers/AppController.js',
        'public/javascripts/controllers/CardController.js',
        'public/javascripts/controllers/UserController.js',
        'public/javascripts/controllers/GameController.js',
        'public/javascripts/controllers/SoloGameController.js',
        'public/javascripts/controllers/StoreController.js',
        'public/javascripts/controllers/CmsController.js',
        'public/javascripts/controllers/VrController.js',
        'public/javascripts/directives/CardDirective.js',
        'public/javascripts/directives/CardNotCollectedDirective.js',
        'public/javascripts/directives/PackDirective.js',
        'public/javascripts/directives/FilePickerDirective.js',
        'public/javascripts/filters/LevelFilter.js',
        'public/javascripts/filters/XpFilter.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'test/client-tests.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // ng-html2js converts templates to js strings to make testing easier
    preprocessors: {
        'public/javascripts/*.js': 'coverage',
        'public/javascripts/controllers/*.js': 'coverage',
        'public/javascripts/services/*.js': 'coverage',
        'public/javascripts/directives/*.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],


    // coverage reporter options
    coverageReporter: {
        type: 'html',
        dir: 'coverage/',
        file: 'ng-coverage.html'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    
    // travis-ci config to use Chrome
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
  });

  if(process.env.TRAVIS) {
      config.browsers = ['PhantomJS'];
  }
};