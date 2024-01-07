---
sidebar_position: 5
sidebar_label: 'Tutorial: IPC Provider'
---

# Tutorial: IPC Provider

The IPC Provider offers high-performance local communication, providing a swift alternative to the straightforward HTTP Provider. Tailored for efficiency, it excels in local environments, enhancing the speed of your web application's connection to the Ethereum network for decentralized applications.

## Prerequisites

Before we get started, make sure you have a basic understanding of JavaScript and Ethereum. Additionally, we need to set up our environment by installing the following:

1. **Node.js**

    Node.js is a JavaScript runtime environment that enables you to run JavaScript on the server-side. You can download it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

2. **npm**

    npm (Node Package Manager) is used to publish and install packages to and from the public npm registry or a private npm registry. You can install it by following the instructions here: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

    Alternatively, you can use **yarn** instead of **npm** by following the instructions here: [https://classic.yarnpkg.com/lang/en/docs/getting-started/](https://classic.yarnpkg.com/lang/en/docs/getting-started/).

3. **Geth** (Optional, used only at the IPC provider example)

    Geth (go-ethereum) is an Ethereum execution client meaning it handles transactions, deployment and execution of smart contracts and contains an embedded computer known as the Ethereum Virtual Machine. You can install it by following the instructions here: [https://geth.ethereum.org/docs/getting-started/installing-geth](https://geth.ethereum.org/docs/getting-started/installing-geth)

## IPC Provider (for Node.js)

The IPC Provider allows you to connect to an Ethereum node using Inter-Process Communication (IPC) in a Node.js environment. This provider is useful when you have a local Ethereum node running on your machine and want to interact with it using Node.js.

In the following steps you will run `geth` in development mode and you will run a piece of code that reads the Ethereum accounts and sends a transaction:

To connect to the Ethereum network using the IPC provider, follow these steps:

1. Start a `geth` node in development mode by opening a terminal window and navigating to the `geth` executable file. Then, run the following command to create a development chain:

```bash
geth --dev --ipcpath <path>
```

Make sure to replace `<path>` with the desired IPC path. For example:

```bash
geth --dev --ipcpath /Users/username/Library/Ethereum/geth.ipc
```

This will start a `geth` node in development mode with IPC enabled and an IPC path specified. If the command is successful, the `geth` node will be running, and you should see output similar to the following:

```bash
INFO [12-10|15:10:37.121] IPC endpoint opened		 	url=<path>
INFO [12-10|15:10:37.122] HTTP endpoint opened		 	url=http://localhost:8545
INFO [12-10|15:10:37.122] WebSocket endpoint opened		url=ws://localhost:8546
INFO [12-10|15:10:37.127] Mapped network port		  	proto=udp extport=0 intport=30303 interface=UPnP(UDP)
```

2.  Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
3.  Create a new folder and navigate to it:

```bash
mkdir web3-providers-tutorial
cd web3-providers-tutorial
```

4.  Install web3.js using npm:

```bash
npm i web3
```

5.  Create a new JavaScript file called `web3-ipc-provider.js` in your code editor.

6.  Copy and paste the following code into your `web3-ipc-provider.js` file and save it:

```typescript title='IPC Provider'
import { Web3 } from 'web3';
import { IpcProvider } from 'web3-providers-ipc';

// Connect to the Ethereum network using IPC provider
const ipcPath = '<path>'; // Replace with your actual IPC path
const ipcProvider = new IpcProvider(ipcPath);

const web3 = new Web3(ipcProvider);

async function main() {
  try {
    console.log('Does the provider support subscriptions?:', ipcProvider.supportsSubscriptions());

    // Get the list of accounts in the connected node which is in this case: geth in dev mode.
    const accounts = await web3.eth.getAccounts();
    console.log('Accounts:', accounts);

    // Send a transaction to the network
    const transactionReceipt = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[0], // sending a self-transaction
      value: web3.utils.toWei('0.001', 'ether'),
    });
    console.log('Transaction Receipt:', transactionReceipt);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```

7. replace `<path>` with the `ipcPath` that you had specified, when starting the `geth` node, in the first step.

8. Type `node web3-ipc-provider.js` in the command prompt or terminal window and press Enter. This will run your JavaScript file.

If everything is set up properly, you should see the list of accounts and transaction receipt printed in the console, similar to the following:

```bash
Do the provider supports subscription?: true
Accounts: [ '0x82333ED0FAA7a883297C4d8e0FDE1E1CFABAeB7D' ]
Transaction Receipt: {
  blockHash: '0xd1220a9b6f86083e420da025179593f5aad3732165a687019a89528a4ab2bcd8',
  blockNumber: 1n,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1000000001n,
  from: '0x82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: 1n,
  to: '0x82333ed0faa7a883297c4d8e0fde1e1cfabaeb7d',
  transactionHash: '0x76c05df78dc5dbfade0d11322b3cadc894c17efe36851856aca29488b47c3fbd',
  transactionIndex: 0n,
  type: 0n
}
```

Keep in mind that using IPC Provider with `geth` in development mode in a production environment is not recommended as it can pose a security risk.
