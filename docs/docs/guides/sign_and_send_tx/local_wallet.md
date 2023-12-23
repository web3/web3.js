---
sidebar_position: 0
sidebar_label: 'Local wallet'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Local Wallet

The simplest way to sign and send transactions is using a local wallet:

## Ethereum Transaction

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
// First step: initialize `web3` instance
const { Web3 } = require('web3');
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const account = web3.eth.accounts.wallet.add("privateKey").get(0);

// Make sure the account has enough eth on balance to send the transaction


async function sendTransaction() {
	// Third step: sign and send the transaction
	// Magic happens behind sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed.
	try {
		const receipt = await web3.eth.sendTransaction({
			from: account?.address,
			to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
			value: '0x1',
			gas: '300000',
			// other transaction's params
		});
	} catch (error) {
		// catch transaction error
		console.error(error);
	}
}

(async () => {
	await sendTransaction();
})();
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>

```typescript
// First step: initialize `web3` instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = 'privateKey';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

async function sendTransaction() {
	// Third step: sign and send the transaction
	// Magic happens behind sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed.
	try {
		const receipt = await web3.eth.sendTransaction({
			from: account?.address,
			to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
			value: '0x1',
			gas: '300000',
			// other transaction's params
		});
	} catch (error) {
		// catch transaction error
		console.error(error);
	}
}

(async () => {
	await sendTransaction();
})();
```

  </TabItem>
</Tabs>


List of references:

-   [eth.accounts.wallet.add](/api/web3-eth-accounts/class/Wallet#add)
-   [eth.sendTransaction](/api/web3-eth/class/Web3Eth#sendTransaction)

## Contract Transaction

<Tabs groupId="prog-lang" queryString>

  <TabItem value="javascript" label="JavaScript"
  	attributes={{className: "javascript-tab"}}>

```javascript
// First step: initialize `web3` instance
const { Web3 } = require('web3');
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = 'privateKey';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

// fill ContractAbi and ContractBytecode with your contract's abi and bytecode

async function deploy() {
    // Third step: sign and send the transaction
    // In any function where you can pass from the address set address of the account that exists in a wallet, it will be automatically signed.

    try {
        // deploy
        const contract = new web3.eth.Contract(ContractAbi);
        const contractDeployed = await contract
            .deploy({
                input: ContractBytecode,
                arguments: ['Constructor param1', 'Constructor param2'],
            })
            .send({
                from: account?.address,
                gas: '1000000',
                // other transaction's params
            });

        // call method
        await contractDeployed.methods
            .transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
            .send({
                from: account?.address,
                gas: '1000000',
                // other transaction's params
            });
    } catch (error) {
        // catch transaction error
        console.error(error);
    }
}

(async () => {
    await deploy();
})();
```

  </TabItem>
  
  <TabItem value="typescript" label="TypeScript" default 
  	attributes={{className: "typescript-tab"}}>


```typescript

:::warning
Using `web3.eth.personal`  web3.eth.personal is not considered secure and is strongly discouraged. The personal RPC endpoints have been deprecated due to significant security issues.
:::

// First step: initialize `web3` instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = 'privateKey';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

// fill ContractAbi and ContractBytecode with your contract's abi and bytecode

async function deploy() {
	// Third step: sign and send the transaction
	// In any function where you can pass from the address set address of the account that exists in a wallet, it will be automatically signed.

	try {
		// deploy
		const contract = new web3.eth.Contract(ContractAbi);
		const contractDeployed = await contract
			.deploy({
				input: ContractBytecode,
				arguments: ['Constructor param1', 'Constructor param2'],
			})
			.send({
				from: account?.address,
				gas: '1000000',
				// other transaction's params
			});

		// call method
		await contractDeployed.methods
			.transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1')
			.send({
				from: account?.address,
				gas: '1000000',
				// other transaction's params
			});
	} catch (error) {
		// catch transaction error
		console.error(error);
	}
}

(async () => {
	await deploy();
})();
```

  </TabItem>
</Tabs>


List of references:

-   [eth.accounts.wallet.add](/api/web3-eth-accounts/class/Wallet#add)
-   [eth.Contract](/api/web3-eth-contract/class/Contract)
-   [contract.deploy](/api/web3-eth-contract/class/Contract#deploy)
-   [contract.methods](/api/web3-eth-contract/class/Contract#methods)
