# Ethereum JavaScript API

[![Join the chat at https://gitter.im/ethereum/ethereum.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereum.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the Ethereum compatible [JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
which implements the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec. It's available on npm as a node module, for bower and component as an embeddable js and as a meteor.js package.

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url] [![dev dependency status][dep-dev-image]][dep-dev-url][![Coverage Status][coveralls-image]][coveralls-url][![Stories in Ready][waffle-image]][waffle-url]

<!-- [![browser support](https://ci.testling.com/ethereum/ethereum.js.png)](https://ci.testling.com/ethereum/ethereum.js) -->

You need to run a local ethrereum node to use this library.

[Documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API)

## Installation

### Node.js

    $ npm install web3

### Meteor.js

    $ meteor add ethereum:web3

### As Browser module
Bower

	$ bower install web3

Component

	$ component install ethereum/web3.js

* Include `ethereum.min.js` in your html file. (not required for the meteor package)
* Include [bignumber.js](https://github.com/MikeMcl/bignumber.js/) (not required for the meteor package)

## Usage
Use the `web3` object directly from global namespace:

	console.log(web3); // {eth: .., shh: ...} // it's here!

Set a provider (QtSyncProvider, HttpProvider)

	web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

There you go, now you can use it:

```
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
```


For another example see `example/index.html`.


## Contribute!

### Requirements

* Node.js
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
```

### Building (gulp)

```bash
npm run-script build
```


### Testing (mocha)

```bash
npm test
```

### Testing (karma)
Karma allows testing within one or several browsers.

```bash
npm run-script karma # default browsers are Chrome and Firefox
npm run-script karma -- --browsers="Chrome,Safari" # custom browsers
```


**Please note this repo is in it's early stage.**

If you'd like to run a Http ethereum node check out
[cpp-ethereum](https://github.com/ethereum/cpp-ethereum).

Install ethereum and spawn a node:

```
eth -j
```

[npm-image]: https://badge.fury.io/js/web3.png
[npm-url]: https://npmjs.org/package/web3
[travis-image]: https://travis-ci.org/ethereum/web3.js.svg
[travis-url]: https://travis-ci.org/ethereum/web3.js
[dep-image]: https://david-dm.org/ethereum/web3.js.svg
[dep-url]: https://david-dm.org/ethereum/web3.js
[dep-dev-image]: https://david-dm.org/ethereum/web.js/dev-status.svg
[dep-dev-url]: https://david-dm.org/ethereum/web3.js#info=devDependencies
[coveralls-image]: https://coveralls.io/repos/ethereum/web3.js/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/ethereum/web3.js?branch=master
[waffle-image]: https://badge.waffle.io/ethereum/web3.js.svg?label=ready&title=Ready
[waffle-url]: http://waffle.io/ethereum/web3.js

