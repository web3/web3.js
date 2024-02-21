---
sidebar_position: 1
sidebar_label: 'Wagmi Web3js Adaptor'
title: 'Wagmi Web3js Adaptor'
---

If you're using [Wagmi](https://wagmi.sh/react/getting-started#use-wagmi) and want to add web3.js, use this provider in your project:


```typescript
import {Web3} from 'web3'
import {useMemo} from 'react'
import type {Chain, Client, Transport} from 'viem'
import {type Config, useClient} from 'wagmi'

export function clientToWeb3js(client?: Client<Transport, Chain>) {
    if (!client) {
        return new Web3()
    }

    const {transport} = client

    if (transport.type === 'fallback') {
        return new Web3(transport.transports[0].value.url)
    }

    return new Web3(transport.url)
}

/** Action to convert a viem Client to a web3.js Instance. */
export function useWeb3js({chainId}: { chainId?: number } = {}) {
    const client = useClient<Config>({chainId})
    return useMemo(() => clientToWeb3js(client), [client])
}

```

Usage example:

```typescript
import {useWeb3js} from '../web3/useWeb3js'
import {mainnet} from 'wagmi/chains' // for example for mainnet
// somewhere in your React render method
const web3js = useWeb3js({chainId: mainnet.id})
// ...
```


:::tip
[This repository](https://github.com/avkos/wagmi-web3js-example-app) contains an example Wagmi app that demonstrates how to interact with the Ethereum blockchain using the web3.js library
::: 
