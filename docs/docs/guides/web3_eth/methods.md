---
sidebar_position: 2
sidebar_label: 'Web3Eth methods'
---

# Web3Eth methods

## createAccessList


The [createAccessList](/api/web3-eth/function/createAccessList) method is used to create an access list.
Creating an access list in Ethereum is typically associated with Ethereum Improvement Proposal (EIP)-2930, which introduces a way to specify which accounts and storage keys a transaction expects to access. Access lists are used to optimize gas costs for transactions by providing explicit information about what the transaction needs to access.

## estimateGas

The [estimateGas](/api/web3-eth/function/estimateGas) function is used to estimate the amount of gas that will be consumed when executing a specific transaction or invoking a contract function. This can be very useful when you want to determine the potential cost of a transaction or function call before actually sending it to the Ethereum network. It helps users ensure that they have enough ether to cover the gas costs for the operation.

## getBalance

The [getBalance](/api/web3-eth/function/getBalance) function is used to retrieve the balance of an Ethereum address, which represents the amount of Ether (ETH) associated with that address. It's a fundamental and frequently used function when working with Ethereum applications.

## getBlock

The [getBlock](/api/web3-eth/function/getBlock) function is used to retrieve information about a specific Ethereum block. Ethereum blocks are the fundamental building blocks of the blockchain, containing a collection of transactions and other data.

## getBlockNumber

The [getBlockNumber](/api/web3-eth/function/getBlockNumber) function is used to retrieve the latest block number (also known as the block height) of the Ethereum blockchain. The block number is a crucial piece of information in Ethereum as it represents the current state of the blockchain, indicating the total number of blocks that have been mined up to the present.

## getBlockTransactionCount

The [getBlockTransactionCount](/api/web3-eth/function/getBlockTransactionCount) function is used to retrieve the number of transactions in a specific Ethereum block. It allows you to determine how many transactions were included in a particular block on the Ethereum blockchain.

## getBlockUncleCount

The [getBlockUncleCount](/api/web3-eth/function/getBlockUncleCount) function is used to retrieve the number of uncle blocks associated with a specific Ethereum block. In Ethereum, uncle blocks (also known as "stale blocks" or "ommer blocks") are blocks that were mined but not included in the main blockchain. They are referenced by other blocks as a way to reward miners for their efforts even if their blocks weren't part of the main chain.

## getChainId

The [getChainId](/api/web3-eth/function/getChainId) function is used to retrieve the chain ID of the connected Ethereum network. The chain ID is a unique identifier for a specific Ethereum network, and it's used to help prevent replay attacks when signing transactions. Different Ethereum networks, such as the mainnet, testnets, and private networks, have distinct chain IDs.

## getCode

The [getCode](/api/web3-eth/function/getCode) function library is used to retrieve the bytecode of a smart contract deployed on the Ethereum blockchain. Smart contracts on Ethereum are typically created by deploying bytecode to a specific address, and this function allows you to fetch the bytecode associated with a particular contract address.

## getCoinbase

The [getCoinbase](/api/web3-eth/function/getCoinbase) function is used to retrieve the address of the Ethereum account that is currently acting as the coinbase address for mining on the connected Ethereum node. The coinbase address is the address to which block rewards are sent when miners successfully mine a new block on the Ethereum blockchain. Miners configure their coinbase addresses to receive rewards for their mining efforts.

## getGasPrice

The [getGasPrice](/api/web3-eth/function/getGasPrice) function is used to retrieve the current gas price on the Ethereum network. Gas price is the amount of Ether (ETH) that users are willing to pay for each unit of gas when executing a transaction on the Ethereum network. Gas price is an important factor in determining the transaction fee (in ETH) for a transaction.

## getPendingTransactions

The [getPendingTransactions](/api/web3-eth/function/getPendingTransactions) function is used to retrieve information about pending transactions in the Ethereum network. Pending transactions are transactions that have been submitted to the network but have not yet been included in a mined block. This function allows you to access information about transactions that are waiting to be confirmed by miners.

## getProof

The [getProof](/api/web3-eth/function/getProof) function is used to obtain a Merkle proof or Patricia trie proof for a specific value or data in an Ethereum smart contract's storage. This function is typically used when you want to validate that a piece of data is stored in the contract's storage or to provide evidence for data inclusion without having to interact with the entire contract state.

In Ethereum, storage proofs are used to demonstrate the existence of a value within a contract's storage without querying the entire storage of the contract, which can be computationally expensive. These proofs are essential for various applications, including decentralized exchanges, blockchain explorers, and certain cryptographic operations.

## getProtocolVersion

You can use the [getProtocolVersion](/api/web3-eth/function/getProtocolVersion) method to retrieve the current Ethereum protocol version of the connected Ethereum node.

## getStorageAt

The [getStorageAt](/api/web3-eth/function/getStorageAt) method is used to fetch the data stored at a specific storage slot of an Ethereum address. It is often used for inspecting the internal state of smart contracts, especially when you want to retrieve the value of a specific variable in a contract's storage.

## getTransaction

The [getTransaction](/api/web3-eth/function/getTransaction) method allows you to retrieve information about a transaction based on its transaction hash. You provide the transaction hash, and this method returns an object containing details about the transaction

## getTransactionCount

The [getTransactionCount](/api/web3-eth/function/getTransactionCount) method allows you to retrieve the transaction count (nonce) of a specific Ethereum address.

## getTransactionReceipt

The [getTransactionReceipt](/api/web3-eth/function/getTransactionReceipt) method allows you to retrieve the transaction receipt for a specific transaction based on its transaction hash.

## getUncle

The [getUncle](/api/web3-eth/function/getUncle) method allows you to retrieve information about an uncle block at a specific index within a given block.

## isMining

The [isMining](/api/web3-eth/function/isMining) function returns a boolean value, indicating whether the node is actively mining or not.

## isSyncing

The [isSyncing](/api/web3-eth/function/isSyncing) method allows you to check the current synchronization status of your Ethereum node.

## sendTransaction

The [sendTransaction](/api/web3-eth/function/sendTransaction) method is used to create and send a transaction to the Ethereum network.

:::important
Please be cautious when sending transactions, especially when dealing with smart contracts, as they may execute specific functions that can have irreversible effects. Always ensure that the details in your transaction object are accurate and intended.

[Here](/guides/wallet/transactions) you can find more examples how to send transaction.
:::

## sign

The [sign](/api/web3-eth/function/sign) method is used to sign a message or data using a private key. This is often used to prove ownership or authorship of a specific piece of data or to provide cryptographic proof in various Ethereum-related operations.

## signTransaction

The [signTransaction](/api/web3-eth/function/signTransaction) method is used to sign an Ethereum transaction, creating a signed transaction object that can be broadcast to the Ethereum network.

## sendSignedTransaction

The [sendSignedTransaction](/api/web3-eth/function/sendSignedTransaction) method is used to send a signed Ethereum transaction to the Ethereum network. Before sending a transaction, you need to sign it using a private key, and then you can use this method to broadcast the signed transaction to the network.

:::note
[Here](/guides/wallet/transactions) you can find more examples how to send transaction.
:::