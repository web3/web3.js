---
sidebar_position: 3
sidebar_label: 'Web3PromiEvent'
---

# PromiEvent

You can use Web3PromiEvent when you send transaction via `web3.eth.sendTransaction`, `web3.eth.sendSignedTransaction`, `contractDeployed.methods['methodName'](...methodParams).send` functions

```ts
web3.eth.sendTransaction({...})
    .on('sending', (sending) => {
        // Sending example
        // 0x02f86d82053903849502f900849a9a0d16830186a0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c080a0b0fce643a6ca3077ee6b83590b1798d00edef99e2c65c1837daab88d46860887a07ca449a31b2430dbf21310b8c4491386762ade23e48c7cd0b70d315576374c7c
    })
    .on('sent', (sent) => {
        // Sent example
        // 0x02f86d82053903849502f900849a9a0d16830186a0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c080a0b0fce643a6ca3077ee6b83590b1798d00edef99e2c65c1837daab88d46860887a07ca449a31b2430dbf21310b8c4491386762ade23e48c7cd0b70d315576374c7c
    })
    .on('transactionHash', (transactionHash) => {
        // Transaction hash example
        // 0x6d85b2f07e7c8f2a7ce90a5bcfa3100c528f173f0707164434fb42d397d92d50
    })
    .on('confirmation', (confirmation) => {
        // Confirmation example
        // {
        //     confirmations: 1n,
        //         receipt: {
        //          blockHash: '0x947b8c95dea7f0c643f2be0e9d1c3bec76c7f5146fdf34f5f1efe6d2cab5f568',
        //               blockNumber: 22n,
        //               cumulativeGasUsed: 21000n,
        //               effectiveGasPrice: 2553565308n,
        //               from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
        //               gasUsed: 21000n,
        //               logs: [],
        //               logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        //               status: 1n,
        //               to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
        //               transactionHash: '0x3ec198ae10cf289b91210b4fd86a3b22cc9bcef16bca6beee21c35b76a2b7073',
        //               transactionIndex: 0n,
        //               type: 2n
        //          },
        //     latestBlockHash: '0x947b8c95dea7f0c643f2be0e9d1c3bec76c7f5146fdf34f5f1efe6d2cab5f568'
        // }

    })
    .on('receipt', (receipt) => {
        // Receipt example
        // {
        //     blockHash: '0x135d14b724d90b97feec1e96df590ce9af762d424aea49d29e11feaa24fe02f1',
        //     blockNumber: 23n,
        //     cumulativeGasUsed: 21000n,
        //     effectiveGasPrice: 2546893579n,
        //     from: '0xe2597eb05cf9a87eb1309e86750c903ec38e527e',
        //     gasUsed: 21000n,
        //     logs: [],
        //     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        //     status: 1n,
        //     to: '0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882',
        //     transactionHash: '0x9a6497fe4028d716e66a24ab7dfd3d1bcf136ba2ec26f427719b4ddaaff76fb7',
        //     transactionIndex: 0n,
        //     type: 2n
        // }

    })
    .on('error', (error) => {
        // Error example
        // InvalidResponseError: Returned error: exceeds block gas limit
        // at Web3RequestManager._processJsonRpcResponse (.../web3_request_manager.js:193:23)
        // at Web3RequestManager.<anonymous> (.../web3_request_manager.js:112:29)
        // at Generator.next (<anonymous>)
        // at fulfilled (.../web3_request_manager.js:5:58)
        // at processTicksAndRejections (node:internal/process/task_queues:96:5) {
        //             cause: { code: -32000, message: 'exceeds block gas limit' },
        //             code: 101,
        //             data: undefined,
        //             request: {
        //             jsonrpc: '2.0',
        //             id: 'ea1f8fb4-fe86-4492-9d89-c6e31bf1c036',
        //             method: 'eth_sendRawTransaction',
        //             params: [
        //             '0x02f86e82053903849502f900849a9a0d168405f7c1f0947ab80aeb6bb488b7f6c41c58e83ef248eb39c8828080c001a0ddd93f5ce9a6a0de130dc660e65d2cdf8784148b8c91b83635b8458e96a767a3a028c48b048bf041e530ded63a0d2198855043f782ef0aa47391a2afa9c50a5ff1'
        //             ]
        // }
    });


```

List of references:

-   [Web3PromiEvent](/api/web3-core/class/Web3PromiEvent)
