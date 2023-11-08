# Class: ENS

This class is designed to interact with the ENS system on the Ethereum blockchain.

## Hierarchy

- `Web3Context`\<`EthExecutionAPI` & `Web3NetAPI`\>

  ↳ **`ENS`**

## Constructors

### constructor

• **new ENS**(`registryAddr?`, `provider?`): [`ENS`](ENS.md)

Use to create an instance of ENS

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `registryAddr?` | `string` | (Optional) The address of the ENS registry (default: mainnet registry address) |
| `provider?` | `string` \| `SupportedProviders`\<`EthExecutionAPI` & `Web3NetAPI`\> \| `Web3ContextObject`\<`EthExecutionAPI` & `Web3NetAPI`, `any`\> | (Optional) The provider to use for the ENS instance |

#### Returns

[`ENS`](ENS.md)

**`Example`**

```ts
const ens = new ENS(
	"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	"http://localhost:8545"
);

console.log( ens.defaultChain);
> mainnet
```

#### Overrides

Web3Context\&lt;EthExecutionAPI &amp; Web3NetAPI\&gt;.constructor

#### Defined in

[web3-eth-ens/src/ens.ts:64](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L64)

## Properties

### registryAddress

• **registryAddress**: `string`

The registryAddress property can be used to define a custom registry address when you are connected to an unknown chain. It defaults to the main registry address.

#### Defined in

[web3-eth-ens/src/ens.ts:43](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L43)

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

• `get` **events**(): `ContractEventsInterface`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"label"`` = 'label'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewOwner"`` = 'NewOwner'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"resolver"`` = 'resolver'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewResolver"`` = 'NewResolver'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"Transfer"`` = 'Transfer'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"owner"`` = 'owner'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"recordExists"`` = 'recordExists'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"resolver"`` = 'resolver'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"ttl"`` = 'ttl'; `outputs`: readonly [\{ `internalType`: ``"uint64"`` = 'uint64'; `name`: ``""`` = ''; `type`: ``"uint64"`` = 'uint64' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }], `ContractEvents`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"label"`` = 'label'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewOwner"`` = 'NewOwner'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"resolver"`` = 'resolver'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewResolver"`` = 'NewResolver'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"Transfer"`` = 'Transfer'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"owner"`` = 'owner'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"recordExists"`` = 'recordExists'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"resolver"`` = 'resolver'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"ttl"`` = 'ttl'; `outputs`: readonly [\{ `internalType`: ``"uint64"`` = 'uint64'; `name`: ``""`` = ''; `type`: ``"uint64"`` = 'uint64' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }]\>\>

#### Returns

`ContractEventsInterface`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"label"`` = 'label'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewOwner"`` = 'NewOwner'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"resolver"`` = 'resolver'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewResolver"`` = 'NewResolver'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"Transfer"`` = 'Transfer'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"owner"`` = 'owner'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"recordExists"`` = 'recordExists'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"resolver"`` = 'resolver'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"ttl"`` = 'ttl'; `outputs`: readonly [\{ `internalType`: ``"uint64"`` = 'uint64'; `name`: ``""`` = ''; `type`: ``"uint64"`` = 'uint64' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }], `ContractEvents`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"label"`` = 'label'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewOwner"`` = 'NewOwner'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"resolver"`` = 'resolver'; `type`: ``"address"`` = 'address' }] ; `name`: ``"NewResolver"`` = 'NewResolver'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }] ; `name`: ``"Transfer"`` = 'Transfer'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"owner"`` = 'owner'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"recordExists"`` = 'recordExists'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"resolver"`` = 'resolver'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"ttl"`` = 'ttl'; `outputs`: readonly [\{ `internalType`: ``"uint64"`` = 'uint64'; `name`: ``""`` = ''; `type`: ``"uint64"`` = 'uint64' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }]\>\>

- Returns all events that can be emitted by the ENS registry.

#### Defined in

[web3-eth-ens/src/ens.ts:241](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L241)

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

### checkNetwork

