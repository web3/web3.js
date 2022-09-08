# web3-providers-ipc

[![NPM Package][npm-image]][npm-url] 
This is an IPC provider sub-package for [web3.js][repo].

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-providers-ipc
```

## Usage

```js
const Web3IpcProvider = require('web3-providers-ipc');
const net = require(net);

const ipc = new Web3IpcProvider('/Users/me/Library/Ethereum/geth.ipc', net);
```

## Types

All the TypeScript typings are placed in the `types` folder.

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/v/web3-providers-ipc.svg
[npm-url]: https://npmjs.org/package/web3-providers-ipc
