<p style="text-align: center;">
  <img src="assets/logo/web3js.jpg" width="200" alt="web3.js">
</p>

# web3.js - Ethereum JavaScript API

[![Discord][discord-image]][discord-url] [![StackExchange][stackexchange-image]][stackexchange-url] [![NPM Package Version][npm-image-version]][npm-url] [![NPM Package Downloads][npm-image-downloads]][npm-url] [![Build Status][actions-image]][actions-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Lerna][lerna-image]][lerna-url] [![Netlify Status][netlify-image]][netlify-url]

This is the Ethereum [JavaScript API][docs]
which connects to the [Generic JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec.

You need to run a local or remote [Ethereum](https://www.ethereum.org/) node to use this library.

Please read the [documentation][docs] for more.

## Installation

### Node

```bash
npm install web3
```

### Yarn

```bash
yarn add web3
```

### In the Browser

Use the prebuilt `dist/web3.min.js`, or
build using the [web3.js][repo] repository:

```bash
npm run build
```

Then include `dist/web3.min.js` in your html file.
This will expose `Web3` on the window object.

Or via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

UNPKG:

```html
<script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
```

## Usage

```js
// In Node.js
const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8546');
console.log(web3);
// Output
{
    eth: ... ,
    shh: ... ,
    utils: ...,
    ...
}
```

Additionally you can set a provider using `web3.setProvider()` (e.g. WebsocketProvider):

```js
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
```

There you go, now you can use it:

```js
web3.eth.getAccounts().then(console.log);
```

### Usage with TypeScript

We support types within the repo itself. Please open an issue here if you find any wrong types.

You can use `web3.js` as follows:

```typescript
import Web3 from 'web3';
import { BlockHeader, Block } from 'web3-eth' // ex. package types
const web3 = new Web3('ws://localhost:8546');
```

If you are using the types in a `commonjs` module, like in a Node app, you just have to enable `esModuleInterop` and `allowSyntheticDefaultImports` in your `tsconfig` for typesystem compatibility:

```js
"compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    ....
```

## Troubleshooting and known issues.

### Web3 and Create-react-app

If you are using create-react-app version >=5 you may run into issues building. This is because NodeJS polyfills are not included in the latest version of create-react-app.

### Solution


- Install react-app-rewired and the missing modules

If you are using yarn:
```bash
yarn add --dev react-app-rewired process crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer
```

If you are using npm:
```bash
npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
```

- Create `config-overrides.js` in the root of your project folder with the content:

```javascript
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}
```

- Within `package.json` change the scripts field for start, build and test. Instead of `react-scripts` replace it with `react-app-rewired`

before: 
```typescript
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
},
```

after:
```typescript
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

The missing Nodejs polyfills should be included now and your app should be functional with web3.
- If you want to hide the warnings created by the console:

In `config-overrides.js` within the `override` function, add:

```javascript
config.ignoreWarnings = [/Failed to parse source map/];
```

### Web3 and Angular

### New solution

If you are using Angular version >11 and run into an issue building, the old solution below will not work. This is because polyfills are not included in the newest version of Angular.

- Install the required dependencies within your angular project:

```bash
npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify
```

- Within `tsconfig.json` add the following `paths` in `compilerOptions` so Webpack can get the correct dependencies

```typescript
{
    "compilerOptions": {
        "paths" : {
        "crypto": ["./node_modules/crypto-browserify"],
        "stream": ["./node_modules/stream-browserify"],
        "assert": ["./node_modules/assert"],
        "http": ["./node_modules/stream-http"],
        "https": ["./node_modules/https-browserify"],
        "os": ["./node_modules/os-browserify"],
    }
}
```

- Add the following lines to `polyfills.ts` file:

```typescript
import { Buffer } from 'buffer';

(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
} as any;
```

### Old solution

If you are using Ionic/Angular at a version >5 you may run into a build error in which modules `crypto` and `stream` are `undefined`

a workaround for this is to go into your node-modules and at `/angular-cli-files/models/webpack-configs/browser.js` change  the `node: false` to `node: {crypto: true, stream: true}` as mentioned [here](https://github.com/ethereum/web3.js/issues/2260#issuecomment-458519127)

Another variation of this problem was an [issue opned on angular-cli](https://github.com/angular/angular-cli/issues/1548)

## Documentation

Documentation can be found at [ReadTheDocs][docs].

## Building

### Requirements

-   [Node.js](https://nodejs.org)
-   [npm](https://www.npmjs.com/)

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

### Building (webpack)

Build the web3.js package:

```bash
npm run build
```

### Testing (mocha)

```bash
npm test
```

### Contributing

Please follow the [Contribution Guidelines](./CONTRIBUTIONS.md) and [Review Guidelines](./REVIEW.md).

This project adheres to the [Release Guidelines](./REVIEW.md).

### Community

-   [Discord][discord-url]
-   [StackExchange][stackexchange-url]

### Similar libraries in other languages

-   Haskell: [hs-web3](https://github.com/airalab/hs-web3)
-   Java: [web3j](https://github.com/web3j/web3j)
-   PHP: [web3.php](https://github.com/web3p/web3.php)
-   Purescript: [purescript-web3](https://github.com/f-o-a-m/purescript-web3)
-   Python: [Web3.py](https://github.com/ethereum/web3.py)
-   Ruby: [ethereum.rb](https://github.com/EthWorks/ethereum.rb)
-   Scala: [web3j-scala](https://github.com/mslinn/web3j-scala)

[repo]: https://github.com/ethereum/web3.js
[docs]: http://web3js.readthedocs.io/
[npm-image-version]: https://img.shields.io/npm/v/web3.svg
[npm-image-downloads]: https://img.shields.io/npm/dm/web3.svg
[npm-url]: https://npmjs.org/package/web3
[actions-image]: https://github.com/ethereum/web3.js/workflows/Build/badge.svg
[actions-url]: https://github.com/ethereum/web3.js/actions
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev
[dep-dev-image]: https://david-dm.org/ethereum/web3.js/dev-status.svg
[dep-dev-url]: https://david-dm.org/ethereum/web3.js#info=devDependencies
[coveralls-image]: https://coveralls.io/repos/ethereum/web3.js/badge.svg?branch=1.x
[coveralls-url]: https://coveralls.io/r/ethereum/web3.js?branch=1.x
[waffle-image]: https://badge.waffle.io/ethereum/web3.js.svg?label=ready&title=Ready
[waffle-url]: https://waffle.io/ethereum/web3.js
[discord-image]: https://img.shields.io/discord/593655374469660673?label=Discord&logo=discord&style=flat
[discord-url]:  https://discord.gg/pb3U4zE8ca
[lerna-image]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[lerna-url]: https://lerna.js.org/
[netlify-image]: https://api.netlify.com/api/v1/badges/1fc64933-d170-4939-8bdb-508ecd205519/deploy-status
[netlify-url]: https://app.netlify.com/sites/web3-staging/deploys
[stackexchange-image]: https://img.shields.io/badge/web3js-stackexchange-brightgreen
[stackexchange-url]: https://ethereum.stackexchange.com/questions/tagged/web3js

## Semantic versioning

This project follows [semver](https://semver.org/) as closely as possible **from version 1.3.0 onwards**. Earlier minor version bumps [might](https://github.com/ethereum/web3.js/issues/3758) have included breaking behavior changes.
