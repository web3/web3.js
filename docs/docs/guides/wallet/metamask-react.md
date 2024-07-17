---
sidebar_position: 5
sidebar_label: 'Tutorial: Connecting to Metamask with React'
---

# Connecting to Metamask with React

<iframe width="100%" height="700px"  src="https://stackblitz.com/edit/stackblitz-starters-rinwzp?embed=1&file=src%2FApp.tsx"></iframe>

This tutorial builds on the previous tutorial that used [vanilla JavaScript with Web3.js and MetaMask](/guides/wallet/metamask-vanilla). In this tutorial, [React](https://react.dev/) and TypeScript will be used to implement similar capabilities.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Review prerequisites
2. Initialize a new React project and add Web3.js
3. Use MetaMask as the Web3.js provider
4. Request access to the MetaMask accounts
5. Sign a message with a MetaMask account
6. Verify the account used to sign a message

:::tip
If you encounter any issues while following this guide or have any questions, don't hesitate to seek assistance. Our friendly community is ready to help you out! Join our [Discord](https://discord.gg/F4NUfaCC) server and head to the **#web3js-general** channel to connect with other developers and get the support you need. 
:::

## Step 1: Prerequisites

This tutorial assumes basic familiarity with the command line as well as familiarity with React and [Node.js](https://nodejs.org/). Before starting this tutorial, ensure that Node.js and its package manager, npm, are installed.

```bash
$: node -v
# your version may be different, but it's best to use the current stable version
v18.16.1
$: npm -v
9.5.1
```

Make sure that MetaMask is [installed](https://metamask.io/download/) as a browser extension and the steps to create an account (e.g. create a password, review the seed phrase) have been completed.

## Step 2: Initialize a New React Project and Add Web3.js

Initialize a new React project and navigate into the new project directory:

```bash
npx create-react-app web3-metamask-react --template typescript
cd web3-metamask-react
```

Add Web3.js to the project with the following command:

```bash
npm i web3
```

## Step 3: Use MetaMask as the Web3.js Provider

MetaMask will inject the Ethereum provider as an `ethereum` property on the [global `Window` object](https://developer.mozilla.org/en-US/docs/Web/API/Window). To communicate this change to the TypeScript compiler, update `src/react-app-env.d.ts` as follows:

```ts
import { MetaMaskProvider } from "web3";

/// <reference types="react-scripts" />

declare global {
  interface Window {
    ethereum: MetaMaskProvider;
  }
}
```

Replace the contents of `src/App.tsx` with the following:

```tsx
import { useEffect, useState } from "react";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [latestBlock, setLatestBlock] = useState<string | null>(null);
  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    if (window.ethereum) {
      // use the injected Ethereum provider to initialize Web3.js
      setWeb3(new Web3(window.ethereum));
      // check if Ethereum provider comes from MetaMask
      if (window.ethereum.isMetaMask) {
        setProvider("Connected to Ethereum with MetaMask.");
      } else {
        setProvider("Non-MetaMask Ethereum provider detected.");
      }
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning("Please install MetaMask");
    }
  }, []);

  useEffect(() => {
    async function getChainId() {
      if (web3 === null) {
        return;
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`);
    }

    async function getLatestBlock() {
      if (web3 === null) {
        return;
      }

      // get latest block and populate placeholder
      setLatestBlock(`Latest Block: ${await web3.eth.getBlockNumber()}`);

      // subscribe to new blocks and update UI when a new block is created
      const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
      blockSubscription.on("data", (block) => {
        setLatestBlock(`Latest Block: ${block.number}`);
      });
    }

    getChainId();
    getLatestBlock();
  }, [web3]);
  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <div id="provider">{provider}</div>
      <div id="chainId">{chainId}</div>
      <div id="latestBlock">{latestBlock}</div>
    </>
  );
}

