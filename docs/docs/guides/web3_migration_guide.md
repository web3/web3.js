# Web3 Migration Guide

## Breaking Changes

Passing callbacks to functions is no longer supported, except for event listeners.

### Not Implemented or Exported

-   [extend](https://web3js.readthedocs.io/en/v1.7.3/web3.html#extend) Extending web3 modules functionality is not implemented
-   [web3.bzz](https://web3js.readthedocs.io/en/v1.7.3/web3-bzz.html) Package for interacting with Swarm is not implemented
-   [web3.shh](https://web3js.readthedocs.io/en/v1.7.3/web3-shh.html) Package for interacting with Whisper is not implemented

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` default value is `undefined` instead of `null` (if web3 is instantiated without a provider)

### Web3 BatchRequest

```ts
const batch = new web3.BatchRequest();
```

#### add()

in 1.x nothing was returned, in 4.x returns a deferred promise which can be used to run specific code after completion of each respective request

```ts
// in 1.x
batch.add(
	web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback),
);

// in 4.x

const request1 = {
	jsonrpc: '2.0',
	id: 10,
	method: 'eth_getBalance',
	params: ['0xf4ffff492596ac13fee6126846350433bf9a5021', 'latest'],
};
const request2 = {
	jsonrpc: '2.0',
	id: 12,
	method: 'eth_getBalance',
	params: ['0xdc6bad79dab7ea733098f66f6c6f9dd008da3258', 'latest'],
};
batch.add(request1);
const request2Promise = batch.add(request2);
request2Promise.then(response => {
	console.log(response);
});
```

#### execute()

in 4.x execute returns a promise, where 1.x was based on the callbacks of requests passed to `add`

```ts
// in 1.x
batch.execute();

// in 4.x
const responses = await batch.execute();
```

### Web3-eth-accounts

#### create and wallet.create

In 1.x `entropy` is an optional parameter for the create method, 4.x does not have `entropy` as a parameter, create method uses an audited package ethereum-cryptography/secp256k1 that is cryptographically secure random number with certain characteristics.

#### privateKeyToAccount

In 1.x `ignoreLength` is an optional parameter for privateKeyToAccount, in 4.x `ignoreLength` is removed

#### signTransaction

In 4.x a transaction object must be passed. Must be typed legacy, EIP2930 or EIP 1559 transaction type Read more about [transaction types] (https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#transaction-types)

#### recover

In 4.x, instead of passing in seperate parameters `messageHash`, `r`, `s`, `v`, a signature object is passed containing those parameters
