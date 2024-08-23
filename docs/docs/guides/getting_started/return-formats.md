---
sidebar_position: 3
sidebar_label: Return Formats
---

# Return Formats

By default, Web3.js formats byte values as hexadecimal strings (e.g. `"0x221`") and number values as [`BigInt`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The default formats can be configured at the global level by updating the [`defaultReturnFormat` configuration option](/guides/web3_config/#defaultreturnformat). Many Web3.js functions (e.g. [`getBlock`](/api/web3-eth/function/getBlock), [`sendTransaction`](/api/web3-eth/function/sendTransaction)) accept an optional parameter named `returnFormat` of the [type `DataFormat`](/api/web3-types#DataFormat) that can be used to configure the format for data returned by that single function invocation.

The following example demonstrates working with return formats:

```js
import { FMT_BYTES, FMT_NUMBER, Web3 } from "web3";

const web3 = new Web3("https://eth.llamarpc.com");

// use the default return format
web3.eth.getBlock().then((block) => {
  console.log(`Block #${block.number} [Hash: ${block.hash}]`);
});
// ↳ Block #20614588 [Hash: 0x86784297b538a8bb2a13c9a0d808c01816fc952170609d28832a2eb6fa32c918]

// specify the return format for a single function invocation
web3.eth
  .getBlock(undefined, undefined, {
    bytes: FMT_BYTES.UINT8ARRAY,
    number: FMT_NUMBER.HEX,
  })
  .then((block) => {
    console.log(`Block #${block.number} [Hash: ${block.hash}]`);
  });
// ↳ Block #0x13a8dbc [Hash: 134,120,66,151,...,250,50,201,24]

// configure default return format for the web3-eth package
web3.eth.defaultReturnFormat = {
  bytes: FMT_BYTES.UINT8ARRAY,
  number: FMT_NUMBER.HEX,
};

web3.eth.getBlock().then((block) => {
  console.log(`Block #${block.number} [Hash: ${block.hash}]`);
});
// ↳ Block #0x13a8dbc [Hash: 134,120,66,151,...,250,50,201,24]
```

The supported return formats are:

- Bytes
  - [`FMT_BYTES.HEX`](/api/web3-types/enum/FMT_BYTES#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
  - [`FMT_BYTES.UINT8ARRAY`](/api/web3-types/enum/FMT_BYTES#UINT8ARRAY): [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) (e.g. `[ 2, 33 ]`)
- Numbers
  - [`FMT_NUMBER.BIGINT`](/api/web3-types/enum/FMT_NUMBER#BIGINT): [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) (e.g. `221n`)
  - [`FMT_NUMBER.HEX`](/api/web3-types/enum/FMT_NUMBER#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
  - [`FMT_NUMBER.NUMBER`](/api/web3-types/enum/FMT_NUMBER#NUMBER): [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (e.g. `221`)
  - [`FMT_NUMBER.STR`](/api/web3-types/enum/FMT_NUMBER#STR): [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"221"`)
