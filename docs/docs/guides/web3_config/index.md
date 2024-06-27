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
- [Deprecated][transactionConfirmationPollingInterval](/api/web3-core/class/Web3Config#transactionConfirmationPollingInterval)
- [blockHeaderTimeout](/api/web3-core/class/Web3Config#blockHeaderTimeout)
- [maxListenersWarningThreshold](/api/web3-core/class/Web3Config#maxListenersWarningThreshold)  
- [contractDataInputFill](/api/web3-core/class/Web3Config#contractDataInputFill)
- [defaultNetworkId](/api/web3-core/class/Web3Config#defaultNetworkId)  
- [defaultChain](/api/web3-core/class/Web3Config#defaultChain)  
- [defaultHardfork](/api/web3-core/class/Web3Config#defaultHardfork)  
- [defaultCommon](/api/web3-core/class/Web3Config#defaultCommon)  
- [defaultTransactionType](/api/web3-core/class/Web3Config#defaultTransactionType)
- [defaultMaxPriorityFeePerGas](/api/web3-core/class/Web3Config#defaultMaxPriorityFeePerGas)
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

For example, the error message could be `TransactionRevertInstructionError('Returned error: invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field TransactionArgs.data of type hexutil.Bytes')`. The default value is `false`, and handleRevert is only supported for `sendTransaction` and not for `sendSignedTransaction` for now.

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

The default value for `defaultAccount` is `undefined`.

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
The `transactionPollingInterval` is used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network. Modifying this value can reduce the wait time for confirmations or decrease the number of network requests. Setting the `transactionPollingInterval` would also set `transactionReceiptPollingInterval` and `transactionConfirmationPollingInterval` to the same value. Default is 1000 ms.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionPollingInterval = 2000; // 2000 ms = 2 s

console.log(web3.getContextObject().config)
/* ↳
  ...
  transactionPollingInterval: 2000,
  transactionPollingTimeout: 750000,
  transactionReceiptPollingInterval: 2000,
  transactionSendTimeout: 750000,
  transactionConfirmationPollingInterval: 2000,
  ...
*/
```
:::info
The `transactionPollingInterval` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionPollingInterval = 2000; // 2000 ms = 2 s

console.log(web3.eth.getContextObject().config)
/* ↳
  ...
  transactionPollingInterval: 2000,
  transactionPollingTimeout: 750000,
  transactionReceiptPollingInterval: 2000,
  transactionSendTimeout: 750000,
  transactionConfirmationPollingInterval: 2000,
  ...
*/
```
:::

### transactionPollingTimeout
The `transactionPollingTimeout` is used over HTTP connections. This option defines the number of seconds Web3 will wait for a receipt which confirms that a transaction was mined by the network. It can be set based on the average transaction confirmation time on the network. Note: If this method times out, the transaction may still be pending. Default is 750 seconds (12.5 minutes).
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionPollingTimeout = 600000; // 600000 ms = 600 s = 10 min

console.log(web3.getContextObject().config)
```
:::info
The `transactionPollingTimeout` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionPollingTimeout = 600000; // 600000 ms = 600 s = 10 min

console.log(web3.eth.getContextObject().config)
```
:::

### transactionReceiptPollingInterval
The `transactionReceiptPollingInterval` is used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network. Compared to `transactionPollingInterval`, it takes higher precedence. When this value is set, it will be read first. Default is `undefined`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionReceiptPollingInterval = 2000; // 2000 ms = 2 s

console.log(web3.getContextObject().config)
```
:::info
The `transactionReceiptPollingInterval` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionReceiptPollingInterval = undefined;

console.log(web3.eth.getContextObject().config)
```
:::

### transactionSendTimeout
The `transactionSendTimeout` is used to wait for Ethereum Node to return the sent transaction result. Note: If the RPC call stuck at the Node and therefor timed-out, the transaction may still be pending or even mined by the Network. We recommend checking the pending transactions in such a case. Default is 750 seconds (12.5 minutes).
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.transactionSendTimeout = 600000; // 600000 ms = 600 s = 10 min

console.log(web3.getContextObject().config)
```
:::info
The `transactionSendTimeout` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.transactionSendTimeout  = 600000; // 600000 ms = 600 s = 10 min

console.log(web3.eth.getContextObject().config)
```
:::

### transactionConfirmationPollingInterval
The `transactionConfirmationPollingInterval` is deprecated. Please use `transactionReceiptPollingInterval` or `transactionPollingInterval` instead.

### blockHeaderTimeout
The `blockHeaderTimeout` is used over socket-based connections. After sending a transaction, it will listen for the appearance of new blocks and proceed with subsequent operations based on the transaction results within them. This option defines the amount seconds it should wait for 'newBlockHeaders' event before falling back to polling to fetch transaction receipt. Default is 10 seconds.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.blockHeaderTimeout = 20; // 20 s

console.log(web3.getContextObject().config)
```
:::info
The `blockHeaderTimeout` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.blockHeaderTimeout = 20; // 20 s

console.log(web3.eth.getContextObject().config)
```
:::

### maxListenersWarningThreshold
The `maxListenersWarningThreshold` is used to set the `maxListeners` property in `EventEmitter`. Default is 100.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.maxListenersWarningThreshold = 200;

console.log(web3.getContextObject().config)
```
:::info
The `maxListenersWarningThreshold` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.maxListenersWarningThreshold = 200;

console.log(web3.eth.getContextObject().config)
```
:::

### contractDataInputFill
The `contractDataInputFill` will allow you to set the hash of the method signature and encoded parameters to the property either `data`, `input` or `both` within your contract. This will affect the contracts send, call and estimateGas methods. Default is `data`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.contractDataInputFill = 'input';

console.log(web3.getContextObject().config)
```
:::info
The `contractDataInputFill` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.contractDataInputFill = 'both';

console.log(web3.eth.getContextObject().config)
```
:::

#### All available choices for contractDataInputFill:
```ts
contractDataInputFill: 'data' | 'input' | 'both';
```

### defaultNetworkId
Each network has its own network ID. The defaultNetwork allows you to set the default network ID to increase code readability. If this parameter is not set, it will fetch the network ID from the connected RPC request. Default is `undefined`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultNetworkId = 1;

console.log(web3.getContextObject().config)
```
:::info
The `defaultNetworkId` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultNetworkId = '0x1';

console.log(web3.eth.getContextObject().config)
```
:::

### defaultChain
The `defaultChain` is used for building the `baseChain` property of the tx options in a transaction. If the `defaultCommon.basechain` is set, the`defaultChain` should be consistent with it. Default is `mainnet`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultChain = 'ropsten';

console.log(web3.getContextObject().config)
```
:::info
The `defaultChain` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultChain = 'ropsten';

console.log(web3.eth.getContextObject().config)
```
:::
#### All available choices for defaultChain:
```ts
'goerli' | 'kovan' | 'mainnet' | 'rinkeby' | 'ropsten' | 'sepolia'
```


### defaultHardfork
The `defaultHardfork` is used for building the `defaultHardfork` property of the tx options in a transaction. If the `defaultCommon.defaultHardfork` is set, the`defaultHardfork` should be consistent with it. Default is `london`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultHardfork = 'berlin';

console.log(web3.getContextObject().config)
```
:::info
The `defaultHardfork` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultHardfork = 'istanbul';

console.log(web3.eth.getContextObject().config)
```
:::
#### All available choices for contractDataInputFill:
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

### defaultCommon
The `defaultCommon` is used for building the `common` property of the tx options in a transaction. It should be consistent with the `defaultHardfork` and `defaultChain`. The `defaultCommon` property does contain the following Common object:
```
- customChain - Object: The custom chain properties
  - name - string: (optional) The name of the chain
  - networkId - number: Network ID of the custom chain
  - chainId - number: Chain ID of the custom chain
- baseChain - string: (optional) 'goerli', 'kovan', 'mainnet', 'rinkeby', 'ropsten' or 'sepolia'
- hardfork - string: (optional) chainstart, homestead, dao, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, or london
```

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

console.log(web3.getContextObject().config)
```
:::info
The `defaultCommon` can be configured both globally and at the package level:
```ts
import { Web3, Hardfork } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultHardfork = 'berlin'
web3.eth.defaultChain = 'goerli'

web3.eth.defaultCommon = {
    baseChain: 'goerli',
    hardfork: 'berlin' as Hardfork,
    customChain: {
        networkId: 1,
        chainId: 1,
    },
};

console.log(web3.eth.getContextObject().config)
```
:::

### defaultTransactionType
The `defaultTransactionType` is used set the transaction type. Transactions with type 0x0 are legacy transactions that use the transaction format existing before typed transactions were introduced in EIP-2718. Transactions with type 0x1 are transactions introduced in EIP-2930. Transactions with type 0x2 are transactions introduced in EIP-1559, included in Ethereum's London fork. Default is `0x02`.
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultTransactionType = 0x0;

console.log(web3.getContextObject().config)
```
:::info
The `defaultTransactionType` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultTransactionType  = 0x0;

console.log(web3.eth.getContextObject().config)
```
:::

### defaultMaxPriorityFeePerGas
The `defaultMaxPriorityFeePerGas` is used to send transactions with the maximum priority gas fee. The default value is 2500000000 (2.5gwei) in hexstring format.
```ts
import { Web3 } from 'web3';
import { numberToHex } from 'web3-utils'

const web3 = new Web3('http://127.0.0.1:7545');

web3.defaultMaxPriorityFeePerGas = numberToHex(2100000000); // 2.1gwei

console.log(web3.getContextObject().config)
```
:::info
The `defaultMaxPriorityFeePerGas` can be configured both globally and at the package level:
```ts
import { Web3 } from 'web3';
import { numberToHex } from 'web3-utils'

const web3 = new Web3('http://127.0.0.1:7545');

web3.eth.defaultMaxPriorityFeePerGas = numberToHex(2100000000); // 2.1gwei

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
