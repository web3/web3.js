# Web3Eth Migration Guide

## Breaking Changes

Any function which returned `number` value, now returns `bigint`

All the API level interfaces returning or accepting `null` in 1.x, use `undefined` now

### Not Implemented or Exported

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

### `web3.eth.getGasPrice`

returns a bigint string instead of a number string

```typescript
// in 1.x
await web3.eth.getGasPrice(); // '2000000000'

// in 4.x
await web3.eth.getGasPrice(); // 2000000000n
```

### `web3.eth.getFeeHistory`

returns hex strings for `gasUsedRatio` array items instead of a numbers

```typescript
// in 1.x
await web3.eth.getFeeHistory('0x1', 'latest', []);
// {
//  oldestBlock: '0x0',
//  baseFeePerGas: [ '0x3b9aca00', '0x342770c0' ],
//  gasUsedRatio: [ 0 ]
// }

// in 4.x
await web3.eth.getFeeHistory('0x1', 'latest', []);
// {
//  oldestBlock: '0x0',
//  baseFeePerGas: [ '0x3b9aca00', '0x342770c0' ],
//  gasUsedRatio: [ '0x0' ]
// }
```

### `web3.eth.getBlockNumber`

returns a bigint instead of a number

```typescript
// in 1.x
await web3.eth.getBlockNumber(); // 0

// in 4.x
await web3.eth.getBlockNumber(); // '0n'
```

### `web3.eth.getBalance`

returns a bigint instead of a number string

```typescript
// in 1.x
await web3.eth.getBalance('0xAB089B30f46883C3598B720d85837080b9929D0B'); // '115792089237316195423570985008687907853269984665640564039357583989538129639927'

// in 4.x
await web3.eth.getBalance('0xAB089B30f46883C3598B720d85837080b9929D0B'); // 115792089237316195423570985008687907853269984665640564039357583989538129639927n
```

### `web3.eth.getBlock`

-   Returns a bigint instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a bigint instead of a number string for the following properties:
    -   `difficulty`
    -   `totalDifficulty`

```typescript
// in 1.x
await web3.eth.getBlock('latest');
// {
//   baseFeePerGas: 875000000,
//   difficulty: '2',
//   extraData: '0xd883010a12846765746888676f312e31382e31856c696e75780000000000000010157d9c4ad322d920918d4ddae4e001202a22839fbfd2371b1ddf285300e9e9594b411a7fac32c9bb8a46d2a91d6070ccb3aad2f2e868e0c1ea63f704312eba00',
//   gasLimit: 11511229,
//   gasUsed: 21000,
//   hash: '0x784c14e4f4593cf26a8351a60bf638005ba5f9484bf10cfdd91efa111b374d66',
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   miner: '0x0000000000000000000000000000000000000000',
//   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//   nonce: '0x0000000000000000',
//   number: 1,
//   parentHash: '0x9652fad2b90eb0e77c7ef0aca9d906ab75af9c43f82351e7dac910ee8621fff4',
//   receiptsRoot: '0x056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2',
//   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//   size: 725,
//   stateRoot: '0xbfcc9c1696039dbfb95250cf36a43bbc07e1fce54d6d0c000cb38a8a77038660',
//   timestamp: 1656322892,
//   totalDifficulty: '3',
//   transactions: [
//     '0x7de9d0e0082eaa351466f5919bb17b42263a2cbe132064eb551dcc9d134b5df8'
//   ],
//   transactionsRoot: '0x806f860d591e93723afa2e16f8cce628bd02acbf03325dcab76b9a7c7012c535',
//   uncles: []
// }

// in 4.x
await web3.eth.getBlock('latest');
// {
//   baseFeePerGas: 875000000n,
//   difficulty: 2n,
//   extraData: '0xd883010a12846765746888676f312e31382e31856c696e75780000000000000010157d9c4ad322d920918d4ddae4e001202a22839fbfd2371b1ddf285300e9e9594b411a7fac32c9bb8a46d2a91d6070ccb3aad2f2e868e0c1ea63f704312eba00',
//   gasLimit: 11511229n,
//   gasUsed: 21000n,
//   hash: '0x784c14e4f4593cf26a8351a60bf638005ba5f9484bf10cfdd91efa111b374d66',
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   miner: '0x0000000000000000000000000000000000000000',
//   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//   nonce: 0n,
//   number: 1n,
//   parentHash: '0x9652fad2b90eb0e77c7ef0aca9d906ab75af9c43f82351e7dac910ee8621fff4',
//   receiptsRoot: '0x056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2',
//   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//   size: 725n,
//   stateRoot: '0xbfcc9c1696039dbfb95250cf36a43bbc07e1fce54d6d0c000cb38a8a77038660',
//   timestamp: 1656322892n,
//   totalDifficulty: 3n,
//   transactions: [
//     '0x7de9d0e0082eaa351466f5919bb17b42263a2cbe132064eb551dcc9d134b5df8'
//   ],
//   transactionsRoot: '0x806f860d591e93723afa2e16f8cce628bd02acbf03325dcab76b9a7c7012c535',
//   uncles: []
// }
```

