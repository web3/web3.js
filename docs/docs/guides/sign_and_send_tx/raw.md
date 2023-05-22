---
sidebar_position: 1
sidebar_label: 'Raw Transaction'
---

# Using Raw Transaction

## Eth Transaction

```ts
// First step: initialize web3 instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: convert private key to account
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
try {
	const signedTx = await account.signTransaction({
		from: account.address,
		to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
		amount: '0x1',
		gas: '100000',
		// other transaction's params
	});
	await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of references:

-   [account.signTransaction](/api/web3-eth-accounts/function/signTransaction)
-   [eth.accounts.privateKeyToAccount](/api/web3-eth-accounts/function/privateKeyToAccount)
-   [eth.sendSignedTransaction](/api/web3-eth/class/Web3Eth#sendSignedTransaction)
-   [eth.sendTransaction](/api/web3-eth/class/Web3Eth#sendTransaction)

## Contract Transaction

```ts
// First step: initialize web3 instance
import Web3 from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: convert private key to account
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
try {
	// deploy
	const contract = new web3.eth.Contract(ERC20Token.abi);
	const contractTx = contract.deploy({
		input: ERC20TokenBytecode,
		arguments: ['1000000000000000000'],
	});
	const signedTxData = await account.signTransaction({
		input: contractTx.encodeABI(),
		from: account.address,
		gas: '10000000',
	});
	const deployResult = await web3.eth.sendSignedTransaction(signedTxData.rawTransaction);

	// call method
	const toAddress = '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401';
	const contractDeployed = new web3.eth.Contract(ERC20Token.abi, deployResult.logs[0].address);

	const balance = await contractDeployed.methods.balanceOf(account.address).call();
	const contractMethodTx = contractDeployed.methods.transfer(toAddress, '0x10');

	const signedMethodData = await account.signTransaction({
		input: contractMethodTx.encodeABI(),
		to: contractDeployed.options.address,
		from: account.address,
		gas: '4700000',
		// other transaction's params
	});
	await web3.eth.sendSignedTransaction(signedMethodData.rawTransaction);
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of references:

-   [account.signTransaction](/api/web3-eth-accounts/function/signTransaction)
-   [contract.deploy](/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](/api/web3-eth-contract/class/Contract#methods)
-   [eth.accounts.privateKeyToAccount](/api/web3-eth-accounts/function/privateKeyToAccount)
-   [eth.Contract](/api/web3-eth-contract/class/Contract)
-   [eth.sendSignedTransaction](/api/web3-eth/class/Web3Eth#sendSignedTransaction)
