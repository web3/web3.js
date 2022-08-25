---
sidebar_position: 3
sidebar_label: Web3.eth
---

# Web3.eth Migration Guide

## Breaking Changes

All the API level interfaces returning or accepting `null` in `1.x`, use `undefined` in `4.x`

### Return Values

##### Returns a `BigInt` instead of a number string

-   `web3.eth.getGasPrice`
-   `web3.eth.getBalance`

##### Returns a `BigInt` instead of a number

-   `web3.eth.getBlockNumber`
-   `web3.eth.getBlockTransactionCount`
-   `web3.eth.getBlockUncleCount`
-   `web3.eth.getTransactionCount`
-   `web3.eth.estimateGas`

---

##### `web3.eth.getBlock`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a `BigInt` instead of a number string for the following properties:
    -   `difficulty`
    -   `totalDifficulty`

##### `web3.eth.getUncle`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a `BigInt` instead of a number string for the following properties:
    -   `difficulty`

##### `web3.eth.getTransaction`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a `BigInt` instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`
    -   `chainId`

##### `web3.eth.getPendingTransactions`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a `BigInt` instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`

##### `web3.eth.getTransactionFromBlock`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a `BigInt` instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`

##### `web3.eth.getTransactionReceipt`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a `BigInt` instead of a boolean for the following properties:
    -   `status`

##### `web3.eth.sendSignedTransaction`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a `BigInt` instead of a boolean for the following properties:
    -   `status`

### Not Implemented

