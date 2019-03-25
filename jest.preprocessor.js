module.exports = require('babel-jest').createTransformer({
    env: {
        test: {
            presets: [['@babel/env']],
            plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-transform-runtime',
                ['istanbul', {
                    'exclude': [
                        'dist',
                        'tests',
                        'node_modules'
                    ]
                }]
            ]
        }
    }
});