export default App;
```

Review the comments in `src/App.tsx`. This file defines a component with several placeholders that will be used to display network information, and also provides two `useEffect` hooks for populating those placeholders. The first `useEffect` hook checks for an [injected provider](/guides/web3_providers_guide/#injected-provider). If an injected provider is found,  it's used to construct a new `Web3` instance and connect to the Ethereum network. A check is performed to ensure that the injected provider is coming from MetaMask and the result of this check is displayed to the user. If no injected provider is found, the user is instructed to install MetaMask. The second `useEffect` hook uses the injected provider to update the placeholders with the chain ID and latest block number, and creates an event subscription to update the block number as new blocks are created.

To start the React app, execute the following command in the project directory:

```bash
npm start
```

This should automatically open the page in a web browser (make sure it's the browser with the MetaMask extension). If everything is set up correctly, the webpage should state that it is connected to the Ethereum network with MetaMask and list the chain ID (for the default Ethereum Mainnet network this value should be `1`) and latest block number. The latest block number should change when new blocks are created.

## Step 4: Request Access to the MetaMask Accounts

Replace the contents of `src/App.tsx` with the following (take note of the highlighted sections, which are new):

```tsx
import { useEffect, useState } from "react";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [latestBlock, setLatestBlock] = useState<string | null>(null);
  // highlight-start
  const [accountButtonDisabled, setAccountButtonDisabled] =
    useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  // highlight-end
  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    if (window.ethereum) {
      // use the injected Ethereum provider to initialize Web3.js
      setWeb3(new Web3(window.ethereum));
      // check if Ethereum provider comes from MetaMask
      if (window.ethereum.isMetaMask) {
        setProvider("Connected to Ethereum with MetaMask.");
      } else {
        setProvider("Non-MetaMask Ethereum provider detected.");
      }
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning("Please install MetaMask");
      // highlight-next-line
      setAccountButtonDisabled(true);
    }
  }, []);

  useEffect(() => {
    async function getChainId() {
      if (web3 === null) {
        return;
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`);
    }

    async function getLatestBlock() {
      if (web3 === null) {
        return;
      }

      // get latest block and populate placeholder
      setLatestBlock(`Latest Block: ${await web3.eth.getBlockNumber()}`);

      // subscribe to new blocks and update UI when a new block is created
      const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
      blockSubscription.on("data", (block) => {
        setLatestBlock(`Latest Block: ${block.number}`);
      });
    }

    getChainId();
    getLatestBlock();
  }, [web3]);

  // highlight-start
  // click event for "Request MetaMask Accounts" button
  async function requestAccounts() {
    if (web3 === null) {
      return;
    }

    // request accounts from MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("requestAccounts")?.remove();

    // get list of accounts
    const allAccounts = await web3.eth.getAccounts();
    setAccounts(allAccounts);
    // get the first account and populate placeholder
    setConnectedAccount(`Account: ${allAccounts[0]}`);
  }
  // highlight-end
  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <div id="provider">{provider}</div>
      <div id="chainId">{chainId}</div>
      <div id="latestBlock">{latestBlock}</div>
      // highlight-start
      <div id="connectedAccount">{connectedAccount}</div>
      <div>
        <button
          onClick={() => requestAccounts()}
          id="requestAccounts"
          disabled={accountButtonDisabled}
        >
          Request MetaMask Accounts
        </button>
      </div>
      // highlight-end
    </>
  );
}

export default App;
```

The component has been updated to include a placeholder for the MetaMask account, as well as a button that is used to request the accounts from MetaMask. If no Ethereum provider is found, the button to request the MetaMask accounts is disabled.

A function named `requestAccounts` has been defined as the click-handler for the new button. The accounts are requested by invoking `window.ethereum.request({ method: ["eth_requestAccounts"] })` and once the request has been approved, the account addresses are available by calling [`web3.eth.getAccounts()`](https://docs.web3js.org/api/web3-eth/class/Web3Eth#getAccounts). MetaMask can be used to manage multiple accounts, but this tutorial only makes use of a single account. More information about the [`window.ethereum.request`](https://docs.metamask.io/wallet/reference/provider-api/#request) function and [`eth_requestAccounts`](https://docs.metamask.io/wallet/reference/eth_requestaccounts/) RPC call can be found in the MetaMask documentation.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. Click the button that says "Request MetaMask Accounts", which should activate MetaMask. After accepting the MetaMask notifications, the address of the MetaMask account should be displayed on the webpage. MetaMask will remember that the webpage has been given permission to access its accounts and it will not be necessary to accept any confirmations when requesting accounts in the future.

## Step #5: Sign a Message with a MetaMask Account

Replace the contents of `src/App.tsx` with the following (take note of the highlighted sections, which are new):

```tsx
import { useEffect, useState } from "react";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [latestBlock, setLatestBlock] = useState<string | null>(null);
  const [accountButtonDisabled, setAccountButtonDisabled] =
    useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  // highlight-start
  const [messageToSign, setMessageToSign] = useState<string | null>(null);
  const [signingResult, setSigningResult] = useState<string | null>(null);
  // highlight-end
  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    if (window.ethereum) {
      // use the injected Ethereum provider to initialize Web3.js
      setWeb3(new Web3(window.ethereum));
      // check if Ethereum provider comes from MetaMask
      if (window.ethereum.isMetaMask) {
        setProvider("Connected to Ethereum with MetaMask.");
      } else {
        setProvider("Non-MetaMask Ethereum provider detected.");
      }
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning("Please install MetaMask");
      setAccountButtonDisabled(true);
    }
  }, []);

  useEffect(() => {
    async function getChainId() {
      if (web3 === null) {
        return;
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`);
    }

    async function getLatestBlock() {
      if (web3 === null) {
        return;
      }

      // get latest block and populate placeholder
      setLatestBlock(`Latest Block: ${await web3.eth.getBlockNumber()}`);

      // subscribe to new blocks and update UI when a new block is created
      const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
      blockSubscription.on("data", (block) => {
        setLatestBlock(`Latest Block: ${block.number}`);
      });
    }

    getChainId();
    getLatestBlock();
  }, [web3]);

  // click event for "Request MetaMask Accounts" button
  async function requestAccounts() {
    if (web3 === null) {
      return;
    }

    // request accounts from MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("requestAccounts")?.remove();

    // get list of accounts
    const allAccounts = await web3.eth.getAccounts();
    setAccounts(allAccounts);
    // get the first account and populate placeholder
    setConnectedAccount(`Account: ${allAccounts[0]}`);
  }

  // highlight-start
  // click event for "Sign Message" button
  async function signMessage() {
    if (web3 === null || accounts === null || messageToSign === null) {
      return;
    }

    // sign message with first MetaMask account
    const signature = await web3.eth.personal.sign(
      messageToSign,
      accounts[0],
      "",
    );

    setSigningResult(signature);
  }
  // highlight-end
  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <div id="provider">{provider}</div>
      <div id="chainId">{chainId}</div>
      <div id="latestBlock">{latestBlock}</div>
      <div id="connectedAccount">{connectedAccount}</div>
      <div>
        <button
          onClick={() => requestAccounts()}
          id="requestAccounts"
          disabled={accountButtonDisabled}
        >
          Request MetaMask Accounts
        </button>
      </div>
      // highlight-start
      <div>
        <input
          onChange={(e) => {
            setMessageToSign(e.target.value);
          }}
          id="messageToSign"
          placeholder="Message to Sign"
          disabled={connectedAccount === null}
        />
        <button
          onClick={() => signMessage()}
          id="signMessage"
          disabled={connectedAccount === null}
        >
          Sign Message
        </button>
        <div id="signingResult">{signingResult}</div>
      </div>
      // highlight-end
    </>
  );
}

