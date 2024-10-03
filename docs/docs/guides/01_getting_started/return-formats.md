---
sidebar_position: 3
sidebar_label: Return Formats
---

# Return Formats

By default, Web3.js formats byte values as hexadecimal strings (e.g. `"0x221`") and number values as [`BigInt`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt). The default formats can be configured at the global level by updating the [`defaultReturnFormat` configuration option](/guides/web3_config/#defaultreturnformat). Many Web3.js functions (e.g. [`getBlock`](/api/web3-eth/function/getBlock), [`sendTransaction`](/api/web3-eth/function/sendTransaction)) accept an optional parameter named `returnFormat` of the [type `DataFormat`](/api/web3-types#DataFormat) that can be used to configure the format for data returned by that single function invocation.

The following example demonstrates working with return formats:

```ts
import { Block, FMT_BYTES, FMT_NUMBER, Numbers, Web3 } from 'web3';

const web3 = new Web3('https://eth.llamarpc.com');

// use the default return format
web3.eth.getBlock().then((block: Block) => {
	console.log(`Block #${block.number} Hash: ${block.hash}`);
});
// ↳ Block #20735255 Hash: 0xbaea6dbd46fa810a27be4c9eac782602f8efe7512fb30a8455c127b101a23e22

// specify the return format for a single function invocation
web3.eth
	.getBlockNumber({
		bytes: FMT_BYTES.HEX,
		number: FMT_NUMBER.HEX,
	})
	.then((blockNumber: Numbers) => {
		console.log(`Block #${blockNumber}`);
	});
// ↳ Block #0x13c6517

// configure default return format for the web3-eth package
web3.eth.defaultReturnFormat = {
	bytes: FMT_BYTES.UINT8ARRAY,
	number: FMT_NUMBER.HEX,
};

web3.eth.getBlock().then((block: Block) => {
	console.log(`Block #${block.number} Hash: [${block.hash}]`);
});
// ↳ Block #0x13c6517 Hash: [186,234,109,...,162,62,34]
```

The supported return formats are:

-   Bytes
    -   [`FMT_BYTES.HEX`](/api/web3-types/enum/FMT_BYTES#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
    ```ts
    web3.eth
    	.getBlock(undefined, undefined, {
    		bytes: FMT_BYTES.HEX,
    		number: FMT_NUMBER.BIGINT,
    	})
    	.then((block: Block) => {
    		console.log(`Block hash: ${block.hash}`);
    	});
    // ↳ Block hash: 0xbaea6dbd46fa810a27be4c9eac782602f8efe7512fb30a8455c127b101a23e22
    ```
    -   [`FMT_BYTES.UINT8ARRAY`](/api/web3-types/enum/FMT_BYTES#UINT8ARRAY): [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) (e.g. `[ 2, 33 ]`)
    ```ts
    web3.eth
    	.getBlock(undefined, undefined, {
    		bytes: FMT_BYTES.UINT8ARRAY,
    		number: FMT_NUMBER.BIGINT,
    	})
    	.then((block: Block) => {
    		console.log(`Block hash: [${block.hash}]`);
    	});
    // ↳ Block hash: [186,234,109,...,162,62,34]
    ```
-   Numbers
    -   [`FMT_NUMBER.BIGINT`](/api/web3-types/enum/FMT_NUMBER#BIGINT): [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) (e.g. `221n`)
    ```ts
    web3.eth
    	.getBlockNumber({
    		bytes: FMT_BYTES.HEX,
    		number: FMT_NUMBER.BIGINT,
    	})
    	.then((blockNumber: Numbers) => {
    		console.log(`Block #${blockNumber}`);
    	});
    // ↳ Block #20735255
    ```
    -   [`FMT_NUMBER.HEX`](/api/web3-types/enum/FMT_NUMBER#HEX): hexadecimal [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"0xdd"`)
    ```ts
    web3.eth
    	.getBlockNumber({
    		bytes: FMT_BYTES.HEX,
    		number: FMT_NUMBER.HEX,
    	})
    	.then((blockNumber: Numbers) => {
    		console.log(`Block #${blockNumber}`);
    	});
    // ↳ Block #0x13c6517
    ```
    -   [`FMT_NUMBER.NUMBER`](/api/web3-types/enum/FMT_NUMBER#NUMBER): [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) (e.g. `221`)
    ```ts
    web3.eth
    	.getBlockNumber({
    		bytes: FMT_BYTES.HEX,
    		number: FMT_NUMBER.NUMBER,
    	})
    	.then((blockNumber: Numbers) => {
    		console.log(`Block #${blockNumber}`);
    	});
    // ↳ Block #20735255
    ```
    -   [`FMT_NUMBER.STR`](/api/web3-types/enum/FMT_NUMBER#STR): [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) (e.g. `"221"`)
    ```ts
    web3.eth
    	.getBlockNumber({
    		bytes: FMT_BYTES.HEX,
    		number: FMT_NUMBER.STR,
    	})
    	.then((blockNumber: Numbers) => {
    		console.log(`Block #${blockNumber}`);
    	});
    // ↳ Block #20735255
    ```
