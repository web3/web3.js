# web3-eth-personal

This is a sub package of [web3.js][repo]

This is the personal package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-personal
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-personal.js` in your html file.
This will expose the `Web3EthPersonal` object on the window object.


## Usage

```js
import {ProvidersModuleFactory} from 'web3-providers';
import {Personal} from 'web3-eth-personal';

const personal = new Personal(
    new ProvidersModuleFactory().createProviderAdapterResolver().resolve('http://127.0.0.1:4546'),
    options
);
```

## Types

If you are using TypeScript all the types are defined in the `index.d.ts` file.


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


