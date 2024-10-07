---
sidebar_label: '🔄 Wagmi usage'
title: 'Wagmi Web3.js Adapter'
position: 16
---

### Reference Implementation

If you're using [Wagmi](https://wagmi.sh/react/getting-started#use-wagmi) and want to add web3.js, use this code in your project. This snippet will help you to convert a `Viem` client to a `web3.js` instance for signing transactions and interacting with the blockchain:

```typescript
import { Web3 } from 'web3';
import { useMemo } from 'react';
import type { Chain, Client, Transport } from 'viem';
import { type Config, useClient, useConnectorClient } from 'wagmi';

export function clientToWeb3js(client?: Client<Transport, Chain>) {
	if (!client) {
		return new Web3();
	}

	const { transport } = client;

	if (transport.type === 'fallback') {
		return new Web3(transport.transports[0].value.url);
	}
	return new Web3(transport);
}

/** Action to convert a viem Client to a web3.js Instance. */
export function useWeb3js({ chainId }: { chainId?: number } = {}) {
	const client = useClient<Config>({ chainId });
	return useMemo(() => clientToWeb3js(client), [client]);
}

/** Action to convert a viem ConnectorClient to a web3.js Instance. */
export function useWeb3jsSigner({ chainId }: { chainId?: number } = {}) {
	const { data: client } = useConnectorClient<Config>({ chainId });
	return useMemo(() => clientToWeb3js(client), [client]);
}
```

### Usage examples

Get block data example:

```typescript
import { useWeb3js } from '../web3/useWeb3js';
import { mainnet } from 'wagmi/chains';
import { useEffect, useState } from 'react';

type Block = {
	hash: string;
	extraData: string;
	miner: string;
};

function Block() {
	const web3js = useWeb3js({ chainId: mainnet.id });
	const [block, setBlock] = useState<Block>();

	useEffect(() => {
		web3js.eth
			.getBlock(19235006)
			.then(b => {
				setBlock(b as Block);
			})
			.catch(console.error);
	}, [setBlock]);

	if (!block) return <div>Loading...</div>;

	return (
		<>
			<div id="hash">{block.hash}</div>
			<div id="extraData">{block.extraData}</div>
			<div id="miner">{block.miner}</div>
		</>
	);
}

export default Block;
```

Send transaction example:

```typescript
import { mainnet } from 'wagmi/chains';
import { useAccount, useConnect } from 'wagmi';
import { useWeb3jsSigner } from '../web3/useWeb3js';
import { useEffect } from 'react';

function SendTransaction() {
	const account = useAccount();
	const { connectors, connect } = useConnect();
	const web3js = useWeb3jsSigner({ chainId: mainnet.id });

	useEffect(() => {
		if (account && account.address) {
			web3js.eth
				.sendTransaction({
					from: account.address,
					to: '0x', // some address
					value: '0x1', // set your value
				})
				.then(console.log)
				.catch(console.error);
		}
	}, [account]);

	return (
		<>
			{connectors.map(connector => (
				<button key={connector.uid} onClick={() => connect({ connector })} type="button">
					{connector.name}
				</button>
			))}
		</>
	);
}

export default SendTransaction;
```

:::tip
[This repository](https://github.com/avkos/wagmi-web3js-example-app) contains an example Wagmi app that demonstrates how to interact with the Ethereum blockchain using the web3.js library
:::
