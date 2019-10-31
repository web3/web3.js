<p align="center">
<img src="https://github.com/ethereum/web3.js/raw/1.x/web3js.jpg" width=200 />
</p>

# web3.js - Ethereum JavaScript API

[![Join the chat at https://gitter.im/ethereum/web3.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/web3.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)[![npm](https://img.shields.io/npm/dm/web3.svg)](https://www.npmjs.com/package/web3) [![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url] [![dev dependency status][dep-dev-image]][dep-dev-url] [![Coverage Status][coveralls-image]][coveralls-url]
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

This is the Ethereum [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec.

You need to run a local or remote [Ethereum](https://www.ethereum.org/) node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node

```bash
npm install web3
```

### Yarn

```bash
yarn add web3
```

### Meteor

_Note_: works only in the Browser for now. (PR welcome).

```bash
meteor add ethereum:web3
```

### Browser

There are three ways to use this package in the browser:

- Install it with ``npm`` and bundle it with the preferred bundler (rollup, webpack, or parcel).
- Use the ``unpkg`` or ``jsdelivr`` CDN.
- Install it with ``npm`` and load the minified file from the ``node_modules`` folder.

If you use the CDN or minified version from the ``node_modules`` folder, a ``Web3`` property will be exposed on the ``window`` object in your browser.

## Usage

```js
// in node.js
var Web3 = require('web3');

var web3 = new Web3('ws://localhost:8546');
console.log(web3);
> {
    eth: ... ,
    shh: ... ,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `web3.setProvider()` (e.g. WebsocketProvider):

```js
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

There you go, now you can use it:

```js
web3.eth.getAccounts().then(console.log);
```

### Usage with TypeScript

We support types within the repo itself. Please open an issue here if you find any wrong types.

You can use `web3.js` as follows:

```typescript
import Web3 from 'web3';
const web3 = new Web3('ws://localhost:8546');
```

If you are using the types in a `commonjs` module like for example a node app you just have to enable `esModuleInterop` in your `tsconfig` compile option, also enable `allowSyntheticDefaultImports` for typesystem compatibility:

```js
"compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ....
```

## Documentation

Documentation can be found at [read the docs][docs].

## Building

### Requirements

-   [Node.js](https://nodejs.org)
-   [npm](https://www.npmjs.com/)

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Build Pipeline

**Scripts**

- ``build:all`` - Creates CJS and ESM bundles for all packages
- ``build:all:cjs`` - Creates CJS bundles for all packages
- ``build:all:esm`` - Creates ESM bundles for all packages
- ``build:web3`` - Creates just the CJS and ESM bundle of the web3 umbrella package
- ``build:web3:minified`` - Creates all CJS and ESM bundles of all packages and creates a web3.min after

**Generated Bundles**

- ``main`` 
  + Will be used in nodejs on a normal ``require(...)`` and does have the CJS module format.
- ``module``
  + Will be used for ESM-ready tools and does have the ES format.
- ``unpkg`` 
  + Will be used from the ``unpkg`` CDN and does contain the minified UMD formatted bundle.
- ``jsdelivr``
  + Will be used from the ``jsdelivr`` CDN and does contain the minified UMD formatted bundle.
  
**Configuration**

The base configuration is located in the root folder of this repository and does return the configuration function which will be used in each package of this project. 

Properties of the [config function](https://github.com/ethereum/web3.js/tree/1.x/rollup.config.js): 

- ``name: string``
  + Will be used for named exports
- ``outputFileName: string``
  + Name of the output file
- ``globals: {[key: string]: string}``
  + pre-defined names for the globally available packages (used in CJS and ESM)
- ``dedupe: string[]``
  + Will be used to remove duplicated modules in the minified UMD bundles.
- ``namedExports: boolean``
  + Simple config to activate named exports for the bundles of a package
  
Example Usage:
``` javascript
import pkg from './package.json';
import rollupConfig from '../../rollup.config';

export default rollupConfig(
    'Web3Net',
    pkg.name,
    {
        'web3-core': 'Web3Core',
        'web3-core-method': 'Web3CoreMethod',
        'web3-utils': 'Web3Utils'
    },
    ['bn.js', 'elliptic', 'js-sha3', 'underscore']
);
```


### Testing 

**Scripts**

- ``test:unit`` - Runs just the unit tests
- ``test:e2e:ganache`` - Runs the e2e tests with ganache
- ``test:e2e:geth:auto`` - Runs the e2e tests with geth automine
- ``test:e2e:geth:insta`` - Runs the e2e tests with geth instaseal
- ``test:e2e:clients`` - Runs the e2e tests with geth and ganache
- ``test:e2e:chrome`` - Runs the e2e tests in Chrome
- ``test:e2e:firefox`` - Runs the e2e tests in Firefox
- ``test:e2e:browsers`` - Runs the e2e tests in Chrome and Firefox
- ``test:e2e:publish`` - Creates a virtual npm registry for running third party tests
- ``test:e2e:truffle`` - Runs the truffle tests with the current working state of web3


### Contributing

-   All contributions have to go into 1.x, or the 2.x branch
-   Please follow the code style of the other files, we use 4 spaces as tabs.

### Community

-   [Gitter](https://gitter.im/ethereum/web3.js?source=orgpage)
-   [Forum](https://forum.ethereum.org/categories/ethereum-js)

### Similar libraries in other languages

-   Python - [Web3.py](https://github.com/ethereum/web3.py)
-   Haskell - [hs-web3](https://github.com/airalab/hs-web3)
-   Java - [web3j](https://github.com/web3j/web3j)
-   Scala - [web3j-scala](https://github.com/mslinn/web3j-scala)
-   Purescript - [purescript-web3](https://github.com/f-o-a-m/purescript-web3)
-   PHP - [web3.php](https://github.com/sc0Vu/web3.php)

[repo]: https://github.com/ethereum/web3.js
[docs]: http://web3js.readthedocs.io/
[npm-image]: https://badge.fury.io/js/web3.png
[npm-url]: https://npmjs.org/package/web3
[travis-image]: https://travis-ci.org/ethereum/web3.js.svg
[travis-url]: https://travis-ci.org/ethereum/web3.js
[dep-image]: https://david-dm.org/ethereum/web3.js.svg
[dep-url]: https://david-dm.org/ethereum/web3.js
[dep-dev-image]: https://david-dm.org/ethereum/web3.js/dev-status.svg
[dep-dev-url]: https://david-dm.org/ethereum/web3.js#info=devDependencies
[coveralls-image]: https://coveralls.io/repos/ethereum/web3.js/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/ethereum/web3.js?branch=1.x
[waffle-image]: https://badge.waffle.io/ethereum/web3.js.svg?label=ready&title=Ready
[waffle-url]: https://waffle.io/ethereum/web3.js
