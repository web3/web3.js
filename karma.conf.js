// Karma configuration
// Generated on Thu Feb 19 2015 19:57:47 GMT+0100 (W. Europe Standard Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,    logLevel: config.LOG_INFO,
        //singleRun: true,    logLevel: config.LOG_DEBUG,

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'mocha'],


        // list of files / patterns to load in the browser
        files: [
            'test/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],

        client: {
            mocha: {
                //ui: 'tdd'
                timeout: 5000           // especially for the post requests
            }
        },
        browserify: {
            bundleDelay: 750,
            debug: true
                //     transform: [],
                //     //extensions: ['.js']
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/*.js': ['browserify']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // // Chrome
        // // PhantomJS
        browsers: ['Chrome', 'Safari', 'Firefox'],
        browserNoActivityTimeout: 10000,
        browserDisconnectTimeout: 5000,

        customLaunchers: {
            chromeWithoutSecurity: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            },

            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            IE8: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE8'
            }
        }
    });
};
