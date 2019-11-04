process.env.MOZ_HEADLESS = 1;

if (!process.env.TRAVIS) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = function(config) {
    var configuration = {
        frameworks: [
            'mocha',
            'browserify'
        ],
        files: [
            'packages/web3/dist/web3.min.js',
            'test/**/e2e*.js'
        ],
        preprocessors: {
            'test/**/e2e*.js': ['browserify']
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
        exclude: ['web3'],
        browsers: [
            'ChromeHeadless',
            'FirefoxHeadless'
        ],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless']
            },
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        }
    };

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'Chrome_travis_ci',
            'FirefoxHeadless'
        ];
    }

    config.set(configuration);
};
