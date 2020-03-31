# web3-net

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub-package of [web3.js][repo].

This is the net package used in other [web3.js][repo] packages.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-net
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-net.js` in your html file.
This will expose the `Web3Net` object on the window object.

## Usage

```js
// in node.js
var Web3Net = require('web3-net');

var net = new Web3Net('ws://localhost:8546');
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-net.svg
[npm-url]: https://npmjs.org/package/web3-net
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-net
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-net
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-net
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-net
