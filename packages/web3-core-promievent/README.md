# web3-core-promievent

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a sub package of [web3.js][repo]

This is the PromiEvent package is used to return a EventEmitter mixed with a Promise to allow multiple final states as well as chaining.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-promievent
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core-promievent.js` in your html file.
This will expose the `Web3PromiEvent` object on the window object.


## Usage

```js
// in node.js
var Web3PromiEvent = require('web3-core-promievent');

var myFunc = function(){
    var promiEvent = Web3PromiEvent();
    
    setTimeout(function() {
        promiEvent.eventEmitter.emit('done', 'Hello!');
        promiEvent.resolve('Hello!');
    }, 10);
    
    return promiEvent.eventEmitter;
};


// and run it
myFunc()
.then(console.log);
.on('done', console.log);
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/dm/web3-core-promievent.svg
[npm-url]: https://npmjs.org/package/web3-core-promievent
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-core-promievent
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-core-promievent
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-core-promievent
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-core-promievent

