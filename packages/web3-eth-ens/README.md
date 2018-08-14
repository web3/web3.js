# web3-eth-ens

This is a sub package of [web3.js][repo]

This is the contract package to be used in the `web3-eth` package.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-eth-ens
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth-ens.js` and `dist/web3-eth.js` in your html file.
This will expose the `EthEns` object on the window object.

## Usage

```js
    var eth = new Web3Eth(web3.currentProvider);
    var ens = new EthEns(eth);
    
    ens.getAddress('ethereum.eth').then(function (result) {
      console.log(result);
    });
```



[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


