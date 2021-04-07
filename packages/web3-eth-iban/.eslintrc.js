module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
      "@typescript-eslint",
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "@typescript-eslint/no-extra-semi": "off",
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
};
