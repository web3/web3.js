process.env.MOZ_HEADLESS = 1;

if (!process.env.TRAVIS){
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

// BROWSER_BUNDLE_TEST is set for an un-browserified check that both bundles load correctly.
// BROWSER_BUNDLE_TEST is not set for the e2e unit tests, which check that bundle internals are ok.
function getTestFiles(){
    switch (process.env.BROWSER_BUNDLE_TEST){
        case 'publishedDist': return ["packages/web3/dist/web3.min.js", "test/e2e.minified.js"]
        case 'gitRepoDist':   return ["dist/web3.min.js", "test/e2e.minified.js"]
        default:              return ["test/**/e2e*.js", "test/**/*tf8*.js"]
    }
}

// Only loads browserified preprocessor for the logic unit tests so we can `require` stuff.
function getPreprocessors(){
    if (!process.env.BROWSER_BUNDLE_TEST){
        return {
            'test/**/e2e*.js': [ 'browserify' ],
            'test/**/*tf8*.js': [ 'browserify' ]
        }
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
