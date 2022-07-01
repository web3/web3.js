---
title: Setting Provider
---

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

:::tip
A provider can be either `string` type or [`SupportedProviders`](/api/web3-core#SupportedProviders).
:::

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
