# Class: Contract\<Abi\>

The class designed to interact with smart contracts on the Ethereum blockchain.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Abi` | extends `ContractAbi` |

## Hierarchy

- `Web3Context`\<`EthExecutionAPI`, typeof `contractSubscriptions`\>

  ↳ **`Contract`**

## Implements

- `Web3EventEmitter`\<`ContractEventEmitterInterface`\<`Abi`\>\>

## Constructors

### constructor

• **new Contract**\<`Abi`\>(`jsonInterface`, `context?`, `returnFormat?`): [`Contract`](Contract.md)\<`Abi`\>

Creates a new contract instance with all its methods and events defined in its {@doclink glossary/json_interface | json interface} object.

```ts
new web3.eth.Contract(jsonInterface[, address][, options])
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Abi` | extends readonly `AbiFragment`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsonInterface` | `Abi` | The JSON interface for the contract to instantiate. |
| `context?` | `Web3Context`\<`unknown`, `any`\> \| `Partial`\<`Web3ContextInitOptions`\<`EthExecutionAPI`, \{ `logs`: typeof `LogsSubscription` ; `newBlockHeaders`: typeof `NewHeadsSubscription` ; `newHeads`: typeof `NewHeadsSubscription`  }\>\> | The context of the contract used for customizing the behavior of the contract. |
| `returnFormat?` | `DataFormat` | - |

#### Returns

[`Contract`](Contract.md)\<`Abi`\>

- The contract instance with all its methods and events.

```ts title="Example"
var myContract = new web3.eth.Contract([...], '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
  from: '0x1234567890123456789012345678901234567891', // default from address
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
```

To use the type safe interface for these contracts you have to include the ABI definitions in your Typescript project and then declare these as `const`.

```ts title="Example"
const myContractAbi = [....] as const; // ABI definitions
const myContract = new web3.eth.Contract(myContractAbi, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
```

#### Overrides

Web3Context\&lt;EthExecutionAPI, typeof contractSubscriptions\&gt;.constructor

#### Defined in

[web3-eth-contract/src/contract.ts:273](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L273)

## Properties

### options

• `Readonly` **options**: `ContractOptions`

The options `object` for the contract instance. `from`, `gas` and `gasPrice` are used as fallback values when sending transactions.

```ts
myContract.options;
> {
    address: '0x1234567890123456789012345678901234567891',
    jsonInterface: [...],
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    gasPrice: '10000000000000',
    gas: 1000000
}

myContract.options.from = '0x1234567890123456789012345678901234567891'; // default from address
myContract.options.gasPrice = '20000000000000'; // default gas price in wei
myContract.options.gas = 5000000; // provide as fallback always 5M gas
```

#### Defined in

[web3-eth-contract/src/contract.ts:218](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L218)

___

### syncWithContext

• **syncWithContext**: `boolean` = `false`

Set to true if you want contracts' defaults to sync with global defaults.

#### Defined in

[web3-eth-contract/src/contract.ts:223](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L223)

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

### events

• `get` **events**(): `ContractEventsInterface`\<`Abi`, `ContractEvents`\<`Abi`\>\>

Subscribe to an event.

```ts
await myContract.events.MyEvent([options])
```

There is a special event `allEvents` that can be used to subscribe all events.

```ts
await myContract.events.allEvents([options])
```

#### Returns

`ContractEventsInterface`\<`Abi`, `ContractEvents`\<`Abi`\>\>

