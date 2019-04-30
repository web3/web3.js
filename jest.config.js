// TODO: Improve tests and add the branch property to the coverageThreshold config.
const config = {
    // notifyMode: 'success-change',
    collectCoverage: true,
    coverageDirectory: './coverage/',
    coverageThreshold: {
        global: {
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    // notify: true,
    clearMocks: true,
    resetMocks: true,
    resetModules: true,
    testMatch: ['/**/**Test.js'],
    transform: {
        '^.+\\.js$': '<rootDir>/../../jest.preprocessor.js'
    },
    bail: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'dist',
    ]
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
