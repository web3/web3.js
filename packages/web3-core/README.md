# web3-core

This is a sub module of [web3.js][repo]

The ```web3-core``` contains core functions for [web3.js][repo] modules. This module should be used
if someone wants to implement a new web3 module. 

Don't forget to overwrite the ```setProvider()``` method in the parent object and be sure it
will set the provider on his child modules too. This is the default behaviour of web3.

##### AbstractWeb3Module:

> This class provides the default dependencies and behaviours of an web3 JSON-RPC module.

- ```extend(methods: Object):void ``` Extends the current object with additional RPC methods.
- ```setProvider(provider: any):void ``` Sets the current provider of it.
- ```clearSubscriptions():void ``` Clears all subscriptions
- ```proxyHandler(target, name): any``` This will be used for the RPC method handling in the Proxy object.  
- ```BatchRequest``` This provides the possibility to create a batch requests. Please have a look on the official [documentation][docs] for further information.
- ```givenProvider``` This contains the detected provider.
- ```currentProvider``` This contains the current provider of this object.
- ```methodController``` This is an instance of ```MethodController```. It will be used to execute an RPC request. For further information please have a look on the ```MethodController``` in the ```web3-core-method``` package.
- ```methodModelFactory``` This is an instance of ```AbstractMethodModelFactory```. If this property is given then it will create an "MethodProxy". Please have a look on the ```web3-core-method```readme file for further information.


##### Options
Each Web3Module provides the possibility to define default options over the constructor:

- ```defaultAccount: String``` The default address to use (default: null) 
- ```defaultBlock: String|Number``` The default block to use (default: latest)
- ```transactionBlockTimeout: Number``` The block timeout for the confirmation workflow (default: 50). Will be used if the Websocket- or the IPCProvider is used.
- ```transactionConfirmationBlocks: Number``` The needed blocks to set a transaction as confirmed (default: 24)
- ```transactionPollingTimeout: Number``` The polling timeout (default: 15). Will be used if the HttpProvider is used.
- ```defaultGasPrice: String``` The default gas price to use (default: null). Can be overwritten with the transaction options. If no default value is defined and also not in the transaction options it will get the current gasPrice of the connected node.
- ```defaultGas: Number``` The default gas limit (default: null). Can be overwritten with the transaction options.

## Installation

### Node.js

```bash
npm install web3-core
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core.js` in your html file.
This will expose the `moduleInstance` object on the window object.

## Usage

```js
import AbstractWeb3Module from 'web3-core';

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
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
