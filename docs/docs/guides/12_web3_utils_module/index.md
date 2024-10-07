---
sidebar_label: '📦 Web3 Utils module'
title: Mastering Utility Functions
position: 12
---

## Introduction

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/vitejs-vite-kbtbsv?embed=1&file=main.ts&showSidebar=1"></iframe>
In this guide, you'll learn about the different functions of the web3 utils package, it contains the methods to know how to generate random bytes in different formats, how to perform conversion between Hex values and numbers, hashing functions, addresses, packing padding and in the last part you will see how to compare block numbers.

## Installation

Install only the web3 package

```bash
npm i web3-utils
```

Or you can install the web3 library as well and then access web3.utils

```bash
npm i web3
```

## Imports

There are three different ways to import utils package.

### Import the entire web3 library

```js
// import web3 module
import { Web3 } from 'web3';

// no need to initialize a provider
Web3.utils.toHex('web3');
//=> 0x77656233

// initializing  a provider
const web3 = new Web3('https:// eth.llamarpc.com');

// access the utils package
web3.utils.toHex('web3');
//=> 0x77656233
```

### Import utils module

```js
// import utils module
import { utils } from 'web3';

// access the utils package
utils.toWei('1', 'ether');
```

### Import specific methods

```js
// import toWei and toHex functions
import { toWei, toHex } from 'web3-utils';

// usage
toWei('1', 'ether');
toHex('');
```

## Methods example

### Random Hex and Bytes

```js
// Random bytes in hex format and array format

console.log(web3.utils.randomBytes(32));
/* => array format
Uint8Array(32) [
  251,  70, 124,  65, 203, 180,  92, 234,
  210, 236,  72, 154,  83, 219, 171, 223,
  212, 136, 117, 140,  67, 117,  86,  81,
  234, 245, 148, 186, 175,  83,  98,  78
]
*/

console.log(web3.utils.randomHex(32));
/* => hex string format
0x594386dc9b2e150979416f9b2a093e01f84a37c4f8db5fc1b0d9b1dc83a12c1f
*/
```

:::info
If you don't give any arguments then both of these functions will have a default value as 32.
:::

### Conversions - Ethereum Denominations

We've got two different functions to perform conversions between Ethereum denominations.

```js
console.log(web3.utils.fromWei('1', 'ether'));
// 0.000000000000000001

console.log(web3.utils.toWei('1', 'ether'));
// 1_000_000_000_000_000_000
```

### Conversions to Hex Values

```js
// most versatile one
console.log(web3.utils.toHex(10));
// 0xa

console.log(web3.utils.toHex(true));
// 0x01

console.log(web3.utils.numberToHex(10));
// 0xa

console.log(web3.utils.fromDecimal(10));
// 0xa

const arr = new Uint8Array([1, 2, 3, 4]);

console.log(web3.utils.toHex(arr));
// 0x7b2230223a312c2231223a322c2232223a332c2233223a347d

console.log(web3.utils.bytesToHex(arr));
// 0x01020304
```

### Conversions UTF and ASCII

```js
console.log(web3.utils.utf8ToHex('😊'));
// 0xf09f988a

console.log(web3.utils.fromUtf8('😊'));
// 0xf09f988a

console.log(web3.utils.asciiToHex('😊'));
// 0xd83dde0a

console.log(web3.utils.toUtf8('0xf09f988a'));
// 😊

console.log(web3.utils.hexToUtf8('0xf09f988a'));
// 😊

console.log(web3.utils.hexToString('0xf09f988a'));
// 😊

// emojis are not ASCII character, that's why it won't work
console.log(web3.utils.toAscii('0x4869'));
// Hi

console.log(web3.utils.hexToAscii('0x4869'));
// Hi
```

### Conversions - Numbers and Bigint

```js
console.log(web3.utils.toNumber('0xa'));
// 10 (number)

console.log(web3.utils.hexToNumber('0xa'));
// 10 (number)

console.log(web3.utils.toDecimal('0xa'));
// 10 (number)

console.log(web3.utils.hexToNumberString('0xa'));
// 10 (string)

console.log(web3.utils.toBigInt('0xa'));
// 10n (bigint)
```

### Hashing Functions

```js
// both will return undefined if an empty string is passed as an argument
console.log(web3.utils.sha3('hello web3'));
// 0x6c171485a0138b7b0a49d72b570e1d9c589d42a79ae57329d90671d1ac702d74

console.log(web3.utils.soliditySha3({ type: 'string', value: 'hello web3' }));
// 0x6c171485a0138b7b0a49d72b570e1d9c589d42a79ae57329d90671d1ac702d74
```

### Addresses

