const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
    BigInt: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    project: "./tsconfig.json"
  },
  plugins: [
    "eslint-plugin-import"
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  rules: {
    //doesnt work, it reports false errors
    "constructor-super": "off",
    //it doesn't recognize module/lib/something (like mainnet & minimal presets)
    "import/no-duplicates": "off",
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": false,
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    "func-call-spacing": "off",
    "max-len": ["error", {
      "code": 120
    }],
    //if --fix is run it messes imports like /lib/presets/minimal & /lib/presets/mainnet
    "import/no-duplicates": "off",
    "new-parens": "error",
    "no-caller": "error",
    "no-bitwise": "off",
    "no-cond-assign": "error",
    "no-consecutive-blank-lines": 0,
    "no-console": "warn",
    "no-var": "error",
    "object-curly-spacing": ["error", "never"],
    "object-literal-sort-keys": 0,
    "no-prototype-builtins": 0,
    "prefer-const": "error",
    "quotes": ["error", "double"],
    "semi": "off"
  },
  "overrides": [
    {
      "files": ["**/test/**/*.ts"],
      "rules": {
        "import/no-extraneous-dependencies": "off",
      }
    }
  ]
};
