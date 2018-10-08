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
var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
var Utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;
var MethodPackage = require('web3-core-method');
var ProvidersPackage = require('web3-core-providers');

// Create an object/package like Eth

function MyObject (
    provider,
    providersPackage,
    methodController,
    methodModelFactory
) {
    AbstractWeb3Object.call(
        this,
        provider,
        providersPackage,
        methodController,
        methodModelFactory
    );
};

// Inherit from AbstractWeb3Object
MyObject.prototype = Object.create(AbstractWeb3Object.prototype);
MyObject.prototype.constructor = MyObject;



// Create the MyMethoModelFactory object

function MyMethodModelFactory(utils, formatters) {
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
MyMethodModelFactory.prototype = Object.create(
    MethodPackage.AbstractMethodModelFactory.prototype
);
MyMethodModelFactory.prototype.constructor = MyMethodModelFactory;


// Instantiate anything
var myObject = new MyObject(
    ProvidersPackage.detect(), 
    ProvidersPackage, 
    MethodPackage.createMethodController(), 
    new MyMethodModelFactory(Utils, formatters)
);

myObject.sendTransaction({...}, function(){ ... });
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


