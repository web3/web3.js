
# ERC-20 Transfers and EIP-1559

## Introduction
In this tutorial we will walk through sending transactions with the tx object and understand how the transaction gets executed, using web3.js version 4x.

## The need for EIP-1559
 
Before Users had to set a single gas price for their transactions. This led to high volatility in gas fees and issues with transactions getting stuck if the gas price wasn't high enough.
With the introduction of EIP-1559, a minimum fee was introduced which will  automatically adjust based on network congestion
also a tip for miners was introduced to incentivize them, which will prioritize the transaction.


##  Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Setting up  
2. Get current base fee from the network  
3. Set max priority fee.  
4. Construct the transaction object
5. Sign and send the transaction to the RPC provider

Before we start writing and deploying our contract, we need to set up our environment. For that, we need to install the following:

1. Node.js - Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server-side. You can download it from https://nodejs.org/en/download/  

2. npm - Node Package Manager is used to publish and install packages to and from the public npm registry or a private npm registry. Here is how to install it https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. (Alternatively, you can use yarn instead of npm https://classic.yarnpkg.com/lang/en/docs/getting-started/)

# Getting started

Here we initialize Web3 and set an RPC url inside `const Url;` , add our private key in the `const privateKey;` , then we specify the erc20 token inside the  
 `const tokenAdress;`
``` 
Javascript

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract myContract{

const Web3 = require('web3');


const Url = 'wss://mainnet.infura.io/v3/******';

const privateKey = 'YOUR_PRIVATE_KEY';

const tokenAddress = '0x...'; 
}

```

Inside the `async function transferWithEIP1559()`, we initialize a provider, then add account and get the current base fee from the network to store it inside of  
`const gasPrice;` , next we set the maximum priority fee we are willing to allocate inside  `const maxPriorityFeePerGas;`, to do this we make use of utils package of web3.js, which is imported at the top.

Construct the Transaction object:  
To send the transaction details to the RPC provider for the transfer, we need to format the details in the tx object(transaction object). The tx object must contain the following:  
from, to, value, gas, maxPriorityFeePerGas.


```
async function transferWithEIP1559() {
  try {
    const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    // Get current base fee from the network
    const gasPrice = await web3.eth.gasPrice();

    // Set max priority fee (optional, you can adjust this)
    const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');

    // Construct the transaction object
    const tx = {
      from: account.address,
      to: recipientAddress, // For ETH transfers
      // or: to: tokenAddress, // For ERC-20 token transfers
      value: amountToTransfer, // For ETH transfers, set to 0x0 for tokens
      // ... (add contract data for ERC-20 transfers)
      gas: web3.utils.toHex(210000), // Gas limit, adjust as needed
      gasPrice,
      maxPriorityFeePerGas,
      type: 2, // EIP-1559 transaction type
    };
    ```

Sign and send the transaction:  
To sign a transaction we perform the `signTransaction` method on the account with the help of the web3.js lib.
Next we use the `sendSignedTransaction` method with the `signedTx` parameters.

```
 // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction hash: ${txHash}`);
  } catch (error) {
    console.error('Error:', error);
  }
```
## Conclusion
In this tutorial, we learned how to sign a set up RPC urls and transfer erc-20 tokens with the help of Web3.js library.

## Additional Resources

-   [Official web3.js Documentation](https://docs.web3js.org/)
-   [Solidity Documentation](https://solidity.readthedocs.io/)
-   [Ganache](https://www.trufflesuite.com/ganache)
-   [Truffle](https://trufflesuite.com/)
-   [Remix IDE](https://remix.ethereum.org/)

## Tips and Best Practices

-   Always test your smart contracts on a local network like Ganache before deploying them to the mainnet.
-   Use the latest version of web3.js and Solidity to take advantage of the latest features and security patches.
-   Keep your private keys secure and never share them with anyone.
-   Use the gas limit and gas price parameters carefully to avoid spending too much on transaction fees.
-   Use the `estimateGas` function in web3.js to estimate the gas required for a transaction before sending it to the network.
-   Use events to notify the client application about state changes in the smart contract.
-   Use a linter like Solhint to check for common Solidity coding errors.
