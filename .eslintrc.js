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
    'space-before-function-paren': [2, 'always'],
    'import/extensions': 'off',
  },
  globals: {},
};
