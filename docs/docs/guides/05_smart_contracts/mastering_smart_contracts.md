---
sidebar_position: 2
sidebar_label: 'Mastering Smart Contracts'
---

# Mastering Smart Contracts

## Live code editor

### Deploy and Interact with smart contracts:

This contract is deployed on the [mumbai testnet](https://mumbai.polygonscan.com/address/0xB9433C87349134892f6C9a9E342Ed6adce39F8dF). In this live code editor, you will find the following:

In the code editor you'll find:

-   `ContractCounter.sol`: the solidity code of the contract with:
    -   `uint256 number`: state variable of the contract.
    -   `increase()`: this function will increment by 1 the `number` variable.
    -   `getNumber()`: this function will return the current value of the `number` variable.
-   `counterABI.json`: the ABI of the ContractCounter.sol
-   `counterBytecode.json`: the compiled Bytecode of the ContractCounter.sol
-   `main.js`: here you will find 3 functions:

    -   `deploy()`: sample script to deploy the smart contract using the ABI and Bytecode
    -   `getNumber()`: sample script to call the reading function getNumber() of the smart contract
    -   `increase()`: sample script to interact with the increase() function of the smart contract

-   Contract address:

```bash
0xB9433C87349134892f6C9a9E342Ed6adce39F8dF
```

<iframe width="100%" height="700px" src="https://stackblitz.com/edit/vitejs-vite-idcw5t?embed=1&file=main.js&showSidebar=1"></iframe>

## Contract class

:::info
This guide expects you to have some basic knowledge. If you are just starting, it is recommended to first check out this [Tutorial: Deploying and Interacting with Smart Contracts](./smart_contracts_guide.md).
:::

The `Contract` class is the main object exported by the `web3-eth-contract` package. It is also available in the `web3` package.

### Importing the Contract Class

To use the `Contract` class, you'll need to import it from one of two packages: directly from the `web3-eth-contract` package or from the `web3` package.

Here's an example of importing from each:

```ts
// Importing from web3-eth-contract package
import { Contract } from 'web3-eth-contract';
const contract = new Contract(...);

// Importing from the main web3 package
import { Contract } from 'web3';
const contract = new Contract(...);

// Importing from the main web3 package from inside `web3.eth` namespace
import { Web3 } from 'web3';
const web3 = new Web3('http://127.0.0.1:8545');
const contract = new web3.eth.Contract(...);

// to set the provider for the contract instance:
contract.setProvider('http://127.0.0.1:7545');
```

### `Contract` vs `web3.eth.Contract`

There is a way to create a contract object, other than the ones listed above. That is by accessing an instance of `Web3` object. And this instance of `Web3` is usually called `web3`.

Actually, the `web3.eth.Contract` is typically how you access the class through a web3 instance that already has a provider setup and that may already has customized configurations.

:::tip

1. Importing the `web3-eth-contract` module can be beneficial if you want to reduce the size of your application instead of importing the whole `Web3` module.

2. Note the difference between `Web3.eth.Contract` and `web3instance.eth.Contract` (that is usually named `web3.eth.Contract`) is that the `Web3` (with capital `W`) is used to access the objects organized in namespaces. While `web3instance`, that is usually named `web3`, is to access the properties of this instance.
   :::

Examples:

```ts
import { Contract } from 'web3-eth-contract';

// instantiating Contract directly with provider URL from Contract package
// alternatively, you can instantiate the Contract without a provider and set it later using contract.setProvider()
const abi = [{...}];
const address = '0x...';
const contract = new Contract(abi, address { provider: 'http://127.0.0.1:8545' });

// the provider can be set like this if not provided at the constructor:
contract.setProvider('http://127.0.0.1:7545');

// using Contract from a web3 instance
const web3 = new Web3('http://localhost:8545');
const contract = new web3.eth.Contract(abi, address);
// no need to pass the provider to this contract instance.
// because it will have the same provider of the web3 instance.
```

### Constructor Parameters

When you instantiate a `Contract`, you primarily provide one or two parameters, and sometimes 3 parameters:

1. **ABI (Application Binary Interface):** The ABI tells the `Contract` how to format calls and transactions so that the contract can understand them.

:::tip
If you do not know how to get the contract ABI, we recommend you to check the Step 4 at the [# Step 4: Deploying and Interacting with Smart Contracts](./smart_contracts_guide#step-4-compile-the-solidity-code-with-the-solidity-compiler-and-get-its-abi-and-bytecode) tutorial. And to look into the guide: [Infer Contract Types from JSON Artifact](./infer_contract_types).
:::

2. (optional) **Contract Address:** The Ethereum address at which your contract is deployed. If the contract is not deployed yet, do not pass a second parameter or pass `undefined` to it.

3. (optional) **Contract Options:** you can provide contract options as a third parameter.

```ts
const abi = [{...}]; /* obtained ABI as an array */;
const address = '0x...'; // Deployed address of the contract

const myContract = new Contract(abi, address, {
  defaultGasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
  defaultGas: 5000000, // provide the gas limit for transactions
  //...other optional properties
});
```

### Contract Properties and Methods

The `Contract` class comes equipped with a range of properties and methods for contract interaction. We encourage you to check them at the [Contract API Documentation section](/api/web3-eth-contract/class/Contract)

#### Properties include

-   **config**: The set of configurations for the contract instance that is defaults to the same values as the `web3` object instance. But, it allows for using a different configurations for a specific contract instance. So, in most cases, you would use `web3.eth.Contract` and keep the configurations of the parent context (from the `web3` instance). Except if there is something you need to handle differently for only a specific contract instance.

Here is an example on how to set a value of a specific config variable on a contract instance:

```ts
import {Web3} from 'web3';

// Set up a connection to a testnet or Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')); //or new Web3('http://127.0.0.1:8545')

// Create a new contract object using the ABI and bytecode
const abi = [{...}]
const myContract = new web3.eth.Contract(abi);
console.log(myContract.config.handleRevert); //false

// This will set `handleRevert` to `true` only on `myContract` instance:
myContract.handleRevert = true; // same as: myContract.config.handleRevert
console.log(myContract.config.handleRevert); //true

```

More on the `config` properties in the [API documentation](/api/web3/namespace/core/#Web3ConfigOptions)

-   **options**: The set of options for the contract instance.
    This options can be passed as the third parameter to the constructor. And can be accessed also later with contractInstance.options.

```ts
myContract.options = {
    address: '0x1234567890123456789012345678901234567891',
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    gasPrice: '10000000000000',
    gas: 1000000
}

// If the smart contract is not deployed yet, the property `address` will be filled automatically after deployment succeed.
// If the smart contract is already deployed, you can set the `address`:
myContract.options.address = '0x1234567890123456789012345678901234567891';
// this is the same as the second parameter in the constructor:
// new Contract(abi, `address`);

// set default from address
myContract.options.from = '0x1234567890123456789012345678901234567891';
// set default gas price in wei
myContract.options.gasPrice = '20000000000000';
// set the gas limit
myContract.options.gas = 5000000;

// you can also use this to update the ABI of the contract
myContract.options.jsonInterface = [{...}]; // ABI
// this is the same as the first parameter in the Contract constructor:
// new Contract(`abi`, address)
```

-   **methods**: An object mapping your contract's methods for easy calling.
    This property provide a strongly typed methods depending on the passed ABI. And here is how to use it:

```ts
// note that the bellow METHOD_NAME and METHOD_PARAMETERS are
// according to the early provided ABI.
// And TypeScript intellisense will help you with.

// to call a method by sending a transaction
contract.methods.METHOD_NAME(METHOD_PARAMETERS).send();
// you need to specify the account (from) that will be used to sign and send the transaction
contract.methods.METHOD_NAME(METHOD_PARAMETERS).send({ from: '0x...' });

// to call a view or pure method that does not send a transaction
contract.methods.METHOD_NAME(METHOD_PARAMETERS).call();
```

:::tip
Refer to the [Gas and Priority Fees guide](/guides/transactions/gas-and-fees#smart-contract-fees) to learn how to control and optimize fees when using Web3.js to interact with smart contracts.
:::

-   **events**: An object mapping your contract's events, allowing you to subscribe to them.

    And here is an example on how to use it:

```ts
//If you want to filter events, create `options`:
const options: ContractEventOptions = {
    // the following means all events where `myNumber` is `12` or `13`
    filter: myNumber: [12,13];
    // you can specify the block from where you like to start
    // listing to events
    fromBlock: 'earliest';

    // You can also manually set the topics for the event filter.
    // If given the filter property and event signature,
    // (topic[0]) will not be set automatically.
    // Each topic can also be a nested array of topics that behaves
    // as `or` operation between the given nested topics.
    topics?: ['0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab'];
}

// if you would like to not filter, don't pass `options`.
const event = await myContract.events.MyEvent(options);

event.on('data', (data) => {
    console.log(data)
});
event.on('error', (err: Error) => {
    console.log(err);
});
```

To subscribe all events use the special `allEvents`:

```ts
const event = await myContract.events.allEvents(options);
```

#### Methods include

-   **deploy**: For deploying a new contract instance.

```ts
// this will give you the accounts from the connected provider
// For example, if you are using MetaMask, it will be the account available.
const providersAccounts = await web3.eth.getAccounts();
const defaultAccount = providersAccounts[0];
console.log('deployer account:', defaultAccount);

// NOTE: If you want to manually unlock an account with a private key, you can use wallet.add(privateKey).
// however, exercise caution and ensure the security of your private keys.

// this is how to obtain the deployer function,
// so you can estimate its needed gas and deploy it.
const contractDeployer = myContract.deploy({
	data: bytecode, // prefix the bytecode with '0x' if it is note already
	arguments: [1], // provide the parameters in an array; in this case, it's the number `1`.
});

// optionally, estimate the gas that will be used for development and log it
const gas = await contractDeployer.estimateGas({
	from: defaultAccount,
});
console.log('estimated gas:', gas);

// Deploy the contract to the Ganache network
const tx = await contractDeployer.send({
	from: defaultAccount,
	gas,
	gasPrice: 10000000000,
});
console.log('Contract deployed at address: ' + tx.options.address);
```

:::tip
If you do not know how to get the contract bytecode, we recommend you to check the Step 4 at the [Deploying and Interacting with Smart Contracts](./smart_contracts_guide#step-4-compile-the-solidity-code-with-the-solidity-compiler-and-get-its-abi-and-bytecode) tutorial.
:::

-   **getPastEvents**: Gets past events for this contract. It differs from `events` properties that it returns the past events as an array, rather than allowing to subscribe to them like when using `events` properties. More on the [API documentation](/api/web3-eth-contract/class/Contract#getPastEvents)

-   **setProvider**: This allows you to set a specific provider for a contract instance. As highlighted early in this guide, this is especially handy if you are importing the `Contract` object from `web3-eth-contract` and then you will need to set the provider while there is no `web3` context to read the provider from.

```ts
// Importing from web3-eth-contract package
import { Contract } from 'web3-eth-contract';
const contract = new Contract(...);

// to set the provider for the contract instance
contract.setProvider('yourProvider');
```

## ABI and Bytecode

### ABI

The ABI is the Application Binary Interface ( ABI ) of a smart contract. Which defines the methods and variables that are available in a smart contract and which we can use to interact with that smart contract.

For example, for the following solidity code:

```ts
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract MyContract {
    uint256 public myNumber;

    constructor(uint256 _myNumber) {
        myNumber = _myNumber;
    }

    function setMyNumber(uint256 _myNumber) public {
        myNumber = _myNumber;
    }
}
```

Its ABI would be:

```ts
const abi = [
	{
		inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'myNumber',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_myNumber', type: 'uint256' }],
		name: 'setMyNumber',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as const;
```

### Bytecode

Bytecode results from the compilation of a Solidity code. Bytecode is generally compact numeric codes, constants, and other pieces of information. Where each instruction step is an operation which is referred to as “opcodes,” which are typically one-byte (eight-bits) long. This is why they’re called “bytecode”—one-byte opcodes.
And this bytecode is usually represented as a long hex string similar to the following;

```ts
const bytecode = '0x60806040523480156100115760006000fd5b50604051610224380380610224...';
```

:::info
And as mentioned in the tips inside previous sections:
If you do not know how to get the contract ABI and bytecode, we recommend you to check the Step 4 at the [Deploying and Interacting with Smart Contracts](./smart_contracts_guide#step-4-compile-the-solidity-code-with-the-solidity-compiler-and-get-its-abi-and-bytecode) tutorial.
:::

### Do I always need the contract ByteCode?

The short answer is yes, only if you need to deploy the smart contract yourself. And below is more elaboration on this.

Basically, with every Contract instance, there are 2 cases. First case is when you want to deploy a smart contract. And in this case, you will need to provide the bytecode of this smart contract.

```ts
import {Contract} from 'web3-eth-contract';

const myContract = new Contract(abi, undefined, options);
// if there is no options to be passed you can write:
const myContract = new Contract(abi);

await myContract.deploy({
    data: '0x' + bytecode,

    // the smart contract constructor arguments in an array
    arguments: [arg1, arg2],
}).send({
    from: someAccount,
    ...
});

// the contract address will be filled automatically here after deployment:
myContract.options.address
```

And the other case, is when you want to interact with an already deployed smart contract. In this scenario, you will need to provide the address of the already deployed smart contract.

```ts
import { Contract } from 'web3-eth-contract';

const myContract = new Contract(abi, smartContractAddress, options);
// if there is no options to be passed you can write:
const myContract = new Contract(abi, smartContractAddress);
```

### Do I always need the contract ABI?

The answer is yes, you need the ABI, especially if you want to enjoy TypeScript IntelliSense, and we strongly recommend doing so. The ABI informs your development environment about the contract's structure, allowing for improved code suggestions and type checking.

If you choose not to provide the ABI, you won't be able to interact with the contract's methods correctly, and you'll miss out on IntelliSense support.

```ts
const myContract = new Contract(abi, address || undefined, options);
// remember that address can be empty if the contract is not deployed yet.
// or you can set the address to directly interact with the contract.
```
