// BROWSER_BUNDLE_TEST is set for an un-browserified check that both bundles load correctly.
// BROWSER_BUNDLE_TEST is not set for the e2e unit tests, which check that bundle internals are ok.
function getTestFiles() {
    switch (process.env.BROWSER_BUNDLE_TEST) {
        case 'publishedDist':
            return ['packages/web3/dist/web3.min.js', 'test/e2e.minified.js'];
        case 'gitRepoDist':
            return ['dist/web3.min.js', 'test/e2e.minified.js'];
        default:
            return ['test/**/e2e*.js'];
    }
}

// Only loads browserified preprocessor for the logic unit tests so we can `require` stuff.
function getPreprocessors() {
    if (!process.env.BROWSER_BUNDLE_TEST) {
        return { 'test/**/e2e*.js': ['browserify'] };
    }
}

module.exports = function (config) {
    const configuration = {
        frameworks: ['mocha', 'browserify'],
        files: getTestFiles(),
        preprocessors: getPreprocessors(),
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-browserify',
            'karma-spec-reporter',
        ],
        reporters: ['spec'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    };

    config.set(configuration);
};
