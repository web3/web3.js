# conflux-web.js - Conflux JavaScript API

This is the Conflux [JavaScript API][docs]
which connects to the [Generic JSON RPC](https://conflux-chain.github.io/conflux-doc/json-rpc/) spec.

You need to run a local or remote Conflux node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node

```bash
npm install conflux-web
```

### Yarn

```bash
yarn add conflux-web
```

## Usage

```js
import ConfluxWeb from 'conflux-web';
// const ConfluxWeb = require('conflux-web'); // for nodejs

const confluxWeb = new ConfluxWeb('ws://localhost:8546');
console.log(confluxWeb);
> {
    cfx: ...,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `confluxWeb.setProvider()` (e.g. WebsocketProvider)

```js
confluxWeb.setProvider('ws://localhost:8546');
// or
confluxWeb.setProvider(new ConfluxWeb.providers.WebsocketProvider('ws://localhost:8546'));
```

There you go, now you can use it:

```js
confluxWeb.cfx.getAccounts()
.then(console.log);
```

### Usage with TypeScript

We support types within the [repo] itself. Please open an issue here if you find any wrong types.

You can use `conflux-web.js` as follows:

```typescript
import ConfluxWeb from 'conflux-web';
const confluxWeb = new ConfluxWeb("ws://localhost:8546");
```

If you are using the types in a `commonjs` module like for example a node app you just have to enable `esModuleInterop` in your `tsconfig` compile option, also enable `allowSyntheticDefaultImports` for typesystem compatibility:

```js
"compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ....
```

## Documentation

Documentation can be found at [read the docs][docs]

## Contributing

- All contributions have to go into the 1.0 branch
- Please follow the code style of the other files, we use 4 spaces as tabs.

### Requirements

* [Node.js](https://nodejs.org)
* npm

### Commands
```bash
npm run clean // removes all the node_modules folders in all modules
npm run bootstrap // install all dependencies and symlinks the internal modules for all modules
npm run test // runs all tests 
npm run build // runs rollup
npm run dev // runs rollup with a watcher
```

### Support

![browsers](https://img.shields.io/badge/browsers-latest%202%20versions-brightgreen.svg)
![node](https://img.shields.io/badge/node->=6-green.svg)

### Community
 - [community](https://www.conflux-chain.org/community)
 - [blog](https://www.conflux-chain.org/blog)

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
[docs]: https://conflux-chain.github.io/conflux-doc
