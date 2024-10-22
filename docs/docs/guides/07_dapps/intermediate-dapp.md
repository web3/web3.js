---
sidebar_position: 3
sidebar_label: 'Tutorial: Intermediate dApp Development'
---

# Intermediate dApp Development

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/stackblitz-starters-tt56cg?embed=1&file=src%2FApp.tsx"></iframe>

This tutorial demonstrates using Web3.js to build a dApp that uses the [EIP-6963 standard](https://eips.ethereum.org/EIPS/eip-6963). EIP-6963 was designed to make it easy for dApp developers to support users with more than one wallet browser extension. Rather than relying on the global `window.ethereum` object, EIP-6963 specifies a mechanism that allows multiple wallet providers to announce their availability to a dApp. The dApp in this tutorial will allow the user to transfer ether from one of their wallet accounts to another account on the network.

:::info
This intermediate tutorial builds on concepts that were introduced in other tutorials, like [Sending Transactions](/guides/transactions/transactions) and [Connecting to Metamask with React](/guides/dapps/metamask-react). If you are new to working with Web3.js, considering reviewing or completing those tutorials before starting this one.
:::

## Overview

Here is a high-level overview of the steps in this tutorial:

1. Review prerequisites
2. Initialize a new React project and add dependencies
3. Configure and start a Hardhat node
4. Update the React app and create a provider store
5. Use a provider with Web3.js
6. Create a form to transfer ether

:::tip
If you encounter any issues while following this guide or have any questions, don't hesitate to seek assistance. Our friendly community is ready to help you out! Join our [Discord](https://discord.gg/F4NUfaCC) server and head to the **#web3js-general** channel to connect with other developers and get the support you need.
:::

## Step 1: Prerequisites

This tutorial assumes basic familiarity with the command line as well as familiarity with React and [Node.js](https://nodejs.org/). Before starting this tutorial, ensure that Node.js and its package manager, npm, are installed.

```console
$: node -v
# your version may be different, but it's best to use the current stable version
v20.14.0
$: npm -v
10.8.2
```

Make sure that at least one EIP-6963 compliant wallet browser extension is installed and set up, such as:

-   [Enkrypt](https://www.enkrypt.com/download.html)
-   [Exodus](https://www.exodus.com/download/)
-   [MetaMask](https://metamask.io/download/)
-   [Trust Wallet](https://trustwallet.com/download)

This tutorial will use MetaMask as an example.

## Step 2: Initialize a New React Project and Add Dependencies

Initialize a new React project and navigate into the new project directory:

```console
npx create-react-app web3-intermediate-dapp --template typescript
cd web3-intermediate-dapp
```

Add Web3.js to the project with the following command:

```console
npm i web3
```

This tutorial uses a local [Hardhat](https://hardhat.org/) network, which will be configured to fund the wallet's account. To support this, install Hardhat as a development dependency:

```console
npm i -D hardhat
```

## Step 3: Configure and Start the Hardhat Node

Because Hardhat will be configured with the wallet's secret recovery phrase, it's important that the Hardhat configuration file is not checked into version control systems like GitHub. Open the `.gitignore` file that was created by the `create-react-app` command and add a line for `hardhat.config.js`:

```bash
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# add this line
hardhat.config.js

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

Create a file called `hardhat.config.js` and add the following Hardhat configuration:

```typescript
module.exports = {
	networks: {
		hardhat: {
			accounts: {
				mnemonic: '<SECRET RECOVERY PHRASE>',
			},
			chainId: 1337,
		},
	},
};
```

Replace `<SECRET RECOVERY PHRASE>` with the wallet's [secret recovery phrase](https://support.metamask.io/privacy-and-security/how-to-reveal-your-secret-recovery-phrase/).

Start the Hardhat development network by executing the following command:

```console
npx hardhat node
```

Executing this command will produce the following output, which provides the URL that can be used to connect to the Hardhat development network:

```console
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: <ACCOUNT 0 ADDRESS> (10000 ETH)

...

Account #19: <ACCOUNT 19 ADDRESS> (10000 ETH)
```

:::note
If the Hardhat development network was properly configured with the wallet's secret recovery phrase, `<ACCOUNT ADDRESS 0>` should match the address of the wallet's first account.
:::

The Hardhat development network needs to remain running in the terminal that was used to start it. Open a new terminal instance in the project directory to execute the remaining commands in this tutorial.

## Step 4: Update the React App and Create a Provider Store

Delete the following files:

-   `src/App.css`
-   `src/App.test.tsx`
-   `src/logo.svg`

Create a `src/useProviders.ts` file and add the following code:

```ts
import { useSyncExternalStore } from 'react';
import {
	type EIP6963ProviderDetail,
	type EIP6963ProviderResponse,
	type EIP6963ProvidersMapUpdateEvent,
	Web3,
	web3ProvidersMapUpdated,
} from 'web3';

// initial empty list of providers
let providerList: EIP6963ProviderDetail[] = [];

/**
 * External store for subscribing to EIP-6963 providers
 */
const providerStore = {
	// get current list of providers
	getSnapshot: () => providerList,
	// subscribe to EIP-6963 provider events
	subscribe: (callback: () => void) => {
		// update the list of providers
		function setProviders(response: EIP6963ProviderResponse) {
			providerList = [];
			response.forEach((provider: EIP6963ProviderDetail) => {
				providerList.push(provider);
			});

			// notify subscribers that the list of providers has been updated
			callback();
		}

		// Web3.js helper function to request EIP-6963 providers
		Web3.requestEIP6963Providers().then(setProviders);

		// handler for newly discovered providers
		function updateProviders(providerEvent: EIP6963ProvidersMapUpdateEvent) {
			setProviders(providerEvent.detail);
		}

		// register handler for newly discovered providers with Web3.js helper function
		Web3.onNewProviderDiscovered(updateProviders);

		// return a function that unsubscribes from the created event listener
		return () => window.removeEventListener(web3ProvidersMapUpdated as any, updateProviders);
	},
};

// export the provider store as a React hook
export const useProviders = () =>
	useSyncExternalStore(providerStore.subscribe, providerStore.getSnapshot);
```

This file exports a single member - a React [`useSyncExternalStore` hook](https://react.dev/reference/react/useSyncExternalStore) with a subscription to the EIP-6963 providers. The provider store uses the Web3.js types and helper functions for working with the EIP-6963 standard. Any React component can use this hook to access a dynamic list of the available EIP-6963 providers.

Replace the contents of the `src/App.tsx` file with the following:

```tsx
import type { EIP6963ProviderDetail } from 'web3';

import { useProviders } from './useProviders';

function App() {
	// get the dynamic list of providers
	const providers = useProviders();

	return (
		<>
			{providers.map((provider: EIP6963ProviderDetail) => {
				// list available providers
				return (
					<div key={provider.info.uuid}>
						{provider.info.name} [{provider.info.rdns}]
					</div>
				);
			})}
		</>
	);
}

export default App;
```

The `App` component defined in `src/App.tsx` uses the provider store to list the available EIP-6963 providers. For each provider, information that is [specified by EIP-6963](https://eips.ethereum.org/EIPS/eip-6963#provider-info) will be displayed.

Use the `npm start` command to launch the dApp in a new browser tab. Keep this browser tab open as it will automatically update when changes are made. If everything is working properly, all available EIP-6963 providers should be listed.

## Step 5: Use a Provider with Web3.js

Replace the contents of the `src/App.tsx` file with the following:

```tsx
import { useEffect, useState } from 'react';
import { type EIP6963ProviderDetail, Web3 } from 'web3';

import { useProviders } from './useProviders';

function App() {
	// get the dynamic list of providers
	const providers = useProviders();

	// application state
	const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
	const [accounts, setAccounts] = useState<string[]>([]);
	const [balances, setBalances] = useState<Map<string, number>>(new Map());

	// click-handler for provider buttons
	function setProvider(provider: EIP6963ProviderDetail) {
		const web3: Web3 = new Web3(provider.provider);
		setWeb3(web3);
		web3.eth.requestAccounts().then(setAccounts);
		provider.provider.on('accountsChanged', setAccounts);
		provider.provider.on('chainChanged', () => window.location.reload());
	}

	// update account balances
	useEffect(() => {
		async function updateBalances(web3: Web3) {
			const balances = new Map<string, number>();
			for (const account of accounts) {
				const balance = await web3.eth.getBalance(account);
				balances.set(account, parseFloat(web3.utils.fromWei(balance, 'ether')));
			}

			setBalances(balances);
		}

		if (web3 === undefined) {
			return;
		}

		// set balances for list of accounts
		updateBalances(web3);

		// update balances when a new block is created
		const subscription = web3.eth.subscribe('newBlockHeaders').then(subscription => {
			subscription.on('data', () => updateBalances(web3));
			return subscription;
		});

		return () => {
			subscription.then(subscription => subscription.unsubscribe());
		};
	}, [accounts, web3]);

	return (
		<>
			{web3 === undefined
				? // no provider set, display list of available providers
				  providers.map((provider: EIP6963ProviderDetail) => {
						// for each provider, display a button to connect to that provider
						return (
							<div key={provider.info.uuid}>
								<button
									onClick={() => setProvider(provider)}
									style={{ display: 'inline-flex', alignItems: 'center' }}
								>
									<img
										src={provider.info.icon}
										alt={provider.info.name}
										width="35"
									/>
									<span>{provider.info.name}</span>
								</button>
							</div>
						);
				  })
				: accounts.map((address: string, ndx: number) => {
						// provider set, list accounts and balances
						return (
							<div key={address}>
								<div>Account: {address}</div>
								<div>Balance: {`${balances.get(address)}`}</div>
								{ndx !== accounts.length - 1 ? <br /> : null}
							</div>
						);
				  })}
		</>
	);
}

export default App;
```

The `App` component now displays a button for each provider. The click-handler for these buttons creates a new Web3.js instance that uses the specified provider and [requests the accounts](/api/web3-eth/class/Web3Eth#requestAccounts) from that provider. An [`accountsChanged` handler](https://docs.metamask.io/wallet/reference/provider-api/#accountschanged) is registered to keep the list of accounts up-to-date. The click-handler also registers a [`chainChanged` handler](https://docs.metamask.io/wallet/reference/provider-api/#chainchanged) that reloads the page when the chain that the wallet is using changes. When the list of accounts is updated, a map of account balances is created. This map is kept up-to-date by creating a [`NewHeadsSubscription` handler](/api/web3-eth/class/NewHeadsSubscription) that refreshes the account balances every time a new block is created.

In order to use the Hardhat development network with a wallet browser extension, the wallet must be configured with the details of the Hardhat development network. This process will be slightly different for each wallet (e.g. [add a network to MetaMask](https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/#adding-a-network-manually)), but will always require specifying the URL that was displayed when the Hardhat network was started as well as the chain ID 1337, which was specified in the `hardhat.config.js` file. Before proceeding, ensure that the wallet has been configured with the details of the Hardhat development network.

Once the wallet has been configured with the details of the Hardhat development network, return to the browser tab that was opened by `npm start`. Ensure that the wallet is connected to the Hardhat network and click the button for the wallet. If everything is working properly, the wallet's accounts should be listed and each should have a balance of 10,000 ETH.

## Step 6: Create a Form to Transfer Ether

Create a `src/TransferForm.tsx` file and add the following code:

```tsx
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { type Address, Web3 } from 'web3';

function TransferForm({ address, web3 }: { address: Address; web3: Web3 }) {
	// form state
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [transferTo, setTransferTo] = useState<string>('');
	const [transferAmount, setTransferAmount] = useState<string>('');

	// https://www.geeksforgeeks.org/ethereum-address-validation-using-regular-expressions/
	function isValidAddress(address: string): boolean {
		return /^(0x)?[0-9a-fA-F]{40}$/.test(address);
	}

	// form validator
	useEffect(() => {
		const amount = parseFloat(transferAmount);
		setIsFormValid(isValidAddress(transferTo) && !isNaN(amount) && amount > 0);
	}, [transferTo, transferAmount]);

	// form change handler
	function transferFormChange(e: ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;

		if (name === 'to') {
			setTransferTo(value);
		} else if (name === 'amount') {
			setTransferAmount(value);
		}
	}

	// submit form handler
	function transfer(e: FormEvent<HTMLFormElement>): void {
		// prevent default form submission behavior
		e.preventDefault();

		if (web3 === undefined) {
			return;
		}

		// parse form data
		const formData: FormData = new FormData(e.currentTarget);

		// validate "to" field
		const to: FormDataEntryValue | null = formData.get('to');
		if (to === null || !isValidAddress(to as string)) {
			return;
		}

		// check if "amount" field is empty
		const amount: FormDataEntryValue | null = formData.get('amount');
		if (amount === null) {
			return;
		}

		// validate "amount" field
		const value: number = parseFloat(amount as string);
		if (isNaN(value) || value <= 0) {
			return;
		}

		// reset form
		setTransferTo('');
		setTransferAmount('');

		// send transaction
		web3.eth.sendTransaction({
			from: address,
			to: to as string,
			value: web3.utils.toWei(value, 'ether'),
		});
	}

	return (
		<form onSubmit={transfer}>
			<label>
				Transfer to:{' '}
				<input value={transferTo} onChange={transferFormChange} name="to" type="text" />
			</label>

			<span style={{ paddingRight: '5px' }}></span>

			<label>
				Transfer amount in ether:{' '}
				<input
					value={transferAmount === undefined ? '' : transferAmount.toString()}
					onChange={transferFormChange}
					name="amount"
					type="number"
				/>
			</label>

			<span style={{ paddingRight: '5px' }}></span>

			<button type="submit" disabled={!isFormValid}>
				Transfer
			</button>
		</form>
	);
}

export default TransferForm;
```

The `src/TransferForm.tsx` file defines a React component called `TransferForm` that can be used to transfer ether from one account to another. This component requires two attributes: an address, which is the address that the ether will be transferred _from_, and a `Web3` object, which is the `Web3` instance that will be used to perform the transfer.

Replace the contents of the `src/App.tsx` file with the following:

```tsx
import { useEffect, useState } from 'react';
import { type EIP6963ProviderDetail, Web3 } from 'web3';

// highlight-next-line
import TransferForm from './TransferForm';
import { useProviders } from './useProviders';

function App() {
	// get the dynamic list of providers
	const providers = useProviders();

	// application state
	const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
	const [accounts, setAccounts] = useState<string[]>([]);
	const [balances, setBalances] = useState<Map<string, number>>(new Map());

	// click-handler for provider buttons
	function setProvider(provider: EIP6963ProviderDetail) {
		const web3: Web3 = new Web3(provider.provider);
		setWeb3(web3);
		web3.eth.requestAccounts().then(setAccounts);
		provider.provider.on('accountsChanged', setAccounts);
		provider.provider.on('chainChanged', () => window.location.reload());
	}

	// update account balances
	useEffect(() => {
		async function updateBalances(web3: Web3) {
			const balances = new Map<string, number>();
			for (const account of accounts) {
				const balance = await web3.eth.getBalance(account);
				balances.set(account, parseFloat(web3.utils.fromWei(balance, 'ether')));
			}

			setBalances(balances);
		}

		if (web3 === undefined) {
			return;
		}

		// set balances for list of accounts
		updateBalances(web3);

		// update balances when a new block is created
		const subscription = web3.eth.subscribe('newBlockHeaders').then(subscription => {
			subscription.on('data', () => updateBalances(web3));
			return subscription;
		});

		return () => {
			subscription.then(subscription => subscription.unsubscribe());
		};
	}, [accounts, web3]);

	return (
		<>
			{web3 === undefined
				? // no provider set, display list of available providers
				  providers.map((provider: EIP6963ProviderDetail) => {
						// for each provider, display a button to connect to that provider
						return (
							<div key={provider.info.uuid}>
								<button
									onClick={() => setProvider(provider)}
									style={{ display: 'inline-flex', alignItems: 'center' }}
								>
									<img
										src={provider.info.icon}
										alt={provider.info.name}
										width="35"
									/>
									<span>{provider.info.name}</span>
								</button>
							</div>
						);
				  })
				: accounts.map((address: string, ndx: number) => {
						// provider set, list accounts and balances
						return (
							<div key={address}>
								<div>Account: {address}</div>
								<div>Balance: {`${balances.get(address)}`}</div>
								// highlight-next-line
								<TransferForm address={address} web3={web3}></TransferForm>
								{ndx !== accounts.length - 1 ? <br /> : null}
							</div>
						);
				  })}
		</>
	);
}

export default App;
```

The only thing that has changed in the `src/App.tsx` file is that the `TransferForm` component is being imported and a `TransferForm` is created for each account in the list of accounts.

Return to the browser tab that was opened by `npm start`. There should now be a transfer form below the address and balance of each account. Use the form to transfer ether - this should require accepting a confirmation from the wallet and should result in the balance of the transferring account decreasing.

## Conclusion

This tutorial demonstrated using Web3.js to build a dApp, including using EIP-6963 for the discovery of multiple wallet providers and using a wallet provider to submit a transaction to an Ethereum network. Web3.js provides helpful utilities for working with the EIP-6963 standard and works seamlessly with EIP-6963 providers.
