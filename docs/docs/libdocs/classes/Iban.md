# Class: Iban

Converts Ethereum addresses to IBAN or BBAN addresses and vice versa.

## Constructors

### constructor

• **new Iban**(`iban`): [`Iban`](Iban.md)

Construct a direct or indirect IBAN that has conversion methods and validity checks.
If the provided string was not of either the length of a direct IBAN (34 or 35),
nor the length of an indirect IBAN (20), an Error will be thrown ('Invalid IBAN was provided').

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iban` | `string` | a Direct or an Indirect IBAN |

#### Returns

[`Iban`](Iban.md)

- Iban instance

**`Example`**

```ts
const iban = new web3.eth.Iban("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS");
> Iban { _iban: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS' }
```

#### Defined in

[web3-eth-iban/src/iban.ts:204](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L204)

## Methods

### checksum

▸ **checksum**(): `string`

Returns the IBAN checksum of the early provided IBAN

#### Returns

`string`

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.checksum();
> "81"
```

#### Defined in

[web3-eth-iban/src/iban.ts:366](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L366)

___

### client

▸ **client**(): `string`

Should be called to get client identifier within institution

#### Returns

`string`

the client of the IBAN instance.

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.client();
> 'GAVOFYORK'
```

#### Defined in

[web3-eth-iban/src/iban.ts:351](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L351)

___

### institution

▸ **institution**(): `string`

Returns institution identifier from the early provided  IBAN

#### Returns

`string`

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.institution();
> 'XREG'
```

#### Defined in

[web3-eth-iban/src/iban.ts:380](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L380)

___

### isDirect

▸ **isDirect**(): `boolean`

An instance method that checks if iban number is Direct.
It actually check the length of the provided variable and, only if it is 34 or 35, it returns true.
Note: this is also available as a static method.

#### Returns

`boolean`

- `true` if the provided `iban` is a Direct IBAN, and `false` otherwise.

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.isDirect();
> false
```

#### Defined in

[web3-eth-iban/src/iban.ts:109](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L109)

___

### isIndirect

▸ **isIndirect**(): `boolean`

check if iban number if indirect
It actually check the length of the provided variable and, only if it is 20, it returns true.
Note: this is also available as a static method.

#### Returns

`boolean`

- `true` if the provided `iban` is an Indirect IBAN, and `false` otherwise.

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.isIndirect();
> true
```

#### Defined in

[web3-eth-iban/src/iban.ts:144](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L144)

___

### isValid

▸ **isValid**(): `boolean`

Should be called to check if the early provided IBAN is correct.
Note: this is also available as a static method.

#### Returns

`boolean`

**`Example`**

```ts
const iban = new web3.eth.Iban("XE81ETHXREGGAVOFYORK");
iban.isValid();
> true

const iban = new web3.eth.Iban("XE82ETHXREGGAVOFYORK");
iban.isValid();
> false // because the checksum is incorrect
```

#### Defined in

[web3-eth-iban/src/iban.ts:186](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L186)

___

### toAddress

▸ **toAddress**(): `string`

This method should be used to create the equivalent ethereum address for the early provided Direct IBAN address.
If the provided string was not a direct IBAN (has the length of 34 or 35), an Error will be thrown:
('Iban is indirect and cannot be converted. Must be length of 34 or 35').
Note: this is also available as a static method.

#### Returns

`string`

the equivalent ethereum address

**`Example`**

```ts
const iban = new web3.eth.Iban("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS");
iban.toAddress();
> "0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8"
```

#### Defined in

[web3-eth-iban/src/iban.ts:312](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L312)

___

### toString

▸ **toString**(): `string`

Simply returns the early provided IBAN

#### Returns

`string`

**`Example`**

```ts
const iban = new web3.eth.Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
iban.toString();
> 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'
```

#### Defined in

[web3-eth-iban/src/iban.ts:394](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L394)

___

### createIndirect

▸ **createIndirect**(`options`): [`Iban`](Iban.md)

Should be used to create IBAN object for given institution and identifier

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `IbanOptions` | an object holds the `institution` and the `identifier` which will be composed to create an `Iban` object from. |

#### Returns

[`Iban`](Iban.md)

an Iban class instance that holds the equivalent IBAN

**`Example`**

```ts
web3.eth.Iban.createIndirect({
    institution: "XREG",
    identifier: "GAVOFYORK"
});
> Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}
```

#### Defined in

[web3-eth-iban/src/iban.ts:250](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L250)

___

### fromAddress

▸ **fromAddress**(`address`): [`Iban`](Iban.md)

This method should be used to create iban object from an Ethereum address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | an Ethereum address |

#### Returns

[`Iban`](Iban.md)

an Iban class instance that holds the equivalent IBAN

**`Example`**

```ts
web3.eth.Iban.fromAddress("0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8");
> Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}
```

#### Defined in

[web3-eth-iban/src/iban.ts:266](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L266)

___

### fromBban

▸ **fromBban**(`bban`): [`Iban`](Iban.md)

Convert the passed BBAN to an IBAN for this country specification.
Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bban` | `string` | the BBAN to convert to IBAN |

#### Returns

[`Iban`](Iban.md)

an Iban class instance that holds the equivalent IBAN

**`Example`**

```ts
web3.eth.Iban.fromBban('ETHXREGGAVOFYORK');
> Iban {_iban: "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"}
```

#### Defined in

[web3-eth-iban/src/iban.ts:226](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L226)

___

### isDirect

▸ **isDirect**(`iban`): `boolean`

A static method that checks if an IBAN is Direct.
It actually check the length of the provided variable and, only if it is 34 or 35, it returns true.
Note: this is also available as a method at an Iban instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iban` | `string` | an IBAN to be checked |

#### Returns

`boolean`

- `true` if the provided `iban` is a Direct IBAN, and `false` otherwise.

**`Example`**

```ts
web3.eth.Iban.isDirect("XE81ETHXREGGAVOFYORK");
> false
```

#### Defined in

[web3-eth-iban/src/iban.ts:91](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L91)

___

### isIndirect

▸ **isIndirect**(`iban`): `boolean`

A static method that checks if an IBAN is Indirect.
It actually check the length of the provided variable and, only if it is 20, it returns true.
Note: this is also available as a method at an Iban instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iban` | `string` | an IBAN to be checked |

#### Returns

`boolean`

- `true` if the provided `iban` is an Indirect IBAN, and `false` otherwise.

**`Example`**

```ts
web3.eth.Iban.isIndirect("XE81ETHXREGGAVOFYORK");
> true
```

#### Defined in

[web3-eth-iban/src/iban.ts:126](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L126)

___

### isValid

▸ **isValid**(`iban`): `boolean`

This method could be used to check if a given string is valid IBAN object.
Note: this is also available as a method at an Iban instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iban` | `string` | a string to be checked if it is in IBAN |

#### Returns

`boolean`

- true if it is valid IBAN

**`Example`**

```ts
web3.eth.Iban.isValid("XE81ETHXREGGAVOFYORK");
> true

web3.eth.Iban.isValid("XE82ETHXREGGAVOFYORK");
> false // because the checksum is incorrect
```

#### Defined in

[web3-eth-iban/src/iban.ts:164](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L164)

___

### toAddress

▸ **toAddress**(`iban`): `string`

This method should be used to create an ethereum address from a Direct IBAN address.
If the provided string was not a direct IBAN (has the length of 34 or 35), an Error will be thrown:
('Iban is indirect and cannot be converted. Must be length of 34 or 35').
Note: this is also available as a method at an Iban instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iban` | `string` | a Direct IBAN address |

#### Returns

`string`

the equivalent ethereum address

**`Example`**

```ts
web3.eth.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS");
> "0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8"
```

#### Defined in

[web3-eth-iban/src/iban.ts:292](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L292)

___

### toIban

▸ **toIban**(`address`): `string`

This method should be used to create IBAN address from an Ethereum address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | an Ethereum address |

#### Returns

`string`

the equivalent IBAN address

**`Example`**

```ts
web3.eth.Iban.toIban("0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8");
> "XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"
```

#### Defined in

[web3-eth-iban/src/iban.ts:335](https://github.com/web3/web3.js/blob/73b95317c/packages/web3-eth-iban/src/iban.ts#L335)
