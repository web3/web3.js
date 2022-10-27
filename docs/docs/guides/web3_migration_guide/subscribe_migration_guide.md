---
sidebar_position: 8
sidebar_label: web3.eth.subscribe
---

# web3.eth.subscribe Migration Guide

## Breaking Changes

### web3.eth.clearSubscriptions

In 1.x, `web3.eth.clearSubscriptions` returns `true`.

In 4.x, `web3.eth.clearSubscriptions` returns `Array of subscription ids`.
