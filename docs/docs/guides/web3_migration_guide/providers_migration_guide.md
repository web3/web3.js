---
title: web3.providers Migration Guide
sidebar_position: 2
sidebar_label: web3.providers
---

For full description about the providers, their priorities and their types, you can check [web3.js Providers Guide](/docs/guides/web3_providers_guide/).

### Provider Options Changes

There are differences in the objects that could be passed in the Provider constructors between version 1.x and 4.x. Below, you will find the difference for every Provider object type.

#### HttpProvider

In 1.x, options passed in the constructor should be of type [`HttpProviderOptions`](https://github.com/web3/web3.js/blob/1.x/packages/web3-core-helpers/types/index.d.ts#L173). The `HttpProviderOptions` interface consists of:

```ts
interface HttpProviderOptions {
	keepAlive?: boolean;
	timeout?: number;
	headers?: HttpHeader[];
	withCredentials?: boolean;
	agent?: HttpAgent;
}

interface HttpAgent {
	http?: http.Agent;
	https?: https.Agent;
	baseUrl?: string;
}

interface HttpHeader {
	name: string;
	value: string;
}
```

In 4.x, the options is of type `HttpProviderOptions`, which is an object with a `providerOptions` key and value a `RequestInit` object.
Regarding `RequestInit` see [microsoft's github](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html).

For example:

```ts
// in 1.x
let httpOptions = {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        },
    ],
    agent: {
        http: http.Agent(...),
        baseUrl: ''
    }
};

// in 4.x
let httpOptions = {
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

In 1.x, options passed in the constructor should be of type [`WebsocketProviderOptions`](https://github.com/web3/web3.js/blob/1.x/packages/web3-core-helpers/types/index.d.ts#L192). The `WebsocketProviderOptions` interface consists of:

```ts
interface WebsocketProviderOptions {
	host?: string;
	timeout?: number;
	reconnectDelay?: number;
	headers?: any;
	protocol?: string;
	clientConfig?: object;
	requestOptions?: any;
	origin?: string;
	reconnect?: ReconnectOptions;
}

interface ReconnectOptions {
	auto?: boolean;
	delay?: number;
	maxAttempts?: number;
	onTimeout?: boolean;
}
```

In 4.x, the options object is of type `ClientRequestArgs` or of `ClientOptions`. See [here](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_http_d_._http_.clientrequestargs.html) for `ClientRequestArgs` and [here](https://github.com/websockets/ws) for `ClientOptions`.

In 4.x a second option parameter can be given regarding auto-reconnecting, delay and max tries attempts. And here is its type:

```ts
type ReconnectOptions = {
	autoReconnect: boolean; // default: `true`
	delay: number; // default: `5000`
	maxAttempts: number; // default: `5`
};
```

##### Options examples

Below is an example for the passed options for each version:

```ts
// in 1.x
var options = {
	timeout: 30000, // ms

	// Useful for credentialed urls, e.g: ws://username:password@localhost:8546
	headers: {
		authorization: 'Basic username:password',
	},

	clientConfig: {
		// Useful if requests are large
		maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
		maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

		// Useful to keep a connection alive
		keepalive: true,
		keepaliveInterval: 60000, // ms
	},

	// Enable auto reconnection
	reconnect: {
		auto: true,
		delay: 5000, // ms
		maxAttempts: 5,
		onTimeout: false,
	},
};
// in 4.x
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

##### Error message for reconnect attempts

The error in, version 1.x, was an Error object that contains the message:
`'Maximum number of reconnect attempts reached!'`

However, the error, in version 4.x, is just an error message (not wrapped in an Error object). And the error message will contain the value of the variable `maxAttempts` as follows:

`` `Max connection attempts exceeded (${maxAttempts})` ``

And here is how to catch the error, in version 4.x, if max attempts reached when there is auto reconnecting:

```ts
provider.on('error', errorMessage => {
	if (errorMessage.startsWith('Max connection attempts exceeded')) {
		// the `errorMessage` will be `Max connection attempts exceeded (${maxAttempts})`
		// the `maxAttempts` is equal to the provided value by the user, or the default value `5`.
	}
});
```
