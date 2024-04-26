---
sidebar_position: 5
sidebar_label: 'Tutorial: Sending Transactions'
---

# Transactions

This guide provides insights into sending transactions using web3.js, covering various scenarios from utilizing a local wallet to sending raw transactions.

:::note
Web3.js uses transactions type 2 by default
:::

## Transaction Type 0 (Legacy)

### Raw Transaction 

A Legacy Transaction refers to a transaction that was created using an older version of Ethereum's transaction format, also known as "transaction type 0". This transaction format was used before the EIP-1559 upgrade, which was implemented in August 2021.

```ts
import { Web3 } from"web3";

const web3 = new Web3("https://rpc2.sepolia.org");

async function txLegacy() {
  const wallet = web3.eth.wallet.add("YOUR_PRIVATE_KEY"); //make sure you have funds

  const sender = wallet[0].address;
  const recipient = "0x807BFe4940016B5a7FdA19482042917B02e68359";
  const value = 1; //wei
  const nonce = await web3.eth.getTransactionCount(sender);
  const gas = 21000;
  const gasPrice = await web3.eth.getGasPrice();

  const tx = {
    from: sender,
    to: recipient,
    value,
    nonce,
    gas,
    gasPrice,
    // highlight-next-line
    type: 0,
  };

  const txReceipt = await web3.eth.sendTransaction(tx);
  console.log("Tx hash", txReceipt.transactionHash);
}

txLegacy();
```

### ERC20 Interaction

```ts
import { Web3 } from "web3";

const web3 = new Web3("https://rpc2.sepolia.org");

async function transfer() {
  //initialize wallet
  const wallet = web3.eth.wallet.add("PRIVATE_KEY");

  //initialize contract
  const myERC20 = new web3.eth.Contract(ABI, ADDRESS);

  //send transfer and specify the type
  const txReceipt = await myERC20.methods.transfer(TO, VALUE).send({
    from: wallet[0].address,
    // highlight-next-line
    type: 0,
  });

  console.log(txReceipt.transactionHash);
}

transfer();
```

## Transaction Type 1 (EIP-2930)

This EIP was introduced in April 2021, it introduces a feature called 'Transaction Type and Access List.' This improvement allows saving gas on cross-contract calls by declaring in advance which contract and storage slots will be accessed.

### Raw Transaction

```ts
import { Web3 } from"web3";

const web3 = new Web3("https://rpc2.sepolia.org");

async function txEIP2930() {
  const wallet = web3.eth.wallet.add("YOUR_PRIVATE_KEY");

  const sender = wallet[0].address;
  const contractAddress1 = "0x...";
  const contractAddress2 = "0x..."
  const nonce = await web3.eth.getTransactionCount(sender);
  const gas = 500000; //could be higher
  const gasPrice = await web3.eth.getGasPrice();

  const tx = {
    from: sender,
    to: contractAddress1, //the contract we are calling
    data: "0x...",
    gas,
    gasPrice,
    // highlight-next-line
    type: 1,
    accessList: [
      {
        address: contractAddress2, //contract1 is calling contract2
        storageKeys: [
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
      },
    ],
  };


  const txReceipt = await web3.eth.sendTransaction(tx);
  console.log("Tx hash", txReceipt.transactionHash);
}

txEIP2930()
```

## Transaction Type 2 (EIP-1559)

When a user creates an EIP-1559 transaction, they specify the maximum fee they are willing to pay `maxFeePerGas` as well as a tip `maxPriorityFeePerGas` to incentivize the miner. The actual fee paid by the user is then determined by the network based on the current demand for block space and the priority of the transaction.

### Raw Transaction

```ts
import { Web3 } from"web3";

const web3 = new Web3("https://rpc2.sepolia.org");

async function txEIP1559() {
  const wallet = web3.eth.wallet.add("YOUR_PRIVATE_KEY"); //make sure you have funds

  const sender = wallet[0].address;
  const recipient = "0x807BFe4940016B5a7FdA19482042917B02e68359";
  const value = 1; //wei
  const nonce = await web3.eth.getTransactionCount(sender);
  const gasLimit = 21000;
  const maxFeePerGas = Number((await web3.eth.calculateFeeData()).maxFeePerGas);
  const maxPriorityFeePerGas = Number((await web3.eth.calculateFeeData()).maxPriorityFeePerGas);

  const tx = {
    from: sender,
    to: recipient,
    value,
    nonce,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    // highlight-next-line
    type: 2,
  };

  const txReceipt = await web3.eth.sendTransaction(tx);
  console.log("Tx hash", txReceipt.transactionHash);
}

txEIP1559();
```

### ERC20 Interaction

```ts
import { Web3 } from "web3";

const web3 = new Web3("https://rpc2.sepolia.org");

async function transfer() {
  //initialize wallet
  const wallet = web3.eth.wallet.add("PRIVATE_KEY");

  //initialize contract
  const myERC20 = new web3.eth.Contract(ABI, ADDRESS);

  //send transfer and specify the type
  const txReceipt = await myERC20.methods.transfer(TO, VALUE).send({
    from: wallet[0].address,
    // highlight-next-line
    type: 2,
  });

  console.log(txReceipt.transactionHash);
}

transfer();
```


