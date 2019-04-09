# conflux-web-net

This is a sub package of [ConfluxWeb.js][repo]

This is the net package to be used in other [ConfluxWeb.js][repo] packages.

## Installation

```bash
npm install conflux-web-net
```

## Usage

```js
import {Network} from 'conflux-web-net';

const net = new Network(
    'http://127.0.0.1:4546',
    null,
    options
);
```

## Types 

All the typescript typings are placed in the types folder. 

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
