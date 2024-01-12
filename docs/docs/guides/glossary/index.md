---
sidebar_position: 14
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
        "type": "constructor"
        "stateMutability": "nonpayable",
        "inputs": [{"internalType":"uint256","name":"testInt","type":"uint256"}],
    },
    {
        "type": "event"
        "name": "Event",
        "inputs": [{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"c","type":"bytes32"}],
        "anonymous": false,
    },
    {
        "type": "event"
        "name": "Event2",
        "inputs": [{"indexed":true,"internalType":"uint256","name":"b","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"c","type":"bytes32"}],
        "anonymous": false,
    },
    {
        "type": "function"
        "name": "foo",
        "stateMutability": "nonpayable",
        "inputs": [{"internalType":"uint256","name":"b","type":"uint256"},{"internalType":"bytes32","name":"c","type":"bytes32"}],
        "outputs": [{"internalType":"address","name":"","type":"address"}],
    }
]
```
