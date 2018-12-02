# web3-eth-iban

This is a sub package of [web3.js][repo]

This is the IBAN package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-iban
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-iban.js` in your html file.
This will expose the `Web3EthIban` object on the window object.


## Usage

```js
// in node.js
import {Iban} from 'web3-eth-iban';

const iban = new Iban('XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3');
console.log(iban.toAddress());
> '0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B'
```

## Types 
If you are using TypeScript then all types are defined within the package itself so no need
to install any `@types` libraries. Just import the library and the types should be exposed.  


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


