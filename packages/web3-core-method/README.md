# web3-core-method

This is a sub package of [web3.js][repo]

The Method package used within most [web3.js][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-method
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core-method.js` in your html file.
This will expose the `Web3Method` object on the window object.


## Usage

```js
// in node.js

// Dependencies
var AbstractWeb3Module = require('web3-package').AbstractWeb3Module;
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;
var MethodController = require('web3-core-method').MethodController;
var ProvidersPackage = require('web3-providers');

// Create an object/package like Eth
/**
 * @param {Object|String} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {AbstractMethodModelFactory} methodModelFactory
 * 
 * @constructor
 */
function Module (
    provider,
    providersPackage,
    methodController,
    methodModelFactory
) {
    AbstractWeb3Module.call(
        this,
        provider,
        providersPackage,
        methodController,
        methodModelFactory
    );
};

// Inherit from AbstractWeb3Module
Module.prototype = Object.create(AbstractWeb3Module.prototype);
Module.prototype.constructor = Module;


// Create the MyMethoModelFactory object
/**
 * @param {Object} utils
 * @param {Object} formatters
 * 
 * @constructor
 */
function MethodModelFactory(utils, formatters) {
    MethodPackage.AbstractMethodModelFactory.call(
        this,
        {
            sendTransaction: MethodPackage.SendTransactionMethodModel
        },
        utils,
        formatters
    );
}

// Inherit from AbstractMethodModelFactory
MethodModelFactory.prototype = Object.create(
    MethodPackage.AbstractMethodModelFactory.prototype
);
MethodModelFactory.prototype.constructor = MethodModelFactory;


// Instantiate anything
var module = new Module(
    ProvidersPackage.detect(), 
    ProvidersPackage, 
    new MethodController(), 
    new MethodModelFactory(Utils, formatters)
);

module.sendTransaction({...}, function(){ ... });
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


