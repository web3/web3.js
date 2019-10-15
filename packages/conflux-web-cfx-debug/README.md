# conflux-web-cfx-debug

This is a sub module of [confluxWeb][repo]

This is the debug module and can be used as a standalone module.
Please read the [documentation][docs] for more.

## Installation

```bash
npm install conflux-web-cfx-debug
```

## Usage

```js
import {Debug} from 'conflux-web-cfx-debug';

const debug = new Debug(
    'http://127.0.0.1:8546',
    null,
    options
);
```

## Types

All the typescript typings are placed in the types folder.

[repo]: https://github.com/Conflux-Chain/ConfluxWeb
[docs]: https://conflux-chain.github.io/conflux-doc