-   [extend](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#extend) functionality not implemented

### Defaults and Configs

-   All default values that returned `null` in 1.x, in 4.x return `undefined`. There are:

    -   `givenProvider`
    -   `currentProvider`
    -   `web3.eth.defaultAccount`
        -   1.x has `undefined` documented as default, but in implementation it's `null`

-   `web3.eth.defaultHardfork` default is `london` instead of `undefined`
    -   1.x has `london` documented as default, but in implementation it's `undefined`
-   `web3.eth.defaultChain` default is `mainnet` instead of `undefined`
    -   1.x has `mainnet` documented as default, but in implementation it's `undefined`

### Web3Eth Methods

### `web3.eth.getHashrate`

`getHashrate` is deprecated, and will be removed in a future release. Please use `getHashRate`

### `web3.eth.getFeeHistory`

`4.x` returns a `BigInt` for `oldestBlock` instead of the hex string that's returned in `1.x`

```typescript
// in 1.x
await web3.eth.getFeeHistory('0x1', 'latest', []);
// {
//     oldestBlock: '0x0',
//     baseFeePerGas: [ '0x3b9aca00', '0x342770c0' ],
//     gasUsedRatio: [ 0 ]
// }

// in 4.x
await web3.eth.getFeeHistory('0x1', 'latest', []);
// {
//     oldestBlock: 0n,
//     baseFeePerGas: [ '0x3b9aca00', '0x342770c0' ],
//     gasUsedRatio: [ 0 ]
// }
```

### `web3.eth.sendTransaction`

-   `userTransactionObject.chain` no longer defaults to `mainnet`, will be `undefined` if not provided
-   `userTransactionObject.hardfork` no longer defaults to `london`, will be `undefined` if not provided

#### PromiEvents

##### `sending`

-   In `1.x`, this event listenter would receive a `payload` object as an arguement, in `4.x` just the sent transaction object is recieved

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('sending', (payload) => { ... });
// payload would be:
// {
//   method: 'eth_sendTransaction',
//   params: [
//     {
//       from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       to: '0x0000000000000000000000000000000000000000',
//       value: '0x1',
//       maxPriorityFeePerGas: '0x9502F900',
//       maxFeePerGas: '0xc3e17d20'
//     }
//   ],
//   callback: undefined
// }

// in 4.x
web3.eth.sendTransaction({ ... }).on('sending', (sendTransactionObject) => { ... });
// sendTransactionObject would be:
// {
//     from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//     to: '0x0000000000000000000000000000000000000000',
//     value: '0x1',
//     gasPrice: '0x77359400',
//     maxPriorityFeePerGas: undefined,
//     maxFeePerGas: undefined
// }
```

###### `sent`

-   In `1.x`, this event listenter would receive a `payload` object as an arguement, in `4.x` just the sent transaction object is recieved

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('sent', (payload) => { ... });
// payload would be:
// {
//   method: 'eth_sendTransaction',
//   params: [
//     {
//       from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       to: '0x0000000000000000000000000000000000000000',
//       value: '0x1'
//     }
//   ],
//   callback: undefined
// }

// in 4.x
web3.eth.sendTransaction({ ... }).on('sent', (sentTransactionObject) => { ... });
// sentTransactionObject would be:
// {
//     from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
//     to: '0x0000000000000000000000000000000000000000',
//     value: '0x1',
//     gasPrice: '0x77359400',
//     maxPriorityFeePerGas: undefined,
//     maxFeePerGas: undefined
// }
```

##### `receipt`

-   The `receipt` object the event listener receives:
    -   Returns a `BigInt` instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a `BigInt` instead of a boolean for the following properties:
        -   `status`

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('receipt', (receipt) => { ... });
// receipt would be:
// {
//   blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//   blockNumber: 14966017n,
//   cumulativeGasUsed: 6992382n,
//   effectiveGasPrice: 31200410061n,
//   from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//   gasUsed: 21000n,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: 1n,
//   to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//   transactionHash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//   transactionIndex: 80n,
//   type: 2n
// }

// in 4.x
web3.eth.sendTransaction({ ... }).on('receipt', (receipt) => { ... });
// receipt would be:
// {
//     transactionHash: '0xef37e818889e7b40df24f8546ae15b16cda7e8fdc99ad76356611401cb4c4f93',
//     transactionIndex: '0x0',
//     blockNumber: '0xf',
//     blockHash: '0x8a700d6665a5b91789f7525490c453d55208f7560662aa3ff2eaab8d297bfd07',
//     from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//     to: '0x0000000000000000000000000000000000000000',
//     cumulativeGasUsed: '0x5208',
//     gasUsed: '0x5208',
//     logs: [],
//     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     status: '0x1',
//     effectiveGasPrice: '0x77359400',
//     type: '0x0'
// }
```

##### `confirmation`

-   In `1.x`, this event listener would receive `confirmationNumber` and `receipt` as arguments, in `4.x` an object containing the properties: `confirmationNumber`, `receipt`, and `latestBlockHash` will be received
-   `confirmationNumber` is returned as a `BigInt` instead of a number
-   For the returned `receipt` object:
    -   Returns a `BigInt` instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a `BigInt` instead of a boolean for the following properties:
        -   `status`

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('confirmation', (confirmationNumber, receipt) => { ... });
// confirmationNumber would be: 1
// receipt would be:
// {
//   transactionHash: '0x1e657e53a0e5a75fe36af8a05c89b8a8ea155c951ce43a7c42a77a48c4c89e2f',
//   transactionIndex: 0,
//   blockNumber: 2,
//   blockHash: '0x940bfb359be8064d7c65408efaba3068bdd6995b810aae5fb355bd3d95d3079b',
//   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//   to: '0x0000000000000000000000000000000000000000',
//   cumulativeGasUsed: 21000,
//   gasUsed: 21000,
//   contractAddress: null,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: true,
//   effectiveGasPrice: 3265778125,
//   type: '0x2'
// }

// in 4.x
web3.eth.sendTransaction({ ... }).on('confirmation', (confirmationObject) => { ... });
// confirmationObject would have the following structure:
// {
//     confirmationNumber: 2n,
//     receipt: {
//         transactionHash: '0xd93fe25c2066cd8f15565bcff693507a3c70f5fb9387db57f939ae91f4080c6c',
//         transactionIndex: 0n,
//         blockNumber: 5n,
//         blockHash: '0xe1775977a8041cb2709136804e4be609135f8367b49d38960f92a95b4c02189a',
//         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//         to: '0x0000000000000000000000000000000000000000',
//         cumulativeGasUsed: 5208n,
//         gasUsed: 5208n,
//         logs: [],
//         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//         status: 1n,
//         effectiveGasPrice: 77359400n,
//         type: '0x0'
//     },
//     latestBlockHash: '0xb2ef3763190da82d8efa938f73efa5bb21e3d95c2ce25dd38ca21eea1a942260'
// }
```

-   In `1.x`, an event was emitted for each confirmation starting from `0` (the first block the transaction was included in), in `4.x` confirmations start from `1` and the first event to be emitted will have a `confirmationNumber` of `2`

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('confirmation', (confirmationNumber, receipt) => {
    // confirmationNumber would equal 1 the first time the event was emitted
    // confirmationNumber would then equal 2 the next time
    // and so on until 12 (or whatever transactionConfirmationBlocks is set to) confirmations are found
});

// in 4.x
web3.eth.sendTransaction({ ... }).on('confirmation', (confirmationObject) => {
    // confirmationNumber would equal 2 the first time the event was emitted
    // confirmationNumber would then equal 3 the next time
    // and so on until 12 (or whatever transactionConfirmationBlocks is set to) confirmations are found
});
```

### `web3.eth.sign`

-   To-be-signed data must be provided as a Hex String

```typescript
// In 1.x, data can be provided as both a UTF-8 string and a hex string
await web3.eth.sign('Hello world', '0xd8c375f286c258521564da00ddee3945d1d057c4');
// 0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c
await web3.eth.sign(
	web3.utils.utf8ToHex('Hello world'),
	'0xd8c375f286c258521564da00ddee3945d1d057c4',
);
// 0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c

// 4.x only supports Hex Strings
await web3.eth.sign(
	web3.utils.utf8ToHex('Hello world'),
	'0xd8c375f286c258521564da00ddee3945d1d057c4',
);
// 0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c
```

### `web3.eth.signTransaction`

-   In `1.x`, for untyped, `0x0` and `0x1` typed transactions, `maxPriorityFeePerGas` and `maxFeePerGas` are set to `null`. For `0x2` typed transactions, `gasPrice` is set to `null`. In `4.x` these properties are not present unless provided
-   In `1.x` contract deployment data is provided via the `input` property, while in `4.x` it is provided using the `data` property
-   In `1.x` the hash of the transaction is included in the returned transaction object, while in `4.x` it's not

```typescript
// In 1.x - Legacy (type 0x0) transaction
await web3.eth.signTransaction({
	from: '0x95Cd1391888fe2460371c67cc3e45b9579c3E0dA',
	to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	gas: '21000',
	gasPrice: '0xc3e17d20',
	nonce: '0x4',
});
// {
//     raw: '0x02f86c82053904849502f90084c3e17d20825208946e599da0bff7a6598ac1224e4985430bf16458a48080c080a0711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20a033d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//     tx: {
//       type: '0x2',
//       nonce: '0x4',
//       gasPrice: '0xc3e17d20,
//       maxPriorityFeePerGas: null,
//       maxFeePerGas: null,
//       gas: '0x5208',
//       value: '0x0',
//       input: '0x',
//       v: '0x0',
//       r: '0x711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20',
//       s: '0x33d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//       to: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       chainId: '0x539',
//       accessList: [],
//       hash: '0x2ddb1224899bcbc07c89631870870c61195214bab64d60985cd6d8f1c2fd872b'
//     }
// }

// In 1.x - EIP-1559 (type 0x2) transaction
await web3.eth.signTransaction({
	from: '0x95Cd1391888fe2460371c67cc3e45b9579c3E0dA',
	to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	gas: '21000',
	maxPriorityFeePerGas: '0x9502F900',
	maxFeePerGas: '0xc3e17d20',
	nonce: '0x4',
});
// {
//     raw: '0x02f86c82053904849502f90084c3e17d20825208946e599da0bff7a6598ac1224e4985430bf16458a48080c080a0711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20a033d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//     tx: {
//       type: '0x2',
//       nonce: '0x4',
//       gasPrice: null,
//       maxPriorityFeePerGas: '0x9502f900',
//       maxFeePerGas: '0xc3e17d20',
//       gas: '0x5208',
//       value: '0x0',
//       input: '0x',
//       v: '0x0',
//       r: '0x711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20',
//       s: '0x33d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//       to: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       chainId: '0x539',
//       accessList: [],
//       hash: '0x2ddb1224899bcbc07c89631870870c61195214bab64d60985cd6d8f1c2fd872b'
//     }
// }

// In 4.x - Legacy (type 0x0) transaction
await web3.eth.signTransaction({
	from: '0x95Cd1391888fe2460371c67cc3e45b9579c3E0dA',
	to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	gas: '21000',
	gasPrice: '0xc3e17d20',
	nonce: '0x4',
});
// {
//     raw: '0x02f86c82053904849502f90084c3e17d20825208946e599da0bff7a6598ac1224e4985430bf16458a48080c080a0711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20a033d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//     tx: {
//       type: 2n,
//       nonce: 4n,
//       gasPrice: 3286334752n,
//       gas: 21000n,
//       value: 0n,
//       v: 0n,
//       r: '0x711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20',
//       s: '0x33d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//       to: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       chainId: 1337n,
//       accessList: [],
//       data: '0x'
//     }
// }

// In 4.x - EIP-1559 (type 0x2) transaction
await web3.eth.signTransaction({
	from: '0x95Cd1391888fe2460371c67cc3e45b9579c3E0dA',
	to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	gas: '21000',
	maxPriorityFeePerGas: '0x9502F900',
	maxFeePerGas: '0xc3e17d20',
	nonce: '0x4',
});
// {
//     raw: '0x02f86c82053904849502f90084c3e17d20825208946e599da0bff7a6598ac1224e4985430bf16458a48080c080a0711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20a033d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//     tx: {
//       type: 2n,
//       nonce: 4n,
//       maxPriorityFeePerGas: 2500000000n,
//       maxFeePerGas: 3286334752n,
//       gas: 21000n,
//       value: 0n,
//       v: 0n,
//       r: '0x711c981b34204725019d9851ee0c127543b0c7caf4f8850024e26aefabf26f20',
//       s: '0x33d8447d959bd596c90d57db90917a126b95a0f152c9c86b36d97b177f7ae85f',
//       to: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//       chainId: 1337n,
//       accessList: [],
//       data: '0x'
//     }
// }
```

### `web3.eth.getPastLogs`

-   Returns a `BigInt` instead of a number for the following properties:
    -   `logIndex`
    -   `transactionIndex`
    -   `blockNumber`

```typescript
//in 1.x
await web3.eth
	.getPastLogs({
		address: '0xE012dB5CA859A3238DdC576c0092BA5E728B7268',
		topics: ['0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab'],
	})
	.then(console.log);
// [
//     {
//       address: "0xe405df0ea854cd98df9f646559ce2001396e8f5b",
//       topics: [
//         "0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab",
//       ],
//       data: "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000027431000000000000000000000000000000000000000000000000000000000000",
//       blockNumber: 221,
//       transactionHash:
//         "0xc96bbd8308f70940aa465ecdf95c7ce8c687dede5c53e5ce5ce55434c6e406bd",
//       transactionIndex: 0,
//       blockHash:
//         "0xfd1657fc5d2b18153aa569956718cd2d3a05285712208a9544dfc093966b9c5f",
//       logIndex: 0,
//       removed: false,
//     },
//   ];

//in 4.x
await web3.eth
	.getPastLogs({
		address: '0xE012dB5CA859A3238DdC576c0092BA5E728B7268',
		topics: ['0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab'],
	})
	.then(console.log);
// [
//     {
//       address: "0xe405df0ea854cd98df9f646559ce2001396e8f5b",
//       topics: [
//         "0x617cf8a4400dd7963ed519ebe655a16e8da1282bb8fea36a21f634af912f54ab",
//       ],
//       data: "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000027431000000000000000000000000000000000000000000000000000000000000",
//       blockNumber: 221n,
//       transactionHash:
//         "0xc96bbd8308f70940aa465ecdf95c7ce8c687dede5c53e5ce5ce55434c6e406bd",
//       transactionIndex: 0n,
//       blockHash:
//         "0xfd1657fc5d2b18153aa569956718cd2d3a05285712208a9544dfc093966b9c5f",
//       logIndex: 0n,
//       removed: false,
//     },
//   ];
```

### `web3.eth.getWork`

same as in 1.x

```typescript
web3.eth.getWork().then(console.log);
// [
// 	'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
// 	'0x5EED00000000000000000000000000005EED0000000000000000000000000000',
// 	'0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000',
// ];
```

### `web3.eth.submitWork`

same as in 1.x

```typescript
web3.eth
	.submitWork([
		'0x0000000000000001',
		'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
		'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
	])
	.then(console.log);
//true
```

### `web3.eth.requestAccouts`

same as 1.x, returns array of addressed (must be used with injected provider)

```typescript
await web3.eth.requestAccounts();
//['0xb839Aa3ECdd24c0Fa2fa382Ca179b88a0b33804f']
```

### `web3.eth.getChainId`

Returns a `BigInt` instead of a number string

```typescript
//in 1.x
web3.eth.getChainId().then(console.log);
//1337

//in 4.x
web3.eth.getChainId().then(console.log);
//1337n
```

### `web3.eth.getNodeInfo`

same as in 1.x

```typescript
web3.eth.getNodeInfo().then(console.log);
// Geth/v1.10.18-unstable-b3af0a55/linux-arm64/go1.18.1
```

### `web3.eth.getProof`

-   Returns a `BigInt` instead of a number string for the following properties:
    -   `balance`
    -   `nonce`

`balance` and `nonce` in 1.x were described as numbers

```typescript
//in 1.x
web3.eth
	.getProof(
		'0x10d53fb7D9C9EedC40A97B51663fFd8DcC651a6b',
		[
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000001',
		],
		'latest',
	)
	.then(console.log);
// {
//   address: '0x10d53fb7D9C9EedC40A97B51663fFd8DcC651a6b',
//   accountProof: [
//     '0xf90211a057107845987d38b07b52dd91268d5a41dc0c5d262feb2a21a27165387bca0447a063d1f4079378d594b3a02ac552c5d303fd0ddda203d674114468ee1908e3c61ba06e25ed79c830f5375e01e142f165f2cfd9c6c966e3755f62ae7eac87b6972dcba0e9d751f777e854f7c87fc590f20bd45d5142dd804904746fe0eec6969ef2904ca0e5eb80b4790935a22f416cbdf7abf5658c1b26d9aadcaddda80dfd30fb477605a06ebd45fd404417976368dfc3225139b9c475cd199f0e2ec9dc2bc66894c7b478a0389e57b4c2e590bd7fc4a42c5f8d1ae4f03f981c8d10fd028fe8a8cd21d4b9f6a063662eba9e6e5c1229f73d9b8123a35e837ab9b51c12bd2c21342860a850be5fa088a53f78919dddb7ec2eddb967b7d74eeab59c0352fe0a9fceeab86d3061a2aea06fec4053b58d1914ef325a74d9ad13658f19478091484935cbfb82f2ace45d07a099455c1fe3bc9c9c90668fcaf3996182b0ea32c36b16b757f877981e74265313a07afabdbb861f9c9c801a8be8b9a30fcad67b0468c1599f3150417df833b1ed15a0937108ade09abe0eb7a5d5abf7834cb4d5c6a42256071a203c97e219c9b35e4fa07333b514b144076aedef8232f460a65c5845fb7bee1dffa3d02a63d27ee103dda02a5f97f2acf28a2ef6098553188bb578f5699e5ddd86e750906427c04146638aa0b1ea877b1fb989471890e9e0eea1ca9ecabe4a501f5427dcc6122ac602ec5e5a80',
//     '0xf8b1808080a01fcc2ac732952007a813f5d53b517a2f0c3b5faf38cd0654e564302e39e2fec68080a040cb340b7815612dc0705235c46f04565d5e7005b26b1544bd72d2a0cde1f7fb80a05902a1a7c70a64efedd39ed9ae25078e9054ab531c8fe4bdd7ff245ecd2bca0780a06117e0dc18ac6d32f46418eabf875a8cd21bf05b62013f87242824ca939cb776808080a0261eb1dc702fff2a022d7a2f0386224a760971187e3d6447958293f455aafbc78080',
//     '0xf869a02032c2889a72d251d4f0bbf5eb448f4af962917185a86532af762ff82865ca68b846f8440180a0291bd0e0825fa92cfeb0d3b28529bae6709aa1db89a25f7e62ba5422bbb1e10ea09bbff76f89bb6a6e787eea245acb599900f2d58faab236e165e2b32df0198c84'
//   ],
//   balance: '0',
//   codeHash: '0x9bbff76f89bb6a6e787eea245acb599900f2d58faab236e165e2b32df0198c84',
//   nonce: '1',
//   storageHash: '0x291bd0e0825fa92cfeb0d3b28529bae6709aa1db89a25f7e62ba5422bbb1e10e',
//   storageProof: [
//     {
//       key: '0x0',
//       value: '0x736f6c79656e7420677265656e2069732070656f706c6500000000000000002e',
//       proof: [Array]
//     },
//     { key: '0x1', value: '0x0', proof: [Array] }
//   ]
//}
//in 4.x
web3.eth
	.getProof(
		'0x10d53fb7D9C9EedC40A97B51663fFd8DcC651a6b',
		[
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000001',
		],
		'latest',
	)
	.then(console.log);
    {
//   accountProof: [
//     '0xf90211a057107845987d38b07b52dd91268d5a41dc0c5d262feb2a21a27165387bca0447a063d1f4079378d594b3a02ac552c5d303fd0ddda203d674114468ee1908e3c61ba06e25ed79c830f5375e01e142f165f2cfd9c6c966e3755f62ae7eac87b6972dcba0e9d751f777e854f7c87fc590f20bd45d5142dd804904746fe0eec6969ef2904ca0e5eb80b4790935a22f416cbdf7abf5658c1b26d9aadcaddda80dfd30fb477605a06ebd45fd404417976368dfc3225139b9c475cd199f0e2ec9dc2bc66894c7b478a0389e57b4c2e590bd7fc4a42c5f8d1ae4f03f981c8d10fd028fe8a8cd21d4b9f6a063662eba9e6e5c1229f73d9b8123a35e837ab9b51c12bd2c21342860a850be5fa088a53f78919dddb7ec2eddb967b7d74eeab59c0352fe0a9fceeab86d3061a2aea06fec4053b58d1914ef325a74d9ad13658f19478091484935cbfb82f2ace45d07a099455c1fe3bc9c9c90668fcaf3996182b0ea32c36b16b757f877981e74265313a07afabdbb861f9c9c801a8be8b9a30fcad67b0468c1599f3150417df833b1ed15a0937108ade09abe0eb7a5d5abf7834cb4d5c6a42256071a203c97e219c9b35e4fa07333b514b144076aedef8232f460a65c5845fb7bee1dffa3d02a63d27ee103dda02a5f97f2acf28a2ef6098553188bb578f5699e5ddd86e750906427c04146638aa0b1ea877b1fb989471890e9e0eea1ca9ecabe4a501f5427dcc6122ac602ec5e5a80',
//     '0xf8b1808080a01fcc2ac732952007a813f5d53b517a2f0c3b5faf38cd0654e564302e39e2fec68080a040cb340b7815612dc0705235c46f04565d5e7005b26b1544bd72d2a0cde1f7fb80a05902a1a7c70a64efedd39ed9ae25078e9054ab531c8fe4bdd7ff245ecd2bca0780a06117e0dc18ac6d32f46418eabf875a8cd21bf05b62013f87242824ca939cb776808080a0261eb1dc702fff2a022d7a2f0386224a760971187e3d6447958293f455aafbc78080',
//     '0xf869a02032c2889a72d251d4f0bbf5eb448f4af962917185a86532af762ff82865ca68b846f8440180a0291bd0e0825fa92cfeb0d3b28529bae6709aa1db89a25f7e62ba5422bbb1e10ea09bbff76f89bb6a6e787eea245acb599900f2d58faab236e165e2b32df0198c84'
//   ],
//   balance: 0n,
//   codeHash: '0x9bbff76f89bb6a6e787eea245acb599900f2d58faab236e165e2b32df0198c84',
//   nonce: 1n,
//   storageHash: '0x291bd0e0825fa92cfeb0d3b28529bae6709aa1db89a25f7e62ba5422bbb1e10e',
//   storageProof: [
//     {
//       key: '0x0000000000000000000000000000000000000000000000000000000000000000',
//       value: '0x736f6c79656e7420677265656e2069732070656f706c6500000000000000002e',
//       proof: [Array]
//     },
//     {
//       key: '0x0000000000000000000000000000000000000000000000000000000000000001',
//       value: '0x0',
//       proof: [Array]
//     }
//   ]
// }
```
