# Web3 Subscribe Migration Guide

## Breaking Changes

1. Event `data` from `newBlockHeaders` subscription doesn't return field `size`
2. Event `data` from `logs` subscription doesn't have field `id`
3. ClearSubscriptions 1.x returns true. clearSubscriptions 4.x returns array of subscription's ids