### `web3.eth.getBlockTransactionCount`

returns a bigint instead of a number

```typescript
// in 1.x
await web3.eth.getBlockTransactionCount('latest'); // 0

// in 4.x
await web3.eth.getBlockTransactionCount('latest'); // 0n
```

### `web3.eth.getBlockUncleCount`

returns a bigint instead of a number

```typescript
// in 1.x
await web3.eth.getBlockUncleCount('latest'); // 0

// in 4.x
await web3.eth.getBlockUncleCount('latest'); // '0'
```

### `web3.eth.getUncle`

-   Returns a bigint instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a bigint instead of a number string for the following properties:
    -   `difficulty`

```typescript
// in 1.x
await web3.eth.getUncle(14965991, 0);
// {
//     baseFeePerGas: 35571562105,
//     difficulty: '13923582981852799',
//     extraData: '0x617369612d65617374322d3132',
//     gasLimit: 30087829,
//     gasUsed: 11487217,
//     hash: '0xf049e44dba7ae7c45239de3e2264ead7abd86fec3399ae2234edf778e936885c',
//     logsBloom: '0x206cab47e94018b154281022c05863330003318c70a0ca4460244b4134a88517302d93c854b8068110a11b1342212335ba2020000d12fc330a44489e013e20149006f2034180105e7a820219b52861a241a210ca8d50385d3c481c21a8406c509a584cb15a226e0620111a884c262b9236010cf444700c030e2480f7200a6484b22b15a012c29903b40c0cc4830304c665003cc1b1b240b8752087d8ea1261e2ef8e293711c26d3b2b87c0988dd928d2d1a427340a90900641270ea6008a4d10032424ef0c0209789b424b4c304f5a0700640a40dfae02506303396e85182021203170182904980140409004cde41f818c21c80009480172c26f39944202fc83',
//     miner: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
//     mixHash: '0xfde990a5350c56b44f0538a0b28d6d26d87f59934477ef73908b9d96c91d6e59',
//     nonce: '0xea5a783eb0e0e46b',
//     number: 14965990,
//     parentHash: '0xef7f2e8cb41f37c021b236bc3ea9d2c4e6b0fceefdb3c2c646384b7b2fe116a5',
//     receiptsRoot: '0x327f816a10ba5bcc702055d419baa731346131cc2dda49e64b7ba9e5a7fd49bb',
//     sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//     size: 541,
//     stateRoot: '0x4276888e92368eac990a4bbcda938c9c29bd94f85b134b218990d1b137dc234d',
//     timestamp: 1655273068,
//     transactionsRoot: '0x1717925d728173ce122b91199383468dbce68bda5e308d2a16f00725bab7b140',
//     uncles: []
// }

// in 4.x
await web3.eth.getUncle(14965991, 0);
// {
//     baseFeePerGas: '0x8483af679',
//     difficulty: '0x31776cc9a24e7f',
//     extraData: '0x617369612d65617374322d3132',
//     gasLimit: '0x1cb1a95',
//     gasUsed: '0xaf47f1',
//     hash: '0xf049e44dba7ae7c45239de3e2264ead7abd86fec3399ae2234edf778e936885c',
//     logsBloom: '0x206cab47e94018b154281022c05863330003318c70a0ca4460244b4134a88517302d93c854b8068110a11b1342212335ba2020000d12fc330a44489e013e20149006f2034180105e7a820219b52861a241a210ca8d50385d3c481c21a8406c509a584cb15a226e0620111a884c262b9236010cf444700c030e2480f7200a6484b22b15a012c29903b40c0cc4830304c665003cc1b1b240b8752087d8ea1261e2ef8e293711c26d3b2b87c0988dd928d2d1a427340a90900641270ea6008a4d10032424ef0c0209789b424b4c304f5a0700640a40dfae02506303396e85182021203170182904980140409004cde41f818c21c80009480172c26f39944202fc83',
//     miner: '0xea674fdde714fd979de3edf0f56aa9716b898ec8',
//     mixHash: '0xfde990a5350c56b44f0538a0b28d6d26d87f59934477ef73908b9d96c91d6e59',
//     nonce: '0xea5a783eb0e0e46b',
//     number: '0xe45ce6',
//     parentHash: '0xef7f2e8cb41f37c021b236bc3ea9d2c4e6b0fceefdb3c2c646384b7b2fe116a5',
//     receiptsRoot: '0x327f816a10ba5bcc702055d419baa731346131cc2dda49e64b7ba9e5a7fd49bb',
//     sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//     size: '0x21d',
//     stateRoot: '0x4276888e92368eac990a4bbcda938c9c29bd94f85b134b218990d1b137dc234d',
//     timestamp: '0x62a9766c',
//     transactionsRoot: '0x1717925d728173ce122b91199383468dbce68bda5e308d2a16f00725bab7b140',
//     uncles: []
// }
```

