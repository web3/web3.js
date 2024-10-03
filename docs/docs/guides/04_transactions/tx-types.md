---
sidebar_position: 2
sidebar_label: 'Transaction Types'
---

# Transactions

In this tutorial, we will explore how to send different types of [transactions](https://ethereum.org/en/developers/docs/transactions/) using web3.js, focusing on Ethereum's evolving transaction formats. We'll start with [legacy transactions (Transaction Type 0)](#transaction-type-0-legacy). Next, we'll delve into Transaction [Type 1 (EIP-2930)](#transaction-type-1-eip-2930), which introduces access lists to optimize gas usage. Finally, we'll cover [Transaction Type 2 (EIP-1559)](#transaction-type-2-eip-1559), the current default, which allows users to specify maximum fees and priority tips for more efficient and cost-effective transactions. Each section will include practical code examples to demonstrate sending raw transactions and interacting with ERC20 tokens on the Sepolia test network

:::note
Web3.js uses transaction type 2 by default
:::

## Transaction Type 0 (Legacy)

### Raw Transaction

A Legacy Transaction refers to a transaction that was created using an older version of Ethereum's transaction format, also known as "transaction type 0". This transaction format was used before the EIP-1559 upgrade, which was implemented in August 2021.

```ts
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc2.sepolia.org'); // RPC node url

async function txLegacy() {
	const wallet = web3.eth.wallet.add('YOUR_PRIVATE_KEY'); // make sure you have funds

	const sender = wallet[0].address;
	const recipient = '0x807BFe4940016B5a7FdA19482042917B02e68359';
	const value = 1; // wei
	const nonce = await web3.eth.getTransactionCount(sender);
	const gas = 21000;
	const gasPrice = await web3.eth.getGasPrice();

	const tx = {
		from: sender,
		to: recipient,
		value,
		nonce,
		gas,
		gasPrice,
		// highlight-next-line
		type: 0,
	};

	const txReceipt = await web3.eth.sendTransaction(tx);
	console.log('Tx hash', txReceipt.transactionHash);
}

txLegacy();
```

### ERC20 Interaction

```ts
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc2.sepolia.org');

//WETH token in Sepolia https://sepolia.etherscan.io/address/0xfff9976782d46cc05630d1f6ebab18b2324d6b14#code
const ADDRESS_WETH_SEPOLIA = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const ABI = [
	{
		constant: false,
		inputs: [
			{
				name: 'dst',
				type: 'address',
			},
			{
				name: 'wad',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

async function transfer() {
	//initialize wallet
	const wallet = web3.eth.accounts.wallet.add('YOUR_PRIVATE_KEY'); //make sure you have WETH tokens in the Sepolia network
	//you can swap Sepolia tokens for WETH here https://app.uniswap.org/swap?chain=sepolia

	//initialize WETH contract in sepolia
	const myERC20 = new web3.eth.Contract(ABI, ADDRESS_WETH_SEPOLIA);

	const TO = '0xEA9eEca67682Cd9c6Ce3DdD1681049D7A897289F'; //address to send the tokens to
	const VALUE = 1; //wei value, dont forget to multiply by decimals

	//send transfer and specify the type
	const txReceipt = await myERC20.methods.transfer(TO, VALUE).send({
		from: wallet[0].address,
		// highlight-next-line
		type: 0,
	});

	console.log(txReceipt.transactionHash);
	//=> 0x5f2087c22166f3a1909c40ce537dd564dc3d4c70c5be02f35c6406a628123b16
}

transfer();
```

## Transaction Type 1 (EIP-2930)

This EIP was introduced in April 2021, it introduces a feature called 'Access List.' This improvement allows saving gas on cross-contract calls by declaring in advance which contract and storage slots will be accessed.

### Raw Transaction

```ts
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc2.sepolia.org');

async function txEIP2930() {
	const wallet = web3.eth.wallet.add('YOUR_PRIVATE_KEY');

	const sender = wallet[0].address;
	const contractAddress1 = '0x...';
	const gas = 500000; //could be higher
	const gasPrice = await web3.eth.getGasPrice();
	const data = '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0';

	// highlight-start
	//create access list using web3.eth
	const accessListData = await web3.eth.createAccessList({
		from: sender,
		to: contractAddress1,
		data,
	});
	// highlight-end

	console.log(accessListData);
	/* 
  => 
  {
    // highlight-start
  "accessList": [
      {
        "address": "0x15859bdf5aff2080a9968f6a410361e9598df62f",
        "storageKeys": [
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ]
      }
    ],
    // highlight-end
    "gasUsed": "0x7671"
  }
  */

	const tx = {
		from: sender,
		to: contractAddress1, //the contract we are calling
		data,
		gas,
		gasPrice,
		// highlight-next-line
		type: 1,
		// highlight-next-line
		accessList: accessListData.accessList, //access the object `accessList`
	};

	const txReceipt = await web3.eth.sendTransaction(tx);

	console.log('Tx hash', txReceipt.transactionHash);
}

txEIP2930();
```

## Transaction Type 2 (EIP-1559)

When a user creates an EIP-1559 transaction, they specify the maximum fee they are willing to pay `maxFeePerGas` as well as a tip `maxPriorityFeePerGas` to incentivize the miner. The actual fee paid by the user is then determined by the network based on the current demand for block space and the priority of the transaction.

### Raw Transaction

```ts
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc2.sepolia.org');

async function txEIP1559() {
	const wallet = web3.eth.wallet.add('YOUR_PRIVATE_KEY'); //make sure you have funds

	const sender = wallet[0].address;
	const recipient = '0x807BFe4940016B5a7FdA19482042917B02e68359';
	const value = 1; //wei
	const nonce = await web3.eth.getTransactionCount(sender);
	const gasLimit = 21000;
	const maxFeePerGas = Number((await web3.eth.calculateFeeData()).maxFeePerGas);
	const maxPriorityFeePerGas = Number((await web3.eth.calculateFeeData()).maxPriorityFeePerGas);

	const tx = {
		from: sender,
		to: recipient,
		value,
		nonce,
		gasLimit,
		maxFeePerGas,
		maxPriorityFeePerGas,
		// highlight-next-line
		type: 2,
	};

	const txReceipt = await web3.eth.sendTransaction(tx);
	console.log('Tx hash', txReceipt.transactionHash);
}

txEIP1559();
```

### ERC20 Interaction

```ts
import { Web3 } from 'web3';

const web3 = new Web3('https://rpc2.sepolia.org');

//WETH token in Sepolia https://sepolia.etherscan.io/address/0xfff9976782d46cc05630d1f6ebab18b2324d6b14#code
const ADDRESS_WETH_SEPOLIA = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const ABI = [
	{
		constant: false,
		inputs: [
			{
				name: 'dst',
				type: 'address',
			},
			{
				name: 'wad',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: '',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

async function transfer() {
	//initialize wallet
	const wallet = web3.eth.accounts.wallet.add('YOUR_PRIVATE_KEY'); //make sure you have WETH tokens in the Sepolia network
	//you can swap Sepolia tokens for WETH here https://app.uniswap.org/swap?chain=sepolia

	//initialize WETH contract in sepolia
	const myERC20 = new web3.eth.Contract(ABI, ADDRESS_WETH_SEPOLIA);

	const TO = '0xEA9eEca67682Cd9c6Ce3DdD1681049D7A897289F'; //address to send the tokens to
	const VALUE = 1; //wei value, dont forget to multiply by decimals

	//send transfer and specify the type
	const txReceipt = await myERC20.methods.transfer(TO, VALUE).send({
		from: wallet[0].address,
		// highlight-next-line
		type: 2,
	});

	console.log(txReceipt.transactionHash);
	//=> 0x174bc88023be4af431fad1693a59f7a41135238510cdcd00f15f6409b5471d77
}

transfer();
```
