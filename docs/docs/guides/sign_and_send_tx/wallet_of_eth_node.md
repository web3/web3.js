---
sidebar_position: 1
sidebar_label: 'Node Wallet'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Node Wallet

If Ethereum node has unlocked account in its wallet you can send transaction without need of signing locally in web3.js

## Transaction

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
// First step: initialize web3 instance
const { Web3 } = require('web3');
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
	privateKey: 'privateKey',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3Personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
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

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
	privateKey: 'privateKey',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3Personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
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

  </TabItem>
</Tabs>

List of references:

-   [eth.sendTransaction](/api/web3-eth/class/Web3Eth#sendTransaction)
-   [eth.personal.importRawKey](/api/web3-eth-personal/class/Personal#importRawKey)
-   [eth.personal.unlockAccount](/api/web3-eth-personal/class/Personal#unlockAccount)

## Contract Transaction


<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
// First step: initialize web3 instance
const { Web3 } = require('web3');
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
	privateKey: 'privateKey',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3.eth.personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
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

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
// First step: initialize web3 instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to the Ethereum node and unlock it
const account = {
	privateKey: 'privateKey',
	address: '0xe4beef667408b99053dc147ed19592ada0d77f59',
};

// if you use ganache backend, use a private key with 0x
await web3.eth.personal.importRawKey(account.privateKey);
// if you use geth backend, use a private key without 0x
await web3.eth.personal.importRawKey(account.privateKey.slice(2));

// unlock account
await web3.eth.personal.unlockAccount(account.address, 'anyPassword', 100000000);
// Make sure the account has enough eth on balance to send the transaction

// Third step: sign and send the transaction
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

  </TabItem>
</Tabs>


List of references:

-   [eth.Contract](/api/web3-eth-contract/class/Contract)
-   [eth.personal.importRawKey](/api/web3-eth-personal/class/Personal#importRawKey)
-   [eth.personal.unlockAccount](/api/web3-eth-personal/class/Personal#unlockAccount)
-   [contract.deploy](/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](/api/web3-eth-contract/class/Contract#methods)
