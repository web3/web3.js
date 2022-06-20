# Web3Eth Migration Guide

## Breaking Changes

### Not Implemented or Exported

-   [extend](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#extend) functionality not implemented
-   [web3.eth.createAccessList](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#createaccesslist) not implemented
-   [web3.eth.personal](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#personal) namespace is not exported
-   [web3.eth.net](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#net) namespace is not exported

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` will never return `null`, provider required upon instantiation as opposed to being optional in 1.x //todo maybe this is not true after after the recent discussion/change
-   `web3.eth.defaultAccount` default value is `undefined` instead of `null`
    -   1.x has `undefined` documented as default, but in implementation it's `null`
-   `web3.eth.defaultHardfork` default is `london` instead of `undefined`
    -   1.x has `london` documented as default, but in implementation it's `undefined`
-   `web3.eth.defaultChain` default is `mainnet` instead of `undefined`
    -   1.x has `mainnet` documented as default, but in implementation it's `undefined`

### Web3Eth Methods

### `web3.eth.getHashrate`

renamed to `getHashRate`

### `web3.eth.getGasPrice`

returns a hex string instead of a number string

```typescript
// in 1.x
await web3.eth.getGasPrice(); // '2000000000'

// in 4.x
await web3.eth.getGasPrice(); // '0x77359400'
```

### `web3.eth.getFeeHistory`

returns hex strings for `gasUsedRation` array items instead of a numbers

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

### `web3.eth.getAccounts`

addresses are not returned as checksum

```typescript
// in 1.x
await web3.eth.getAccounts();
// ['0xAB089B30f46883C3598B720d85837080b9929D0B']

// in 4.x
await web3.eth.getAccounts();
// ['0xab089b30f46883c3598b720d85837080b9929d0b']
```

### `web3.eth.getBlockNumber`

returns a hex string instead of a number

```typescript
// in 1.x
await web3.eth.getBlockNumber(); // 0

// in 4.x
await web3.eth.getBlockNumber(); // '0x0'
```

### `web3.eth.getBalance`

returns a hex string instead of a number string

```typescript
// in 1.x
await web3.eth.getBalance('0xAB089B30f46883C3598B720d85837080b9929D0B'); // '115792089237316195423570985008687907853269984665640564039457584007913129639927'

// in 4.x
await web3.eth.getBalance('0xAB089B30f46883C3598B720d85837080b9929D0B'); // '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7'
```

### `web3.eth.getBlock`

-   Returns a hex string instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a hex string instead of a number string for the following properties:
    -   `difficulty`
    -   `totalDifficulty`

```typescript
// in 1.x
await web3.eth.getBlock('latest');
// {
//     baseFeePerGas: 1000000000,
//     difficulty: '1',
//     extraData: '0x0000000000000000000000000000000000000000000000000000000000000000ab089b30f46883c3598b720d85837080b9929d0b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     gasLimit: 11500000,
//     gasUsed: 0,
//     hash: '0x898f2ec817477ef26f0f84e4070840ca9f020fdc2fd4c0375df051da96b93045',
//     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     miner: '0x0000000000000000000000000000000000000000',
//     mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//     nonce: '0x0000000000000000',
//     number: 0,
//     parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//     receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
//     sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//     size: 627,
//     stateRoot: '0xcdbd36dbc4916d258879c5d4fccfc54c6dc0cbd39a6dba5be19e09f4b8e6587d',
//     timestamp: 0,
//     totalDifficulty: '1',
//     transactions: [],
//     transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
//     uncles: []
// }

// in 4.x
await web3.eth.getBlock('latest');
// {
//     baseFeePerGas: '0x3b9aca00',
//     difficulty: '0x1',
//     extraData: '0x0000000000000000000000000000000000000000000000000000000000000000ab089b30f46883c3598b720d85837080b9929d0b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     gasLimit: '0xaf79e0',
//     gasUsed: '0x0',
//     hash: '0x898f2ec817477ef26f0f84e4070840ca9f020fdc2fd4c0375df051da96b93045',
//     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     miner: '0x0000000000000000000000000000000000000000',
//     mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//     nonce: '0x0',
//     number: '0x0',
//     parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//     receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
//     sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
//     size: '0x273',
//     stateRoot: '0xcdbd36dbc4916d258879c5d4fccfc54c6dc0cbd39a6dba5be19e09f4b8e6587d',
//     timestamp: '0x0',
//     totalDifficulty: '0x1',
//     transactions: [],
//     transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
//     uncles: []
// }
```

### `web3.eth.getBlockTransactionCount`

returns a hex string instead of a number

```typescript
// in 1.x
await web3.eth.getBlockTransactionCount('latest'); // 0

// in 4.x
await web3.eth.getBlockTransactionCount('latest'); // '0x0'
```

### `web3.eth.getBlockUncleCount`

returns a hex string instead of a number

```typescript
// in 1.x
await web3.eth.getBlockUncleCount('latest'); // 0

// in 4.x
await web3.eth.getBlockUncleCount('latest'); // '0x0'
```

### `web3.eth.getUncle`

-   Returns a hex string instead of a number for the following properties:
    -   `baseFeePerGas`
    -   `gasLimit`
    -   `gasUsed`
    -   `number`
    -   `size`
    -   `timestamp`
-   Returns a hex string instead of a number string for the following properties:
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

-   Returns a hex string instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a hex string instead of a number string for the following properties:
    -   `gasPrice`
    -   `maxFeePerGas`
    -   `maxPriorityFeePerGas`
    -   `value`

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
// }
```

### `web3.eth.getPendingTransactions`

-   Returns a hex string instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a hex string instead of a number string for the following properties:
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

-   Returns a hex string instead of a number for the following properties:
    -   `blockNumber`
    -   `gas`
    -   `nonce`
    -   `transactionIndex`
    -   `type`
-   Returns a hex string instead of a number string for the following properties:
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
// }
```

### `web3.eth.getTransactionReceipt`

-   Returns a hex string instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a hex string instead of a boolean for the following properties:
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
//     blockHash: '0x55ff0699736027fd0eddf90e890294ba6765ecf699cefd2f6c255a2fdae06a5a',
//     blockNumber: '0xe45d01',
//     cumulativeGasUsed: '0x6ab1fe',
//     effectiveGasPrice: '0x743b079cd',
//     from: '0x3b7414be92e87837d6f95d01b8e3c93ac9d20804',
//     gasUsed: '0x5208',
//     logs: [],
//     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     status: '0x1',
//     to: '0x8b664e252b7c5c87c17e73c69f16e56454c9661f',
//     transactionHash: '0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593',
//     transactionIndex: '0x50',
//     type: '0x2'
// }
```

### `web3.eth.getTransactionCount`

returns a hex string instead of a number

```typescript
// in 1.x
await web3.eth.getTransactionCount('0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'); // 0

// in 4.x
await web3.eth.getTransactionCount('0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'); // '0x0'
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
    -   Returns a hex string instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a hex string instead of a boolean for the following properties:
        -   `status`

```typescript
// in 1.x
web3.eth.sendTransaction({ ... }).on('receipt', (receipt) => { ... });
// receipt would be:
// {
//   transactionHash: '0x4f0f428ae3c2f0ec5e054491ecf01a0c38b92ef128350d4831c07ef52f5d4a15',
//   transactionIndex: 0,
//   blockNumber: 14,
//   blockHash: '0x5bb7c47a0fcb8d53fc2d1524873631340c1855c7b98d657de614d4d0554596f8',
//   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//   to: '0x0000000000000000000000000000000000000000',
//   cumulativeGasUsed: 21000,
//   gasUsed: 21000,
//   contractAddress: null,
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: true,
//   effectiveGasPrice: 2654611504,
//   type: '0x2'
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
-   `confirmationNumber` is returned as a hex string instead of a number
-   For the returned `receipt` object:
    -   Returns a hex string instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a hex string instead of a boolean for the following properties:
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
//     confirmationNumber: '0x2',
//     receipt: {
//         transactionHash: '0xd93fe25c2066cd8f15565bcff693507a3c70f5fb9387db57f939ae91f4080c6c',
//         transactionIndex: '0x0',
//         blockNumber: '0x5',
//         blockHash: '0xe1775977a8041cb2709136804e4be609135f8367b49d38960f92a95b4c02189a',
//         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
//         to: '0x0000000000000000000000000000000000000000',
//         cumulativeGasUsed: '0x5208',
//         gasUsed: '0x5208',
//         logs: [],
//         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//         status: '0x1',
//         effectiveGasPrice: '0x77359400',
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

-   Returns a hex string instead of a number for the following properties:
    -   `blockNumber`
    -   `cumulativeGasUsed`
    -   `effectiveGasPrice`
    -   `gasUsed`
    -   `transactionIndex`
-   Returns a hex string instead of a boolean for the following properties:
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
//   blockNumber: '0xa',
//   cumulativeGasUsed: '0x5208',
//   effectiveGasPrice: '0x4a817c800',
//   from: '0xd8c375f286c258521564da00ddee3945d1d057c4',
//   gasUsed: '0x5208',
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   status: '0x1',
//   to: '0x3535353535353535353535353535353535353535',
//   transactionHash: '0x739c5a6593e20bd545c264482a6bb9e7aebc504559e6406a4ed2fde4bf9dad72',
//   transactionIndex: '0x0',
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

returns a hex string instead of a number

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
// 0x52d4;
```

### `web3.eth.getPastLogs`
