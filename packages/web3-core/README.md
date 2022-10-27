# web3-core

[![NPM Package][npm-image]][npm-url]

This is a sub-package of [web3.js][repo].

The core package contains core functions for [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

You can install the package either using [NPM](https://www.npmjs.com/package/web3-core) or using [Yarn](https://yarnpkg.com/package/web3-core)

### Using NPM

```bash
npm install web3-core
```

### Using Yarn

```bash
yarn add web3-core
```

## Usage

```js
const core = require('web3-core');

const CoolLib = function CoolLib() {
    // sets _requestmanager and adds basic functions
    core.packageInit(this, arguments);
};

CoolLib.providers;
CoolLib.givenProvider;
CoolLib.setProvider();
CoolLib.BatchRequest();
CoolLib.extend();
...
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-core.svg
[npm-url]: https://npmjs.org/package/web3-core
