---
sidebar_position: 2
sidebar_label: 'Tutorial: Sending Transactions'
---

# Sending Transactions

This tutorial will walk through the process of using accounts to send transactions on a [development network](https://ethereum.org/en/developers/docs/development-networks/), including how to subscribe to the events associated with a transaction. The topics covered in this tutorial include basic concepts of [Ethereum](https://ethereum.org/), such as [accounts](/guides/wallet/), [denominations of ether](https://ethereum.org/en/developers/docs/intro-to-ether/#denominations), [transactions](https://ethereum.org/en/developers/docs/transactions/), and [gas fees](https://ethereum.org/en/developers/docs/gas/), as well as the basics of the [Hardhat](https://hardhat.org/) development environment.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Review prerequisites
2. Create a new directory and initialize a new Node.js project
3. Set up Web3.js and Hardhat
4. Send a transaction and review the results
5. Send a transaction and subscribe to its events
6. Send a raw transaction

:::tip
If you encounter any issues while following this guide or have any questions, don't hesitate to seek assistance. Our friendly community is ready to help you out! Join our [Discord](https://discord.gg/F4NUfaCC) server and head to the **#web3js-general** channel to connect with other developers and get the support you need. 
:::

## Step 1: Prerequisites

This tutorial assumes basic familiarity with the command line as well as familiarity with JavaScript and [Node.js](https://nodejs.org/). Before starting this tutorial, ensure that Node.js and its package manager, npm, are installed.

```bash
$: node -v
# your version may be different, but it's best to use the current stable version
v18.16.1
$: npm -v
9.5.1
```

## Step 2: Create a New Directory and Initialize a New Node.js Project

First, create a new project directory for the project and navigate into it:

```bash
mkdir account-transactions-tutorial
cd account-transactions-tutorial
```

Next, initialize a new Node.js project using npm:

```bash
npm init -y
```

This will create a new `package.json` file in your project directory.

## Step 3: Set Up Web3.js and Hardhat

Install the required packages with npm:

```bash
npm i web3 hardhat
```

Next, initialize the Hardhat project:

```bash
npx hardhat init
```

Initializing the Hardhat project will require responding to several prompts - select the default option for each prompt. After the Hardhat project has been initialized, a number of new files and directories will be created.

To start the Hardhat development network, execute the following command:

```bash
npx hardhat node
```

Executing this command will produce the following output, which provides the URL that can be used to connect to the development network as well as the development network's test accounts:

```bash
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: <redacted>

...

Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
Private Key: <redacted>

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```

:::info
The Hardhat development network's test accounts are funded with ETH for testing purpose. These accounts will be used in this tutorial to send transactions.
:::

The Hardhat development network needs to remain running in the terminal that was used to start it. Open a new terminal instance in the project directory to execute the remaining commands in this tutorial.

Next, create a new file called `index.js` in your project directory and add the following code to it:

```js
const { Web3 } = require("web3");

const web3 = new Web3("http://127.0.0.1:8545/");

// Log the chain ID to the console
web3.eth
  .getChainId()
  .then((result) => {
    console.log("Chain ID: " + result);
  })
  .catch((error) => {
    console.error(error);
  });
```

This code sets up a Web3.js connection to the Hardhat development network and logs the chain ID to the console.

:::note
This tutorial uses the default URL for the Hardhat development network (http://127.0.0.1:8545/). Make sure to use the actual URL that was provided when the Hardhat development network was started.
:::

Run the following command to test the connection:

```bash
node index.js
```

If everything is working correctly, the chain ID of the Hardhat development network should be logged to the console:

```bash
Chain ID: 31337
```

## Step 4: Send a Transaction and Review the Results

Create a new file called `transaction-receipt.js` in your project directory and add the following code to it:

:::note
Replace the value of the `privateKey` variable with one of the private keys of the Hardhat development network's test accounts.
:::

```js
const { Web3 } = require("web3");

async function main() {
  const web3 = new Web3("http://127.0.0.1:8545/");

  // create a new Web3.js account object with the private key of a Hardhat test account
  const privateKey = "<redacted>";
  // the account is created with a wallet, which makes it easier to use
  const sender = web3.eth.accounts.wallet.add(privateKey)[0];

  // generate a new random Web3.js account object to receive the transaction
  const receiver = web3.eth.accounts.create();

  // log initial balances
  console.log(
    "Initial sender balance:",
    // account balance in wei
    await web3.eth.getBalance(sender.address)
  );
  console.log(
    "Initial receiver balance:",
    // account balance in wei
    await web3.eth.getBalance(receiver.address)
  );

  // sign and send the transaction
  const receipt = await web3.eth.sendTransaction({
    from: sender.address,
    to: receiver.address,
    // amount in wei
    value: 100,
  });

  // log transaction receipt
  console.log(receipt);

  // log final balances
  console.log(
    "Final sender balance:",
    await web3.eth.getBalance(sender.address)
  );
  console.log(
    "Final receiver balance:",
    await web3.eth.getBalance(receiver.address)
  );
}

main();
```

This script uses the [`web3.eth.sendTransaction`](/libdocs/Web3Eth#sendtransaction) function to send the transaction. The parameter to this function is defined by the [`Transaction`](/api/web3-types/interface/Transaction) interface.

:::note
By default, Web3.js uses the [wei denomination](https://ethereum.org/en/developers/docs/intro-to-ether/#denominations) for account balances and transaction values. The [`web3-utils`](/libdocs/Utils) package has helper functions that can be used to convert other denominations of ether [to](/libdocs/Utils#towei) and [from](/libdocs/Utils#fromwei) wei.
:::

In this example, the account is created with a `Wallet`, which adds it to the internal Web3.js context (i.e. [`Web3Context`](/api/web3-core/class/Web3Context)). When a transaction is sent from an account that has been created with a `Wallet` and added to the context, Web3.js will automatically use that account's private key to sign the transaction. The steps required to send a transaction from an account that hasn't been created with a wallet and added to the context are described in [Step 6: Send a Raw Transaction](#step-6-send-a-raw-transaction).

Execute the following command to run the code from `transaction-receipt.js`:

```bash
node transaction-receipt.js
```

The output should look similar to the following:

```
Initial sender balance: 10000000000000000000000n
Initial receiver balance: 0n
{
  blockHash: '0x9a7250ca7947b84972bf973da232656280f2bb5eab71777a34fb49c08585a2b2',
  blockNumber: 1n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 3375000000n,
  from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0xc14a6278b4a8d4f9eb198b75b7013d58b1de94da',
  transactionHash: '0xaf4b89e10c811e3f2c954447e40f7ecac073ca41fa4a896a3a86299cae24b339',
  transactionIndex: 0n,
  type: 2n
}
Final sender balance: 9999999929124999999900n
Final receiver balance: 100n
```

Note that the sender's balance has decreased by more than the amount that was transferred to the receiver. This is because the sender's balance is also used to pay for the transaction's [gas fees](https://ethereum.org/en/developers/docs/gas/). The transaction receipt specifies the amount of gas that was used (`cumulativeGasUsed`) and the gas price in wei (`effectiveGasPrice`). The total amount deducted from the sender's balance is equal to the amount transferred plus the cost of the gas fees (`cumulativeGasUsed` multiplied by `effectiveGasPrice`).

## Step 5: Send a Transaction and Subscribe to Its Events

In the previous example, the `transaction-receipt.js` script demonstrates sending a transaction to the network and reviewing the results after it has been successfully received. However, there are more stages to the [transaction lifecycle](https://ethereum.org/en/developers/docs/transactions/#transaction-lifecycle) and Web3.js makes it easy to subscribe to these lifecycle stages and create custom handlers for each one. Web3.js supports subscriptions for the following transaction lifecycle events:

- Sending - Web3.js is preparing to send the transaction to the network
- Sent - the transaction has been sent to the network
- Transaction hash - a hash of the transaction has been generated
- Receipt - the transaction has been included in a block
- Confirmation - the block in which the transaction was included has been [finalized](https://ethereum.org/en/glossary/#finality)
- Error - a problem with the transaction was encountered

Create a new file called `transaction-events.js` in your project directory and add the following code to it:

```js
const { Web3 } = require("web3");

const web3 = new Web3("http://127.0.0.1:8545/");

const privateKey = "<redacted>";
const sender = web3.eth.accounts.wallet.add(privateKey)[0];

const receiver = web3.eth.accounts.create();

web3.eth
  .sendTransaction({
    from: sender.address,
    to: receiver.address,
    value: 100,
  })
  .on("sending", (sending) => {
    console.log("Sending:", sending);
  })
  .on("sent", (sent) => {
    console.log("Sent:", sent);
  })
  .on("transactionHash", (transactionHash) => {
    console.log("Transaction Hash:", transactionHash);
  })
  .on("receipt", (receipt) => {
    console.log("Receipt:", receipt);
  })
  .on("confirmation", (confirmation) => {
    console.log("Confirmation:", confirmation);
    process.exit(0);
  })
  .on("error", (error) => {
    console.log("Error:", error);
    process.exit(1);
  });
```

Execute the following command to run the code from `transaction-events.js`:

```bash
node transaction-events.js
```

The output should look similar to the following:

```
Sending: {
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  to: '0x077bd1F472a0C7eD3214583d4B0fE8b21e4b3b5A',
  value: '0x64',
  gasPrice: undefined,
  maxPriorityFeePerGas: '0x9502f900',
  maxFeePerGas: '0xfd51da80'
}
Sent: {
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  to: '0x077bd1F472a0C7eD3214583d4B0fE8b21e4b3b5A',
  value: '0x64',
  gasPrice: undefined,
  maxPriorityFeePerGas: '0x9502f900',
  maxFeePerGas: '0xfd51da80'
}
Transaction Hash: 0x66b4cd592e82ea09dee4015277aee9299bafce369819a82b4797a06ba010c6b1
Receipt: {
  blockHash: '0xeedfe16bb67dae4cc2064f68ddcef1b83deb4b1eaf19b99c2a175aafaded36b9',
  blockNumber: 2n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 3265778125n,
  from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0x077bd1f472a0c7ed3214583d4b0fe8b21e4b3b5a',
  transactionHash: '0x66b4cd592e82ea09dee4015277aee9299bafce369819a82b4797a06ba010c6b1',
  transactionIndex: 0n,
  type: 2n
}
Confirmation: {
  confirmations: 1n,
  receipt: {
    blockHash: '0xeedfe16bb67dae4cc2064f68ddcef1b83deb4b1eaf19b99c2a175aafaded36b9',
    blockNumber: 2n,
    cumulativeGasUsed: 21000n,
    effectiveGasPrice: 3265778125n,
    from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    gasUsed: 21000n,
    logs: [],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    status: 1n,
    to: '0x077bd1f472a0c7ed3214583d4b0fe8b21e4b3b5a',
    transactionHash: '0x66b4cd592e82ea09dee4015277aee9299bafce369819a82b4797a06ba010c6b1',
    transactionIndex: 0n,
    type: 2n
  },
  latestBlockHash: '0xeedfe16bb67dae4cc2064f68ddcef1b83deb4b1eaf19b99c2a175aafaded36b9'
}
```

Because the transaction should succeed, the error event should not be logged to the console. To review an error event, use a random account to send the transaction by changing the value of the `sender` variable as follows:

```js
const sender = web3.eth.accounts.wallet.create(1)[0];
```

This change will cause an error since the new random account does not have a balance that can be used to pay the transaction's gas fees.

Re-run the updated script as before. The output should look similar to the following:

```
Sending: {
  from: '0x2F2f42075567cd9823961A4e04171cEbdc45E390',
  to: '0xb52F3110C8d3eFDa5137A8A935eE35aACCBB3613',
  value: '0x64',
  gasPrice: undefined,
  maxPriorityFeePerGas: '0x9502f900',
  maxFeePerGas: '0xf04caa9a'
}
Error: InvalidResponseError: Returned error: Sender doesn't have enough funds to send tx. The max upfront cost is: 84666712806350 and the sender's balance is: 0.
    at Web3RequestManager._processJsonRpcResponse (.../web3-core/lib/commonjs/web3_request_manager.js:281:23)
    at Web3RequestManager.<anonymous> (.../web3-core/lib/commonjs/web3_request_manager.js:167:29)
    at Generator.next (<anonymous>)
    at fulfilled (.../web3-core/lib/commonjs/web3_request_manager.js:21:58)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  cause: {
    code: -32000,
    message: "Sender doesn't have enough funds to send tx. The max upfront cost is: 84666712806350 and the sender's balance is: 0.",
    data: {
      message: "Sender doesn't have enough funds to send tx. The max upfront cost is: 84666712806350 and the sender's balance is: 0.",
      data: null
    }
  },
  code: 101,
  data: {
    message: "Sender doesn't have enough funds to send tx. The max upfront cost is: 84666712806350 and the sender's balance is: 0.",
    data: null
  },
  request: {
    jsonrpc: '2.0',
    id: 'bf7e8ddd-f2bb-45ab-9168-8c577cd1bcb9',
    method: 'eth_sendRawTransaction',
    params: [
      '0x02f86c827a6980849502f90084f04caa9a82520994b52f3110c8d3efda5137a8a935ee35aaccbb36136480c080a040b3b5d9a72ced0ec70750157a34972233b51e49a511a813763487f84905841ca06237e4a9b1e00934c6fabd32588ed44b6b55bb4aadb67939410a7a0cb801e2f1'
    ]
  }
}
```

## Step 6: Send a Raw Transaction

The previous examples have relied on the helpful Web3.js context to automatically sign transactions with accounts that have been created with a `Wallet`. The final example in this tutorial will demonstrate using a non-wallet account to manually sign a transaction.

Create a new file called `raw-transaction.js` in your project directory and add the following code to it:

```js
const { Web3 } = require("web3");

async function main() {
  const web3 = new Web3("http://127.0.0.1:8545/");

  const privateKey = "<redacted>";
  // import the Hardhat test account without the use of a wallet
  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);

  const receiver = web3.eth.accounts.create();

  // used to calculate the transaction's maxFeePerGas
  const block = await web3.eth.getBlock();

  const transaction = {
    from: sender.address,
    to: receiver.address,
    value: 100,
    // the following two properties must be included in raw transactions
    maxFeePerGas: block.baseFeePerGas * 2n,
    maxPriorityFeePerGas: 100000,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction,
    sender.privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(receipt);
}

main();
```

In this example, the [`signTransaction`](/api/web3-eth-accounts/function/signTransaction) function is used to manually sign the transaction with the sender's private key before using the [`sendSignedTransaction`](/api/web3-eth/function/sendSignedTransaction) function to send the transaction to the network. Note that, unlike in the previous examples, which relied on the helpful Web3.js context to construct the final transaction, this examples requires the inclusion of the [`maxFeePerGas`](/api/web3-types/interface/Transaction#maxFeePerGas) and [`maxPriorityFeePerGas`](/api/web3-types/interface/Transaction#maxPriorityFeePerGas) properties on the [`Transaction`](/api/web3-types/interface/Transaction) object. The exact meaning of these properties is out of the scope of this tutorial, but notice that `maxFeePerGas` is calculated using an actual value retrieved from the network ([`baseFeePerGas`](/api/web3-types/interface/BlockBase#baseFeePerGas)) while `maxPriorityFeePerGas` is set to a value that is simply deemed to be high enough.

Execute the following command to run the code from `raw-transaction.js`:

```bash
node raw-transaction.js
```

The output should look similar to the following:

```
{
  blockHash: '0xb83ccddddb4e715e51765182e184251d55bd4bc5da982691b169d21e39b62559',
  blockNumber: 3n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 670289871n,
  from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0x9f676309956465c7e4d188f58149a9e8f945d477',
  transactionHash: '0xe56a9aee0f4927d5ce1eefaf2a323d32eb51e762bcf2ef33989c101302379bfc',
  transactionIndex: 0n,
  type: 2n
}
```

## Conclusion

This tutorial demonstrated using accounts to send transactions, including how to subscribe to the events associated with a transaction. The easiest way to send a transaction from an account is to create the account with a `Wallet`, which adds that account to the Web3.js context and automates the process of using the account's private key to sign the transaction. However, for non-wallet accounts or in situations where it's necessary to decouple the processes of signing and sending a transaction (e.g. offline signing), Web3.js provides easy interfaces for manually signing a transaction before sending it.
