# web3-core-method

This is a sub package of [web3.js][repo]

The Method module abstracts the JSON-RPC method and is used within most [web3.js][repo] packages.


##### MethodController
> Excecutes the JSON-RPC method with an ```MethodModel```

##### execute
 ```js 
    execute(
        methodModel: AbstractMethodModel,
        accounts: Accounts,
        moduleInstance: AbstractWeb3Module
    ): {Promise<Object|String>|PromiEvent|String} 
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
// in node.js

// Dependencies
import {AbstractWeb3Module} from 'web3-package';
import Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {MethodController} from 'web3-core-method';
import * as ProvidersPackage from 'web3-providers';

// Create an object/package like Eth
class Module extends AbstractWeb3Module {
    
    /**
     * @param {Object|String} provider
     * @param {ProvidersPackage} providersPackage
     * @param {MethodController} methodController
     * @param {AbstractMethodModelFactory} methodModelFactory
     * 
     * @constructor
     */
    constructor (
        provider,
        providersPackage,
        methodController,
        methodModelFactory
    ) {
        super(
            provider,
            providersPackage,
            methodController,
            methodModelFactory
        );
    }
}

// Create the MyMethoModelFactory object
class MethodModelFactory extends AbstractMethodModelFactory {
    
    /**
     * @param {Object} utils
     * @param {Object} formatters
     * 
     * @constructor
     */
    constructor (utils, formatters) {
        super({sendTransaction: MethodPackage.SendTransactionMethodModel},
            utils,
            formatters
        );
    }
}

// Instantiate anything
const module = new Module(
    ProvidersPackage.detect(), 
    ProvidersPackage, 
    new MethodController(), 
    new MethodModelFactory(Utils, formatters)
);

module.sendTransaction({...}, function(){ ... });
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


