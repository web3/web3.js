---
title: JSON Interface
---

The JSON interface is a JSON object describing the [Application Binary Interface (ABI)](https://docs.soliditylang.org/en/develop/abi-spec.html) for an Ethereum smart contract.

Using this JSON interface, web3.js is able to create a JavaScript object representing the smart contract , its methods and events using the web3.eth.Contract object.

### Specification

#### Functions

-   `type`: `"function"`, `"constructor"` (can be omitted, defaulting to `"function"`; `"fallback"` also possible but not relevant in web3.js);
-   `name`: the name of the function (only present for function types);
-   `constant`: true if function is specified to not modify the blockchain state;
-   `payable`: true if function accepts ether, defaults to false;
-   `stateMutability`: a string with one of the following values: pure (specified to not read blockchain state), view (same as constant above), non-payable and payable (same as payable above);
-   `inputs`: an array of objects, each of which contains:
    -- `name`: the name of the parameter;
    -- `type`: the canonical type of the parameter.
-   `outputs`: an array of objects, same as inputs, can be omitted if no outputs exist.

#### Events

-   `type`: always "event"
-   `name`: the name of the event;
-   `inputs`: an array of objects, each of which contains:
    -- `name`: the name of the parameter;
    -- `type`: the canonical type of the parameter.
    -- `indexed`: true if the field is part of the log’s topics, false if it is one of the log’s data segment.
    -- `anonymous`: true if the event was declared as anonymous.

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
