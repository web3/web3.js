**PREVIEW RELEASE** This is a beta preview release with breaking changes! The current stable version is 0.20.0 

<img src="https://github.com/ethereum/web3.js/raw/1.0/web3js.jpg" width=200 />

# web3.js - Ethereum JavaScript API

[![Join the chat at https://gitter.im/ethereum/web3.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/web3.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url] [![dev dependency status][dep-dev-image]][dep-dev-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Stories in Ready][waffle-image]][waffle-url]

This is the Ethereum [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec.


You need to run a local or remote Ethereum node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3
```

### Meteor.js

*Note*: works only in the Browser for now. (PRs welcome)

```bash
meteor add ethereum:web3
```

### In the Browser

Build and include `dist/web3.min.js` in your html file.


## Usage
Use the `Web3` object directly from global namespace:

```js
var web3 = new Web3('ws://localhost:8546');
console.log(Web3);
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

## Documentation

Documentation can be found at [read the docs][docs]


## Building

### Requirements

* [Node.js](https://nodejs.org)
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Building (gulp)

```bash
npm run-script build
```

This will put all the browser build files into the `dist` folder.


### Testing (mocha)

```bash
npm test
```

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

