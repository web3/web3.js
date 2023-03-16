---
sidebar_position: 0
sidebar_label: 'Local wallet'
---

# Using Local Wallet

Simplest way to sign and send transaction is use local wallet:

## Eth Transaction

```ts
// First step: initialize `web3` instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add account to wallet
const privateKeyString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.eth.accounts.wallet.add(privateKeyString);

// Make sure account have enough eth on balance to send transaction

// Third step: sign and send transaction
// Magic happens behind sendTransaction. If transaction sent from account which exists in a wallet it will be automatically signed.
try {
	const receipt = await web3.eth.sendTransaction({
		from: account.address,
		to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
		value: '0x1',
		gas: '300000',
		// other transaction's params
	});
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of functions:

-   [eth.accounts.wallet.add](https://docs.web3js.org/api/web3-eth-accounts/class/Wallet#add)
-   [eth.sendTransaction](https://docs.web3js.org/api/web3-eth/class/Web3Eth#sendTransaction)

## Contract Transaction

```ts
// First step: initialize `web3` instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add account to wallet
const privateKeyString = '0x1f953dc9b6437fb94fcafa5dabe3faa0c34315b954dd66f41bf53273339c6d26';
const account = web3.eth.accounts.wallet.add(privateKeyString);

// Make sure account have enough eth on balance to send transaction

// Third step: sign and send transaction
// In any function where you can pass from address set address of account which exists in a wallet, and it will be automatically signed.

try {
	// deploy
	const contract = new web3.eth.Contract(ContractAbi);
	const contractDeployed = await contract
		.deploy({
			input: ContractBytecode,
			arguments: ['Constructor param1', 'Constructor param2'],
		})
		.send({
			from: account.address,
			gas: '1000000',
			// other transaction's params
		});

	// call method
	await contractDeployed.methods
		.transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
		.send({
			from: account.address,
			gas: '1000000',
			// other transaction's params
		});
} catch (error) {
	// catch transaction error
	console.error(error);
}
```

List of functions:

-   [eth.accounts.wallet.add](https://docs.web3js.org/api/web3-eth-accounts/class/Wallet#add)
-   [eth.Contract](https://docs.web3js.org/api/web3-eth-contract/class/Contract)
-   [contract.deploy](https://docs.web3js.org/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](https://docs.web3js.org/api/web3-eth-contract/class/Contract#methods)
