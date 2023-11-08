# Class: Personal

Eth Personal allows you to interact with the Ethereum node’s accounts.

## Hierarchy

- `Web3Context`\<`EthPersonalAPI`\>

  ↳ **`Personal`**

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

### ecRecover

▸ **ecRecover**(`signedData`, `signature`): `Promise`\<`string`\>

Recovers the account that signed the data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signedData` | `string` | Data that was signed. If String it will be converted using utf8ToHex |
| `signature` | `string` | The signature |

#### Returns

`Promise`\<`string`\>

- The address of the account that signed the data.

**`Example`**

```ts
 const address = await personal.ecRecover(
	"Hello world",
	"0x5d21d01b3198ac34d0585a9d76c4d1c8123e5e06746c8962318a1c08ffb207596e6fce4a6f377b7c0fc98c5f646cd73438c80e8a1a95cbec55a84c2889dca0301b"
);
console.log(address);
> 0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e
```

#### Defined in

[web3-eth-personal/src/personal.ts:228](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L228)

___

### extend

▸ **extend**(`extendObj`): [`Personal`](Personal.md)

This method allows extending the web3 modules.
Note: This method is only for backward compatibility, and It is recommended to use Web3 v4 Plugin feature for extending web3.js functionality if you are developing some thing new.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendObj` | `ExtensionObject` |

#### Returns

[`Personal`](Personal.md)

#### Inherited from

Web3Context.extend

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:162

___

### getAccounts

▸ **getAccounts**(): `Promise`\<`string`[]\>

Returns a list of accounts the node controls by using the provider and calling the RPC method personal_listAccounts. Using `web3.eth.accounts.create()` will not add accounts into this list. For that use `web3.eth.personal.newAccount()`.

#### Returns

`Promise`\<`string`[]\>

- An array of addresses controlled by the node.

**`Example`**

```ts
 const accounts = await personal.getAccounts();
console.log(accounts);
>
[
	'0x79D7BbaC53C9aF700d0B250e9AE789E503Fcd6AE',
	'0xe2597eB05CF9a87eB1309e86750C903EC38E527e',
	'0x7eD0e85B8E1E925600B4373e6d108F34AB38a401',
	'0xE4bEEf667408b99053dC147Ed19592aDa0d77F59',
	'0x7AB80aeB6bb488B7f6c41c58e83Ef248eB39c882',
	'0x12B1D9d74d73b1C3A245B19C1C5501c653aF1af9',
	'0x1a6075A263Ee140e00Dbf8E374Fc5A443d097894',
	'0x4FEC0A51024B13030D26E70904B066C6d41157A5',
	'0x03095dc4857BB26f3a4550c5651Df8b7f6b6B1Ef',
	'0xac0B9b6e8A17991cb172B2ABAF45Fb5eb769E540'
]
```

#### Defined in

[web3-eth-personal/src/personal.ts:49](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L49)

___

### importRawKey

▸ **importRawKey**(`keyData`, `passphrase`): `Promise`\<`string`\>

Imports the given private key into the key store, encrypting it with the passphrase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keyData` | `string` | An unencrypted private key (hex string). |
| `passphrase` | `string` | The password of the account |

#### Returns

`Promise`\<`string`\>

- The address of the new account.

**`Example`**

```ts
const accountAddress = await personal.importRawKey(
	"abe40cb08850da918ee951b237fa87946499b2d8643e4aa12b0610b050c731f6",
	"123456"
);

console.log(unlockTx);
> 0x8727a8b34ec833154b72b62cac05d69f86eb6556
```

#### Defined in

[web3-eth-personal/src/personal.ts:115](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L115)

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

### lockAccount

▸ **lockAccount**(`address`): `Promise`\<`boolean`\>

Locks the given account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the account to lock. |

#### Returns

`Promise`\<`boolean`\>

- `true` if the account was locked, otherwise `false`.

**`Example`**

```ts
await personal.lockAccount(
	"0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e"
);

#### Defined in

[web3-eth-personal/src/personal.ts:96](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L96)

___

### newAccount

▸ **newAccount**(`password`): `Promise`\<`string`\>

Creates a new account and returns its address.
**_NOTE:_**  This function sends a sensitive information like password. Never call this function over a unsecured Websocket or HTTP provider, as your password will be sent in plain text!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | The password to encrypt the account with. |

#### Returns

`Promise`\<`string`\>

- The address of the new account.

**`Example`**

```ts
const addr = await web3.eth.personal.newAccount('password');
console.log(addr);
> '0x1234567891011121314151617181920212223456'
```

#### Defined in

[web3-eth-personal/src/personal.ts:65](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L65)

___

### sendTransaction

▸ **sendTransaction**(`tx`, `passphrase`): `Promise`\<`string`\>

