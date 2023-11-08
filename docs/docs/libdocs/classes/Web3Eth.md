# Class: Web3Eth

The Web3Eth allows you to interact with an Ethereum blockchain.

## Hierarchy

- `Web3Context`\<`Web3EthExecutionAPI`, `RegisteredSubscription`\>

  ↳ **`Web3Eth`**

## Accessors

### BatchRequest

• `get` **BatchRequest**(): `Object`

Will return the Web3BatchRequest constructor.

#### Returns

`Object`

#### Inherited from

Web3Context.BatchRequest

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:157

___

### blockHeaderTimeout

• `get` **blockHeaderTimeout**(): `number`

The blockHeaderTimeout is used over socket-based connections. This option defines the amount seconds it should wait for `'newBlockHeaders'` event before falling back to polling to fetch transaction receipt.
Default is `10` seconds.

#### Returns

`number`

#### Inherited from

Web3Context.blockHeaderTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:166

• `set` **blockHeaderTimeout**(`val`): `void`

Will set the blockHeaderTimeout

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.blockHeaderTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:170

___

### contractDataInputFill

• `get` **contractDataInputFill**(): ``"data"`` \| ``"input"`` \| ``"both"``

The `contractDataInputFill` options property will allow you to set the hash of the method signature and encoded parameters to the property
either `data`, `input` or both within your contract.
This will affect the contracts send, call and estimateGas methods
Default is `input`.

#### Returns

``"data"`` \| ``"input"`` \| ``"both"``

#### Inherited from

Web3Context.contractDataInputFill

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:67

• `set` **contractDataInputFill**(`val`): `void`

Will set the contractDataInputFill

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | ``"data"`` \| ``"input"`` \| ``"both"`` |

#### Returns

`void`

#### Inherited from

Web3Context.contractDataInputFill

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:71

___

### currentProvider

• `get` **currentProvider**(): `undefined` \| `Web3BaseProvider`\<`API`\>

Will return the current provider. (The same as `provider`)

#### Returns

`undefined` \| `Web3BaseProvider`\<`API`\>

Returns the current provider

**`Example`**

```ts
const web3Context = new Web3Context("http://localhost:8545");
console.log(web3Context.provider);
> HttpProvider {
	clientUrl: 'http://localhost:8545',
	httpProviderOptions: undefined
 }
```

#### Inherited from

Web3Context.currentProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:121

• `set` **currentProvider**(`provider`): `void`