export default App;
```

`src/App.tsx` has been updated to include inputs for signing a message with the MetaMask account. Initially, these inputs are disabled - they will be enabled once the page has access to the MetaMask account. A placeholder has been added for the result of the signing operation.

A function named `signMessage` has been defined as the click-handler for the "Sign Message" button. This function calls the [`web3.eth.personal.sign`](/api/web3-eth-personal/class/Personal#sign) method. The first parameter to this method is the message to be signed, which is taken from the input field. The second parameter is the address of the account to use for signing. The third parameter is the passphrase to decrypt the account, which is not used in this example since MetaMask is managing the account. Once the message has been signed, the placeholder is updated with the signed message.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. There should now be disabled input fields below the "Request MetaMask Accounts" button. Click the button to request the accounts (remember, it will not be necessary to accept any MetaMask notifications this time). If everything is working properly, the address of the MetaMask account should be displayed on the webpage and the input fields should become enabled. Type a message (e.g. "Hello, Web3.js!") in the input field and click the "Sign Message" button. If everything is working properly, a MetaMask notification will appear. After the notification has been accepted, the signed message should appear beneath the input fields.

## Step #6: Verify the Account Used to Sign a Message

Replace the contents of `src/App.tsx` with the following (take note of the highlighted sections, which are new):

```tsx
import { useEffect, useState } from "react";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [latestBlock, setLatestBlock] = useState<string | null>(null);
  const [accountButtonDisabled, setAccountButtonDisabled] =
    useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [messageToSign, setMessageToSign] = useState<string | null>(null);
  const [signingResult, setSigningResult] = useState<string | null>(null);
  // highlight-start
  const [originalMessage, setOriginalMessage] = useState<string | null>(null);
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [signingAccount, setSigningAccount] = useState<string | null>(null);
  // highlight-end
  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    if (window.ethereum) {
      // use the injected Ethereum provider to initialize Web3.js
      setWeb3(new Web3(window.ethereum));
      // check if Ethereum provider comes from MetaMask
      if (window.ethereum.isMetaMask) {
        setProvider("Connected to Ethereum with MetaMask.");
      } else {
        setProvider("Non-MetaMask Ethereum provider detected.");
      }
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning("Please install MetaMask");
      setAccountButtonDisabled(true);
    }
  }, []);

  useEffect(() => {
    async function getChainId() {
      if (web3 === null) {
        return;
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`);
    }

    async function getLatestBlock() {
      if (web3 === null) {
        return;
      }

      // get latest block and populate placeholder
      setLatestBlock(`Latest Block: ${await web3.eth.getBlockNumber()}`);

      // subscribe to new blocks and update UI when a new block is created
      const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
      blockSubscription.on("data", (block) => {
        setLatestBlock(`Latest Block: ${block.number}`);
      });
    }

    getChainId();
    getLatestBlock();
  }, [web3]);

  // click event for "Request MetaMask Accounts" button
  async function requestAccounts() {
    if (web3 === null) {
      return;
    }

    // request accounts from MetaMask
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("requestAccounts")?.remove();

    // get list of accounts
    const allAccounts = await web3.eth.getAccounts();
    setAccounts(allAccounts);
    // get the first account and populate placeholder
    setConnectedAccount(`Account: ${allAccounts[0]}`);
  }

  // click event for "Sign Message" button
  async function signMessage() {
    if (web3 === null || accounts === null || messageToSign === null) {
      return;
    }

    // sign message with first MetaMask account
    const signature = await web3.eth.personal.sign(
      messageToSign,
      accounts[0],
      "",
    );

    setSigningResult(signature);
  }

  // highlight-start
  // click event for "Recover Account" button
  async function recoverAccount() {
    if (web3 === null || originalMessage === null || signedMessage === null) {
      return;
    }
    // recover account from signature
    const account = await web3.eth.personal.ecRecover(
      originalMessage,
      signedMessage,
    );

    setSigningAccount(account);
  }
  // highlight-end
  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <div id="provider">{provider}</div>
      <div id="chainId">{chainId}</div>
      <div id="latestBlock">{latestBlock}</div>
      <div id="connectedAccount">{connectedAccount}</div>
      <div>
        <button
          onClick={() => requestAccounts()}
          id="requestAccounts"
          disabled={accountButtonDisabled}
        >
          Request MetaMask Accounts
        </button>
      </div>
      <div>
        <input
          onChange={(e) => {
            setMessageToSign(e.target.value);
          }}
          id="messageToSign"
          placeholder="Message to Sign"
          disabled={connectedAccount === null}
        />
        <button
          onClick={() => signMessage()}
          id="signMessage"
          disabled={connectedAccount === null}
        >
          Sign Message
        </button>
        <div id="signingResult">{signingResult}</div>
      </div>
      // highlight-start
      <div>
        <input
          onChange={(e) => {
            setOriginalMessage(e.target.value);
          }}
          id="originalMessage"
          placeholder="Original Message"
          disabled={connectedAccount === null}
        />
        <input
          onChange={(e) => {
            setSignedMessage(e.target.value);
          }}
          id="signedMessage"
          placeholder="Signed Message"
          disabled={connectedAccount === null}
        />
        <button
          onClick={() => recoverAccount()}
          id="recoverAccount"
          disabled={connectedAccount === null}
        >
          Recover Account
        </button>
        <div id="signingAccount">{signingAccount}</div>
      </div>
      // highlight-end
    </>
  );
}

export default App;
```

As in the previous step, `src/App.tsx` has been updated to include inputs for recovering the account that was used to sign a message. As before, these inputs are disabled - they will be enabled once the page has access to the MetaMask account. A placeholder has been added for the result of the recovery operation.

A function named `recoverAccount` has been defined as the click-handler for the "Recover Account" button. This function calls the [`web3.eth.personal.ecRecover`](/api/web3-eth-personal/class/Personal#ecRecover) method. The first parameter to this method is the original unsigned message, which is taken from the first input field. The second parameter is the signed message, which is taken from the second input field. Once the account has been recovered, the placeholder is updated with the address of the account.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. There should now be additional disabled input fields below those from the previous step. Follow the same steps as before to request the accounts from MetaMask and sign a message, then copy and paste the original message and message signature (starting with the leading `0x` characters) into the new input fields. Click the "Recover Account" button. If everything is working properly, the address of the account that was used to sign the message should appear below the new input fields. This address should match the one that is displayed above the input fields that were used to sign the message.

## Conclusion

This tutorial demonstrated using Web3.js with MetaMask, including using the MetaMask injected provider and using a MetaMask account to sign a message. To use the MetaMask injected provider with Web3.js, simply construct a new instance of the `Web3` class with the `window.ethereum` property. To request access to the MetaMask accounts, use `window.ethereum.request({ method: "eth_requestAccounts" })` - once the user has confirmed this request, the MetaMask accounts will be available with `web3.eth.getAccounts()`. When the MetaMask injected provider handles a request that requires the use of a MetaMask account, MetaMask will prompt the user to confirm the request.
