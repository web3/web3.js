process.env.CHROME_BIN = require('puppeteer').executablePath();
process.env.MOZ_HEADLESS = 1;

module.exports = function (config) {
    config.set({
        frameworks: [
            'mocha',
            'browserify'
        ],
        files: [
            'node_modules/@babel/polyfill/dist/polyfill.js', // For async/await in tests
            'test/**/e2e*.js'
        ],
        preprocessors: {
            'test/**/e2e*.js': [ 'browserify' ]
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-browserify',
            'karma-spec-reporter'
        ],
        reporters: ['spec'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: [
            'ChromeHeadless',
            'FirefoxHeadless'
        ],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },
    });
};