▸ **checkNetwork**(): `Promise`\<`string`\>

Checks if the current used network is synced and looks for ENS support there.
Throws an error if not.

#### Returns

`Promise`\<`string`\>

- The address of the ENS registry if the network has been detected successfully

**`Example`**

```ts
console.log(await web3.eth.ens.checkNetwork());
> '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
```

#### Defined in

[web3-eth-ens/src/ens.ts:193](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L193)

___

### extend

▸ **extend**(`extendObj`): [`ENS`](ENS.md)

This method allows extending the web3 modules.
Note: This method is only for backward compatibility, and It is recommended to use Web3 v4 Plugin feature for extending web3.js functionality if you are developing some thing new.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendObj` | `ExtensionObject` |

#### Returns

[`ENS`](ENS.md)

#### Inherited from

Web3Context.extend

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:162

___

### getAddress

▸ **getAddress**(`ENSName`, `coinType?`): `Promise`\<`MatchPrimitiveType`\<``"bytes"``, `unknown`\>\>

Resolves an ENS name to an Ethereum address.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ENSName` | `string` | `undefined` | The ENS name to resolve |
| `coinType` | `number` | `60` | (Optional) The coin type, defaults to 60 (ETH) |

#### Returns

`Promise`\<`MatchPrimitiveType`\<``"bytes"``, `unknown`\>\>

- The Ethereum address of the given name
```ts
const address = await web3.eth.ens.getAddress('ethereum.eth');
console.log(address);
> '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'
```

#### Defined in

[web3-eth-ens/src/ens.ts:144](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L144)

___

### getContenthash

▸ **getContenthash**(`ENSName`): `Promise`\<`MatchPrimitiveType`\<``"bytes"``, `unknown`\>\>

Returns the content hash object associated with an ENS node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ENSName` | `string` | The ENS name |

#### Returns

`Promise`\<`MatchPrimitiveType`\<``"bytes"``, `unknown`\>\>

- The content hash object associated with an ENS node

**`Example`**

```ts
const hash = await web3.eth.ens.getContenthash('ethereum.eth');
console.log(hash);
> 'QmaEBknbGT4bTQiQoe2VNgBJbRfygQGktnaW5TbuKixjYL'
```

#### Defined in

[web3-eth-ens/src/ens.ts:179](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L179)

___

### getOwner

▸ **getOwner**(`name`): `Promise`\<`unknown`\>

Returns the owner by the given name and current configured or detected Registry

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The ENS name |

#### Returns

`Promise`\<`unknown`\>

- Returns the address of the owner of the name.

**`Example`**

```ts
const owner = await web3.eth.ens.getOwner('ethereum.eth');
```

#### Defined in

[web3-eth-ens/src/ens.ts:129](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L129)

___

### getPubkey

▸ **getPubkey**(`ENSName`): `Promise`\<`unknown`[] & `Record`\<``1``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & `Record`\<``0``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & [] & `Record`\<``"x"``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & `Record`\<``"y"``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\>\>

Returns the X and Y coordinates of the curve point for the public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ENSName` | `string` | The ENS name |

#### Returns

`Promise`\<`unknown`[] & `Record`\<``1``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & `Record`\<``0``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & [] & `Record`\<``"x"``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\> & `Record`\<``"y"``, `MatchPrimitiveType`\<``"bytes32"``, `unknown`\>\>\>

- The X and Y coordinates of the curve point for the public key

**`Example`**

