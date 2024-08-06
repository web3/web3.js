---
sidebar_position: 6
sidebar_label: 'Web3 Config Guide'
---

# Web3.js Config Guide

## Configuration parameters

There is list of configuration params that can be set for modifying behavior of different functions in web3.js packages. Following is list of configuration options with details:

- [handleRevert](/guides/web3_config/#handlerevert)
- [defaultAccount](/guides/web3_config/#defaultaccount)
- [defaultBlock](/guides/web3_config/#defaultblock)
- [transactionBlockTimeout](/guides/web3_config/#transactionblocktimeout)  
- [transactionConfirmationBlocks](/guides/web3_config/#transactionconfirmationblocks)  
- [transactionPollingInterval](/guides/web3_config/#transactionpollinginterval)  
- [transactionPollingTimeout](/guides/web3_config/#transactionpollingtimeout)  
- [transactionReceiptPollingInterval](/guides/web3_config/#transactionreceiptpollinginterval)  
- [transactionSendTimeout](/guides/web3_config/#transactionsendtimeout)  
- [[Deprecated] transactionConfirmationPollingInterval](/guides/web3_config/#transactionconfirmationpollinginterval)
- [blockHeaderTimeout](/guides/web3_config/#blockheadertimeout)
- [maxListenersWarningThreshold](/guides/web3_config/#maxlistenerswarningthreshold)  
- [contractDataInputFill](/guides/web3_config/#contractdatainputfill)
- [defaultNetworkId](/guides/web3_config/#defaultnetworkid)  
- [defaultChain](/guides/web3_config/#defaultchain)  
- [defaultHardfork](/guides/web3_config/#defaulthardfork)  
- [defaultCommon](/guides/web3_config/#defaultcommon)  
- [defaultTransactionType](/guides/web3_config/#defaulttransactiontype)
- [defaultMaxPriorityFeePerGas](/guides/web3_config/#defaultmaxpriorityfeepergas)
- [defaultReturnFormat](/guides/web3_config/#defaultreturnformat)  

## Global level Config

There is option of modifying any of above-mentioned configuration parameter at global level when instantiating Web3, and it will be available to all packages. 

``` ts
import { Web3 } from 'web3';

const web3 = new Web3({
  provider: 'https://mainnet.infura.io/v3/YOURID',
  config: {
    defaultTransactionType: '0x0',
  },
});

//now default transaction type will be 0x0 so using following function in eth will send type 0x0 transaction

web3.eth
  .sendTransaction({
    from: '0x18532dF2Ab835d4E9D07a8b9B759bf5F8f890f49',
    to: '0xB2f70d8965e754cc07D343a9b5332876D3070155',
    value: 100,
    gasLimit: 21000,
  })
  .then((res) => console.log(res));
```

For Advance Users: Global level config can also be set using `Web3Context` object.

``` ts
import { Web3, Web3Context } from 'web3';

const context = new Web3Context('http://127.0.0.1:7545');
context.setConfig({ defaultTransactionType: '0x0' });

const web3 = new Web3(context);

//it will not default to 0x0 type transactions
web3.eth.sendTransaction({
    from: '0x18532dF2Ab835d4E9D07a8b9B759bf5F8f890f49',
    to: '0x018e221145dE7cefAD09BD53F41c11A918Bf1Cb7',
    value: 100,
    gasLimit: 21000
}).then(res => console.log(res));
```

## Package level config

### Setting config in Individual Package under Web3 instance
Some configuration options that effects selected packages can be modified using `setConfig(...)` function.

``` ts
import { Web3 } from 'web3';

const web3 = new Web3('https://mainnet.infura.io/v3/YOURID');

web3.eth.setConfig({ defaultTransactionType: '0x0'});

web3.eth
  .sendTransaction({
    from: '0x18532dF2Ab835d4E9D07a8b9B759bf5F8f890f49',
    to: '0xB2f70d8965e754cc07D343a9b5332876D3070155',
    value: 100,
    gasLimit: 21000,
  })
  .then((res) => console.log(res));
```

### Setting config in Individually imported Packages

If an individual package is being imported instead of whole web3.js, there is option of setting config params by passing config in constructors or by using `setConfig(...)` function:

For example if only web3Eth package is installed using:

```sh
npm i web3-eth
```

Configuration options can be set by passing in constructor:

```ts title='setConfig in the constructor'
import { Web3Eth } from 'web3-eth';

const web3EthObj = new Web3Eth({
  provider: 'http://127.0.0.1:7545',
  config: {
    defaultTransactionType: 0x0,
  },
});

web3EthObj
  .sendTransaction({
    from: '0x18532dF2Ab835d4E9D07a8b9B759bf5F8f890f49',
    to: '0x018e221145dE7cefAD09BD53F41c11A918Bf1Cb7',
    value: 100,
    gasLimit: 21000,
  })
  .then((res) => console.log(res));
```

Another way of setting config for individually imported package is by using `setConfig(...)` function.

```ts title='setConfig function'
import { Web3Eth } from 'web3-eth';

const web3EthObj = new Web3Eth('http://127.0.0.1:7545');

web3EthObj.setConfig({ defaultTransactionType: 0x0 });

web3EthObj
  .sendTransaction({
    from: '0x18532dF2Ab835d4E9D07a8b9B759bf5F8f890f49',
    to: '0x018e221145dE7cefAD09BD53F41c11A918Bf1Cb7',
    value: 100,
    gasLimit: 21000,
  })
  .then((res) => console.log(res));
```

## Getting Current Config

For getting list of current config params `getContextObject().config` can be used as :

``` ts title='getContextObject() in Web3 object'
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

console.log(web3.getContextObject().config)
/* ↳
  handleRevert: false,
  defaultAccount: undefined,
  defaultBlock: 'latest',
  transactionBlockTimeout: 50,
  transactionConfirmationBlocks: 24,
  transactionPollingInterval: 1000,
  transactionPollingTimeout: 750000,
  transactionReceiptPollingInterval: undefined,
  transactionSendTimeout: 750000,
  transactionConfirmationPollingInterval: undefined,
  blockHeaderTimeout: 10,
  maxListenersWarningThreshold: 100,
  contractDataInputFill: 'input',
  defaultNetworkId: undefined,
  defaultChain: 'mainnet',
  defaultHardfork: 'london',
  defaultCommon: undefined,
  defaultTransactionType: '0x2',
  defaultMaxPriorityFeePerGas: '0x9502f900',
 ...
*/
```

For individually imported packages same approach can be used to get current config params.

```ts title='getContextObject() in an imported package'
import { Web3Eth } from 'web3';

const web3 = new Web3Eth('http://127.0.0.1:7545');

console.log(web3.getContextObject().config)
/* ↳
  handleRevert: false,
  defaultAccount: undefined,
  defaultBlock: 'latest',
  transactionBlockTimeout: 50,
  transactionConfirmationBlocks: 24,
  transactionPollingInterval: 1000,
  transactionPollingTimeout: 750000,
  ...
*/
```

## Explanation of Configuration Parameters

### [handleRevert](/api/web3-core/class/Web3Config#handleRevert)
The following methods will retrieve specific error types and error messages when `handleRevert` is set to `true`:
- [`web3.eth.sendTransaction()`](/api/web3-eth/function/sendTransaction);
- [`myContract.methods.myMethod().send()`](/libdocs/Contract#send);

The error type will be one of the following:
- [InvalidResponseError](/api/web3-errors/class/InvalidResponseError)
- [ContractExecutionError](/api/web3-errors/class/ContractExecutionError)
- [TransactionRevertWithCustomError](/api/web3-errors/class/TransactionRevertWithCustomError)
- [TransactionRevertedWithoutReasonError](/api/web3-errors/class/TransactionRevertedWithoutReasonError)
- [TransactionRevertInstructionError](/api/web3-errors/class/TransactionRevertInstructionError)
- [TransactionPollingTimeoutError](/api/web3-errors/class/TransactionPollingTimeoutError)

For example, the error message could be `TransactionRevertInstructionError('Returned error: invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field TransactionArgs.data of type hexutil.Bytes')`. The `handleRevert` option is only supported for [`sendTransaction`](/api/web3-eth/function/sendTransaction) and not for [`sendSignedTransaction`](/api/web3-eth/function/sendSignedTransaction) for now.

The default value of `handleRevert` is `false`.

### [defaultAccount](/api/web3-core/class/Web3Config#defaultAccount)
The `defaultAccount` option is used as the default `from` property, if no `from` property is specified for the following methods:
- [`web3.eth.sendTransaction()`](/api/web3-eth/function/sendTransaction);
- [`web3.eth.call()`](/api/web3-eth/function/call);
- [`myContract.methods.myMethod().call()`](/libdocs/Contract#call);
- [`myContract.methods.myMethod().send()`](/libdocs/Contract#send);

The default value of `defaultAccount` is `undefined`.

### [defaultBlock](/api/web3-core/class/Web3Config#defaultBlock)
The following methods accept an optional `blockNumber` parameter, the `defaultBlock` option is used for these methods if no `blockNumber` parameter is provided. 
- [`web3.eth.getBalance()`](/api/web3-eth/function/getBalance);
- [`web3.eth.getCode()`](/api/web3-eth/function/getCode);
- [`web3.eth.getTransactionCount()`](/api/web3-eth/function/getTransactionCount);
- [`web3.eth.getStorageAt()`](/api/web3-eth/function/getStorageAt);
- [`web3.eth.call()`](/api/web3-eth/function/call);
- [`myContract.methods.myMethod().call()`](/libdocs/Contract#call);

If a `blockNumber` parameter is provided to one of the above function calls, it will override this option.

The default value of `defaultBlock` is "latest".

#### All available choices for defaultBlock:
```ts
web3.defaultBlock = 20167235; // A block number
web3.defaultBlock = "earliest"; // The genesis block
web3.defaultBlock = "latest"; // The latest block (current head of the blockchain)
web3.defaultBlock = "pending"; // The block pending to be mined (including pending transactions)
web3.defaultBlock = "finalized"; // (For POS networks) The finalized block is one which has been accepted as canonical by greater than 2/3 of validators
web3.defaultBlock = "safe"; // (For POS networks) The safe head block is one which under normal network conditions, is expected to be included in the canonical chain. Under normal network conditions the safe head and the actual tip of the chain will be equivalent (with safe head trailing only by a few seconds). Safe heads will be less likely to be reorged than the proof of work network`s latest blocks.
```

### [transactionBlockTimeout](/api/web3-core/class/Web3Config#transactionBlockTimeout)
 This option defines the number of new blocks to wait for the **first confirmation**, otherwise the [`PromiEvent`](/api/web3/class/Web3PromiEvent) rejects with a timeout error.

The default value of `transactionBlockTimeout` is 50. 

### [transactionConfirmationBlocks](/api/web3-core/class/Web3Config#transactionConfirmationBlocks)
This defines the number of blocks required for a transaction to be considered confirmed. Different chains have varying security considerations and requirements for confirmation block numbers.

The default value of `transactionConfirmationBlocks` is 24.

### [transactionPollingInterval](/api/web3-core/class/Web3Config#transactionPollingInterval)
This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network. Modifying this value can reduce the wait time for confirmations or decrease the number of network requests. Setting the `transactionPollingInterval` would also set [`transactionReceiptPollingInterval`](/guides/web3_config/#transactionreceiptpollinginterval) and [`transactionConfirmationPollingInterval`](/guides/web3_config/#transactionconfirmationpollinginterval) to the same value.

The default value of `transactionPollingInterval` is 1000 ms.

```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionPollingInterval = 1000; // 1000 ms = 1 s

console.log(web3.getContextObject().config);
/* ↳
  ...
  transactionPollingInterval: 1000,
  transactionPollingTimeout: 750000,
  transactionReceiptPollingInterval: 1000,
  transactionSendTimeout: 750000,
  transactionConfirmationPollingInterval: 1000,
  ...
*/
```

### [transactionPollingTimeout](/api/web3-core/class/Web3Config#transactionPollingTimeout)
This option defines the number of seconds Web3 will wait for a receipt which confirms that a transaction was mined by the network. It can be set based on the average transaction confirmation time on the network. Note: If the `transactionPollingTimeout` is exceeded, the transaction may still be pending.

The default value of `transactionPollingTimeout` is 750 seconds (12.5 minutes).

### [transactionReceiptPollingInterval](/api/web3-core/class/Web3Config#transactionReceiptPollingInterval)
This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network. Compared to [`transactionPollingInterval`](/guides/web3_config/#transactionpollinginterval), it takes higher precedence. When this value is set, it will be read first.

The default value of `transactionReceiptPollingInterval` is `undefined`.

### [transactionSendTimeout](/api/web3-core/class/Web3Config#transactionSendTimeout)
The `transactionSendTimeout` option is used to specify how long to wait for the network to return the sent transaction result. Note: If the RPC call times out, the transaction may still be pending or even mined by the network. It is recommended that the pending transactions be checked in such a case.

The default value of `transactionSendTimeout` is 750 seconds (12.5 minutes).

### [transactionConfirmationPollingInterval](/api/web3-core/class/Web3Config#transactionConfirmationPollingInterval)
The `transactionConfirmationPollingInterval` option is deprecated. Please use [`transactionReceiptPollingInterval`](/guides/web3_config/#transactionreceiptpollinginterval) or [`transactionPollingInterval`](/guides/web3_config/#transactionpollinginterval) instead.

### [blockHeaderTimeout](/api/web3-core/class/Web3Config#blockHeaderTimeout)
After sending a transaction, Web3 will listen for the appearance of new blocks and proceed with subsequent operations based on the transaction results within them. This option defines the number of seconds Web3 should wait for the appearance of new blocks before reverting to polling to fetch the transaction receipt.

The default value of `blockHeaderTimeout` is 10 seconds.

### [maxListenersWarningThreshold](/api/web3-core/class/Web3Config#maxListenersWarningThreshold)
The `maxListenersWarningThreshold` is used to set the `maxListeners` property in [`EventEmitter`](/api/web3-utils/class/EventEmitter).

The default value of `maxListenersWarningThreshold` is 100.

### [contractDataInputFill](/api/web3-core/class/Web3Config#contractDataInputFill)
The `contractDataInputFill` option allows users to specify whether the [`data`](/api/web3/namespace/types#data) or [`input`](/api/web3/namespace/types#input) property (or both properties) should be set to the hash of the method signature and encoded parameters. This will affect the contracts [`send`](/libdocs/Contract#send), [`call`](/libdocs/Contract#call) and [`estimateGas`](/libdocs/Contract#estimategas) methods.

The default value of `contractDataInputFill` is `data`.

#### All available choices for contractDataInputFill:
```ts
'data'
'input'
'both'
```

### [defaultNetworkId](/api/web3-core/class/Web3Config#defaultNetworkId)
Each network has its own [network ID](https://docs.goquorum.consensys.io/concepts/network-and-chain-id). The `defaultNetworkId` option allows users to set the default network ID. If this option is not set, Web3 will fetch the network ID with an RPC request.

The default value of `defaultNetworkId` is `undefined`.

### [defaultChain](/api/web3-core/class/Web3Config#defaultChain)
The `defaultChain` option is used to set the [`Common`](/api/web3-eth-contract/class/Contract#defaultCommon) `baseChain` property. The value of this option should be consistent with [`defaultCommon.baseChain`](/guides/web3_config/#defaultcommon) if both options are set.

The default value of `defaultChain` is `mainnet`.

#### All available choices for defaultChain:
```ts
'goerli'
'kovan'
'mainnet'
'rinkeby'
'ropsten'
'sepolia'
```

### [defaultHardfork](/api/web3-core/class/Web3Config#defaultHardfork)
The `defaultHardfork` option is used to set the [`Common`](/api/web3-eth-contract/class/Contract#defaultCommon) `hardfork` property. The value of this option should be consistent with [`defaultCommon.hardfork`](/guides/web3_config/#defaultcommon) if both options are set.

The default value of `defaultHardfork` is `london`.

#### All available choices for defaultHardFork:
```ts
'chainstart'
'frontier'
'homestead'
'dao'
'tangerineWhistle'
'spuriousDragon'
'byzantium'
'constantinople'
'petersburg'
'istanbul'
'muirGlacier'
'berlin'
'london'
'altair'
'arrowGlacier'
'grayGlacier'
'bellatrix'
'merge'
'capella'
'sharding'
```

### [defaultCommon](/api/web3-core/class/Web3Config#defaultCommon)
The `defaultCommon` option is used to set the [`defaultCommon`](/libdocs/Contract#defaultcommon) value for smart contract transactions. It should be consistent with the [`defaultHardfork`](/guides/web3_config/#defaulthardfork) and [`defaultChain`](/guides/web3_config/#defaultchain) options if they are set.

The default value of `defaultCommon` is `undefined`.

```ts
import { Web3, Hardfork } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultHardfork = 'berlin'
web3.defaultChain = 'goerli'

web3.defaultCommon = {
    baseChain: 'goerli',
    hardfork: 'berlin' as Hardfork,
    customChain: {
        networkId: 1,
        chainId: 1,
    },
};

console.log(web3.getContextObject().config);
```

### [defaultTransactionType](/api/web3-core/class/Web3Config#defaultTransactionType)
The `defaultTransactionType` option is used to set the transaction type. Transactions with type 0x0 are legacy transactions that use the transaction format that existed before [typed transactions](https://ethereum.org/en/developers/docs/transactions/#typed-transaction-envelope) were introduced in [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718). Transactions with type 0x1 are transactions introduced in [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930). Transactions with type 0x2 are transactions introduced in [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), included in Ethereum's London fork.

The default value of `defaultTransactionType` is `0x02`.

### [defaultMaxPriorityFeePerGas](/api/web3-core/class/Web3Config#defaultMaxPriorityFeePerGas)
The `defaultMaxPriorityFeePerGas` option is used to set the [`defaultMaxPriorityFeePerGas`](/api/web3-eth-contract/class/Contract#defaultMaxPriorityFeePerGas) value for [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) smart contract transactions ([transaction type](#defaulttransactiontype) 0x2).

The default value of `defaultMaxPriorityFeePerGas` is 2500000000 (2.5gwei) in hexstring format.

### [defaultReturnFormat](/api/web3-core/class/Web3Config#defaultReturnFormat)
The `defaultReturnFormat` option allows users to specify the format in which certain types of data should be returned by default. It is a configuration parameter that can be set at the global level and affects how data is returned across the entire library.
```ts
import { Web3, FMT_NUMBER, FMT_BYTES } from 'web3';

web3.defaultReturnFormat = {
    number: FMT_NUMBER.BIGINT,
    bytes: FMT_BYTES.HEX,
};

```

#### All available choices for numeric data:
```ts 
export enum FMT_NUMBER {
    NUMBER = 'NUMBER_NUMBER',
    HEX = 'NUMBER_HEX',
    STR = 'NUMBER_STR',
    BIGINT = 'NUMBER_BIGINT',
};
```
#### All available choices for bytes data:     
```ts
export enum FMT_BYTES {
    HEX = 'BYTES_HEX',
    UINT8ARRAY = 'BYTES_UINT8ARRAY',
};
```