- When individual event is accessed will returns [ContractBoundEvent](../modules.md#contractboundevent) object

#### Defined in

[web3-eth-contract/src/contract.ts:429](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L429)

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

### methods

• `get` **methods**(): `ContractMethodsInterface`\<`Abi`\>

Creates a transaction object for that method, which then can be `called`, `send`, `estimated`, `createAccessList` , or `ABI encoded`.

The methods of this smart contract are available through:

The name: `myContract.methods.myMethod(123)`
The name with parameters: `myContract.methods['myMethod(uint256)'](123)`
The signature `myContract.methods['0x58cf5f10'](123)`

This allows calling functions with same name but different parameters from the JavaScript contract object.

\> The method signature does not provide a type safe interface, so we recommend to use method `name` instead.

```ts
// calling a method
const result = await myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});

// or sending and using a promise
const receipt = await myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});

// or sending and using the events
const sendObject = myContract.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});
sendObject.on('transactionHash', function(hash){
  ...
});
sendObject.on('receipt', function(receipt){
  ...
});
sendObject.on('confirmation', function(confirmationNumber, receipt){
  ...
});
sendObject.on('error', function(error, receipt) {
  ...
});
```

#### Returns

`ContractMethodsInterface`\<`Abi`\>

- Either returns PayableMethodObject or NonPayableMethodObject based on the definitions of the {@doclink glossary/json_interface | json interface} of that contract.

#### Defined in

[web3-eth-contract/src/contract.ts:471](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L471)

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

### clone

▸ **clone**(): [`Contract`](Contract.md)\<`any`\>

Clones the current contract instance. This doesn't deploy contract on blockchain and only creates a local clone.

#### Returns

[`Contract`](Contract.md)\<`any`\>

- The new contract instance.

```ts
const contract1 = new eth.Contract(abi, address, {gasPrice: '12345678', from: fromAddress});

const contract2 = contract1.clone();
contract2.options.address = address2;

(contract1.options.address !== contract2.options.address);
> true
```

#### Defined in

[web3-eth-contract/src/contract.ts:490](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L490)

___

### deploy

▸ **deploy**(`deployOptions?`): `Object`

Call this function to deploy the contract to the blockchain. After successful deployment the promise will resolve with a new contract instance.

```ts
myContract.deploy({
  input: '0x12345...', // data keyword can be used, too. If input is used, data will be ignored.
  arguments: [123, 'My String']
})
.send({
  from: '0x1234567890123456789012345678901234567891',
  gas: 1500000,
  gasPrice: '30000000000000'
}, function(error, transactionHash){ ... })
.on('error', function(error){ ... })
.on('transactionHash', function(transactionHash){ ... })
.on('receipt', function(receipt){
 console.log(receipt.contractAddress) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt){ ... })
.then(function(newContractInstance){
  console.log(newContractInstance.options.address) // instance with the new contract address
});

// When the data is already set as an option to the contract itself
myContract.options.data = '0x12345...';

myContract.deploy({
  arguments: [123, 'My String']
})
.send({
  from: '0x1234567890123456789012345678901234567891',
  gas: 1500000,
  gasPrice: '30000000000000'
})
.then(function(newContractInstance){
  console.log(newContractInstance.options.address) // instance with the new contract address
});

// Simply encoding
myContract.deploy({
  input: '0x12345...',
  arguments: [123, 'My String']
})
.encodeABI();
> '0x12345...0000012345678765432'

// Gas estimation
myContract.deploy({
  input: '0x12345...',
  arguments: [123, 'My String']
})
.estimateGas(function(err, gas){
  console.log(gas);
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployOptions?` | `Object` | - |
| `deployOptions.arguments?` | `ContractConstructorArgs`\<`Abi`\> | The arguments which get passed to the constructor on deployment. |
| `deployOptions.data?` | `string` | The byte code of the contract. |
| `deployOptions.input?` | `string` | - |

#### Returns

`Object`

- The transaction object

| Name | Type |
| :------ | :------ |
| `arguments` | `never`[] \| `NonNullable`\<`ContractConstructorArgs`\<`Abi`\>\> |
| `encodeABI` | () => `string` |
| `estimateGas` | \<ReturnFormat\>(`options?`: `PayableCallOptions`, `returnFormat`: `ReturnFormat`) => `Promise`\<`NumberTypes`[`ReturnFormat`[``"number"``]]\> |
| `send` | (`options?`: `PayableCallOptions`) => `Web3PromiEvent`\<[`Contract`](Contract.md)\<`Abi`\>, `SendTransactionEvents`\<\{ `bytes`: `HEX` ; `number`: `BIGINT`  }\>\> |

#### Defined in

[web3-eth-contract/src/contract.ts:590](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L590)

___

### extend

▸ **extend**(`extendObj`): [`Contract`](Contract.md)\<`Abi`\>

This method allows extending the web3 modules.
Note: This method is only for backward compatibility, and It is recommended to use Web3 v4 Plugin feature for extending web3.js functionality if you are developing some thing new.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendObj` | `ExtensionObject` |

#### Returns

[`Contract`](Contract.md)\<`Abi`\>

#### Inherited from

Web3Context.extend

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:162

___

### getPastEvents

▸ **getPastEvents**\<`ReturnFormat`\>(`returnFormat?`): `Promise`\<(`string` \| `EventLog`)[]\>

Gets past events for this contract.

```ts
const events = await myContract.getPastEvents('MyEvent', {
  filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
  fromBlock: 0,
  toBlock: 'latest'
});

> [{
  returnValues: {
      myIndexedParam: 20,
      myOtherIndexedParam: '0x123456789...',
      myNonIndexParam: 'My String'
  },
  raw: {
      data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
  },
  event: 'MyEvent',
  signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
  logIndex: 0,
  transactionIndex: 0,
  transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
  blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
  blockNumber: 1234,
  address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
},{
  ...
}]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnFormat` | extends `DataFormat` = \{ `bytes`: `HEX` ; `number`: `BIGINT`  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnFormat?` | `ReturnFormat` | Return format |

#### Returns

`Promise`\<(`string` \| `EventLog`)[]\>

- An array with the past event `Objects`, matching the given event name and filter.

#### Defined in

[web3-eth-contract/src/contract.ts:708](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-contract/src/contract.ts#L708)

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
| `provider?` | `string` \| `SupportedProviders`\<`EthExecutionAPI`\> | SupportedProviders The provider to set |

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
