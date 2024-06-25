---
sidebar_position: 6
sidebar_label: 'Web3 Config Guide'
---

# Web3.js Config Guide

## Configuration parameters

There is list of configuration params that can be set for modifying behavior of different functions in web3.js packages. Following is list of configuration options with details:

- [handleRevert](/api/web3-core/class/Web3Config#handleRevert) 
- [defaultAccount](/api/web3-core/class/Web3Config#defaultAccount)
- [defaultBlock](/api/web3-core/class/Web3Config#defaultBlock) 
- [transactionBlockTimeout](/api/web3-core/class/Web3Config#transactionBlockTimeout)  
- [transactionConfirmationBlocks](/api/web3-core/class/Web3Config#transactionConfirmationBlocks)  
- [transactionPollingInterval](/api/web3-core/class/Web3Config#transactionPollingInterval)  
- [transactionPollingTimeout](/api/web3-core/class/Web3Config#transactionPollingTimeout)  
- [transactionReceiptPollingInterval](/api/web3-core/class/Web3Config#transactionReceiptPollingInterval)  
- [transactionSendTimeout](/api/web3-core/class/Web3Config#transactionSendTimeout)  
- [transactionConfirmationPollingInterval](/api/web3-core/class/Web3Config#transactionConfirmationPollingInterval)  
- [blockHeaderTimeout](/api/web3-core/class/Web3Config#blockHeaderTimeout)
- [maxListenersWarningThreshold](/api/web3-core/class/Web3Config#maxListenersWarningThreshold)  
- [contractDataInputFill](/api/web3-core/class/Web3Config#contractDataInputFill)
- [defaultNetworkId](/api/web3-core/class/Web3Config#defaultNetworkId)  
- [defaultChain](/api/web3-core/class/Web3Config#defaultChain)  
- [defaultHardfork](/api/web3-core/class/Web3Config#defaultHardfork)  
- [defaultCommon](/api/web3-core/class/Web3Config#defaultCommon)  
- [defaultTransactionType](/api/web3-core/class/Web3Config#defaultTransactionType)  
- [defaultReturnFormat](/api/web3-core/class/Web3Config#defaultReturnFormat)  

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

### handleRevert
When `handleRevert` is set to True, the following methods will retrieve specific error types and error messages:
```ts
- web3.eth.sendTransaction()
- web3.eth.call()
- myContract.methods.myMethod().call()
- myContract.methods.myMethod().send()
```

The error types will be one of the following:
```ts
- InvalidResponseError
- ContractExecutionError
- TransactionRevertWithCustomError
- TransactionRevertedWithoutReasonError
- TransactionRevertInstructionError
- TransactionPollingTimeoutError
```

For example, the error message could be `TransactionRevertInstructionError('Returned error: invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field TransactionArgs.data of type hexutil.Bytes')`. The default value is `false`, and handleRevert is only supported for `sendTransaction` and not for `sendSignedTransaction` at this time.

```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.handleRevert = true;

console.log(web3.getContextObject().config)
```
:::info
The `handleRevert` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.handleRevert = true;

console.log(web3.eth.getContextObject().config)
```
:::

### defaultAccount
This `defaultAccount` is used as the default `from` property, if no `from` property is specified in for the following methods:
```ts
- web3.eth.sendTransaction()
- web3.eth.call()
- myContract.methods.myMethod().call()
- myContract.methods.myMethod().send()
```

The default value for `defaultAccount` is `undefined`. It is worth noting that the `defaultAccount` here can be any string, as there is no validation during the config phase.

```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultAccount = "0x0000000000000000000000000000000000000000";

console.log(web3.getContextObject().config)
```
:::info
The `defaultAccount` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultAccount = "0x0000000000000000000000000000000000000000";

console.log(web3.eth.getContextObject().config)
```
:::

### defaultBlock
The following methods require a `blockNumber` parameter during its execution process, the `defaultBlock` is used for these methods. 
```ts
- web3.eth.getBalance()
- web3.eth.getCode()
- web3.eth.getTransactionCount()
- web3.eth.getStorageAt()
- web3.eth.call()
- myContract.methods.myMethod().call()
```

You can override it by passing in the defaultBlock as last parameter. The default value is "latest".

```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultBlock = 20167235;

console.log(web3.getContextObject().config)
```
:::info
The `defaultBlock` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultBlock = "earliest";

console.log(web3.eth.getContextObject().config)
```
:::

#### All available choices for defaultBlock:
```ts
web3.defaultBlock = 20167235; // A block number
web3.defaultBlock = "earliest"; // The genesis block
web3.defaultBlock = "latest"; // The latest block (current head of the blockchain)
web3.defaultBlock = "pending"; // The currently mined block (including pending transactions)
web3.defaultBlock = "finalized"; // (For POS networks) The finalized block is one which has been accepted as canonical by greater than 2/3 of validators
web3.defaultBlock = "safe"; // (For POS networks) The safe head block is one which under normal network conditions, is expected to be included in the canonical chain. Under normal network conditions the safe head and the actual tip of the chain will be equivalent (with safe head trailing only by a few seconds). Safe heads will be less likely to be reorged than the proof of work network`s latest blocks.
```

### transactionBlockTimeout
The `transactionBlockTimeout` is used over socket-based connections. This option defines the amount of new blocks it should wait until the **first confirmation** happens, otherwise the PromiEvent rejects with a timeout error. The default value is 50. 

```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionBlockTimeout = 60;

console.log(web3.getContextObject().config)
```
:::info
The `transactionBlockTimeout` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionBlockTimeout = 60;

console.log(web3.eth.getContextObject().config)
```
:::

### transactionConfirmationBlocks
This defines the number of blocks it requires until a transaction is considered confirmed. Different chains have varying security considerations and requirements for confirmation block numbers. The default value is 24.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionConfirmationBlocks = 60;

console.log(web3.getContextObject().config)
```
:::info
The `transactionConfirmationBlocks` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionConfirmationBlocks = 60;

console.log(web3.eth.getContextObject().config)
```
:::


### transactionPollingInterval
The `transactionPollingInterval` is used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network. Modifying this value can reduce the wait time for confirmations or decrease the number of network requests. Default is 1000 ms.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionPollingInterval = 2000; // 2000 ms = 2 s

console.log(web3.getContextObject().config)
```
:::info
The `transactionPollingInterval` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionPollingInterval = 2000; // 2000 ms = 2 s

console.log(web3.eth.getContextObject().config)
```
:::

### defaultReturnFormat
The `defaultReturnFormat` allows users to specify the format in which certain types of data should be returned by default. It is a configuration parameter that can be set at the global level and affects how data is returned across the entire library.
```ts
import { Web3, FMT_NUMBER, FMT_BYTES } from 'web3';

web3.defaultReturnFormat = {
    number: FMT_NUMBER.BIGINT,
    bytes: FMT_BYTES.HEX,
};

```
:::info
The `defaultReturnFormat` can be configured both globally and at the package level:
```ts
import { Web3Eth, FMT_NUMBER, FMT_BYTES } from 'web3-eth';

const eth = new Web3Eth()
eth.defaultReturnFormat = {
    number: FMT_NUMBER.BIGINT,
    bytes: FMT_BYTES.HEX,
};

```
:::
#### All available choices for numeric data:
```ts 
export enum FMT_NUMBER {
    NUMBER = 'NUMBER_NUMBER',
    HEX = 'NUMBER_HEX',
    STR = 'NUMBER_STR',
    BIGINT = 'NUMBER_BIGINT',
}
```
#### All available choices for bytes data:     
```ts
export enum FMT_BYTES {
    HEX = 'BYTES_HEX',
    UINT8ARRAY = 'BYTES_UINT8ARRAY',
}
```
