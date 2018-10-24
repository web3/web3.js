# web3-shh

This is a sub package of [web3.js][repo]

This is the whisper v5 package.   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-shh
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-shh.js` in your html file.
This will expose the `Web3Shh` object on the window object.


## Usage

```js
import {ProvidersModuleFactory} from 'web3-providers';
import {Shh} from 'web3-shh';

const shh = new Shh(
    new ProvidersModuleFactory().createProviderAdapterResolver().resolve('http://127.0.0.1:4546'),
    options
);
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


