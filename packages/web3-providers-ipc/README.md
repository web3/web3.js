# web3-providers-ipc

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub package of [web3.js][repo]

This is a IPC provider for [web3.js][repo].  
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ipc
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-providers-ipc.js` in your html file.
This will expose the `Web3IpcProvider` object on the window object.

## Usage

```js
// in node.js
var Web3IpcProvider = require('web3-providers-ipc');
var net = require(net);

var ipc = new Web3IpcProvider('/Users/me/Library/Ethereum/geth.ipc', net);
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-providers-ipc.svg
[npm-url]: https://npmjs.org/package/web3-providers-ipc
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-providers-ipc
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-providers-ipc
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-providers-ipc
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-providers-ipc
