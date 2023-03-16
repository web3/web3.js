---
sidebar_position: 2
sidebar_label: 'Unlocked account'
---

# Using Unlocked Account

if node have unlocked account you can send transaction without signing

## Eth Transaction

```ts
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add account to ethereum node and unlock it
const account = {
	privateKey: '0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend use private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend use private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3Personal.unlockAccount(account.address, 'anyPassword', 100000000);

// Third step: sign and send transaction
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

-   [importRawKey](https://docs.web3js.org/api/web3-eth-personal/class/Personal#importRawKey)
-   [unlockAccount](https://docs.web3js.org/api/web3-eth-personal/class/Personal#unlockAccount)
-   [eth.sendTransaction](https://docs.web3js.org/api/web3-eth/class/Web3Eth#sendTransaction)

## Contract Transaction

```ts
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add account to ethereum node and unlock it
const account = {
	privateKey: '0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend use private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend use private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3Personal.unlockAccount(account.address, 'anyPassword', 100000000);

// Third step: sign and send transaction
try {
	// deploy
	const contract = new web3.eth.Contract(ContractAbi);
	const contractDeployed = await contract
		.deploy({
			data: ContractBytecode,
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

-   [importRawKey](https://docs.web3js.org/api/web3-eth-personal/class/Personal#importRawKey)
-   [unlockAccount](https://docs.web3js.org/api/web3-eth-personal/class/Personal#unlockAccount)
-   [eth.Contract](https://docs.web3js.org/api/web3-eth-contract/class/Contract)
-   [contract.deploy](https://docs.web3js.org/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](https://docs.web3js.org/api/web3-eth-contract/class/Contract#methods)
