const config = {
    verbose: true,
    notifyMode: 'success-change',
    notify: true,
    clearMocks: true,
    resetMocks: true,
    resetModules: true,
    testMatch: ['/**/**Test.js'],
    transform: {
        '^.+\\.js$': '<rootDir>/../../jest.preprocessor.js'
    },
    bail: true
};

/**
 * Returns the jest configuration with the moduleNameMapper object set.
 *
 * @param {Object} moduleNameMapper
 *
 * @returns {Object}
 */
module.exports = (moduleNameMapper) => {
    if (moduleNameMapper) {
        config['moduleNameMapper'] = moduleNameMapper;

        return config;
    }

    return config;
};
