---
sidebar_position: 2
sidebar_label: 'Providers'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# web3.js Providers Guide

## Introduction

web3.js providers are objects responsible for enabling connectivity with the Ethereum network in various ways. Connecting your web application to an Ethereum node is necessary for sending transactions, querying data, and interacting with smart contracts on the network. In this guide, we will explore the different types of providers available in web3.js, how to set them up, and how to use them in your code.

Connecting to a chain happens through a provider. You can pass the provider to the constructor as in the following example:



<Tabs groupId="prog-lang" queryString>
  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');

const web3 = new Web3(/* PROVIDER*/);

// calling any method that interact with the network would involve using the early passed provider.
await web3.eth.sendTransaction({
	from,
	to,
	value,
});
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

// calling any method that interact with the network would involve using the early passed provider.
await web3.eth.sendTransaction({
	from,
	to,
	value,
});
```
	
	
  </TabItem>
</Tabs>

The created Web3 instance will use the passed provider to interact with the blockchain network. This interaction happens when sending a request and receiving the response, and possibly when listening to provider events (if the provider support this).

## Providers Types

Actually, the provider could be any of the following:

-   An instance of [HttpProvider](/api/web3-providers-http/class/HttpProvider)
-   An instance of [WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider)
-   An instance of [IpcProvider](/api/web3-providers-ipc/class/IpcProvider)
-   A string containing string url for `http`/`https` or `ws`/`wss` protocol. And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `wss`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.
-   Any provider object that adhere to [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193). And it has been tested with Ganache provider, Hardhat provider, and Incubed (IN3) as a provider.

For both [WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider) and [IpcProvider](/api/web3-providers-ipc/class/IpcProvider) the user can listen to emitted events. More on this is at [Providers Events Listening](events_listening).

:::tip
The passed provider can be either type `string` or one of the [`SupportedProviders`](/api/web3-core#SupportedProviders). And if it is passed as a string, then internally the compatible provider object will be created and used.
:::

## Providers Priorities

There are multiple ways to set the provider.

```ts title='Setting a provider'
web3.setProvider(myProvider);
web3.eth.setProvider(myProvider);
web3.Contract.setProvider(myProvider);
contractInstance.setProvider(myProvider);
```

The key rule for setting provider is as follows:

1. Any provider set on the higher level will be applied to all lower levels. e.g. Any provider set using `web3.setProvider` will also be applied to `web3.eth` object.
2. For contracts `web3.Contract.setProvider` can be used to set provider for **all instances** of contracts created by `web3.eth.Contract`.

---

## Examples

### Local Geth Node

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545');
// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));


// Using the IPC provider in node.js
const { Web3 } = require('web3');
const { IpcProvider } = require('web3-providers-ipc');

const web3 = new Web3(
  new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc'),
); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

  </TabItem>

  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
import { Web3 } from 'web3';
const web3 = new Web3('http://localhost:8545');
// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));


// Using the IPC provider in node.js
import { Web3 } from 'web3';
import { IpcProvider } from 'web3-providers-ipc';

const web3 = new Web3(
  new IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc'),
); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

  </TabItem>
</Tabs>

### Remote Node Provider

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
// Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
const { Web3 } = require('web3');
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
// Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
import { Web3 } from 'web3';
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
```

  </TabItem>
</Tabs>


### Injected providers

As stated above, the injected provider should be in compliance with [EIP-1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md). And it is tested with Ganache provider, Hardhat provider, and Incubed (IN3) as a provider.

