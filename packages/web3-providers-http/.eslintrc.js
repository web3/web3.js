module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  // TODO Review these rules, disabled because false positives
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0
  },
};
