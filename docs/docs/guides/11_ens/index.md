---
sidebar_label: '📦 Web3 ENS module'
title: Mastering the Web3 ENS package
position: 11
---

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/vitejs-vite-qmk8vz?embed=1&file=main.ts&showSidebar=1"></iframe>

In this tutorial, we'll explore how to use the web3.js ENS (Ethereum Name Service) package. The Ethereum Name Service (ENS) is a decentralized domain system built on the Ethereum blockchain. It serves as a distributed, secure, and human-readable naming system designed to map Ethereum addresses, smart contracts, and various other services to easily understandable names.

## Installing web3.js

First, install web3.js version 4 in your project using npm:

```bash
npm install web3
```

## Setting up web3 and ENS

Now, let's set up web3 and ENS in a TypeScript file:

```typescript
import Web3 from 'web3';

// Assuming you have a provider, replace 'http://localhost:8545' with your Web3 provider
const web3 = new Web3('http://localhost:8545');

// You can use ENS with web3 object:
const ens = await web3.eth.ens.getAddress('alice.eth');
```

## Installing web3.js ENS

For directly using ENS package first install ENS package and import `ENS`.

```bash
npm install web3-eth-ens
```

```typescript
import { ENS } from 'web3-eth-ens';

const ens = new ENS(undefined, 'https://127.0.0.1:4545');

console.log(await ens.getAddress('vitalik.eth'));
```

## ENS Examples

### getAddress

The getAddress function retrieves the Ethereum address associated with the given ENS name. It resolves the address by querying the ENS resolver for the provided ENS name and returns the resolved Ethereum address.

```typescript
const address = await web3.eth.ens.getAddress('ethereum.eth');
console.log(address);
```

### getContenthash

The getContenthash function retrieves the content hash associated with the provided ENS name. It communicates with the ENS resolver to obtain the content hash value and returns the resolved content hash.

```typescript
const hash = await web3.eth.ens.getContenthash('ethereum.eth');
console.log(hash);
```

### getOwner

The getOwner function obtains the owner of the specified ENS name. It queries the ENS registry to fetch the owner of the ENS name and returns the owner's Ethereum address.

```typescript
const owner = await web3.eth.ens.getOwner('ethereum.eth');
console.log(owner);
```

### getPubKey

The getPubKey function fetches the public key x and y associated with the provided ENS name using the ENS resolver.

```typescript
const key = await web3.eth.ens.getPubkey('xyz.eth');
console.log(key);
```

### getResolver

The getResolver function retrieves the resolver for the given ENS name.

```typescript
const resolver = await web3.eth.ens.getResolver('xyz.eth');
console.log(resolver.options.address);
```

### getTTL

The getTTL function retrieves the Time-to-Live (TTL) value associated with the specified ENS name.

```typescript
const ttl = await web3.eth.ens.getTTL('xyz.eth');
console.log(ttl);
```

### recordExists

The recordExists function checks whether a record exists for the given ENS name.

```typescript
const result = await web3.eth.ens.recordExists('ethereum.eth');
console.log(result);
```

## Conclusion

In this tutorial, we've covered how to use the web3.js ENS package to interact with Ethereum Name Service. You should now be able to perform various ENS-related operations using web3.js version 4. For more details visit web3.js ENS [documentation](/libdocs/ENS) section.
