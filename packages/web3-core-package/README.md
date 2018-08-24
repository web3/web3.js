# web3-core

This is a sub package of [web3.js][repo]

The core package contains core functions for [web3.js][repo] packages.
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-core
```


## Usage

```js
// in node.js
var core = require('web3-core');

var CoolLib = function CoolLib() {

    // sets _requestmanager and adds basic functions
    core.packageInit(this, arguments);
    
};


CoolLib.providers;
CoolLib.givenProvider;
CoolLib.setProvider();
CoolLib.BatchRequest();
CoolLib.extend();
...
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


