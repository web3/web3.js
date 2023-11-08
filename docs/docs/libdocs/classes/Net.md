# Class: Net

Net class allows you to interact with an Ethereum node’s network properties.

## Hierarchy

- `Web3Context`\<`Web3NetAPI`\>

  ↳ **`Net`**

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

### extend

▸ **extend**(`extendObj`): [`Net`](Net.md)

This method allows extending the web3 modules.
Note: This method is only for backward compatibility, and It is recommended to use Web3 v4 Plugin feature for extending web3.js functionality if you are developing some thing new.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendObj` | `ExtensionObject` |

#### Returns

[`Net`](Net.md)

#### Inherited from

Web3Context.extend

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:162

___

### getId

▸ **getId**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

Gets the current network ID

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | Return format |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

A Promise of the network ID.

**`Example`**

```ts
const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
await net.getId();
> 1
```

#### Defined in

[web3-net/src/net.ts:38](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-net/src/net.ts#L38)

___

### getPeerCount

▸ **getPeerCount**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

Get the number of peers connected to.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat` | `ReturnFormat` | Return format |

#### Returns

`Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\>

A promise of the number of the peers connected to.

**`Example`**

```ts
const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
await net.getPeerCount();
> 0
```

#### Defined in

[web3-net/src/net.ts:56](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-net/src/net.ts#L56)

___

### isListening

▸ **isListening**(): `Promise`\<`boolean`\>

Check if the node is listening for peers

#### Returns

`Promise`\<`boolean`\>

A promise of a boolean if the node is listening to peers

**`Example`**

```ts
const net = new Net(Net.givenProvider || 'ws://some.local-or-remote.node:8546');
await net.isListening();
> true
```

#### Defined in

[web3-net/src/net.ts:73](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-net/src/net.ts#L73)

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

### setProvider

▸ **setProvider**(`provider?`): `boolean`

Will set the provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider?` | `string` \| `SupportedProviders`\<`Web3NetAPI`\> | SupportedProviders The provider to set |

#### Returns

`boolean`

Returns true if the provider was set

#### Inherited from

Web3Context.setProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:153

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