### `web3.eth.getTransaction`

-   Returns a bigint instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a bigint instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`
    -   `chainId`

```typescript
// in 1.x
await web3.eth.getTransaction('0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593');
// {
//     accessList: [],
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: 14966017,
//     chainId: '0x1',
//     from: '0x3b7414bE92e87837D6f95D01B8E3c93aC9D20804',
//     gas: 21000,
//     gasPrice: '31200410061',
//     hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     input: '0x',
//     maxFeePerGas: '56156626189',
//     maxPriorityFeePerGas: '1500000000',
//     nonce: 272,
//     r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//     s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//     to: '0x8b664E252B7c5C87c17e73C69F16E56454C9661F',
//     transactionIndex: 80,
//     type: 2,
//     v: '0x1',
//     value: '13066966539051000'
// }

// in 4.x
await web3.eth.getTransaction('0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593');
// {
//   accessList: [],
//   blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//   blockNumber: 14966017n,
//   chainId: 1n,
//   from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//   gas: 21000n,
//   gasPrice: 31200410061n,
//   hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//   input: '0x',
//   maxFeePerGas: 56156626189n,
//   maxPriorityFeePerGas: 1500000000n,
//   nonce: 272n,
//   r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//   s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//   to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//   transactionIndex: 80n,
//   type: 2n,
//   v: 1n,
//   value: 13066966539051000n
// }
```

### `web3.eth.getPendingTransactions`

-   Returns a bigint instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a bigint instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`

```typescript
// in 1.x
await web3.eth.getPendingTransactions();
// [
// {
//     accessList: [],
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: 14966017n,
//     chainId: 1n,
//     from: '0x3b7414bE92e87837D6f95D01B8E3c93aC9D20804',
//     gas: 21000n,
//     gasPrice: '31200410061n',
//     hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     input: '0x',
//     maxFeePerGas: 56156626189n,
//     maxPriorityFeePerGas: 1500000000n,
//     nonce: 272n,
//     r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//     s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//     to: '0x8b664E252B7c5C87c17e73C69F16E56454C9661F',
//     transactionIndex: 80n,
//     type: 2n,
//     v: '0x1',
//     value: 13066966539051000n
// },
// ...]

// in 4.x
await web3.eth.getPendingTransactions();
// [
// {
//     accessList: [],
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: '0xe45d01',
//     chainId: '0x1',
//     from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//     gas: '0x5208',
//     gasPrice: '0x743b079cd',
//     hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     input: '0x',
//     maxFeePerGas: '0xd13321d0d',
//     maxPriorityFeePerGas: '0x59682f00',
//     nonce: '0x110',
//     r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//     s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//     to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//     transactionIndex: '0x50',
//     type: '0x2',
//     v: '0x1',
//     value: '0x2e6c563ada1ff8'
// },
// ...]
```