## Sending transactions with a local wallet

The simplest way to sign and send transactions is using a local wallet:

```typescript
// 1st step: initialize `web3` instance
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

// 2nd step: add an account to wallet
const privateKey = '0x7b907534ec13b19c67c2a738fdaa69014298c71f2221d7e5dec280232e996610';
const account = web3.eth.accounts.wallet.add(privateKey).get(0);
// Make sure the account has enough eth on balance to send the transaction

// 3rd step: sign and send the transaction
//highlight-start
// Magic happens inside sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed using that account.
const receipt = await web3.eth.sendTransaction({
  from: account?.address,
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  value: '0x1',
  gas: '300000',
  // other transaction's params
});
//highlight-end
```

## Sending a raw transaction

```ts 
import { Web3 } from 'web3';

// 1st - initialize the provider
const web3 = new Web3('https://ethereum-sepolia.publicnode.com');

// 2nd - create an account
const account = web3.eth.accounts.privateKeyToAccount('0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba');

// 3rd - create a raw transaction object
const rawTransaction = {
  from: account.address,
  to: '0x5875da5854c2adadbc1a7a448b5b2a09b26baff8', //random wallet or contract address
  value: 1, //optional - value in wei
  maxFeePerGas: Number((await web3.eth.calculateFeeData()).maxFeePerGas),
  maxPriorityFeePerGas: Number((await web3.eth.calculateFeeData()).maxPriorityFeePerGas),
  gasLimit: 2000000
  nonce: await web3.eth.getTransactionCount(account.address), //optional - get the current nonce of the account 
  data: "0x0" //optional - encoded function signature and arguments 
};

// 4th - sign the raw transaction with the private key
const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, account.privateKey);

// 5th - send the signed transaction
const txReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

console.log('Transaction Receipt:', txReceipt);
/* ↳
Transaction Receipt: {
  blockHash: '0xd73a824348ebb8c1895fbe7b2c506c287cfaadc8104628a140e7b39d7e41d50f',
  blockNumber: 4972805n,
  cumulativeGasUsed: 15266381n,
  effectiveGasPrice: 118637814298n,
  from: '0xa3286628134bad128faeef82f44e99aa64085c94',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0x5875da5854c2adadbc1a7a448b5b2a09b26baff8',
  transactionHash: '0x247e4540f9b399655da90e8a0c3d9ec165f62a304f6364f45518a4d6a531cd36',
  transactionIndex: 156n,
  type: 0n
}
*/
```

## Sending a transaction with Browser Injection (Metamask)

This is an example html file that will send a transaction when the button element is clicked.

To run this example you'll need Metamask, the `index.html` file below in your folder and you'll need a local server:

```bash
npm i http-server
```

```bash
npx http-server
```

Afterwards your file will be served on a local port, which will usually be on `http://127.0.0.1:8080`

``` html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Send Transaction Example</title>
    <script src='https://cdn.jsdelivr.net/npm/web3@4.3.0/+esm'></script>
  </head>

  <body>
    <button id='sendButton'>Send Transaction</button>
    <script>
      // Wrap the code inside an async function
      (async function () {
        try {
          // Check if MetaMask is installed and connected
          if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed or not properly configured');
          }

          // Connect to the Ethereum network using MetaMask
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3 = new Web3(window.ethereum);

          // Add event listener to the Send Transaction button
          const sendButton = document.getElementById('sendButton');
          sendButton.addEventListener('click', async () => {
            try {
              await web3.eth.sendTransaction({ from: accounts[0], to: '0x38E2fb54587208f29B1452Bb8136d271BE0912EF' });
            } catch (error) {
              console.error(error);
            }
          });
        } catch (error) {
          console.error(error);
        }
      })();
    </script>
  </body>
</html>
```


## Contract Deployment

```typescript title='Deploy a contract'
// 1st step: initialize `web3` instance
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

// 2nd step: add an account to wallet
const privateKey = '0x7b907534ec13b19c67c2a738fdaa69014298c71f2221d7e5dec280232e996610';
const account = web3.eth.accounts.wallet.add(privateKey).get(0);
// Make sure the account has enough eth on balance to send the transaction

// fill ContractAbi and ContractBytecode with your contract's abi and bytecode

async function deploy() {
  // 3rd step: sign and send the transaction
  // In any function where you can pass from the address set address of the account that exists in a wallet, it will be automatically signed.

  try {
    // deploy
    const contract = new web3.eth.Contract(ContractAbi);
    const contractDeployed = await contract
      .deploy({
        input: ContractBytecode,
        arguments: ['Constructor param1', 'Constructor param2'],
      })
      .send({
        from: account?.address,
        gas: '1000000',
        // other transaction's params
      });

    // call method
    await contractDeployed.methods.transfer('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', '0x1').send({
      from: account?.address,
      gas: '1000000',
      // other transaction's params
    });
  } catch (error) {
    // catch transaction error
    console.error(error);
  }
}

(async () => {
  await deploy();
})();
```


