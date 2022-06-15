# Web3Eth Migration Guide

## Breaking Changes

-   `givenProvider` default value is `undefined` instead of `null`
-   `currentProvider` will never return `null`, provider required upon instantiation as opposed to being optional in 1.x
-   `extend` functionality not implemented
-   `web3.eth.defaultAccount` default value is `undefined` instead of `null`
    -   1.x has `undefined` documented as default, but in implementation it's `null`
-   `web3.eth.defaultHardfork` default is `london` instead of `undefined`
    -   1.x has `london` documented as default, but in implementation it's `undefined`
-   `web3.eth.defaultChain` default is `mainnet` instead of `undefined`
    -   1.x has `mainnet` documented as default, but in implementation it's `undefined`
-   `web3.eth.createAccessList` not implemented
