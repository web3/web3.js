# web3-bzz

This is a sub package of [web3.js][repo]

This is the swarm package of web3.js for further information please read the [documentation][docs].

## Installation

### Node.js

```bash
npm install web3-bzz
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-bzz.js` in your html file.
This will expose the `Web3Bzz` object on the window object.


## Usage

```js
// in node.js
import {Bzz} from 'web3-bzz';

const bzz = new Bzz('http://swarm-gateways.net');
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


