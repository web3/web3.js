# web3-providers

This is a sub package of [web3.js][repo]

## Installation

### Node.js

```bash
npm install web3-providers
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-providers.js` in your html file.
This will expose the `Web3Providers` object on the window object.


## Usage examples

#### HttpProvider
You can pass with the options object the timeout and all known HTTP headers. 

```js 
import {HttpProvider} from 'web3-providers';

const options = {
    timeout: 20000,
    headers: [
        {
            name: 'Access-Control-Allow-Origin', value: '*'
        },
        {...}
    ]
};

const httpProvider = new HttpProvider('http://localhost:8545', options); 
```

#### WebsocketProvider
Instead of setting a authorization header you could also define the credentials over the URL with:
```ws://username:password@localhost:8546```

```js 
import {WebsocketProvider} from 'web3-providers';
const options = { 
    timeout: 30000, 
    headers: {
        authorization: 'Basic username:password'
    }
};
 
const websocketProvider = new WebsocketProvider('ws://localhost:8546', options);
```

#### IpcProvider
```js 
import {IpcProvider} from 'web3-providers';
import net from 'net';

const ipcProvider = new IpcProvider('/Users/me/Library/Ethereum/geth.ipc', net);
```

#### BatchRequest
The BatchRequest provides the possibility to send RPC requests as batch.
Please read the [documentation][docs] for more.

```js 
import {ProvidersModuleFactory, BatchRequest} 'web3-providers;

const provider = new ProvidersModuleFactory()
                        .createProviderAdapterResolver
                        .resolve('ws://localhost:8546');

const batchRequest = new BatchRequest(provider);

batchRequest.add(web3.eth.getBalance.request(
    '0x0000000000000000000000000000000000000000',
    'latest',
    callback
));

batchRequest.execute();
```

#### ProviderDetector
Checks if an provider is given from the environment (Mist, metamask) and returns the provider.

```js
import {ProvidersModuleFactory} 'web3-providers;

const providerDetector = new ProvidersModuleFactory.createProviderDetector();

const givenProvider = providerDetector.detect();
```

#### ProviderAdapterResolver
The ProviderAdapterResolver resolves an url or an given provider object to the correct adapter. 
This way we use internally in web3 just one provider interface and we have no direct dependency to third parties providers.

```js 
import {ProvidersModuleFactory} 'web3-providers;

const socketProviderAdapter = new ProvidersModuleFactory()
                        .createProviderAdapterResolver
                        .resolve('ws://localhost:8546');
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