### `web3.eth.getTransactionFromBlock`

-   Returns a bigint instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a bigint instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`

```typescript
// in 1.x
await web3.eth.getTransactionFromBlock('latest', 1);
// {
//     accessList: [],
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: 14966017,
//     chainId: '0x1',
//     from: '0x3b7414bE92e87837D6f95D01B8E3c93aC9D20804',
//     gas: 21000,
//     gasPrice: '31200410061',
//     hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     input: '0x',
//     maxFeePerGas: '56156626189',
//     maxPriorityFeePerGas: '1500000000',
//     nonce: 272,
//     r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//     s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//     to: '0x8b664E252B7c5C87c17e73C69F16E56454C9661F',
//     transactionIndex: 80,
//     type: 2,
//     v: '0x1',
//     value: '13066966539051000'
// }

// in 4.x
await web3.eth.getTransactionFromBlock('latest', 1);
// {
//     accessList: [],
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: 0xe45d01n,
//     chainId: 1n,
//     from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//     gas: 5208n,
//     gasPrice: 0x743b079cdn,
//     hash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     input: '0x',
//     maxFeePerGas: d13321d0dn,
//     maxPriorityFeePerGas: 59682f00n,
//     nonce: 110n,
//     r: '0xca990b477b7043937d2ead588981464399101c02c0b0c6323acee28427a12f39',
//     s: '0x7c1d2571f7c2fe8bdf74cdecdb719a29e0b76b379c1bae8baf0164ddf7d6b3b8',
//     to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//     transactionIndex: 50n,
//     type: 2n,
//     v: '0x1',
//     value: 2e6c563ada1ff8n
// }
```

### `web3.eth.getTransactionReceipt`

-   Returns a bigint instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a bigint instead of a boolean for the following properties:
    -   `status`

```typescript
// in 1.x
await web3.eth.getTransactionReceipt(
	'0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
);
// {
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: 14966017,
//     contractAddress: null,
//     cumulativeGasUsed: 6992382,
//     effectiveGasPrice: 31200410061,
//     from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//     gasUsed: 21000,
//     logs: [],
//     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     status: true,
//     to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//     transactionHash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     transactionIndex: 80,
//     type: '0x2'
// }

// in 4.x
await web3.eth.getTransactionReceipt(
	'0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
);
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
```

### `web3.eth.getTransactionCount`

returns a bigint instead of a number

```typescript
// in 1.x
await web3.eth.getTransactionCount('0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'); // 0

// in 4.x
await web3.eth.getTransactionCount('0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'); // 0n
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
    -   Returns a bigint instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a bigint instead of a boolean for the following properties:
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
-   `confirmationNumber` is returned as a bigint instead of a number
-   For the returned `receipt` object:
    -   Returns a bigint instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a bigint instead of a boolean for the following properties:
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
    // confirmationNumber would eqaul 1 the first time the event was emitted
    // confirmationNumber would then eqaul 2 the next time
    // and so on until 12 (or whatever transactionConfirmationBlocks is set to) confirmations are found
});

