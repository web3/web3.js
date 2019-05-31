# web3-providers

This is a sub module of [web3.js][repo]

## Installation

```bash
npm install web3-providers
```

## Usage Examples

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
const credentials = Buffer.from('username:password').toString('base64')
const options = { 
    timeout: 30000, 
    headers: {
        authorization: `Basic ${credentials}`
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
import {ProviderResolver, BatchRequest} 'web3-providers';

const provider = new ProviderResolver().resolve('ws://localhost:8546');
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
import {ProviderDetector} from 'web3-providers';

const givenProvider = ProviderDetector.detect();
```

#### ProviderResolver
The ProviderResolver resolves an url or an given provider object to the correct provider class. 
Because of the resolves does web3 has internally just one provider interface and we have no direct dependency to third party providers.

```js 
import {ProviderResolver} 'web3-providers';

const socketProviderAdapter = new ProviderResolver().resolve('ws://localhost:8546');
```

## Types 

All the typescript typings are placed in the types folder. 

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
