---
sidebar_position: 18
sidebar_label: '📖 Glossary'
title: Glossary
---


## Provider

In web3.js, a `provider` is an object responsible for enabling connectivity with the Ethereum network in various ways. Providers facilitate the connection of your web application to an Ethereum node, different provider types are available in web3.js(HTTP, WebSocket and IPC), each with its own features and use cases. **It's important to note that a provider itself only provides read-only access to the blockchain.** It does not use any private keys or accounts for interaction. This read-only functionality is particularly useful for querying data and making calls to the blockchain without the need for private key authorization.

## Accounts

In web3.js, an `account` allows you to perform operations on the blockchain, such as sending transactions, signing data, and interacting with contracts. It serves as the key component for **using a private key** directly to execute various blockchain operations. In other libraries, this concept is often referred to as a `signer`. This versatility in terminology doesn't change its fundamental purpose, providing a secure and straightforward means to manage Ethereum-related operations.


## Wallet

A `wallet` in web3.js can store multiple `accounts`. This feature allows you to manage various private keys for different operations. When using methods such as `web3.eth.sendTransaction()` or `web3.eth.contract.methods.doSomething().send({})`, the web3.js library handles these transactions using the wallet accounts under the hood. Essentially, the wallet makes it easier to coordinate multiple accounts for smoother Ethereum operations.


## Contract

The `Contract` class is an important class in the `web3-eth-contract` package, also available in the `web3` package. It serves as an abstraction representing a connection to a specific contract on the Ethereum Network, enabling applications to interact with it as a typical JavaScript object. Through the `Contract` class, you can execute functions and listen to events associated with the smart contract (e.g, `contract.methods.doSomething().call()`)

## JSON Interface (ABI)

