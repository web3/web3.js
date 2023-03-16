---
sidebar_position: 1
sidebar_label: 'Raw Transaction'
---

# Using Raw Transaction

## Eth Transaction

```ts
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: convert private key to account
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// Third step: sign and send transaction
try {
	const signedTx = await account.signTransaction({
		from: account.address,
		to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
		amount: '0x1',
		gas: '100000',
		// other transaction's params
	});
	const res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	console.log('res', res);
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of functions:

-   [eth.accounts.privateKeyToAccount](https://docs.web3js.org/api/web3-eth-accounts/function/privateKeyToAccount)
-   [eth.sendTransaction](https://docs.web3js.org/api/web3-eth/class/Web3Eth#sendTransaction)
-   [account.signTransaction](https://docs.web3js.org/api/web3-eth-accounts/function/signTransaction)
-   [eth.sendSignedTransaction](https://docs.web3js.org/api/web3-eth/class/Web3Eth#sendSignedTransaction)

## Contract Transaction

```ts
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: convert private key to account
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
try {
	// deploy
	const contract = new web3.eth.Contract(ERC20Token.abi);

	const contractTx = contract.deploy({
		data: ERC20TokenBytecode,
		arguments: ['1000000000000000000'],
	});

	const signedTxData = await account.signTransaction({
		data: contractTx.encodeABI(),
		from: account.address,
		gas: '10000000',
		// other transaction's params
	});

	const deployResult = await web3.eth.sendSignedTransaction(signedTxData.rawTransaction);

	// call method
	const contractMethodTx = contractDeployed.methods.transfer(
		'0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
		'0x1',
	);
	const signedMethodData = await account.signTransaction({
		...contractMethodTx,
		from: account.address,
		// other transaction's params
	});

	await web3.eth.sendSignedTransaction({
		data: signedMethodData.encodeABI(),
	});
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of functions:

-   [eth.accounts.privateKeyToAccount](https://docs.web3js.org/api/web3-eth-accounts/function/privateKeyToAccount)
-   [eth.Contract](https://docs.web3js.org/api/web3-eth-contract/class/Contract)
-   [account.signTransaction](https://docs.web3js.org/api/web3-eth-accounts/function/signTransaction)
-   [contract.deploy](https://docs.web3js.org/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](https://docs.web3js.org/api/web3-eth-contract/class/Contract#methods)
-   [eth.sendSignedTransaction](https://docs.web3js.org/api/web3-eth/class/Web3Eth#sendSignedTransaction)
