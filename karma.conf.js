process.env.MOZ_HEADLESS = 1;

if (!process.env.TRAVIS){
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

function getTestFiles(){
    switch (process.env.BROWSER_BUNDLE_TEST){
        case 'publishedDist': return ["packages/web3/dist/web3.min.js", "test/e2e.minified.js"]
        case 'gitRepoDist':   return ["dist/web3.min.js", "test/e2e.minified.js"]
        default:              return ["test/**/e2e*.js"]
    }
}

// Only loads preprocessor for the logic unit tests
function getPreprocessors(){
    if (!process.env.BROWSER_BUNDLE_TEST){
        return { 'test/**/e2e*.js': [ 'browserify' ] }
    }
}

module.exports = function (config) {
    var configuration = {
        frameworks: [
            'mocha',
            'browserify'
        ],
        files: getTestFiles(),
        preprocessors: getPreprocessors(),
        failOnEmptyTestSuite: false,
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
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
    };

    if(process.env.TRAVIS) {
        configuration.browsers = [
            'Chrome_travis_ci',
            'FirefoxHeadless'
        ];
    }

    config.set(configuration);
};