This method sends a transaction over the management API.
**_NOTE:_** Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `Transaction` | The transaction options |
| `passphrase` | `string` | The passphrase of the current account |

#### Returns

`Promise`\<`string`\>

- The transaction hash

**`Example`**

```ts
const txHash = personal
.sendTransaction({
 	from: "0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e",
	gasPrice: "20000000000",
	gas: "21000",
	to: "0x3535353535353535353535353535353535353535",
	value: "1000000",
	data: "",
	nonce: 0,
},
"123456");

console.log(txHash);
> 0x9445325c3c5638c9fe425b003b8c32f03e9f99d409555a650a6838ba712bb51b
```

#### Defined in

[web3-eth-personal/src/personal.ts:143](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L143)

___

### setProvider

▸ **setProvider**(`provider?`): `boolean`

Will set the provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider?` | `string` \| `SupportedProviders`\<`EthPersonalAPI`\> | SupportedProviders The provider to set |

#### Returns

`boolean`

Returns true if the provider was set

#### Inherited from

Web3Context.setProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:153

___

### sign

▸ **sign**(`data`, `address`, `passphrase`): `Promise`\<`string`\>

Calculates an Ethereum specific signature with:
sign(keccak256("\x19Ethereum Signed Message:\n" + dataToSign.length + dataToSign)))
Adding a prefix to the message makes the calculated signature recognisable as an Ethereum specific signature.

If you have the original message and the signed message, you can discover the signing account address using web3.eth.personal.ecRecover
**_NOTE:_** Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | The data to sign. |
| `address` | `string` | The address to sign with. |
| `passphrase` | `string` | The passphrase to decrypt the account with. |

#### Returns

`Promise`\<`string`\>

- The signature.

**`Example`**

```ts
const sig = await personal .sign("Hello world", "0x0D4Aa485ECbC499c70860fEb7e5AaeAf5fd8172E", "123456")
console.log(sig)
> 0x5d21d01b3198ac34d0585a9d76c4d1c8123e5e06746c8962318a1c08ffb207596e6fce4a6f377b7c0fc98c5f646cd73438c80e8a1a95cbec55a84c2889dca0301b
```

#### Defined in

[web3-eth-personal/src/personal.ts:209](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L209)

___

### signTransaction

▸ **signTransaction**(`tx`, `passphrase`): `Promise`\<`string`\>

Signs a transaction. This account needs to be unlocked.
**_NOTE:_** Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `Transaction` | The transaction data to sign. See [sendTransaction](Personal.md#sendtransaction) for more information. |
| `passphrase` | `string` | The password of the `from` account, to sign the transaction with. |

#### Returns

`Promise`\<`string`\>

- The RLP encoded transaction. The `raw` property can be used to send the transaction using sendSignedTransaction.

**`Example`**

```ts
const tx = personal
.signTransaction({
	from: "0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e",
	gasPrice: "20000000000",
	gas: "21000",
	to: "0x3535353535353535353535353535353535353535",
	value: "1000000000000000000",
	data: "",
	nonce: 0,
},
"123456");

console.log(tx);

> {
	raw: '0xf86e808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080820a95a0c951c03238fe930e6e69ab9d6af9f29248a514048e44884f0e60c4de40de3526a038b71399bf0c8925749ab79e91ce6cd2fc068c84c18ff6a197b48c4cbef01e00',
	tx: {
	type: '0x0',
	nonce: '0x0',
	gasPrice: '0x4a817c800',
	maxPriorityFeePerGas: null,
	maxFeePerGas: null,
	gas: '0x5208',
	value: '0xde0b6b3a7640000',
	input: '0x',
	v: '0xa95',
	r: '0xc951c03238fe930e6e69ab9d6af9f29248a514048e44884f0e60c4de40de3526',
	s: '0x38b71399bf0c8925749ab79e91ce6cd2fc068c84c18ff6a197b48c4cbef01e00',
	to: '0x3535353535353535353535353535353535353535',
	hash: '0x65e3df790ab2a32068b13cff970b26445b8995229ae4abbed61bd996f09fce69'
	}
}
```

#### Defined in

[web3-eth-personal/src/personal.ts:188](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L188)

___

### unlockAccount

▸ **unlockAccount**(`address`, `password`, `unlockDuration`): `Promise`\<`boolean`\>

Unlocks an account for a given duration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address of the account to unlock. |
| `password` | `string` | The password of the account to unlock. |
| `unlockDuration` | `number` | The duration in seconds to unlock the account for. |

#### Returns

`Promise`\<`boolean`\>

**`Example`**

```ts
await personal.unlockAccount(
	"0x0d4aa485ecbc499c70860feb7e5aaeaf5fd8172e",
	"123456",
	600
);
```

#### Defined in

[web3-eth-personal/src/personal.ts:83](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-personal/src/personal.ts#L83)

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