```ts
const key = await web3.eth.ens.getPubkey('ethereum.eth');
console.log(key);
> {
"0": "0x0000000000000000000000000000000000000000000000000000000000000000",
"1": "0x0000000000000000000000000000000000000000000000000000000000000000",
"x": "0x0000000000000000000000000000000000000000000000000000000000000000",
"y": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

#### Defined in

[web3-eth-ens/src/ens.ts:164](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L164)

___

### getResolver

▸ **getResolver**(`name`): `Promise`\<`Contract`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"a"`` = 'a'; `type`: ``"address"`` = 'address' }] ; `name`: ``"AddrChanged"`` = 'AddrChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"coinType"`` = 'coinType'; `type`: ``"uint256"`` = 'uint256' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"newAddress"`` = 'newAddress'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"AddressChanged"`` = 'AddressChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `indexed`: ``true`` = true; `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bool"`` = 'bool'; `name`: ``"approved"`` = 'approved'; `type`: ``"bool"`` = 'bool' }] ; `name`: ``"ApprovalForAll"`` = 'ApprovalForAll'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"hash"`` = 'hash'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"ContenthashChanged"`` = 'ContenthashChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"name"`` = 'name'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"record"`` = 'record'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"DNSRecordChanged"`` = 'DNSRecordChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"name"`` = 'name'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }] ; `name`: ``"DNSRecordDeleted"`` = 'DNSRecordDeleted'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"DNSZoneCleared"`` = 'DNSZoneCleared'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"lastzonehash"`` = 'lastzonehash'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"zonehash"`` = 'zonehash'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"DNSZonehashChanged"`` = 'DNSZonehashChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"implementer"`` = 'implementer'; `type`: ``"address"`` = 'address' }] ; `name`: ``"InterfaceChanged"`` = 'InterfaceChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"string"`` = 'string'; `name`: ``"name"`` = 'name'; `type`: ``"string"`` = 'string' }] ; `name`: ``"NameChanged"`` = 'NameChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"x"`` = 'x'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"y"`` = 'y'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"PubkeyChanged"`` = 'PubkeyChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"string"`` = 'string'; `name`: ``"indexedKey"`` = 'indexedKey'; `type`: ``"string"`` = 'string' }, \{ `indexed`: ``false`` = false; `internalType`: ``"string"`` = 'string'; `name`: ``"key"`` = 'key'; `type`: ``"string"`` = 'string' }] ; `name`: ``"TextChanged"`` = 'TextChanged'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"contentTypes"`` = 'contentTypes'; `type`: ``"uint256"`` = 'uint256' }] ; `name`: ``"ABI"`` = 'ABI'; `outputs`: readonly [\{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``""`` = ''; `type`: ``"uint256"`` = 'uint256' }, \{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"addr"`` = 'addr'; `outputs`: readonly [\{ `internalType`: ``"address payable"`` = 'address payable'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"coinType"`` = 'coinType'; `type`: ``"uint256"`` = 'uint256' }] ; `name`: ``"addr"`` = 'addr'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"contenthash"`` = 'contenthash'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"name"`` = 'name'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }] ; `name`: ``"dnsRecord"`` = 'dnsRecord'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"name"`` = 'name'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"hasDNSRecords"`` = 'hasDNSRecords'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }] ; `name`: ``"interfaceImplementer"`` = 'interfaceImplementer'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"account"`` = 'account'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"name"`` = 'name'; `outputs`: readonly [\{ `internalType`: ``"string"`` = 'string'; `name`: ``""`` = ''; `type`: ``"string"`` = 'string' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"pubkey"`` = 'pubkey'; `outputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"x"`` = 'x'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"y"`` = 'y'; `type`: ``"bytes32"`` = 'bytes32' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }] ; `name`: ``"supportsInterface"`` = 'supportsInterface'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"string"`` = 'string'; `name`: ``"key"`` = 'key'; `type`: ``"string"`` = 'string' }] ; `name`: ``"text"`` = 'text'; `outputs`: readonly [\{ `internalType`: ``"string"`` = 'string'; `name`: ``""`` = ''; `type`: ``"string"`` = 'string' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"zonehash"`` = 'zonehash'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }]\>\>

Returns the Resolver by the given address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the ENS domain |

#### Returns

