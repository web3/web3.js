module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true,
    },
    extends: 'airbnb-base',
    plugins: [],
    // custom rules
    rules: {
        indent: [2, 4],
        'space-before-function-paren': [2, 'always'],
        'import/extensions': 'off',
    },
    globals: {
        ethereumProvider: 'ethereumProvider',
    },
};
