---
sidebar_position: 1
sidebar_label: 'Providers'
---

# web3.js Providers Guide

Connecting to a chain happens through a provider. You can pass the provider to the constructor as in the following example:

```ts
import { Web3 } from `web3`

const web3 = new Web3(/* PROVIDER*/);

// calling any method that interact with the network would involve using the early passed provider.
await web3.eth.sendTransaction({
    from,
    to,
    value,
});
```

The created Web3 instance will use the passed provider to interact with the blockchain network. This interaction happen when sending a request and receiving the response, and when possibly listen to provider events (if the provider support this).

## Providers Types

Actually, the provider could be any of the following:

-   An instance of [HttpProvider](/api/web3-providers-http/class/HttpProvider)
-   An instance of [WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider)
-   An instance of [IpcProvider](/api/web3-providers-ipc/class/IpcProvider)
-   A string containing string url for `http`/`https`, `ws`/`wss`, or `ipc` protocol. And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `ws`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.
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

```ts
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
const net = require('net');
const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
const web3 = new Web3(
	new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net),
); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

### Remote Node Provider

```ts
// Using a remote node provider, like Alchemy (https://www.alchemyapi.io/supernode), is simple.
const Web3 = require('web3');
const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
```

### Injected providers

As stated above, the injected provider should be in compliance with [EIP-1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md). And it is tested with Ganache provider, Hardhat provider, and Incubed (IN3) as a provider.

The web3.js 4.x Provider specifications are defined in [web3 base provider](https://github.com/ChainSafe/web3.js/blob/4.x/packages/web3-types/src/web3_base_provider.ts) for Injected Providers.

```ts
const Web3 = require('web3');
// Using an EIP1193 provider like MetaMask can be injected

if (window.ethereum) {
	// Check if ethereum object exists
	await window.ethereum.request();
	window.web3 = new Web3(window.ethereum); // inject provider
}
```

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

The options object is of type `ClientRequestArgs` or of `ClientOptions`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`.

The second option parameter can be given regarding reconnecting. And here is its type:

```ts
type ReconnectOptions = {
	autoReconnect: boolean;
	delay: number;
	maxAttempts: number;
};
```

:::info
Here is how to catch the error if max attempts reached when the auto reconnecting:

```ts
provider.on('error', errorMessage => {
	if (errorMessage.startsWith('Maximum number of reconnect attempts reached!')) {
		// the `errorMessage` will be `Maximum number of reconnect attempts reached! (${maxAttempts})`
		// the `maxAttempts` is equal to the provided value by the user or the default `5`.
	}
});
```

:::

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

#### Error message for reconnect attempts

:::note
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