// in 4.x
web3.eth.sendTransaction({ ... }).on('confirmation', (confirmationObject) => {
    // confirmationNumber would eqaul 2 the first time the event was emitted
    // confirmationNumber would then eqaul 3 the next time
    // and so on until 12 (or whatever transactionConfirmationBlocks is set to) confirmations are found
});
```

### `web3.eth.sendSignedTransaction`

-   Returns a bigint instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a bigint instead of a boolean for the following properties:
    -   `status`

```ts
//in 1.x
web3.eth.sendSignedTransaction({...}).then(console.log);
// {
//   blockHash: '0xd2964dacbc71217cb8d58b1f3f7ac03d4abbbbd500e13bd505bbdac8361f6fae',
//   blockNumber: 9,
//   contractAddress: null,
//   cumulativeGasUsed: 21000,
//   effectiveGasPrice: 20000000000,
//   from: '0xd8c375f286c258521564da00ddee3945d1d057c4',
//   gasUsed: 21000,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: true,
//   to: '0x3535353535353535353535353535353535353535',
//   transactionHash: '0x2bd1f369a1f9fba4b12a597761f771c34031f67584ed3c5e28a4c915ef0a1f83',
//   transactionIndex: 0,
//   type: '0x0'
// }

//in 4.x
web34.eth.sendSignedTransaction({...}).then(console.log);
// {
//   blockHash: '0xf433c7285366ae50334048ea2a290acc46db49abe75c5166bf71fe410834f338',
//   blockNumber: 10n,
//   cumulativeGasUsed: 21000n,
//   effectiveGasPrice: 20000000000n,
//   from: '0xd8c375f286c258521564da00ddee3945d1d057c4',
//   gasUsed: 21000n,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: 1n,
//   to: '0x3535353535353535353535353535353535353535',
//   transactionHash: '0x739c5a6593e20bd545c264482a6bb9e7aebc504559e6406a4ed2fde4bf9dad72',
//   transactionIndex: 0n,
//   type: '0x0'
// }
```

### `web3.eth.sign`

The message must be converted to hex first.

```ts
//in 1.x both work
web3.eth.sign('Hello world', '0xd8c375f286c258521564da00ddee3945d1d057c4').then(console.log);
//0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c
web3.eth
	.sign(web3.utils.utf8ToHex('Hello world'), '0xd8c375f286c258521564da00ddee3945d1d057c4')
	.then(console.log);
//0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c

//in 4.x message must converted beforehand
web3.eth
	.sign(web3.utils.utf8ToHex('Hello world'), '0xd8c375f286c258521564da00ddee3945d1d057c4')
	.then(console.log);
//0x7907ca312eb55a54673255dfa4e947d7533dcf746460c82b50e281fe88a6f0d17d602d2205b2d7c137cf7cb9b86a7ea976fd062e39bc08373dffa72f020776e11c
```

### `web3.eth.signTransaction`

-   In 1.x documentation examples, the nonce seems to be optional since it isn't present in the payload, but, it is required. It is required in 4.x, too. In 1.x nonce should be a number, in 4.x it can be number or string or hex string.

-   1.x sets gasPrice (or maxPriorityFeePerGas & maxFeePerGas) to null in EIP-1559 transactions (in not EIP-1559 transactions) in the tx object. In 4.x instead of null, they are not present.

-   In 1.x the hash of the tx is present, in 4.x not.

```ts
//in 1.x
let payload = {
	from: '0xd8c375f286c258521564da00ddee3945d1d057c4',
	nonce: web3.utils.hexToNumber(
		await web3.eth.getTransactionCount('0xd8c375f286c258521564da00ddee3945d1d057c4'),
	),
	gasPrice: '20000000000',
	gas: '21000',
	to: '0x3535353535353535353535353535353535353535',
	value: '1000000000000000000',
	data: '',
};