The web3.js 4.x Provider specifications are defined in [web3 base provider](https://github.com/ChainSafe/web3.js/blob/4.x/packages/web3-types/src/web3_base_provider.ts) for Injected Providers.

```html
<script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
<script>
	window.addEventListener('load', function () {
		// Check if web3 is available
		if (typeof window.ethereum !== 'undefined') {
			// Use the browser injected Ethereum provider
			web3 = new Web3(window.ethereum);
			// Request access to the user's MetaMask account
			window.ethereum.enable();
			// Get the user's accounts
			web3.eth.getAccounts().then(function (accounts) {
				// Show the first account
				document.getElementById('log').innerHTML =
					'Connected with MetaMask account: ' + accounts[0];
			});
		} else {
			// If web3 is not available, give instructions to install MetaMask
			document.getElementById('log').innerHTML =
				'Please install MetaMask to connect with the Ethereum network';
		}
	});
</script>
```

Note that the above code should be hosted in a web server (that could be a simple local web server), because many browser does not support this feature for static files located on your machine.

### Provider Options

There are differences in the objects that could be passed in the Provider constructors.

#### HttpProvider

The options is of type `HttpProviderOptions`, which is an object with a single key named `providerOptions` and its value is an object of type `RequestInit`.
Regarding `RequestInit` see [microsoft's github](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html).

For example:

```ts
const httpOptions = {
	providerOptions: {
		body: undefined,
		cache: 'force-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		integrity: 'foo',
		keepalive: true,
		method: 'GET',
		mode: 'same-origin',
		redirect: 'error',
		referrer: 'foo',
		referrerPolicy: 'same-origin',
		signal: undefined,
		window: undefined,
	} as RequestInit,
};
```

#### WebSocketProvider

Use WebSocketProvider to connect to a Node using a WebSocket connection, i.e. over the `ws` or `wss` protocol.

The options object is of type `ClientRequestArgs` or of `ClientOptions`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`.

The second option parameter can be given regarding reconnecting. And here is its type:

```ts
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
	autoReconnect: boolean; // default: `true`
	delay: number; // default: `5000`
	maxAttempts: number; // default: `5`
};
```

And here is a sample instantiation for the `WebSocketProvider`:

```ts
const provider = new WebSocketProvider(
	`ws://localhost:8545`,
	{
		headers: {
			// to provide the API key if the Node requires the key to be inside the `headers` for example:
			'x-api-key': '<Api key>',
		},
	},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

The second and the third parameters are both optional. And, for example, the second parameter could be an empty object or undefined, like in the following example:

```ts
const provider = new WebSocketProvider(
	`ws://localhost:8545`,
	{},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

##### Options example

Below is an example for the passed options:

```ts
let clientOptions: ClientOptions = {
	// Useful for credentialed urls, e.g: ws://username:password@localhost:8546
	headers: {
		authorization: 'Basic username:password',
	},
	maxPayload: 100000000,
};

const reconnectOptions: ReconnectOptions = {
	autoReconnect: true,
	delay: 5000,
	maxAttempts: 5,
};
```

### IpcProvider

The IPC Provider could be used in node.js dapps when running a local node. And it provide the most secure connection.

It accepts a second parameter called `socketOptions`. And, its type is `SocketConstructorOpts`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html) for full details. And here is its interface:

```ts
// for more check: https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.socketconstructoropts.html
interface SocketConstructorOpts {
	fd?: number | undefined;
	allowHalfOpen?: boolean | undefined;
	readable?: boolean | undefined;
	writable?: boolean | undefined;
}
```

And, the third parameter is called `reconnectOptions` that is of the type `ReconnectOptions`. It can be given to control: auto-reconnecting, delay and max tries attempts. And here its type:

```ts
// this is the same options interface used for both WebSocketProvider and IpcProvider
type ReconnectOptions = {
	autoReconnect: boolean; // default: `true`
	delay: number; // default: `5000`
	maxAttempts: number; // default: `5`
};
```

##### Options examples

Below is an example for the passed options for each version:

```ts
let clientOptions: SocketConstructorOpts = {
	allowHalfOpen: false;
	readable: true;
	writable: true;
};

const reconnectOptions: ReconnectOptions = {
	autoReconnect: true,
	delay: 5000,
	maxAttempts: 5,
};
```

And here is a sample instantiation for the `IpcProvider`:

```ts
const provider = new IpcProvider(
	`path.ipc`,
	{
		writable: false,
	},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

The second and the third parameters are both optional. And, for example, the second parameter could be an empty object or undefined.

```ts
const provider = new IpcProvider(
	`path.ipc`,
	{},
	{
		delay: 500,
		autoReconnect: true,
		maxAttempts: 10,
	},
);
```

#### Error message for reconnect attempts

:::info
This section applies for both `IpcProvider` and `WebSocketProvider`.
:::

The error message, for the max reconnect attempts, will contain the value of the variable `maxAttempts` as follows:

`` `Maximum number of reconnect attempts reached! (${maxAttempts})` ``

And here is how to catch the error, if max attempts reached when there is auto reconnecting:

```ts
provider.on('error', error => {
	if (error.message.startsWith('Maximum number of reconnect attempts reached!')) {
		// the `error.message` will be `Maximum number of reconnect attempts reached! (${maxAttempts})`
		// the `maxAttempts` is equal to the provided value by the user, or the default value `5`.
	}
});
```