Will set the current provider. (The same as `provider`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `undefined` \| `string` \| `SupportedProviders`\<`API`\> | SupportedProviders The provider to set |

#### Returns

`void`

**`Example`**

```ts
 const web3Context = new Web3Context("http://localhost:8545");
web3Context.currentProvider = "ws://localhost:8545";
console.log(web3Context.provider);
> WebSocketProvider {
_eventEmitter: EventEmitter {
_events: [Object: null prototype] {},
_eventsCount: 0,
...
}
```

#### Inherited from

Web3Context.currentProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:140

___

### defaultAccount

• `get` **defaultAccount**(): `undefined` \| `string`

This default address is used as the default `from` property, if no `from` property is specified in for the following methods:
- web3.eth.sendTransaction()
- web3.eth.call()
- myContract.methods.myMethod().call()
- myContract.methods.myMethod().send()

#### Returns

`undefined` \| `string`

#### Inherited from

Web3Context.defaultAccount

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:79

• `set` **defaultAccount**(`val`): `void`

Will set the default account.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `undefined` \| `string` |

#### Returns

`void`

#### Inherited from

Web3Context.defaultAccount

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:83

___

### defaultBlock

• `get` **defaultBlock**(): `BlockNumberOrTag`

The default block is used for certain methods. You can override it by passing in the defaultBlock as last parameter. The default value is `"latest"`.
- web3.eth.getBalance()
- web3.eth.getCode()
- web3.eth.getTransactionCount()
- web3.eth.getStorageAt()
- web3.eth.call()
- myContract.methods.myMethod().call()

#### Returns

`BlockNumberOrTag`

#### Inherited from

Web3Context.defaultBlock

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:93

• `set` **defaultBlock**(`val`): `void`

Will set the default block.

- A block number
- `"earliest"` - String: The genesis block
- `"latest"` - String: The latest block (current head of the blockchain)
- `"pending"` - String: The currently mined block (including pending transactions)
- `"finalized"` - String: (For POS networks) The finalized block is one which has been accepted as canonical by greater than 2/3 of validators
- `"safe"` - String: (For POS networks) The safe head block is one which under normal network conditions, is expected to be included in the canonical chain. Under normal network conditions the safe head and the actual tip of the chain will be equivalent (with safe head trailing only by a few seconds). Safe heads will be less likely to be reorged than the proof of work network`s latest blocks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `BlockNumberOrTag` |

#### Returns

`void`

#### Inherited from

Web3Context.defaultBlock

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:104

___

### defaultCommon

• `get` **defaultCommon**(): `undefined` \| `Common`

Will get the default common property
The default common property does contain the following Common object:
- `customChain` - `Object`: The custom chain properties
	- `name` - `string`: (optional) The name of the chain
	- `networkId` - `number`: Network ID of the custom chain
	- `chainId` - `number`: Chain ID of the custom chain
- `baseChain` - `string`: (optional) mainnet, goerli, kovan, rinkeby, or ropsten
- `hardfork` - `string`: (optional) chainstart, homestead, dao, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, or london
Default is `undefined`.

#### Returns

`undefined` \| `Common`

#### Inherited from

Web3Context.defaultCommon

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:230

• `set` **defaultCommon**(`val`): `void`

Will set the default common property

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `undefined` \| `Common` |

#### Returns

`void`

#### Inherited from

Web3Context.defaultCommon

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:235

___

### defaultHardfork

• `get` **defaultHardfork**(): `string`

Will return the default hardfork. Default is `london`
The default hardfork property can be one of the following:
- `chainstart`
- `homestead`
- `dao`
- `tangerineWhistle`
- `spuriousDragon`
- `byzantium`
- `constantinople`
- `petersburg`
- `istanbul`
- `berlin`
- `london`
- 'arrowGlacier',
- 'tangerineWhistle',
- 'muirGlacier'

#### Returns

`string`

#### Inherited from

Web3Context.defaultHardfork

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:211

• `set` **defaultHardfork**(`val`): `void`

Will set the default hardfork.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `string` |

#### Returns

`void`

#### Inherited from

Web3Context.defaultHardfork

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:216

___

### enableExperimentalFeatures

• `get` **enableExperimentalFeatures**(): `Object`

The enableExperimentalFeatures is used to enable trying new experimental features that are still not fully implemented or not fully tested or still have some related issues.
Default is `false` for every feature.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `useRpcCallSpecification` | `boolean` |
| `useSubscriptionWhenCheckingBlockTimeout` | `boolean` |

#### Inherited from

Web3Context.enableExperimentalFeatures

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:175

• `set` **enableExperimentalFeatures**(`val`): `void`

Will set the enableExperimentalFeatures

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `Object` |
| `val.useRpcCallSpecification` | `boolean` |
| `val.useSubscriptionWhenCheckingBlockTimeout` | `boolean` |

#### Returns

`void`

#### Inherited from

Web3Context.enableExperimentalFeatures

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:182

___

### givenProvider

• `get` **givenProvider**(): `undefined` \| `SupportedProviders`\<`never`\>

Will return the givenProvider if available.

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser. Will return the given provider by the (browser) environment, otherwise `undefined`.

#### Returns

`undefined` \| `SupportedProviders`\<`never`\>

#### Inherited from

Web3Context.givenProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:146

___

### handleRevert

• `get` **handleRevert**(): `boolean`

The `handleRevert` options property returns the revert reason string if enabled for the following methods:
- web3.eth.sendTransaction()
- web3.eth.call()
- myContract.methods.myMethod().call()
- myContract.methods.myMethod().send()
Default is `false`.

`Note`: At the moment `handleRevert` is only supported for `sendTransaction` and not for `sendSignedTransaction`

#### Returns

`boolean`

#### Inherited from

Web3Context.handleRevert

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:56

• `set` **handleRevert**(`val`): `void`

Will set the handleRevert

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `boolean` |

#### Returns

`void`

#### Inherited from

Web3Context.handleRevert

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:60

___

### provider

• `get` **provider**(): `undefined` \| `Web3BaseProvider`\<`API`\>

Will return the current provider.

#### Returns

`undefined` \| `Web3BaseProvider`\<`API`\>

Returns the current provider

**`Example`**

```ts
const web3 = new Web3Context("http://localhost:8545");
console.log(web3.provider);
> HttpProvider {
	clientUrl: 'http://localhost:8545',
	httpProviderOptions: undefined
 }
```

#### Inherited from

Web3Context.provider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:86

• `set` **provider**(`provider`): `void`

Will set the current provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `undefined` \| `string` \| `SupportedProviders`\<`API`\> | The provider to set Accepted providers are of type SupportedProviders |

#### Returns

`void`

**`Example`**

```ts
 const web3Context = new web3ContextContext("http://localhost:8545");
web3Context.provider = "ws://localhost:8545";
console.log(web3Context.provider);
> WebSocketProvider {
_eventEmitter: EventEmitter {
_events: [Object: null prototype] {},
_eventsCount: 0,
...
}
```

#### Inherited from

Web3Context.provider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:106

___

### subscriptionManager

• `get` **subscriptionManager**(): `Web3SubscriptionManager`\<`API`, `RegisteredSubs`\>

Will return the current subscriptionManager (Web3SubscriptionManager)

#### Returns

`Web3SubscriptionManager`\<`API`, `RegisteredSubs`\>

#### Inherited from

Web3Context.subscriptionManager

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:56

___

### transactionBlockTimeout

• `get` **transactionBlockTimeout**(): `number`

The `transactionBlockTimeout` is used over socket-based connections. This option defines the amount of new blocks it should wait until the first confirmation happens, otherwise the PromiEvent rejects with a timeout error.
Default is `50`.

#### Returns

`number`

#### Inherited from

Web3Context.transactionBlockTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:119

• `set` **transactionBlockTimeout**(`val`): `void`

Will set the transactionBlockTimeout.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionBlockTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:123

___

### transactionConfirmationBlocks

• `get` **transactionConfirmationBlocks**(): `number`

This defines the number of blocks it requires until a transaction is considered confirmed.
Default is `24`.

#### Returns

`number`

#### Inherited from

Web3Context.transactionConfirmationBlocks

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:128

• `set` **transactionConfirmationBlocks**(`val`): `void`

Will set the transactionConfirmationBlocks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionConfirmationBlocks

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:132

___

### transactionPollingInterval

• `get` **transactionPollingInterval**(): `number`

Used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network.
Default is `1000` ms.

#### Returns

`number`

#### Inherited from

Web3Context.transactionPollingInterval

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:137

• `set` **transactionPollingInterval**(`val`): `void`

Will set the transactionPollingInterval.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionPollingInterval

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:141

___

### transactionPollingTimeout

• `get` **transactionPollingTimeout**(): `number`

Used over HTTP connections. This option defines the number of seconds Web3 will wait for a receipt which confirms that a transaction was mined by the network. Note: If this method times out, the transaction may still be pending.
Default is `750` seconds (12.5 minutes).

#### Returns

`number`

#### Inherited from

Web3Context.transactionPollingTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:146

• `set` **transactionPollingTimeout**(`val`): `void`

Will set the transactionPollingTimeout.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionPollingTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:150

___

### transactionReceiptPollingInterval

• `get` **transactionReceiptPollingInterval**(): `undefined` \| `number`

The `transactionPollingInterval` is used over HTTP connections. This option defines the number of seconds between Web3 calls for a receipt which confirms that a transaction was mined by the network.
Default is `undefined`

#### Returns

`undefined` \| `number`

#### Inherited from

Web3Context.transactionReceiptPollingInterval

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:155

• `set` **transactionReceiptPollingInterval**(`val`): `void`

Will set the transactionReceiptPollingInterval

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `undefined` \| `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionReceiptPollingInterval

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:159

___

### transactionSendTimeout

• `get` **transactionSendTimeout**(): `number`

The time used to wait for Ethereum Node to return the sent transaction result.
Note: If the RPC call stuck at the Node and therefor timed-out, the transaction may still be pending or even mined by the Network. We recommend checking the pending transactions in such a case.
Default is `750` seconds (12.5 minutes).

#### Returns

`number`

#### Inherited from

Web3Context.transactionSendTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:110

• `set` **transactionSendTimeout**(`val`): `void`

Will set the transactionSendTimeout.

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Inherited from

Web3Context.transactionSendTimeout

#### Defined in

web3-core/lib/commonjs/web3_config.d.ts:114

## Methods

### call

▸ **call**\<`ReturnFormat`\>(`transaction`, `blockNumber?`, `returnFormat?`): `Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

Executes a message call within the EVM without creating a transaction.
It does not publish anything to the blockchain and does not consume any gas.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `TransactionCall` | A transaction object where all properties are optional except `to`, however it's recommended to include the `from` property or it may default to `0x0000000000000000000000000000000000000000` depending on your node or provider. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) - Specifies what block to use as the current state of the blockchain while processing the transaction. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

The returned data of the call, e.g. a smart contract function's return value.

#### Defined in

[web3-eth/src/web3_eth.ts:1159](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1159)

___

### clearSubscriptions

▸ **clearSubscriptions**(`notClearSyncing?`): `undefined` \| `Promise`\<`string`[]\>

Resets subscriptions.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `notClearSyncing` | `boolean` | `false` | If `true` it keeps the `syncing` subscription. |

#### Returns

`undefined` \| `Promise`\<`string`[]\>

A promise to an array of subscription ids that were cleared.

```ts
web3.eth.clearSubscriptions().then(console.log);
> [...] An array of subscription ids that were cleared
```

#### Defined in

[web3-eth/src/web3_eth.ts:1655](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1655)

___

### createAccessList

▸ **createAccessList**\<`ReturnFormat`\>(`transaction`, `blockNumber?`, `returnFormat?`): `Promise`\<\{ `accessList?`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `gasUsed?`: `NumberTypes`[`ReturnFormat`[``"number"``]]  }\>

This method generates an access list for a transaction.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `TransactionForAccessList` | A transaction object where all properties are optional except `from`, however it's recommended to include the `to` property. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) - Specifies what block to use as the current state of the blockchain while processing the transaction. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the createAccessList should be formatted. |

#### Returns

`Promise`\<\{ `accessList?`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `gasUsed?`: `NumberTypes`[`ReturnFormat`[``"number"``]]  }\>

The returned data of the createAccessList,  e.g. The generated access list for transaction.

**`Example`**

```ts
web3.eth.createAccessList({
from: '0xDe95305a63302C3aa4d3A9B42654659AeA72b694',
data: '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0',
gasPrice: '0x3b9aca00',
gas: '0x3d0900',
to: '0x940b25304947ae863568B3804434EC77E2160b87'
})
.then(console.log);

> {
 "accessList": [
    {
      "address": "0x15859bdf5aff2080a9968f6a410361e9598df62f",
      "storageKeys": [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ]
    }
  ],
  "gasUsed": "0x7671"
}
```

#### Defined in

[web3-eth/src/web3_eth.ts:1535](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1535)

___

### estimateGas

▸ **estimateGas**\<`ReturnFormat`\>(`transaction`, `blockNumber?`, `returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

Simulates the transaction within the EVM to estimate the amount of gas to be used by the transaction.
The transaction will not be added to the blockchain, and actual gas usage can vary when interacting
with a contract as a result of updating the contract's state.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The Transaction object to estimate the gas for. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) - Specifies what block to use as the current state of the blockchain while processing the gas estimation. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The used gas for the simulated transaction execution.

```ts
const transaction = {
      from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
      to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
      value: '0x1',
      nonce: '0x1',
      type: '0x0'
}

web3.eth.estimateGas(transaction).then(console.log);
> 21000n

web3.eth.estimateGas(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
> 21000
```

#### Defined in

[web3-eth/src/web3_eth.ts:1193](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1193)

___

### extend

▸ **extend**(`extendObj`): [`Web3Eth`](Web3Eth.md)

This method allows extending the web3 modules.
Note: This method is only for backward compatibility, and It is recommended to use Web3 v4 Plugin feature for extending web3.js functionality if you are developing some thing new.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendObj` | `ExtensionObject` |

#### Returns

[`Web3Eth`](Web3Eth.md)

#### Inherited from

Web3Context.extend

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:162

___

### getAccounts

▸ **getAccounts**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

A list of accounts the node controls (addresses are checksummed).

```ts
web3.eth.getAccounts().then(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
```

#### Defined in

[web3-eth/src/web3_eth.ts:229](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L229)

___

### getBalance

▸ **getBalance**\<`ReturnFormat`\>(`address`, `blockNumber?`, `returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

Get the balance of an address at a given block.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to get the balance of. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) Specifies what block to use as the current state for the balance query. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The current balance for the given address in `wei`.

```ts
web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
> 1000000000000n

web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
> "0xe8d4a51000"
```

#### Defined in

[web3-eth/src/web3_eth.ts:268](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L268)

___

### getBlock

▸ **getBlock**\<`ReturnFormat`\>(`block?`, `hydrated?`, `returnFormat?`): `Promise`\<\{ `baseFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `difficulty?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `extraData`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `gasLimit`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsed`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `logsBloom?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `miner`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `mixHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `number`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `parentHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `receiptsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `sha3Uncles`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `size`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `stateRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `timestamp`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `totalDifficulty`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `transactions`: `string`[] \| \{ readonly blockHash?: ByteTypes[ReturnFormat["bytes"]] \| undefined; readonly blockNumber?: NumberTypes[ReturnFormat["number"]] \| undefined; ... 23 more ...; s?: ByteTypes[ReturnFormat["bytes"]] \| undefined; }[] ; `transactionsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `uncles`: `string`[]  }\>

Retrieves a Block matching the provided block number, block hash or block tag.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `block` | `BlockNumberOrTag` | `undefined` | The BlockNumberOrTag (defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) or block hash of the desired block. |
| `hydrated` | `boolean` | `false` | If specified `true`, the returned block will contain all transactions as objects. If `false` it will only contain transaction hashes. |
| `returnFormat` | `ReturnFormat` | `undefined` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted (does not format transaction objects or hashes). |

#### Returns

`Promise`\<\{ `baseFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `difficulty?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `extraData`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `gasLimit`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsed`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `logsBloom?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `miner`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `mixHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `number`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `parentHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `receiptsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `sha3Uncles`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `size`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `stateRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `timestamp`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `totalDifficulty`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `transactions`: `string`[] \| \{ readonly blockHash?: ByteTypes[ReturnFormat["bytes"]] \| undefined; readonly blockNumber?: NumberTypes[ReturnFormat["number"]] \| undefined; ... 23 more ...; s?: ByteTypes[ReturnFormat["bytes"]] \| undefined; }[] ; `transactionsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `uncles`: `string`[]  }\>

A Block object matching the provided block number or block hash.

```ts
web3.eth.getBlock(0).then(console.log);
> {
   hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
   parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
   miner: '0x0000000000000000000000000000000000000000',
   stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
   transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
   difficulty: 1n,
   number: 0n,
   gasLimit: 30000000n,
   gasUsed: 0n,
   timestamp: 1658281638n,
   extraData: '0x',
   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   nonce: 0n,
   totalDifficulty: 1n,
   baseFeePerGas: 1000000000n,
   size: 514n,
   transactions: [],
   uncles: []
 }

web3.eth.getBlock(
     "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
     false,
     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> {
   hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
   parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
   miner: '0x0000000000000000000000000000000000000000',
   stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
   transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
   difficulty: 1,
   number: 0,
   gasLimit: 30000000,
   gasUsed: 0,
   timestamp: 1658281638,
   extraData: '0x',
   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   nonce: 0,
   totalDifficulty: 1,
   baseFeePerGas: 1000000000,
   size: 514,
   transactions: [],
   uncles: []
 }
```

#### Defined in

[web3-eth/src/web3_eth.ts:416](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L416)

___

### getBlockNumber

▸ **getBlockNumber**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The current block number.

```ts
web3.eth.getBlockNumber().then(console.log);
> 2744n

web3.eth.getBlockNumber({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
> "0xab8"
```

#### Defined in

[web3-eth/src/web3_eth.ts:246](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L246)

___

### getBlockTransactionCount

▸ **getBlockTransactionCount**\<`ReturnFormat`\>(`block?`, `returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `BlockNumberOrTag` | The BlockNumberOrTag (defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) or block hash of the desired block. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The number of transactions in the provided block.

```ts
web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
> 1n

web3.eth.getBlockTransactionCount(
    "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> 1
```

#### Defined in

[web3-eth/src/web3_eth.ts:440](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L440)

___

### getBlockUncleCount

▸ **getBlockUncleCount**\<`ReturnFormat`\>(`block?`, `returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `BlockNumberOrTag` | The BlockNumberOrTag (defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) or block hash of the desired block. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The number of [uncles](https://ethereum.org/en/glossary/#ommer) in the provided block.

```ts
web3.eth.getBlockUncleCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
> 1n

web3.eth.getBlockUncleCount(
    "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> 1
```

#### Defined in

[web3-eth/src/web3_eth.ts:465](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L465)

___

### getChainId

▸ **getChainId**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The chain ID of the current connected node as described in the [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md).

```ts
web3.eth.getChainId().then(console.log);
> 61n

web3.eth.getChainId({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
> 61
```

#### Defined in

[web3-eth/src/web3_eth.ts:1329](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1329)

___

### getCode

▸ **getCode**\<`ReturnFormat`\>(`address`, `blockNumber?`, `returnFormat?`): `Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

Get the code at a specific address.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to get the code from. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) Specifies what block to use as the current state for the code query. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

The [data](https://ethereum.org/en/developers/docs/transactions/#the-data-field) at the provided `address`.

```ts
web3.eth.getCode("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234").then(console.log);
> "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"

web3.eth.getCode(
     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
     undefined,
     { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
).then(console.log);
> Uint8Array(50) [
  96,  1,  96,   0, 128, 53, 129, 26, 129, 129, 129,
  20, 96,  18,  87, 131,  1,   0, 91,  96,  27,  96,
  1, 53,  96,  37,  86, 91, 128, 96,   0,  82,  96,
  32, 96,   0, 242,  91, 96,   0, 96,   7, 130,   2,
  144, 80, 145, 144,  80, 86
]
```

#### Defined in

[web3-eth/src/web3_eth.ts:344](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L344)

___

### getCoinbase

▸ **getCoinbase**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

Returns the coinbase address to which mining rewards will go.

```ts
web3.eth.getCoinbase().then(console.log);
> "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
```

#### Defined in

[web3-eth/src/web3_eth.ts:147](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L147)

___

### getFeeHistory

▸ **getFeeHistory**\<`ReturnFormat`\>(`blockCount`, `newestBlock?`, `rewardPercentiles`, `returnFormat?`): `Promise`\<\{ `baseFeePerGas`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsedRatio`: `NumberTypes`[`ReturnFormat`[``"number"``]][] ; `oldestBlock`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `reward`: `NumberTypes`[`ReturnFormat`[``"number"``]][][]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockCount` | `Numbers` | Number of blocks in the requested range. Between `1` and `1024` blocks can be requested in a single query. Less than requested may be returned if not all blocks are available. |
| `newestBlock` | `BlockNumberOrTag` | Highest number block of the requested range. |
| `rewardPercentiles` | `Numbers`[] | A monotonically increasing list of percentile values to sample from each block’s effective priority fees per gas in ascending order, weighted by gas used. Example: `['0', '25', '50', '75', '100']` or `['0', '0.5', '1', '1.5', '3', '80']` |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<\{ `baseFeePerGas`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsedRatio`: `NumberTypes`[`ReturnFormat`[``"number"``]][] ; `oldestBlock`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `reward`: `NumberTypes`[`ReturnFormat`[``"number"``]][][]  }\>

`baseFeePerGas` and transaction effective `priorityFeePerGas` history for the requested block range if available.
The range between `headBlock - 4` and `headBlock` is guaranteed to be available while retrieving data from the `pending` block and older history are optional to support.
For pre-EIP-1559 blocks the `gasPrice`s are returned as `rewards` and zeroes are returned for the `baseFeePerGas`.

```ts
web3.eth.getFeeHistory(4, 'pending', [0, 25, 75, 100]).then(console.log);
> {
    baseFeePerGas: [
        22983878621n,
        21417903463n,
        19989260230n,
        17770954829n,
        18850641304n
    ],
    gasUsedRatio: [
        0.22746546666666667,
        0.2331871,
        0.05610054885262125,
        0.7430227268212117
    ],
    oldestBlock: 15216343n,
    reward: [
        [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
        [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
        [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
        [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
    ]
}

web3.eth.getFeeHistory(4, BlockTags.LATEST, [0, 25, 75, 100], { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
> {
    baseFeePerGas: [
        22983878621,
        21417903463,
        19989260230,
        17770954829,
        18850641304
    ],
    gasUsedRatio: [
        0.22746546666666667,
        0.2331871,
        0.05610054885262125,
        0.7430227268212117
    ],
    oldestBlock: 15216343,
    reward: [
        [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
        [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
        [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
        [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
    ]
}
```

#### Defined in

[web3-eth/src/web3_eth.ts:1489](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1489)

___

### getGasPrice

▸ **getGasPrice**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The gas price determined by the last few blocks median gas price.

```ts
web3.eth.getGasPrice().then(console.log);
> 20000000000n

web3.eth.getGasPrice({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
> "0x4a817c800"
```

#### Defined in

[web3-eth/src/web3_eth.ts:215](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L215)

___

### getHashRate

▸ **getHashRate**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The number of hashes per second that the node is mining with.

```ts
web3.eth.getHashRate().then(console.log);
> 493736n

web3.eth.getHashRate({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
> "0x788a8"
```

#### Defined in

[web3-eth/src/web3_eth.ts:197](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L197)

___

### getHashrate

▸ **getHashrate**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The number of hashes per second that the node is mining with.

```ts
web3.eth.getHashrate().then(console.log);
> 493736n

web3.eth.getHashrate({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
> "0x788a8"
```

**`Deprecated`**

Will be removed in the future, please use [Web3Eth.getHashRate](Web3Eth.md#gethashrate) method instead.

#### Defined in

[web3-eth/src/web3_eth.ts:179](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L179)

___

### getNodeInfo

▸ **getNodeInfo**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

The current client version.

```ts
web3.eth.getNodeInfo().then(console.log);
> "Mist/v0.9.3/darwin/go1.4.1"
```

#### Defined in

[web3-eth/src/web3_eth.ts:1343](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1343)

___

### getPastLogs

▸ **getPastLogs**\<`ReturnFormat`\>(`filter`, `returnFormat?`): `Promise`\<(`string` \| \{ `address?`: `string` ; `blockHash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `blockNumber?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `data?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `id?`: `string` ; `logIndex?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `removed?`: `boolean` ; `topics?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]][] ; `transactionHash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `transactionIndex?`: `NumberTypes`[`ReturnFormat`[``"number"``]]  })[]\>

Gets past logs, matching the provided `filter`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `Filter` | A Filter object containing the properties for the desired logs. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<(`string` \| \{ `address?`: `string` ; `blockHash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `blockNumber?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `data?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `id?`: `string` ; `logIndex?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `removed?`: `boolean` ; `topics?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]][] ; `transactionHash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `transactionIndex?`: `NumberTypes`[`ReturnFormat`[``"number"``]]  })[]\>

FilterResultsAPI, an array of Log objects.

```ts
web3.eth.getPastLogs({
     address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
     topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
 }).then(console.log);
> [{
      data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
      logIndex: 0n,
      transactionIndex: 0n,
      transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
      blockNumber: 1234n,
      address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
  },
  {...}]

web3.eth.getPastLogs(
    {
      address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
      topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
    },
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> [{
      data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
      logIndex: 0,
      transactionIndex: 0,
      transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
      blockNumber: 1234,
      address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
  },
  {...}]
```

#### Defined in

[web3-eth/src/web3_eth.ts:1245](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1245)

___

### getPendingTransactions

▸ **getPendingTransactions**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<\{ `accessList?`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `chain?`: `ValidChains` ; `chainId?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `common?`: \{ customChain: \{ name?: string \| undefined; networkId: NumberTypes[ReturnFormat["number"]]; chainId: NumberTypes[ReturnFormat["number"]]; }; baseChain?: ValidChains \| undefined; hardfork?: "chainstart" \| ... 19 more ... \| undefined; } ; `data?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `from?`: `string` ; `gas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasLimit?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasPrice?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hardfork?`: ``"chainstart"`` \| ``"frontier"`` \| ``"homestead"`` \| ``"dao"`` \| ``"tangerineWhistle"`` \| ``"spuriousDragon"`` \| ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"muirGlacier"`` \| ``"berlin"`` \| ``"london"`` \| ``"altair"`` \| ``"arrowGlacier"`` \| ``"grayGlacier"`` \| ``"bellatrix"`` \| ``"merge"`` \| ``"capella"`` \| ``"shanghai"`` ; `input?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `maxFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `maxPriorityFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `networkId?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `nonce?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `r?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `s?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `to?`: ``null`` \| `string` ; `type?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `v?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `value?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `yParity?`: `string`  }[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<\{ `accessList?`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `chain?`: `ValidChains` ; `chainId?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `common?`: \{ customChain: \{ name?: string \| undefined; networkId: NumberTypes[ReturnFormat["number"]]; chainId: NumberTypes[ReturnFormat["number"]]; }; baseChain?: ValidChains \| undefined; hardfork?: "chainstart" \| ... 19 more ... \| undefined; } ; `data?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `from?`: `string` ; `gas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasLimit?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasPrice?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hardfork?`: ``"chainstart"`` \| ``"frontier"`` \| ``"homestead"`` \| ``"dao"`` \| ``"tangerineWhistle"`` \| ``"spuriousDragon"`` \| ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"muirGlacier"`` \| ``"berlin"`` \| ``"london"`` \| ``"altair"`` \| ``"arrowGlacier"`` \| ``"grayGlacier"`` \| ``"bellatrix"`` \| ``"merge"`` \| ``"capella"`` \| ``"shanghai"`` ; `input?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `maxFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `maxPriorityFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `networkId?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `nonce?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `r?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `s?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `to?`: ``null`` \| `string` ; `type?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `v?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `value?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `yParity?`: `string`  }[]\>

A list of pending transactions.

```ts
web3.eth.getPendingTransactions().then(console.log);
> [
     {
         hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
         type: 0n,
         nonce: 0n,
         blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
         blockNumber: null,
         transactionIndex: 0n,
         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
         value: 1n,
         gas: 90000n,
         gasPrice: 2000000000n,
         input: '0x',
         v: 2709n,
         r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
         s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     },
     {
         hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
         type: 0n,
         nonce: 1n,
         blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
         blockNumber: null,
         transactionIndex: 0n,
         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
         value: 1n,
         gas: 90000n,
         gasPrice: 2000000000n,
         input: '0x',
         v: 2710n,
         r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
         s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
     }
  ]

* web3.eth.getPendingTransactions({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
> [
     {
         hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
         type: 0,
         nonce: 0,
         blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
         blockNumber: null,
         transactionIndex: 0,
         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
         value: 1,
         gas: 90000,
         gasPrice: 2000000000,
         input: '0x',
         v: 2709,
         r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
         s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     },
     {
         hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
         type: 0,
         nonce: 1,
         blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
         blockNumber: null,
         transactionIndex: 0,
         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
         value: 1,
         gas: 90000,
         gasPrice: 2000000000,
         input: '0x',
         v: 2710,
         r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
         s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
     }
  ]
```

#### Defined in

[web3-eth/src/web3_eth.ts:688](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L688)

___

### getProof

▸ **getProof**\<`ReturnFormat`\>(`address`, `storageKeys`, `blockNumber?`, `returnFormat?`): `Promise`\<\{ `accountProof`: `ByteTypes`[`ReturnFormat`[``"bytes"``]][] ; `balance`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `codeHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `storageHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `storageProof`: \{ readonly key: ByteTypes[ReturnFormat["bytes"]]; readonly value: NumberTypes[ReturnFormat["number"]]; readonly proof: ByteTypes[ReturnFormat["bytes"]][]; }[]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The Address of the account or contract. |
| `storageKeys` | `Bytes`[] | Array of storage-keys which should be proofed and included. See web3.getStorageAt. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) - Specifies what block to use as the current state of the blockchain while processing the gas estimation. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the return data from the call should be formatted. |

#### Returns

`Promise`\<\{ `accountProof`: `ByteTypes`[`ReturnFormat`[``"bytes"``]][] ; `balance`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `codeHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `storageHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `storageProof`: \{ readonly key: ByteTypes[ReturnFormat["bytes"]]; readonly value: NumberTypes[ReturnFormat["number"]]; readonly proof: ByteTypes[ReturnFormat["bytes"]][]; }[]  }\>

The account and storage-values of the specified account including the Merkle-proof as described in [EIP-1186](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md).

```ts
web3.eth.getProof(
    "0x1234567890123456789012345678901234567890",
    ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
    "latest"
).then(console.log);
> {
    "address": "0x1234567890123456789012345678901234567890",
    "accountProof": [
        "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
        "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
        "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
        "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
    ],
    "balance": 0n,
    "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "nonce": 0n,
    "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "storageProof": [
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value": 0n,
            "proof": []
        },
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value": 0n,
            "proof": []
        }
    ]
}

web3.eth.getProof(
    "0x1234567890123456789012345678901234567890",
    ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
    undefined,
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> {
    "address": "0x1234567890123456789012345678901234567890",
    "accountProof": [
        "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
        "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
        "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
        "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
    ],
    "balance": 0,
    "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    "nonce": 0,
    "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "storageProof": [
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value": 0,
            "proof": []
        },
        {
            "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value": 0,
            "proof": []
        }
    ]
}
```

#### Defined in

[web3-eth/src/web3_eth.ts:1419](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1419)

___

### getProtocolVersion

▸ **getProtocolVersion**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

Returns the ethereum protocol version of the node.

```ts
web3.eth.getProtocolVersion().then(console.log);
> "63"
```

#### Defined in

[web3-eth/src/web3_eth.ts:113](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L113)

___

### getStorageAt

▸ **getStorageAt**\<`ReturnFormat`\>(`address`, `storageSlot`, `blockNumber?`, `returnFormat?`): `Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

Get the storage at a specific position of an address.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to get the storage from. |
| `storageSlot` | `Numbers` | The index position of the storage. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) Specifies what block to use as the current state for the storage query. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

The value in storage at the given position.

```ts
web3.eth.getStorageAt("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234", 0).then(console.log);
> "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"

web3.eth.getStorageAt(
     "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234",
     0,
     undefined,
     { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
).then(console.log);
> Uint8Array(31) [
      3, 52,  86, 115,  33,  35, 255, 255,
      35, 66,  52,  45, 209,  35,  66,  67,
      67, 36,  35,  66,  52, 253,  35,  79,
      210, 63, 212, 242,  61,  66,  52
   ]
```

#### Defined in

[web3-eth/src/web3_eth.ts:303](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L303)

___

### getTransaction

▸ **getTransaction**\<`ReturnFormat`\>(`transactionHash`, `returnFormat?`): `Promise`\<\{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas`: `string` ; `maxPriorityFeePerGas`: `string` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList?`: `undefined` ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v`: `string` ; `value`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | `Bytes` | The hash of the desired transaction. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<\{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas`: `string` ; `maxPriorityFeePerGas`: `string` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList?`: `undefined` ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v`: `string` ; `value`: `string`  }\>

The desired transaction object.

```ts
web3.eth.getTransaction('0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc').then(console.log);
{
   hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
   type: 0n,
   nonce: 0n,
   blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
   blockNumber: 1n,
   transactionIndex: 0n,
   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
   to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
   value: 1n,
   gas: 90000n,
   gasPrice: 2000000000n,
   input: '0x',
   v: 2709n,
   r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
   s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 }

web3.eth.getTransaction(
    web3.utils.hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
{
   hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
   type: 0,
   nonce: 0,
   blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
   blockNumber: 1,
   transactionIndex: 0,
   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
   to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
   value: 1,
   gas: 90000,
   gasPrice: 2000000000,
   input: '0x',
   v: 2709,
   r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
   s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 }
```

#### Defined in

[web3-eth/src/web3_eth.ts:591](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L591)

___

### getTransactionCount

▸ **getTransactionCount**\<`ReturnFormat`\>(`address`, `blockNumber?`, `returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to get the number of transactions for. |
| `blockNumber` | `BlockNumberOrTag` | (BlockNumberOrTag defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) Specifies what block to use as the current state for the query. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

The number of transactions sent from the provided address.

```ts
web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
> 1n

web3.eth.getTransactionCount(
    "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    undefined,
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> 1
```

#### Defined in

[web3-eth/src/web3_eth.ts:835](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L835)

___

### getTransactionFromBlock

▸ **getTransactionFromBlock**\<`ReturnFormat`\>(`block?`, `transactionIndex`, `returnFormat?`): `Promise`\<`undefined` \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas`: `string` ; `maxPriorityFeePerGas`: `string` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList?`: `undefined` ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v`: `string` ; `value`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `BlockNumberOrTag` | The BlockNumberOrTag (defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) or block hash of the desired block. |
| `transactionIndex` | `Numbers` | The index position of the transaction. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`undefined` \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas`: `string` ; `maxPriorityFeePerGas`: `string` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList`: \{ readonly address?: string \| undefined; readonly storageKeys?: string[] \| undefined; }[] ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v?`: `undefined` ; `value`: `string` ; `yParity`: `string`  } \| \{ `accessList?`: `undefined` ; `blockHash?`: `string` ; `blockNumber?`: `string` ; `chainId?`: `string` ; `data?`: `string` ; `from`: `string` ; `gas`: `string` ; `gasPrice`: `string` ; `hash`: `string` ; `input`: `string` ; `maxFeePerGas?`: `undefined` ; `maxPriorityFeePerGas?`: `undefined` ; `nonce`: `string` ; `r`: `string` ; `s`: `string` ; `to?`: ``null`` \| `string` ; `transactionIndex?`: `string` ; `type`: `string` ; `v`: `string` ; `value`: `string`  }\>

The desired transaction object.

```ts
web3.eth.getTransactionFromBlock('0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00', 0).then(console.log);
{
   hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
   type: 0n,
   nonce: 0n,
   blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
   blockNumber: 1n,
   transactionIndex: 0n,
   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
   to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
   value: 1n,
   gas: 90000n,
   gasPrice: 2000000000n,
   input: '0x',
   v: 2709n,
   r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
   s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 }

web3.eth.getTransactionFromBlock(
    hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
    0,
    { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
{
   hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
   type: 0,
   nonce: 0,
   blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
   blockNumber: 1,
   transactionIndex: 0,
   from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
   to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
   value: 1,
   gas: 90000,
   gasPrice: 2000000000,
   input: '0x',
   v: 2709,
   r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
   s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
 }
```

#### Defined in

[web3-eth/src/web3_eth.ts:744](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L744)

___

### getTransactionReceipt

▸ **getTransactionReceipt**\<`ReturnFormat`\>(`transactionHash`, `returnFormat?`): `Promise`\<`TransactionReceipt`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionHash` | `Bytes` | Hash of the transaction to retrieve the receipt for. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`TransactionReceipt`\>

The desired TransactionReceipt object.

```ts
web3.eth.getTransactionReceipt("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f").then(console.log);
> {
     transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     transactionIndex: 0n,
     blockNumber: 2n,
     blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     cumulativeGasUsed: 21000n,
     gasUsed: 21000n,
     logs: [],
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     status: 1n,
     effectiveGasPrice: 2000000000n,
     type: 0n
 }

web3.eth.getTransactionReceipt(
     "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> {
     transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     transactionIndex: 0,
     blockNumber: 2,
     blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     cumulativeGasUsed: 21000,
     gasUsed: 21000,
     logs: [],
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     status: 1,
     effectiveGasPrice: 2000000000,
     type: 0n
 }
```

#### Defined in

[web3-eth/src/web3_eth.ts:803](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L803)

___

### getUncle

▸ **getUncle**\<`ReturnFormat`\>(`block?`, `uncleIndex`, `returnFormat?`): `Promise`\<\{ `baseFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `difficulty?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `extraData`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `gasLimit`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsed`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `logsBloom?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `miner`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `mixHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `number`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `parentHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `receiptsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `sha3Uncles`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `size`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `stateRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `timestamp`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `totalDifficulty`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `transactions`: `string`[] \| \{ readonly blockHash?: ByteTypes[ReturnFormat["bytes"]] \| undefined; readonly blockNumber?: NumberTypes[ReturnFormat["number"]] \| undefined; ... 23 more ...; s?: ByteTypes[ReturnFormat["bytes"]] \| undefined; }[] ; `transactionsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `uncles`: `string`[]  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `BlockNumberOrTag` | The BlockNumberOrTag (defaults to [Web3Eth.defaultBlock](Web3Eth.md#defaultblock)) or block hash of the desired block. |
| `uncleIndex` | `Numbers` | The index position of the uncle. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<\{ `baseFeePerGas?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `difficulty?`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `extraData`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `gasLimit`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `gasUsed`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `hash?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `logsBloom?`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `miner`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `mixHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `nonce`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `number`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `parentHash`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `receiptsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `sha3Uncles`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `size`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `stateRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `timestamp`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `totalDifficulty`: `NumberTypes`[`ReturnFormat`[``"number"``]] ; `transactions`: `string`[] \| \{ readonly blockHash?: ByteTypes[ReturnFormat["bytes"]] \| undefined; readonly blockNumber?: NumberTypes[ReturnFormat["number"]] \| undefined; ... 23 more ...; s?: ByteTypes[ReturnFormat["bytes"]] \| undefined; }[] ; `transactionsRoot`: `ByteTypes`[`ReturnFormat`[``"bytes"``]] ; `uncles`: `string`[]  }\>

A blocks [uncle](https://ethereum.org/en/glossary/#ommer) by a given uncle index position.

```ts
web3.eth.getUncle(0, 1).then(console.log);
> {
   hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
   parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
   miner: '0x0000000000000000000000000000000000000000',
   stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
   transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
   difficulty: 1n,
   number: 0n,
   gasLimit: 30000000n,
   gasUsed: 0n,
   timestamp: 1658281638n,
   extraData: '0x',
   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   nonce: 0n,
   totalDifficulty: 1n,
   baseFeePerGas: 1000000000n,
   size: 514n,
   transactions: [],
   uncles: []
 }

web3.eth.getUncle(
     "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
     1,
     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
).then(console.log);
> {
   hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
   parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
   miner: '0x0000000000000000000000000000000000000000',
   stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
   transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
   difficulty: 1,
   number: 0,
   gasLimit: 30000000,
   gasUsed: 0,
   timestamp: 1658281638,
   extraData: '0x',
   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   nonce: 0,
   totalDifficulty: 1,
   baseFeePerGas: 1000000000,
   size: 514,
   transactions: [],
   uncles: []
 }
```

#### Defined in

[web3-eth/src/web3_eth.ts:535](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L535)

___

### getWork

▸ **getWork**(): `Promise`\<[`string`, `string`, `string`]\>

Gets work for miners to mine on. Returns the hash of the current block, the seedHash, and the boundary condition to be met ('target').

#### Returns

`Promise`\<[`string`, `string`, `string`]\>

The mining work as an array of strings with the following structure:

String 32 Bytes - at index 0: current block header pow-hash
String 32 Bytes - at index 1: the seed hash used for the DAG.
String 32 Bytes - at index 2: the boundary condition ('target'), 2^256 / difficulty.

```ts
web3.eth.getWork().then(console.log);
> [
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "0x5EED00000000000000000000000000005EED0000000000000000000000000000",
    "0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000"
]
```

#### Defined in

[web3-eth/src/web3_eth.ts:1270](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1270)

___

### isMining

▸ **isMining**(): `Promise`\<`boolean`\>

Checks whether the node is mining or not.

#### Returns

`Promise`\<`boolean`\>

`true` if the node is mining, otherwise `false`.

```ts
web3.eth.isMining().then(console.log);
> true
```

#### Defined in

[web3-eth/src/web3_eth.ts:161](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L161)

___

### isSyncing

▸ **isSyncing**(): `Promise`\<`SyncingStatusAPI`\>

Checks if the node is currently syncing.

#### Returns

`Promise`\<`SyncingStatusAPI`\>

Either a SyncingStatusAPI, or `false`.

```ts
web3.eth.isSyncing().then(console.log);
> {
    startingBlock: 100,
    currentBlock: 312,
    highestBlock: 512,
    knownStates: 234566,
    pulledStates: 123455
}
```

#### Defined in

[web3-eth/src/web3_eth.ts:134](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L134)

___

### link

▸ **link**\<`T`\>(`parentContext`): `void`

Link current context to another context.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Web3Context`\<`unknown`, `any`, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentContext` | `T` |

#### Returns

`void`

#### Inherited from

Web3Context.link

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:70

___

### requestAccounts

▸ **requestAccounts**(): `Promise`\<`string`[]\>

This method will request/enable the accounts from the current environment and for supporting [EIP 1102](https://eips.ethereum.org/EIPS/eip-1102)
This method will only work if you’re using the injected provider from a application like Metamask, Status or TrustWallet.
It doesn’t work if you’re connected to a node with a default Web3.js provider (WebsocketProvider, HttpProvider and IpcProvider).
For more information about the behavior of this method please read [EIP-1102](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md): Opt-in account exposure.

#### Returns

`Promise`\<`string`[]\>

An array of enabled accounts.

```ts
web3.eth.requestAccounts().then(console.log);
> ['0aae0B295369a9FD31d5F28D9Ec85E40f4cb692BAf', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']
```

#### Defined in

[web3-eth/src/web3_eth.ts:1313](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1313)

___

### sendSignedTransaction

▸ **sendSignedTransaction**\<`ReturnFormat`\>(`transaction`, `returnFormat?`, `options?`): `Web3PromiEvent`\<`TransactionReceipt`, `SendSignedTransactionEvents`\<`ReturnFormat`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Bytes` | Signed transaction in one of the valid Bytes format. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |
| `options?` | `SendTransactionOptions`\<`TransactionReceipt`\> | A configuration object used to change the behavior of the method |

#### Returns

`Web3PromiEvent`\<`TransactionReceipt`, `SendSignedTransactionEvents`\<`ReturnFormat`\>\>

If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
```ts
const signedTransaction = "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"

const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction);
console.log(transactionHash);
> 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700

web3.eth.sendSignedTransaction(signedTransaction).then(console.log);
> 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700

web3.eth.sendSignedTransaction(signedTransaction).catch(console.log);
> <Some TransactionError>
```

Otherwise, a Web3PromiEvent is returned which has several events than can be listened to using the `.on` syntax, such as:
- `sending`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
> "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
```
- `sent`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('sent', sentTransaction => console.log(sentTransaction));
> "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
```
- `transactionHash`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('transactionHash', transactionHash => console.log(transactionHash));
> 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
```
- `receipt`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('receipt', receipt => console.log(receipt));
> {
     blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
     blockNumber: 1n,
     cumulativeGasUsed: 21000n,
     effectiveGasPrice: 1000000001n,
     from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     gasUsed: 21000n,
     logs: [],
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     status: 1n,
     to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
     transactionIndex: 0n,
     type: 0n
}
```
- `confirmation`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('confirmation', confirmation => console.log(confirmation));
> {
    confirmations: 1n,
    receipt: {
         blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
         blockNumber: 1n,
         cumulativeGasUsed: 21000n,
         effectiveGasPrice: 1000000001n,
         from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
         gasUsed: 21000n,
         logs: [],
         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
         status: 1n,
         to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
         transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
         transactionIndex: 0n,
         type: 0n
    },
    latestBlockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081'
}
```
- `error`
```ts
web3.eth.sendSignedTransaction(signedTransaction).on('error', error => console.log(error));
> <Some TransactionError>
```

#### Defined in

[web3-eth/src/web3_eth.ts:1047](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1047)

___

### sendTransaction

▸ **sendTransaction**\<`ReturnFormat`\>(`transaction`, `returnFormat?`, `options?`): `Web3PromiEvent`\<`TransactionReceipt`, `SendTransactionEvents`\<`ReturnFormat`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` \| `TransactionWithFromLocalWalletIndex` \| `TransactionWithToLocalWalletIndex` \| `TransactionWithFromAndToLocalWalletIndex` | The Transaction, TransactionWithFromLocalWalletIndex, TransactionWithToLocalWalletIndex or TransactionWithFromAndToLocalWalletIndex to send. __Note:__ In the `to` and `from` fields when hex strings are used, it is assumed they are addresses, for any other form (number, string number, etc.) it is assumed they are wallet indexes. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |
| `options?` | `SendTransactionOptions`\<`TransactionReceipt`\> | A configuration object used to change the behavior of the `sendTransaction` method. |

#### Returns

`Web3PromiEvent`\<`TransactionReceipt`, `SendTransactionEvents`\<`ReturnFormat`\>\>

If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
```ts
const transaction = {
  from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
  to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
  value: '0x1'
}

const transactionHash = await web3.eth.sendTransaction(transaction);
console.log(transactionHash);
> 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f

web3.eth.sendTransaction(transaction).then(console.log);
> 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f

web3.eth.sendTransaction(transaction).catch(console.log);
> <Some TransactionError>

// Example using options.ignoreGasPricing = true
web3.eth.sendTransaction(transaction, undefined, { ignoreGasPricing: true }).then(console.log);
> 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
```

Otherwise, a Web3PromiEvent is returned which has several events than can be listened to using the `.on` syntax, such as:
- `sending`
```ts
web3.eth.sendTransaction(transaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
> {
   from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
   to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
   value: '0x1',
   gasPrice: '0x77359400',
   maxPriorityFeePerGas: undefined,
   maxFeePerGas: undefined
}
```
- `sent`
```ts
web3.eth.sendTransaction(transaction).on('sent', sentTransaction => console.log(sentTransaction));
> {
   from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
   to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
   value: '0x1',
   gasPrice: '0x77359400',
   maxPriorityFeePerGas: undefined,
   maxFeePerGas: undefined
}
```
- `transactionHash`
```ts
web3.eth.sendTransaction(transaction).on('transactionHash', transactionHash => console.log(transactionHash));
> 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
```
- `receipt`
```ts
web3.eth.sendTransaction(transaction).on('receipt', receipt => console.log(receipt));
> {
     transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     transactionIndex: 0n,
     blockNumber: 2n,
     blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     cumulativeGasUsed: 21000n,
     gasUsed: 21000n,
     logs: [],
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     status: 1n,
     effectiveGasPrice: 2000000000n,
     type: 0n
}
```
- `confirmation`
```ts
web3.eth.sendTransaction(transaction).on('confirmation', confirmation => console.log(confirmation));
> {
    confirmations: 1n,
    receipt: {
        transactionHash: '0xb4a3a35ae0f3e77ef0ff7be42010d948d011b21a4e341072ee18717b67e99ab8',
        transactionIndex: 0n,
        blockNumber: 5n,
        blockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548',
        from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
        to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
        cumulativeGasUsed: 21000n,
        gasUsed: 21000n,
        logs: [],
        logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        status: 1n,
        effectiveGasPrice: 2000000000n,
        type: 0n
    },
    latestBlockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548'
}
```
- `error`
```ts
web3.eth.sendTransaction(transaction).on('error', error => console.log);
> <Some TransactionError>
```

#### Defined in

[web3-eth/src/web3_eth.ts:951](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L951)

___

### setProvider

▸ **setProvider**(`provider?`): `boolean`

Will set the provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider?` | `string` \| `SupportedProviders`\<`Web3EthExecutionAPI`\> | SupportedProviders The provider to set |

#### Returns

`boolean`

Returns true if the provider was set

#### Inherited from

Web3Context.setProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:153

___

### sign

▸ **sign**\<`ReturnFormat`\>(`message`, `addressOrIndex`, `returnFormat?`): `Promise`\<\{ `message?`: `string` ; `messageHash`: `string` ; `r`: `string` ; `s`: `string` ; `signature`: `string` ; `v`: `string`  } \| `ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Bytes` | Data to sign in one of the valid Bytes format. |
| `addressOrIndex` | `string` | - |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<\{ `message?`: `string` ; `messageHash`: `string` ; `r`: `string` ; `s`: `string` ; `signature`: `string` ; `v`: `string`  } \| `ByteTypes`[`ReturnFormat`[``"bytes"``]]\>

The signed `message`.

```ts
// Using an unlocked account managed by connected RPC client
web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe").then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

// Using an unlocked account managed by connected RPC client
web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.UINT8ARRAY }).then(console.log);
> Uint8Array(65) [
   48, 117,  94, 214,  83, 150, 250, 207, 134, 197,  62,
   98,  23, 197,  43,  77, 174, 190, 114, 170,  73,  65,
  216, 150,  53,  64, 157, 228, 201, 199, 249,  70, 109,
   78, 154, 174, 199, 151, 127,   5, 233,  35, 136, 155,
   51, 192, 208, 221,  39, 215,  34, 107, 110, 111,  86,
  206, 115, 116, 101, 197, 207, 208,  75, 228,   0
]
```

// Using an indexed account managed by local Web3 wallet
web3.eth.sign("0x48656c6c6f20776f726c64", 0).then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

#### Defined in

[web3-eth/src/web3_eth.ts:1082](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1082)

___

### signTransaction

▸ **signTransaction**\<`ReturnFormat`\>(`transaction`, `returnFormat?`): `Promise`\<`SignedTransactionInfoAPI`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `Transaction` | The transaction object to sign. |
| `returnFormat` | `ReturnFormat` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) Specifies how the return data should be formatted. |

#### Returns

`Promise`\<`SignedTransactionInfoAPI`\>

SignedTransactionInfoAPI, an object containing the [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/#top) encoded signed transaction (accessed via the `raw` property) and the signed transaction object (accessed via the `tx` property).

```ts
const transaction = {
     from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     value: '0x1',
     gas: '21000',
     gasPrice: await web3Eth.getGasPrice(),
     nonce: '0x1',
     type: '0x0'
}

web3.eth.signTransaction(transaction).then(console.log);
> {
  raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
  tx: {
     type: 0n,
     nonce: 1n,
     gasPrice: 1000000001n,
     gas: 21000n,
     value: 1n,
     v: 2710n,
     r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
     s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     data: '0x'
  }
}

web3.eth.signTransaction(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
> {
  raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
  tx: {
     type: 0,
     nonce: 1,
     gasPrice: 1000000001,
     gas: 21000,
     value: 1,
     v: 2710,
     r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
     s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     data: '0x'
  }
}
```

#### Defined in

[web3-eth/src/web3_eth.ts:1141](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1141)

___

### signTypedData

▸ **signTypedData**\<`ReturnFormat`\>(`address`, `typedData`, `useLegacy?`, `returnFormat?`): `Promise`\<`string`\>

This method sends EIP-712 typed data to the RPC provider to be signed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | The address that corresponds with the private key used to sign the typed data. |
| `typedData` | `Eip712TypedData` | `undefined` | The EIP-712 typed data object. |
| `useLegacy` | `boolean` | `false` | A boolean flag determining whether the RPC call uses the legacy method `eth_signTypedData` or the newer method `eth_signTypedData_v4` |
| `returnFormat` | `ReturnFormat` | `undefined` | (DataFormat defaults to DEFAULT_RETURN_FORMAT) - Specifies how the signed typed data should be formatted. |

#### Returns

`Promise`\<`string`\>

The signed typed data.

#### Defined in

[web3-eth/src/web3_eth.ts:1552](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1552)

___

### submitWork

▸ **submitWork**(`nonce`, `hash`, `digest`): `Promise`\<`boolean`\>

Used for submitting a proof-of-work solution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonce` | `string` | The nonce found (8 bytes). |
| `hash` | `string` | The header’s pow-hash (32 bytes). |
| `digest` | `string` | The mix digest (32 bytes). |

#### Returns

`Promise`\<`boolean`\>

Returns `true` if the provided solution is valid, otherwise `false`.

```ts
web3.eth.submitWork([
    "0x0000000000000001",
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000"
]).then(console.log);
> true
```

#### Defined in

[web3-eth/src/web3_eth.ts:1291](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1291)

___

### subscribe

▸ **subscribe**\<`T`, `ReturnType`\>(`name`, `args?`, `returnFormat?`): `Promise`\<`InstanceType`\<`RegisteredSubscription`[`T`]\>\>

Lets you subscribe to specific events in the blockchain.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `RegisteredSubscription` |
| `ReturnType` | extends `DataFormat` = `DataFormat` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `T` | The subscription you want to subscribe to. |
| `args?` | `ConstructorParameters`\<`RegisteredSubscription`[`T`]\>[``0``] | Optional additional parameters, depending on the subscription type. |
| `returnFormat` | `ReturnType` | - |

#### Returns

`Promise`\<`InstanceType`\<`RegisteredSubscription`[`T`]\>\>

A subscription object of type RegisteredSubscription. The object contains:
 - subscription.id: The subscription id, used to identify and unsubscribing the subscription.
 - subscription.subscribe(): Can be used to re-subscribe with the same parameters.
 - subscription.unsubscribe(): Unsubscribes the subscription and returns TRUE in the callback if successful.
 - subscription.args: The subscription arguments, used when re-subscribing.

You can use the subscription object to listen on:

- on("data") - Fires on each incoming log with the log object as argument.
- on("changed") - Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
- on("error") - Fires when an error in the subscription occurs.
- on("connected") - Fires once after the subscription successfully connected. Returns the subscription id.

**`Example`**

**Subscribe to Smart Contract events**
```ts
// Subscribe to `logs`
const logSubscription = web3.eth.subscribe('logs', {
    address: '0x1234567890123456789012345678901234567890',
    topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
});
logSubscription.on('data', (data: any) => console.log(data));
logSubscription.on('error', (error: any) => console.log(error));

```

**`Example`**

**Subscribe to new block headers**
```ts
// Subscribe to `newBlockHeaders`
const newBlocksSubscription = await web3.eth.subscribe('newBlockHeaders');

newBlocksSubscription.on('data', async blockhead => {
	console.log('New block header: ', blockhead);

	// You do not need the next line, if you like to keep notified for every new block
	await newBlocksSubscription.unsubscribe();
	console.log('Unsubscribed from new block headers.');
});
newBlocksSubscription.on('error', error =>
	console.log('Error when subscribing to New block header: ', error),
);
```

#### Defined in

[web3-eth/src/web3_eth.ts:1609](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth/src/web3_eth.ts#L1609)

___

### use

▸ **use**\<`T`, `T2`\>(`ContextRef`, `...args`): `T`

Use to create new object of any type extended by `Web3Context`
and link it to current context. This can be used to initiate a global context object
and then use it to create new objects of any type extended by `Web3Context`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Web3Context`\<`unknown`, `any`, `T`\> |
| `T2` | extends `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `ContextRef` | `Web3ContextConstructor`\<`T`, `T2`\> |
| `...args` | [...T2[]] |

#### Returns

`T`

#### Inherited from

Web3Context.use

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:66
