# web3-eth-contract

This is a sub package of [web3.js][repo]

This is the contract package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-contract
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-contract.js` in your html file.
This will expose the `Web3EthContract` object on the window object.


## Usage

```js
import {ProvidersModuleFactory} from 'web3-providers';
import {Contract} from 'web3-eth-contract';

const provider = new ProvidersModuleFactory().createProviderAdapterResolver().resolve('http://127.0.0.1:4546');
const contract = new Contract(
    provider,
    abi,
    address,
    options
);

contract.methods.someFunc().send({...}).on('receipt', (receipt) => {});
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


