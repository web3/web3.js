# Web3 Migration Guide

## Breaking Changes

### Not Implemented or Exported

-   [extend](https://web3js.readthedocs.io/en/v1.7.3/web3.html#extend) Extending web3 modules functionality is not implemented
-   [web3.bzz](https://web3js.readthedocs.io/en/v1.7.3/web3-bzz.html) Package for interacting with Swarm is not implemented
-   [web3.shh](https://web3js.readthedocs.io/en/v1.7.3/web3-shh.html) Package for interacting with Whisper is not implemented
-   [web3.net](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html#net) namespace is not exported

### Defaults and Configs

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` will never return `null`, provider required upon instantiation as opposed to being optional in 1.x

### Web3 Instance

provider parameter is required in 4.x

```typescript
// in 1.x this is working
let web3 = new Web3();

// in 4.x a provider is required
let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
```

### Web3 Methods