```js
// isAddress() is deprecated so we can use toCheckSumAddress()
// to see if the hex string we are passing is a correct ethereum address

// passing an address with all characters lowercase
console.log(web3.utils.toChecksumAddress('0xa3286628134bad128faeef82f44e99aa64085c94'));
// 0xA3286628134baD128faeef82F44e99AA64085C94

// passing an wrong address
console.log(web3.utils.toChecksumAddress('0xa3286628134bad128faeef82f44e99aa64085c9'));
// InvalidAddressError: Invalid value given "0xa286628134bad128faeef82f44e99aa64085c94". Error: invalid ethereum address.
```

### Packing and Padding

```js
// same as abi.encodePacked() in solidity (must be strings)
// converts everything to hex and packs everything without padding
console.log(web3.utils.encodePacked('1', '1', '1'));
// 0x313131

// it will convert the number `10` to hex('a') and add 0s until it's 32 characters long
// the third argument will be the one that will fill/pad the whole hex string, in this case is '0'
console.log(web3.utils.padRight(10, 32, 0));
// 0xa0000000000000000000000000000000

console.log(web3.utils.rightPad(10, 32, 0));
// 0xa0000000000000000000000000000000

console.log(web3.utils.padLeft(10, 32, 0));
// 0x0000000000000000000000000000000a

console.log(web3.utils.leftPad(10, 32, 0));
// 0x0000000000000000000000000000000a
```

### Compare Block Numbers

```js
// accepts numbers and formats as well
console.log(web3.utils.compareBlockNumbers('pending', 'latest'));
// 1

console.log(web3.utils.compareBlockNumbers('latest', 'pending'));
// -1

console.log(web3.utils.compareBlockNumbers('latest', 'latest'));
// 0

console.log(web3.utils.compareBlockNumbers(2, 2));
// 0
```

### Formatting

The [`format` function](/api/web3-utils/function/format) in the `web3-utils` package is used to convert data between equivalent formats. For example, bytes that are represented as a [`Uint8Array` type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) can be formatted as a hexademical string (e.g. `"0xdd"`) or primitive JavaScript [`Number` types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) can be formatted as [`BigInt` types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The `format` function expects two required parameters, `schema` and `data`, and accepts a third optional parameter, `returnFormat`. The `schema` parameter is used to describe how the data should be interpreted. The `data` parameter represents the data that is to be formatted. The [`returnFormat` parameter](#return-formats) specifies how the data should be formatted.

Here are some example that demonstrate the use of the `format` function:

```js
import { format } from 'web3-utils';
import { FMT_BYTES, FMT_NUMBER } from 'web3-types';

// format a primitive number as a hexidecimal string
console.log(format({ format: 'uint' }, 221, { number: FMT_NUMBER.HEX }));
// ↳ 0xdd

// format a primitive number as a BigInt
console.log(format({ format: 'uint' }, 221, { number: FMT_NUMBER.BIGINT }));
// ↳ 221n

// format a stringified number as a hexidecimal string
console.log(format({ format: 'uint' }, '221', { number: FMT_NUMBER.HEX }));
// ↳ 0xdd

// format a Uint8Array of bytes as a hexidecimal string
console.log(
	format({ format: 'bytes' }, new Uint8Array([2, 33]), {
		bytes: FMT_BYTES.HEX,
	}),
);
// ↳ 0x0221

// format an array of values
console.log(
	format({ type: 'array', items: { format: 'uint' } }, ['221', 1983], {
		number: FMT_NUMBER.HEX,
	}),
);
// ↳ [ '0xdd', '0x7bf' ]

// format an object with multiple properties
console.log(
	format(
		{
			type: 'object',
			properties: {
				aNumber: { format: 'uint' },
				someBytes: { format: 'bytes' },
			},
		},
		{ aNumber: '221', someBytes: new Uint8Array([2, 33]) },
		{ bytes: FMT_BYTES.UINT8ARRAY, number: FMT_NUMBER.HEX },
	),
);
// ↳ { aNumber: '0xdd', someBytes: Uint8Array(2) [ 2, 33 ] }
```

#### Return Formats

The following return formats are supported:

-   Bytes
    -   [`FMT_BYTES.HEX`](/api/web3-types/enum/FMT_BYTES#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
    -   [`FMT_BYTES.UINT8ARRAY`](/api/web3-types/enum/FMT_BYTES#UINT8ARRAY): [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) (e.g. `[ 2, 33 ]`)
-   Numbers
    -   [`FMT_NUMBER.BIGINT`](/api/web3-types/enum/FMT_NUMBER#BIGINT): [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) (e.g. `221n`)
    -   [`FMT_NUMBER.HEX`](/api/web3-types/enum/FMT_NUMBER#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
    -   [`FMT_NUMBER.NUMBER`](/api/web3-types/enum/FMT_NUMBER#NUMBER): [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (e.g. `221`)
    -   [`FMT_NUMBER.STR`](/api/web3-types/enum/FMT_NUMBER#STR): [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"221"`)
