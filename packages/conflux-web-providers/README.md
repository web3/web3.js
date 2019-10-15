# conflux-web-providers

This is a sub package of [ConfluxWeb.js][repo]

## Installation

```bash
npm install conflux-web-providers
```

## Usage Examples

#### HttpProvider
You can pass with the options object the timeout and all known HTTP headers. 

```js 
import {HttpProvider} from 'conflux-web-providers';

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
import {WebsocketProvider} from 'conflux-web-providers';
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
import {IpcProvider} from 'conflux-web-providers';
import net from 'net';

const ipcProvider = new IpcProvider('/Users/me/Library/Conflux/geth.ipc', net);
```

#### BatchRequest
The BatchRequest provides the possibility to send JSON-RPC requests as batch.

```js 
import {ProviderResolver, BatchRequest} 'conflux-web-providers';

const provider = new ProviderResolver().resolve('ws://localhost:8546');
const batchRequest = new BatchRequest(provider);

batchRequest.add(confluxWeb.cfx.getBalance.request(
    '0x0000000000000000000000000000000000000000',
    'latest_state',
    callback
));

await batchRequest.execute();
```

#### ProviderDetector
Checks if an provider is given from the environment (Mist, MetaMask) and returns the provider.

```js
import {ProviderDetector} from 'conflux-web-providers';

const givenProvider = ProviderDetector.detect();
```

#### ProviderResolver
The ProviderResolver resolves an url or an given provider object to the correct provider class. 
Because of the resolves does conflux-web has internally just one provider interface and we have no direct dependency to third party providers.

```js 
import {ProviderResolver} 'conflux-web-providers';

const socketProviderAdapter = new ProviderResolver().resolve('ws://localhost:8546');
```

## Types 

All the typescript typings are placed in the types folder. 

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
