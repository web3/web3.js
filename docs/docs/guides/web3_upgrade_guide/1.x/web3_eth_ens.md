---
sidebar_position: 3
sidebar_label: web3.eth.ens
---

# web3.eth.ens Migration Guide

## Breaking Changes

-   All the API level interfaces returning or accepting `null` in 1.x, use `undefined` in 4.x.
-   Functions don't accept a callback anymore.
-   Functions that accepted an optional `TransactionConfig` as the last argument, now accept an optional `NonPayableCallOptions`. See `web3-eth-contract` package for more details.
-   List of web3-eth-ens set functions are removed in 4.x

#### receipt

-   The `receipt` object the event listener receives:
    -   Returns a `BigInt` instead of a number for the following properties:
        -   `transactionIndex`
        -   `blockNumber`
        -   `cumulativeGasUsed`
        -   `gasUsed`
        -   `effectiveGasPrice`
    -   Returns a `BigInt` instead of a boolean for the following properties:
        -   `status`

#### web3.eth.ens.registryAddress

-   In 1.x ens was trying to find the registry address of the current network. In 4.x the default value is set to the address of registry address in the mainnet.

#### web3.eth.ens.registry

-   `registry` was the way to get the ENS registry in 1.x. In 4.x the registry functionality is exposed directly through the `ens` class.

#### resolver

-   `resolver` was already deprecated in the latest versions of 1.x. In 4.x it doesn't exist, use `getResolver` instead.

#### setOwner

-   In 1.x documentation it is mentioned that `name`,`txConfig` and `callback` are the function arguments. This is wrong, since there is one more argument, `address`. So the right signature is `setOwner(name: string, address: string, txConfig?: TransactionConfig | undefined, callback?: ....)`. The same applies for 4.x, too.

#### `getTTL`

-   In 4.x a `bigint` is returned instead of a `number`.

### Removed functions

    -   `getMultihash` is not supported in web3-eth-ens 4.x as it's deprecated in ENS public resolver
    -   Following functions are not supported in web3-eth-ens 4.x :
            `setResolver`
            `setSubnodeRecord`
            `setApprovalForAll`
            `isApprovedForAll`
            `setSubnodeOwner`
            `setTTL`
            `setOwner`
            `setRecord`
            `setAddress`
            `setPubkey`
            `setContenthash`
