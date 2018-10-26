# web3-core-promievent

This is a sub package of [web3.js][repo]

This is the PromiEvent package is used to return a EventEmitter mixed with a Promise to allow multiple final states as well as chaining.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core-promievent
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-core-promievent.js` in your html file.
This will expose the `Web3PromiEvent` object on the window object.


## Usage

```js
import PromiEvent from 'web3-core-promievent';

const myFunc = () => {
    const promiEvent = new PromiEvent();
    
    setTimeout(() => {
        promiEvent.emit('done', 'Hello!');
        promiEvent.resolve('Hello!');
    }, 10);
    
    return promiEvent;
};


myFunc().then(console.log)
> Hello!

myFunc().on(console.log)
> Hello!
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