`Promise`\<`Contract`\<readonly [\{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"a"`` = 'a'; `type`: ``"address"`` = 'address' }] ; `name`: ``"AddrChanged"`` = 'AddrChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"coinType"`` = 'coinType'; `type`: ``"uint256"`` = 'uint256' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"newAddress"`` = 'newAddress'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"AddressChanged"`` = 'AddressChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"address"`` = 'address'; `name`: ``"owner"`` = 'owner'; `type`: ``"address"`` = 'address' }, \{ `indexed`: ``true`` = true; `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bool"`` = 'bool'; `name`: ``"approved"`` = 'approved'; `type`: ``"bool"`` = 'bool' }] ; `name`: ``"ApprovalForAll"`` = 'ApprovalForAll'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"hash"`` = 'hash'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"ContenthashChanged"`` = 'ContenthashChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"name"`` = 'name'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"record"`` = 'record'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"DNSRecordChanged"`` = 'DNSRecordChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"name"`` = 'name'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }] ; `name`: ``"DNSRecordDeleted"`` = 'DNSRecordDeleted'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"DNSZoneCleared"`` = 'DNSZoneCleared'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"lastzonehash"`` = 'lastzonehash'; `type`: ``"bytes"`` = 'bytes' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes"`` = 'bytes'; `name`: ``"zonehash"`` = 'zonehash'; `type`: ``"bytes"`` = 'bytes' }] ; `name`: ``"DNSZonehashChanged"`` = 'DNSZonehashChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }, \{ `indexed`: ``false`` = false; `internalType`: ``"address"`` = 'address'; `name`: ``"implementer"`` = 'implementer'; `type`: ``"address"`` = 'address' }] ; `name`: ``"InterfaceChanged"`` = 'InterfaceChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"string"`` = 'string'; `name`: ``"name"`` = 'name'; `type`: ``"string"`` = 'string' }] ; `name`: ``"NameChanged"`` = 'NameChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"x"`` = 'x'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``false`` = false; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"y"`` = 'y'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"PubkeyChanged"`` = 'PubkeyChanged'; `type`: ``"event"`` = 'event' }, \{ `anonymous`: ``false`` = false; `inputs`: readonly [\{ `indexed`: ``true`` = true; `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `indexed`: ``true`` = true; `internalType`: ``"string"`` = 'string'; `name`: ``"indexedKey"`` = 'indexedKey'; `type`: ``"string"`` = 'string' }, \{ `indexed`: ``false`` = false; `internalType`: ``"string"`` = 'string'; `name`: ``"key"`` = 'key'; `type`: ``"string"`` = 'string' }] ; `name`: ``"TextChanged"`` = 'TextChanged'; `type`: ``"event"`` = 'event' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"contentTypes"`` = 'contentTypes'; `type`: ``"uint256"`` = 'uint256' }] ; `name`: ``"ABI"`` = 'ABI'; `outputs`: readonly [\{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``""`` = ''; `type`: ``"uint256"`` = 'uint256' }, \{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"addr"`` = 'addr'; `outputs`: readonly [\{ `internalType`: ``"address payable"`` = 'address payable'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint256"`` = 'uint256'; `name`: ``"coinType"`` = 'coinType'; `type`: ``"uint256"`` = 'uint256' }] ; `name`: ``"addr"`` = 'addr'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"contenthash"`` = 'contenthash'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"name"`` = 'name'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"uint16"`` = 'uint16'; `name`: ``"resource"`` = 'resource'; `type`: ``"uint16"`` = 'uint16' }] ; `name`: ``"dnsRecord"`` = 'dnsRecord'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"name"`` = 'name'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"hasDNSRecords"`` = 'hasDNSRecords'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }] ; `name`: ``"interfaceImplementer"`` = 'interfaceImplementer'; `outputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``""`` = ''; `type`: ``"address"`` = 'address' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"address"`` = 'address'; `name`: ``"account"`` = 'account'; `type`: ``"address"`` = 'address' }, \{ `internalType`: ``"address"`` = 'address'; `name`: ``"operator"`` = 'operator'; `type`: ``"address"`` = 'address' }] ; `name`: ``"isApprovedForAll"`` = 'isApprovedForAll'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"name"`` = 'name'; `outputs`: readonly [\{ `internalType`: ``"string"`` = 'string'; `name`: ``""`` = ''; `type`: ``"string"`` = 'string' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"pubkey"`` = 'pubkey'; `outputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"x"`` = 'x'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"y"`` = 'y'; `type`: ``"bytes32"`` = 'bytes32' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes4"`` = 'bytes4'; `name`: ``"interfaceID"`` = 'interfaceID'; `type`: ``"bytes4"`` = 'bytes4' }] ; `name`: ``"supportsInterface"`` = 'supportsInterface'; `outputs`: readonly [\{ `internalType`: ``"bool"`` = 'bool'; `name`: ``""`` = ''; `type`: ``"bool"`` = 'bool' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }, \{ `internalType`: ``"string"`` = 'string'; `name`: ``"key"`` = 'key'; `type`: ``"string"`` = 'string' }] ; `name`: ``"text"`` = 'text'; `outputs`: readonly [\{ `internalType`: ``"string"`` = 'string'; `name`: ``""`` = ''; `type`: ``"string"`` = 'string' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }, \{ `inputs`: readonly [\{ `internalType`: ``"bytes32"`` = 'bytes32'; `name`: ``"node"`` = 'node'; `type`: ``"bytes32"`` = 'bytes32' }] ; `name`: ``"zonehash"`` = 'zonehash'; `outputs`: readonly [\{ `internalType`: ``"bytes"`` = 'bytes'; `name`: ``""`` = ''; `type`: ``"bytes"`` = 'bytes' }] ; `stateMutability`: ``"view"`` = 'view'; `type`: ``"function"`` = 'function' }]\>\>

- An contract instance of the resolver

**`Example`**

```ts
const resolver = await ens.getResolver('resolver');

console.log(resolver.options.address);
> '0x1234567890123456789012345678901234567890'
```

#### Defined in

[web3-eth-ens/src/ens.ts:90](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L90)

___

### getTTL

▸ **getTTL**(`name`): `Promise`\<`unknown`\>

Returns the caching TTL (time-to-live) of an ENS name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The ENS name |

#### Returns

`Promise`\<`unknown`\>

- Returns the caching TTL (time-to-live) of a name.

**`Example`**

```ts
const owner = await web3.eth.ens.getTTL('ethereum.eth');
```

#### Defined in

[web3-eth-ens/src/ens.ts:116](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L116)

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

### recordExists

▸ **recordExists**(`name`): `Promise`\<`unknown`\>

Returns true if the record exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The ENS name |

#### Returns

`Promise`\<`unknown`\>

- Returns `true` if node exists in this ENS registry. This will return `false` for records that are in the legacy ENS registry but have not yet been migrated to the new one.

**`Example`**

```ts
const exists = await web3.eth.ens.recordExists('ethereum.eth');
```

#### Defined in

[web3-eth-ens/src/ens.ts:103](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L103)

___

### setProvider

▸ **setProvider**(`provider?`): `boolean`

Will set the provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider?` | `string` \| `SupportedProviders`\<`EthExecutionAPI` & `Web3NetAPI`\> | SupportedProviders The provider to set |

#### Returns

`boolean`

Returns true if the provider was set

#### Inherited from

Web3Context.setProvider

#### Defined in

web3-core/lib/commonjs/web3_context.d.ts:153

___

### supportsInterface

▸ **supportsInterface**(`ENSName`, `interfaceId`): `Promise`\<`MatchPrimitiveType`\<``"bool"``, `unknown`\>\>

Returns true if the related Resolver does support the given signature or interfaceId.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ENSName` | `string` | The ENS name |
| `interfaceId` | `string` | The signature of the function or the interfaceId as described in the ENS documentation |

#### Returns

`Promise`\<`MatchPrimitiveType`\<``"bool"``, `unknown`\>\>

- `true` if the related Resolver does support the given signature or interfaceId.

**`Example`**

```ts
const supports = await web3.eth.ens.supportsInterface('ethereum.eth', 'addr(bytes32');
console.log(supports);
> true
```

#### Defined in

[web3-eth-ens/src/ens.ts:234](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-ens/src/ens.ts#L234)

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
