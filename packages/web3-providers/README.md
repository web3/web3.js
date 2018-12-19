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


## Events of the socket providers

- ```socket_message``` -  This event will be fired on each message of the socket.
- ```socket_ready```   -  This event will be fired when the socket is ready.
- ```socket_close```   -  This event will be fired when the connection get closed.
- ```socket_error```   -  This event will be fired when an error occurs.
- ```socket_connect``` -  This event will be fired when the connection is established.
- ```socket_networkChanged``` -  This event will be fired when the network is changing and does only exist with the EthereumProvider.
- ```socket_accountsChanged``` -  This event will be fired when the accounts are changing and does only exist with the EthereumProvider.

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
        ...
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
The BatchRequest provides the possibility to send JSON-RPC requests as batch.
Please read the [documentation][docs] for more.

```js 
import {ProvidersModuleFactory, BatchRequest} 'web3-providers;

const provider = new ProvidersModuleFactory()
                        .createProviderResolver
                        .resolve('ws://localhost:8546');

const batchRequest = new BatchRequest(provider);

batchRequest.add(web3.eth.getBalance.request(
    '0x0000000000000000000000000000000000000000',
    'latest',
    callback
));

await batchRequest.execute();
```

#### ProviderDetector
Checks if an provider is given from the environment (Mist, MetaMask) and returns the provider.

```js
import {ProvidersModuleFactory} from 'web3-providers';

const providerDetector = new ProvidersModuleFactory.createProviderDetector();
const givenProvider = providerDetector.detect();
```

#### ProviderResolver
The ProviderResolver resolves an url or an given provider object to the correct provider class. 
Because of the resolves does web3 has internally just one provider interface and we have no direct dependency to third party providers.

```js 
import {ProvidersModuleFactory} 'web3-providers;

const socketProviderAdapter = new ProvidersModuleFactory()
                        .createProviderResolver
                        .resolve('ws://localhost:8546');
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
