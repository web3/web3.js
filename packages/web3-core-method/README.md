# web3-core-method

This is a sub package of [web3.js][repo]

The Method module abstracts the JSON-RPC method and is used within most [web3.js][repo] packages.


##### MethodController
> Excecutes the JSON-RPC method with an ```MethodModel```.

```js 
import {MethodController} from 'web3-core-method'

const response = new MethodController().execute(
    methodModel, // AbstractMethodModel
    accounts, // Accounts
    moduleInstance // AbstractWeb3Module
); 
```

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
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {MethodController, AbstractMethodModelFactory, SendTransactionMethodModel} from 'web3-core-method';
import {ProvidersModuleFactory, providers} from 'web3-providers';

// Create an module class
class Module extends AbstractWeb3Module {
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {AbstractMethodModelFactory} methodModelFactory
     * @param {Object} options
     * 
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        providers,
        methodController, 
        methodModelFactory, // optional
        options // optional
    ) {
        super(
            provider,
            providersModuleFactory,
            providers,
            methodController, 
            methodModelFactory, // optional
            options // optional
        );
    }
}

// Create the MethodModelFactory class
class MethodModelFactory extends AbstractMethodModelFactory {
    /**
     * @param {Object} utils
     * @param {Object} formatters
     * 
     * @constructor
     */
    constructor (utils, formatters) {
        super(
            {
                sendTransaction: SendTransactionMethodModel
            },
            utils,
            formatters
        );
    }
}

// Instantiate anything
const providersModuleFactory = new ProvidersModuleFactory();
const module = new Module(
    providersModuleFactory.createProviderDetector().detect(), 
    providersModuleFactory, 
    providers,
    new MethodController(), 
    new MethodModelFactory(Utils, formatters),
    {defaultAccount: '0x', ...}
);

module.sendTransaction({...}, (error, result) => {});
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


