**PREVIEW RELEASE** This is a beta preview release with breaking changes! The current stable version is 0.20.0 

![Web3.js logo](assets/web3js.svg)

# web3.js - Ethereum JavaScript API

[![npm](https://img.shields.io/npm/dm/web3.svg)](https://www.npmjs.com/package/web3) [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]
[![Join the chat at https://gitter.im/ethereum/web3.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/web3.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the Ethereum [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec.

You need to run a local or remote Ethereum node to use this library.

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

## Usage

```js
import Web3 from 'web3';

const web3 = new Web3('ws://localhost:8546');
console.log(web3);
> {
    eth: ... ,
    shh: ... ,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `web3.setProvider()` (e.g. WebsocketProvider)

```js
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

There you go, now you can use it:

```js
web3.eth.getAccounts()
.then(console.log);
```

### Usage with TypeScript

Type definitions are maintained at [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) by others. You can install them with

```bash
npm install --dev @types/web3.js
```

You might need to install type definitions for `bignumber.js` and `lodash` too.

And then use `web3.js` as follows:

```typescript
import Web3 = require("web3"); // Note the special syntax! Copy this line when in doubt!
const web3 = new Web3("ws://localhost:8546");
```

**Please note:** We do not support TypeScript ourselves. If you have any issue with TypeScript and `web3.js` do not create an issue here. Go over to DefinitelyTyped and do it there.

## Documentation

Documentation can be found at [read the docs][docs]

## Building

### Requirements

* [Node.js](https://nodejs.org)
* npm

### Building

```bash
npm run build // Bundle all modules

// Or

cd packages/web3-eth
npm run build // This will just bundle the web3-eth module

cd packages/web3-eth
npm run dev // This module will be bundled each time a file has changed
```

### Testing

```bash
npm run test
```

### Contributing

- All contributions have to go into develop (0.20.x), or the 1.0 branch
- Please follow the code style of the other files, we use 4 spaces as tabs.

### Community
 - [Gitter](https://gitter.im/ethereum/web3.js?source=orgpage)
 - [Forum](https://forum.ethereum.org/categories/ethereum-js)


### Similar libraries in other languages
 - Python [Web3.py](https://github.com/pipermerriam/web3.py)
 - Haskell [hs-web3](https://github.com/airalab/hs-web3)
 - Java [web3j](https://github.com/web3j/web3j)
 - Scala [web3j-scala](https://github.com/mslinn/web3j-scala)
 - Purescript [purescript-web3](https://github.com/f-o-a-m/purescript-web3)
 - PHP [web3.php](https://github.com/sc0Vu/web3.php)


[repo]: https://github.com/ethereum/web3.js
[docs]: http://web3js.readthedocs.io/en/1.0/
[npm-image]: https://badge.fury.io/js/web3.png
[npm-url]: https://npmjs.org/package/web3
[travis-image]: https://travis-ci.org/ethereum/web3.js.svg
[travis-url]: https://travis-ci.org/ethereum/web3.js
[dep-image]: https://david-dm.org/ethereum/web3.js.svg
[dep-url]: https://david-dm.org/ethereum/web3.js
[dep-dev-image]: https://david-dm.org/ethereum/web3.js/dev-status.svg
[dep-dev-url]: https://david-dm.org/ethereum/web3.js#info=devDependencies
[coveralls-image]: https://coveralls.io/repos/ethereum/web3.js/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/ethereum/web3.js?branch=master
[waffle-image]: https://badge.waffle.io/ethereum/web3.js.svg?label=ready&title=Ready
[waffle-url]: https://waffle.io/ethereum/web3.js