The JSON interface is a `JSON` object describing the [Application Binary Interface (ABI)](https://docs.soliditylang.org/en/develop/abi-spec.html) for an Ethereum smart contract.

Using this JSON interface, web3.js is able to create a JavaScript object representing the smart contract , its methods and events using the `web3.eth.Contract` object.

### Functions

-   `type`: `"function"`, `"constructor"` (can be omitted, defaulting to `"function"`; `"fallback"` also possible but not relevant in web3.js);
-   `name`: the name of the function (only present for function types);
-   `constant`: `true` if function is specified to not modify the blockchain state;
-   `payable`: `true` if function accepts ether, defaults to false;
-   `stateMutability`: a `string` with one of the following values: `"pure"` (specified to not read blockchain state), `"view"` (same as constant above), `"non-payable"` and `"payable"` (same as payable above);
-   `inputs`: an `Array of objects`, each of which contains:
    -- `name`: the name of the parameter;
    -- `type`: the canonical type of the parameter.
-   `outputs`: an `Array of objects`, same as inputs, can be omitted if no outputs exist.

### Events

-   `type`: always `"event"`
-   `name`: the name of the event;
-   `inputs`: an `Array of objects`, each of which contains:

    -   `name`: the name of the parameter;

    -   `type`: the canonical type of the parameter.

    -   `indexed`: `true` if the field is part of the log’s topics, false if it is one of the log’s data segment.

    -   `anonymous`: `true` if the event was declared as anonymous.

#### Example

```solidity title='Solidity Contract'
pragma solidity ^0.8.4;

contract Test {
	uint256 a;
	address d = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;

	constructor(uint256 testInt) {
		a = testInt;
	}

	event Event(uint256 indexed b, bytes32 c);

	event Event2(uint256 indexed b, bytes32 c);

	function foo(uint256 b, bytes32 c) public returns (address) {
		emit Event(b, c);
		return d;
	}
}

```

```json title='Resulting JSON ABI'
[
    {
        "type": "constructor",
        "stateMutability": "nonpayable",
        "inputs": [{"internalType":"uint256","name":"testInt","type":"uint256"}],
    },
    {
        "type": "event",
        "name": "Event",
        "inputs": [{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"c","type":"bytes32"}],
        "anonymous": false,
    },
    {
        "type": "event",
        "name": "Event2",
        "inputs": [{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"c","type":"bytes32"}],
        "anonymous": false,
    },
    {
        "type": "function",
        "name": "foo",
        "stateMutability": "nonpayable",
        "inputs": [{"internalType":"uint256","name":"b","type":"uint256"},{"internalType":"bytes32","name":"c","type":"bytes32"}],
        "outputs": [{"internalType":"address","name":"","type":"address"}],
    }
]
```

## Proxy

A `proxy` in Web3.js serves as an intermediary between your application and an Ethereum node, **facilitating communication** by **forwarding requests and responses**. Configuring a proxy can help overcome network restrictions, enhance security, and improve load balancing. You can set up a proxy using either HttpProvider or WebSocketProvider in Web3.js.

## HttpProvider

[HttpProvider](https://docs.web3js.org/guides/web3_providers_guide/#http-provider) in Web3.js connects an application to an Ethereum node over HTTP. It allows for sending transactions, reading blockchain data, and interacting with smart contracts. You create a Web3 instance with the node’s URL to establish the connection. It’s essential for DApps needing blockchain interaction but can block the event loop, so alternatives like `WebSocketProvider` might be used for better performance when real-time communication is needed.

```typescript
import { Web3 } from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
```

## WebSocketProvider
[WebSocketProvider](https://docs.web3js.org/guides/web3_providers_guide/#websocket-provider) in Web3.js connects your application to an Ethereum node via WebSocket, enabling real-time and asynchronous communication. This provider is ideal for applications needing real-time updates, such as new blocks or smart contract events. It offers better performance for high-throughput applications compared to `HttpProvider`. Ensure secure connections with `wss://` for exposed endpoints. Handle reconnections gracefully for reliable operation.

```javascript title='WebSocketProvider example'
import { Web3 } from 'web3';
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

## Events

The `Events` class in Web3.js is a crucial part of the library that enables developers to interact with and listen for events emitted by smart contracts on the Ethereum network. Events in **smart contracts** are similar to `logs` or `messages` that the **contract emits to notify** external applications about specific actions or state changes. Web3.js provides a comprehensive set of tools to handle these events, making it possible to build responsive and interactive decentralized applications (dApps).

#### Example

```solidity title='Event in solidity'
contract MyContract {
  event Transfer(address indexed from, address indexed to, uint value);

  function transfer(address recipient, uint amount) public {
    // ... transfer logic ...
    emit Transfer(msg.sender, recipient, amount);
  }
}
```

```javascript title='Event in web3.js'
import { Web3 } from 'web3';
const MyContract = require('./MyContract.json'); // Assuming ABI is loaded

const web3 = new Web3('wss://mainnet.infura.io/v3/YOUR_INFURA_ID'); // Replace with your provider URL
const contractAddress = '0x...'; // Replace with your contract address

const myContract = new web3.eth.Contract(MyContract.abi, contractAddress);

const transferEvent = myContract.events.Transfer(); // Access the Transfer event

transferEvent.on('data', (event) => {
  console.log('Transfer Event:', event);
  // Process the event data (from, to, value)
});
```

## Event logs

`Logs` in Web3.js are a part of **Ethereum transactions** that contain **information about events triggered** within smart contracts. They provide a way to record and retrieve significant occurrences within the blockchain. `Event logs` are particularly useful for tracking changes, and debugging.

#### Example

```typescript
import { Web3 } from 'web3';
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const options = {
  fromBlock: 0,
  toBlock: 'latest',
  address: '0xYourContractAddress',
  topics: [
    web3.utils.sha3('Transfer(address,address,uint256)')
  ]
};

web3.eth.getPastLogs(options)
  .then((logs) => {
    console.log(logs);
  })
  .catch((error) => {
    console.error('Error retrieving logs:', error);
  });
`