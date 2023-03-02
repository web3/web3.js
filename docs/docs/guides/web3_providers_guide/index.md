---
sidebar_position: 1
sidebar_label: 'web3 Providers'
---

# web3.js Providers Guide

Connecting to a chain happens through a provider. You can pass the provider to the `Web3` constructor as follow:

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

The provider could be any of the following:

-   An instance of [HttpProvider](/api/web3-providers-http/class/HttpProvider)
-   An instance of [WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider)
-   An instance of [IpcProvider](/api/web3-providers-ipc/class/IpcProvider)
-   A string containing string url for `http`/`https`, `ws`/`wss`, or `ipc` protocol. And when a string is passed, an instance of the compatible class above will be created accordingly. ex. WebSocketProvider instance will be created for string containing `ws` or `ws`. And you access this instance by calling `web3.provider` to read the provider and possibly register an event listener.
-   Any provider object that adhere to [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193). And it has been tested with Ganache provider, Hardhat provider, and Incubed (IN3) as a provider.

For both [WebSocketProvider](/api/web3-providers-ws/class/WebSocketProvider) and [IpcProvider](/api/web3-providers-ipc/class/IpcProvider)the user can listen to emitted events. More on this is at [Providers Events Listening](events_listening).
