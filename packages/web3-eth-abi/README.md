# web3-eth-abi

This is a sub package of [web3.js][repo]

This is the abi package will be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-abi
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-abi.js` in your html file.
This will expose the `Web3EthAbi` object on the window object.


## Usage

```js
// in node.js
import {AbiCoder} from 'web3-eth-abi';

const abiCoder = new AbiCoder();
abiCoder.encodeFunctionSignature('myMethod(uint256,string)');
> '0x24ee0097'
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


