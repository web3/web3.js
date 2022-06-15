# Web3Eth Migration Guide

## Breaking Changes

### Not Implemented or Exported

-   `extend` functionality not implemented
-   `web3.eth.createAccessList` not implemented
-   `web3.eth.personal` namespace is not exported
-   `web3.eth.net` namespace is not exported

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` will never return `null`, provider required upon instantiation as opposed to being optional in 1.x
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

- Returns a hex string instead of a number for the following properties:
    - `baseFeePerGas`
    - `gasLimit`
    - `gasUsed`
    - `number`
    - `size`
    - `timestamp`
- Returns a hex string instead of a number string for the following properties:
    - `difficulty`
    - `totalDifficulty`

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

- Returns a hex string instead of a number for the following properties:
    - `baseFeePerGas`
    - `gasLimit`
    - `gasUsed`
    - `number`
    - `size`
    - `timestamp`
- Returns a hex string instead of a number string for the following properties:
    - `difficulty`

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

- Returns a hex string instead of a number for the following properties:
    - `blockNumber`
    - `gas`
    - `nonce`
    - `transactionIndex`
    - `type`
- Returns a hex string instead of a number string for the following properties:
    - `gasPrice`
    - `maxFeePerGas`
    - `maxPriorityFeePerGas`
    - `value`

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

- Returns a hex string instead of a number for the following properties:
    - `blockNumber`
    - `gas`
    - `nonce`
    - `transactionIndex`
    - `type`
- Returns a hex string instead of a number string for the following properties:
    - `gasPrice`
    - `maxFeePerGas`
    - `maxPriorityFeePerGas`
    - `value`

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

- Returns a hex string instead of a number for the following properties:
    - `blockNumber`
    - `gas`
    - `nonce`
    - `transactionIndex`
    - `type`
- Returns a hex string instead of a number string for the following properties:
    - `gasPrice`
    - `maxFeePerGas`
    - `maxPriorityFeePerGas`
    - `value`

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

- Returns a hex string instead of a number for the following properties:
    - `blockNumber`
    - `cumulativeGasUsed`
    - `effectiveGasPrice`
    - `gasUsed`
    - `transactionIndex`
- Returns a hex string instead of a boolean for the following properties:
    - `status`

```typescript
// in 1.x
await web3.eth.getTransactionReceipt('0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593');
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
await web3.eth.getTransactionReceipt('0x219f94fa188e6a0927c3c659537b5c76f4a750b948e7a73c80b28786227aa593');
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
