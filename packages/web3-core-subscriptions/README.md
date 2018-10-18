# web3-core-subscriptions

This is a sub package of [web3.js][repo].
The subscriptions package is used within some [web3.js][repo] packages.

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
import * as ProvidersPackage from 'web3-providers';
import AbstractWeb3Module from 'web3-package';
import SubscriptionsFactory from 'web3-core-subscriptions';

// Create an object of type AbstractWeb3Module
class Module extends AbstractWeb3Module{
    
    /**
     * @param {Object|String} provider
     * @param {ProvidersPackage} providersPackage
     * @param {SubscriptionsFactory} subscriptionsFactory
     * 
     * @constructor
     */
    constructor (
        provider,
        providersPackage,
        subscriptionsFactory
    ) {
        super(provider, providersPackage);
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
const module = new Module(
    ProvidersPackage.detect(),
    ProvidersPackage,
    new SubscriptionsFactory()
);

// Subscribe
module.subscribe('newBlockHeaders', function(){ ... });
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