## Interacting with contract methods

``` ts title='Interact with contracts using a wallet under the hood'
// 1st step: initialize `web3` instance
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER*/);

// 2nd step: add an account to wallet
const privateKeyString = '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba';

const wallet = web3.eth.accounts.wallet.add(privateKeyString);
// Make sure the account has enough eth on balance to send the transaction

async function contractMethod() {
  try {
    // 3rd step: instantiate the contract with the ABI and contract address
    const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    // 4th step: call contract method and send the tx
    await myContract.methods.doSomething().send({
      from: wallet[0].address,
      gas: '1000000',
      // other transaction's params
    });
  } catch (error) {
    // catch transaction error
    console.error(error);
  }
}

(async () => {
  await contractMethod();
})();
```

## Sending a transaction and listening to the events

```ts title='Transactions with Web3PromiEvent'
import { Web3 } from 'web3';

// 1st - initialize the provider
const web3 = new Web3(/* PROVIDER*/);

// 2nd - add an account to wallet
const privateKey = '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba';
const account = web3.eth.accounts.wallet.add(privateKey).get(0);
// Make sure the account has enough eth on balance to send the transaction

// 3rd - sign and send the transaction
// Magic happens behind sendTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed.
const transaction = web3.eth.sendTransaction({
  from: account?.address,
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  value: '0x1',
  gas: '300000',
  // other transaction's params
});

// highlight-start
// 4th - listen to the transaction events
transaction
  .on('sending', (sending) => {
    // Sending example
    console.log('Sending:', sending);
  })
  .on('sent', (sent) => {
    // Sent example
    console.log('Sent:', sent);
  })
  .on('transactionHash', (transactionHash) => {
    // Transaction hash example
    console.log('Transaction Hash:', transactionHash);
  })
  .on('confirmation', (confirmation) => {
    // Confirmation example
    console.log('Confirmation:', confirmation);
  })
  .on('error', (error) => {
    // Error example
    console.error('Error:', error);
  });
// highlight-end
/* ↳
Sending: {
  from: '0xA3286628134baD128faeef82F44e99AA64085C94',
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  value: '0x1',
  gas: '0x493e0',
  gasPrice: undefined,
  maxPriorityFeePerGas: '0x9502f900',
  maxFeePerGas: '0x2b53cf7960'
}
Sent: {
  from: '0xA3286628134baD128faeef82F44e99AA64085C94',
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  value: '0x1',
  gas: '0x493e0',
  gasPrice: undefined,
  maxPriorityFeePerGas: '0x9502f900',
  maxFeePerGas: '0x2b53cf7960'
}
Transaction Hash: 0xa7493bc3eb6e7f41b54291cfd19d90111e68ea2cd9718da937ca4dcc1f831dde
Receipt: {
  blockHash: '0xe049c2cd2a473dad2af5ccf40c2df788cd42a237616cc84cc3861937f1aa2195',
  blockNumber: 4972912n,
  cumulativeGasUsed: 1018070n,
  effectiveGasPrice: 100635626363n,
  from: '0xa3286628134bad128faeef82f44e99aa64085c94',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x...00',
  status: 1n,
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  transactionHash: '0xa7493bc3eb6e7f41b54291cfd19d90111e68ea2cd9718da937ca4dcc1f831dde',
  transactionIndex: 15n,
  type: 2n
}
Confirmation: {
  confirmations: 1n,
  receipt: {
    blockHash: '0xe049c2cd2a473dad2af5ccf40c2df788cd42a237616cc84cc3861937f1aa2195',
    blockNumber: 4972912n,
    cumulativeGasUsed: 1018070n,
    effectiveGasPrice: 100635626363n,
    from: '0xa3286628134bad128faeef82f44e99aa64085c94',
    gasUsed: 21000n,
    logs: [],
    logsBloom: '0x...000',
    status: 1n,
    to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
    transactionHash: '0xa7493bc3eb6e7f41b54291cfd19d90111e68ea2cd9718da937ca4dcc1f831dde',
    transactionIndex: 15n,
    type: 2n
  },
  latestBlockHash: '0xe049c2cd2a473dad2af5ccf40c2df788cd42a237616cc84cc3861937f1aa2195'
}
Confirmation: {
  confirmations: 2n,
  receipt: {...},
  latestBlockHash: '0xf20261fc59d059c9dfd048e44c7fe1499d45822d9fe804bca70ac56559b54b1b'
}
Confirmation: {
  confirmations: 3n,
  receipt: {...},
  latestBlockHash: '0xb52380054ad2382620615ba7b7b40638021d85c5904a402cd11d00fd4db9fba9'
}
*/
```
