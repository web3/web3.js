# web3-core-subscriptions

This is a sub package of [web3.js][repo].
The subscriptions package is used within some [web3.js][repo] packages.

If you would like to know all supported subscriptions please have a look in the ```src/models/subscriptions``` folder.

## Installation

### Node.js

```bash
npm install web3-core-subscriptions
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core-subscriptions.js` in your html file.
This will expose the `Web3Subscriptions` object on the window object.


## Usage

```js
// in node.js

// Dependencies
import {ProvidersModuleFactory, providers} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import {MethodController} from 'web3-core-method';
import {SubscriptionsFactory} from 'web3-core-subscriptions';

// Create an object of type AbstractWeb3Module
class Module extends AbstractWeb3Module{
    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {SubscriptionsFactory} subscriptionsFactory
     * 
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        providers,
        methodController, 
        subscriptionsFactory
    ) {
        super(
            provider,
            providersModuleFactory,
            providers,
            methodController
        );
        this.subscriptionsFactory = subscriptionsFactory;
    }
    
    /**
     * Returns expected subscription
     * 
     * @method subscribe
     * 
     * @param {String} subscriptionMethod
     * @param {Method} callback
     * 
     * @callback callback callback(error, result)
     * @returns {Subscription}
     */
    subscribe (subscriptionMethod, callback) {
        switch (subscriptionMethod) {
            case 'newBlockHeaders':
                return this.subscriptionsFactory
                    .createNewHeadsSubscription(this)
                    .subscribe(callback);
            case 'pendingTransactions':
                return this.subscriptionsFactory
                    .createNewPendingTransactionsSubscription(this)
                    .subscribe(callback);
            default:
                throw Error('Unsupported subscription: ' + subscriptionMethod);
        }
    };
}

// Instantiate anything
const providersModuleFactory = new ProvidersModuleFactory();
const module = new Module(
    providersModuleFactory.createProviderDetector().detect(), 
    providersModuleFactory, 
    providers,
    new MethodController(), 
    new SubscriptionsFactory()
);

// Subscribe
module.subscribe('newBlockHeaders', function(){ ... });
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