web3.eth.signTransaction(payload).then(console.log);
// {
//   raw: '0xf86e808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080820a96a0a6dec055b314bd54c4ac294d6f298dbf8e0e4b1581d1bb916ad728ae26b55d80a01eb7b15974101a58acc6d6a976a32f058b6bdbdb2c3c4b9062865264613ef92f',
//   tx: {
//     type: '0x0',
//     nonce: '0x0',
//     gasPrice: '0x4a817c800',
//     maxPriorityFeePerGas: null,
//     maxFeePerGas: null,
//     gas: '0x5208',
//     value: '0xde0b6b3a7640000',
//     input: '0x',
//     v: '0xa96',
//     r: '0xa6dec055b314bd54c4ac294d6f298dbf8e0e4b1581d1bb916ad728ae26b55d80',
//     s: '0x1eb7b15974101a58acc6d6a976a32f058b6bdbdb2c3c4b9062865264613ef92f',
//     to: '0x3535353535353535353535353535353535353535',
//     hash: '0xfa45fc0923d6290ea1d0e597d81ed90d4594d82ef746eafcc36d2e4474e38fd0'
//   }
// }

//in 4.x
let payload = {
	from: '0xd8c375f286c258521564da00ddee3945d1d057c4',
	nonce: await web3.eth.getTransactionCount('0xd8c375f286c258521564da00ddee3945d1d057c4'),
	gasPrice: '20000000000',
	gas: '21000',
	to: '0x3535353535353535353535353535353535353535',
	value: '1000000000000000000',
	data: '',
};

web3.eth.signTransaction(payload).then(console.log);
// raw: '0xf86e808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080820a96a0a6dec055b314bd54c4ac294d6f298dbf8e0e4b1581d1bb916ad728ae26b55d80a01eb7b15974101a58acc6d6a976a32f058b6bdbdb2c3c4b9062865264613ef92f',
//   tx: {
//     type: '0x0',
//     nonce: '0x0',
//     gasPrice: '0x4a817c800',
//     gas: '0x5208',
//     value: '0xde0b6b3a7640000',
//     v: '0xa96',
//     r: '0xa6dec055b314bd54c4ac294d6f298dbf8e0e4b1581d1bb916ad728ae26b55d80',
//     s: '0x1eb7b15974101a58acc6d6a976a32f058b6bdbdb2c3c4b9062865264613ef92f',
//     to: '0x3535353535353535353535353535353535353535',
//     data: '0x'
//   }
// }
```

### `web3.eth.call`

same as in 1.x, returns the returned data of the call

```ts
const transaction = {
	to: '0x99277D0A90F4A214c42B5B5b2c85B5ba2B46c809',
	data: '0xcfae3217',
};

//in 1.x
web3.eth.call(transaction).then(console.log);
// 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000017736f6c79656e7420677265656e2069732070656f706c65000000000000000000

//in 4.x
web3.eth.call(transaction).then(console.log);
// 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000017736f6c79656e7420677265656e2069732070656f706c65000000000000000000
```

### `web3.eth.estimateGas`

returns a bigint instead of a number

```ts
//in 1.x
web3.eth
	.estimateGas({
		to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
		data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003',
	})
	.then(console.log);
//21204

//in 4.x
web3.eth
	.estimateGas({
		to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
		data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003',
	})
	.then(console.log);
//21204n
```

### `web3.eth.getPastLogs`

-   Returns a bigint instead of a number for the following properties:
    -   `logIndex`
    -   `transactionIndex`
    -   `blockNumber`

```ts
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

```ts
web3.eth.getWork().then(console.log);
// [
// 	'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
// 	'0x5EED00000000000000000000000000005EED0000000000000000000000000000',
// 	'0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000',
// ];
```

### `web3.eth.submitWork`

same as in 1.x

```ts
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

```ts
await web3.eth.requestAccounts();
//['0xb839Aa3ECdd24c0Fa2fa382Ca179b88a0b33804f']
```

### `web3.eth.getChainId`

Returns a bigint instead of a number string

```ts
//in 1.x
web3.eth.getChainId().then(console.log);
//1337

//in 4.x
web3.eth.getChainId().then(console.log);
//1337n
```

### `web3.eth.getNodeInfo`

same as in 1.x

```ts
web3.eth.getNodeInfo().then(console.log);
// Geth/v1.10.18-unstable-b3af0a55/linux-arm64/go1.18.1
```

### `web3.eth.getProof`

-   Returns a bigint instead of a number string for the following properties:
    -   `balance`
    -   `nonce`

`balance` and `nonce` in 1.x were described as numbers

```ts
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
