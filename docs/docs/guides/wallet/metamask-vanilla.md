---
sidebar_position: 4
sidebar_label: 'Tutorial: Connecting to Metamask with Vanilla JS'
---

# Connecting to Metamask with Vanilla JS

[MetaMask](https://metamask.io/) is a powerful [wallet application](https://ethereum.org/en/wallets/) that makes it easy for Ethereum users to securely manage their accounts. Web3.js developers who are building front-end user-facing applications ("[dApps](https://ethereum.org/en/dapps/#what-are-dapps)") can easily integrate their dApp with MetaMask to allow users to safely use their own accounts. This tutorial covers the basics of using Web3.js with MetaMask, including using MetaMask as the Web3.js [provider](/guides/web3_providers_guide/) and using a MetaMask account to [sign](https://ethereum.org/en/glossary/#digital-signatures) a message.

## Overview

Here is a high-level overview of the steps we will be taking in this tutorial:

1. Review prerequisites
2. Create a new directory for the tutorial
3. Use MetaMask as the Web3.js provider
4. Request access to the MetaMask accounts
5. Sign a message with a MetaMask account
6. Verify the account used to sign a message

:::tip
If you encounter any issues while following this guide or have any questions, don't hesitate to seek assistance. Our friendly community is ready to help you out! Join our [Discord](https://discord.gg/F4NUfaCC) server and head to the **#web3js-general** channel to connect with other developers and get the support you need. 
:::

## Step 1: Prerequisites

This tutorial assumes basic familiarity with the command line as well as familiarity with JavaScript and HTML. [Node.js](https://nodejs.org/) is used to run a local HTTP server. Before starting this tutorial, ensure that Node.js and its package manager, npm, are installed.

```bash
$: node -v
# your version may be different, but it's best to use the current stable version
v18.16.1
$: npm -v
9.5.1
```

Make sure that MetaMask is [installed](https://metamask.io/download/) as a browser extension and the steps to create an account (e.g. create a password, review the seed phrase) have been completed.

## Step 2: Create a New Directory for the Tutorial

Create a new directory for the tutorial and navigate into it:

```bash
mkdir web3js-metamask-tutorial
cd web3js-metamask-tutorial
```

## Step 3: Use MetaMask as the Web3.js Provider

Create a new file called `index.html` in your project directory and add the following HTML to it:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3.js MetaMask Tutorial</title>
    <!-- import Web3.js -->
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  </head>
  <body>
    <!-- placeholders -->
    <div id="provider"></div>
    <div id="chainId"></div>
    <div id="latestBlock"></div>
    <div id="warn" style="color: red"></div>
    <script type="module">
      // ensure that there is an injected the Ethereum provider
      if (window.ethereum) {
        // use the injected Ethereum provider to initialize Web3.js
        const web3 = new Web3(window.ethereum);

        // check if Ethereum provider comes from MetaMask
        if (window.ethereum.isMetaMask) {
          document.getElementById("provider").innerText =
            "Connected to Ethereum with MetaMask.";
        } else {
          document.getElementById("provider").innerText =
            "Non-MetaMask Ethereum provider detected.";
        }

        // get chain ID and populate placeholder
        document.getElementById("chainId").innerText =
          `Chain ID: ${await web3.eth.getChainId()}`;
        // get latest block and populate placeholder
        document.getElementById("latestBlock").innerText =
          `Latest Block: ${await web3.eth.getBlockNumber()}`;

        // subscribe to new blocks and update UI when a new block is created
        const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
        blockSubscription.on("data", (block) => {
          document.getElementById("latestBlock").innerText =
            `Latest Block: ${block.number}`;
        });
      } else {
        // no Ethereum provider - instruct user to install MetaMask
        document.getElementById("warn").innerHTML =
          "Please <a href='https://metamask.io/download/'>install MetaMask</a>.";
      }
    </script>
  </body>
</html>
```

Review the comments in `index.html`. This document imports Web3.js, creates several placeholders that will be used to display network information, and defines a script that checks for an [injected provider](/guides/web3_providers_guide/#injected-provider). If an injected provider is found,  it's used to construct a new `Web3` instance and connect to the Ethereum network. A check is performed to ensure that the injected provider is coming from MetaMask and the result of this check is displayed to the user. Once connected through the injected provider, the script updates the placeholders with the chain ID and latest block number, and creates an event subscription to update the block number as new blocks are created. If no injected provider is found, the user is instructed to install MetaMask.

To start a local HTTP server to serve `index.html`, execute the following command in the project directory:

```bash
npx watch-http-server .
```

The output should look like:

```
Websocket Server Listening on Port: 8086
Starting up http-server, serving . on: http://0.0.0.0:8080
Hit CTRL-C to stop the server
Scanned working directory. ready for changes..
```

The HTTP server needs to remain running in the terminal that was used to start it. Any changes that are made in the project directory will cause the webpage to automatically refresh.

Use a MetaMask-enabled web browser to navigate to the URL from the output (http://0.0.0.0:8080 in the example above). If everything is set up correctly, the webpage should state that it is connected to the Ethereum network with MetaMask and list the chain ID (for the default Ethereum Mainnet network this value should be `1`) and latest block number. The latest block number should change when new blocks are created.

## Step 4: Request Access to the MetaMask Accounts

Replace the contents of `index.html` with the following (take note of the highlighted sections, which are new):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3.js MetaMask Tutorial</title>
    <!-- import Web3.js -->
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  </head>
  <body>
    <!-- placeholders -->
    <div id="provider"></div>
    <div id="chainId"></div>
    <div id="latestBlock"></div>
    <!-- highlight-next-line -->
    <div id="connectedAccount"></div>
    <div id="warn" style="color: red"></div>

    <!-- highlight-start -->
    <div>
      <button id="requestAccounts">Request MetaMask Accounts</button>
    </div>
    <!-- highlight-end -->
    <script type="module">
      // ensure that there is an injected the Ethereum provider
      if (window.ethereum) {
        // use the injected Ethereum provider to initialize Web3.js
        const web3 = new Web3(window.ethereum);

        // check if Ethereum provider comes from MetaMask
        if (window.ethereum.isMetaMask) {
          document.getElementById("provider").innerText =
            "Connected to Ethereum with MetaMask.";
        } else {
          document.getElementById("provider").innerText =
            "Non-MetaMask Ethereum provider detected.";
        }

        // get chain ID and populate placeholder
        document.getElementById("chainId").innerText =
          `Chain ID: ${await web3.eth.getChainId()}`;
        // get latest block and populate placeholder
        document.getElementById("latestBlock").innerText =
          `Latest Block: ${await web3.eth.getBlockNumber()}`;

        // subscribe to new blocks and update UI when a new block is created
        const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
        blockSubscription.on("data", (block) => {
          document.getElementById("latestBlock").innerText =
            `Latest Block: ${block.number}`;
        });

        // highlight-start
        // click event for "Request MetaMask Accounts" button
        document
          .getElementById("requestAccounts")
          .addEventListener("click", async () => {
            // request accounts from MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            document.getElementById("requestAccounts").remove();

            // get list of accounts
            const accounts = await web3.eth.getAccounts();
            // get the first account and populate placeholder
            document.getElementById("connectedAccount").innerText =
              `Account: ${accounts[0]}`;
          });
        // highlight-end
      } else {
        // no Ethereum provider - instruct user to install MetaMask
        document.getElementById("warn").innerHTML =
          "Please <a href='https://metamask.io/download/'>install MetaMask</a>.";
        // highlight-next-line
        document.getElementById("requestAccounts").disabled = true;
      }
    </script>
  </body>
</html>
```

The file has been updated to include a placeholder for the MetaMask account, as well as a button that is used to request the accounts from MetaMask.

Once connected to MetaMask, the script now registers a click event for the new button. The accounts are requested by invoking `window.ethereum.request({ method: ["eth_requestAccounts"] })` and once the request has been approved, the account addresses are available by calling [`web3.eth.getAccounts()`](https://docs.web3js.org/api/web3-eth/class/Web3Eth#getAccounts). MetaMask can be used to manage multiple accounts, but this tutorial only makes use of a single account. More information about the [`window.ethereum.request`](https://docs.metamask.io/wallet/reference/provider-api/#request) function and [`eth_requestAccounts`](https://docs.metamask.io/wallet/reference/eth_requestaccounts/) RPC call can be found in the MetaMask documentation. 

If no Ethereum provider is found, the button to request the MetaMask accounts is disabled.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. Click the button that says "Request MetaMask Accounts", which should activate MetaMask. After accepting the MetaMask notifications, the address of the MetaMask account should be displayed on the webpage. MetaMask will remember that the webpage has been given permission to access its accounts and it will not be necessary to accept any confirmations when requesting accounts in the future.

## Step #5: Sign a Message with a MetaMask Account

Replace the contents of `index.html` with the following (take note of the highlighted sections, which are new):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3.js MetaMask Tutorial</title>
    <!-- import Web3.js -->
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  </head>
  <body>
    <!-- placeholders -->
    <div id="provider"></div>
    <div id="chainId"></div>
    <div id="latestBlock"></div>
    <div id="connectedAccount"></div>
    <div id="warn" style="color: red"></div>

    <div>
      <button id="requestAccounts">Request MetaMask Accounts</button>
    </div>

    <!-- highlight-start -->
    <div>
      <input id="messageToSign" placeholder="Message to Sign" disabled />
      <button id="signMessage" disabled>Sign Message</button>
      <div id="signingResult"></div>
    </div>
    <!-- highlight-end -->
    <script type="module">
      // ensure that there is an injected the Ethereum provider
      if (window.ethereum) {
        // use the injected Ethereum provider to initialize Web3.js
        const web3 = new Web3(window.ethereum);

        // check if Ethereum provider comes from MetaMask
        if (window.ethereum.isMetaMask) {
          document.getElementById("provider").innerText =
            "Connected to Ethereum with MetaMask.";
        } else {
          document.getElementById("provider").innerText =
            "Non-MetaMask Ethereum provider detected.";
        }

        // get chain ID and populate placeholder
        document.getElementById("chainId").innerText =
          `Chain ID: ${await web3.eth.getChainId()}`;
        // get latest block and populate placeholder
        document.getElementById("latestBlock").innerText =
          `Latest Block: ${await web3.eth.getBlockNumber()}`;

        // subscribe to new blocks and update UI when a new block is created
        const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
        blockSubscription.on("data", (block) => {
          document.getElementById("latestBlock").innerText =
            `Latest Block: ${block.number}`;
        });

        // click event for "Request MetaMask Accounts" button
        document
          .getElementById("requestAccounts")
          .addEventListener("click", async () => {
            // request accounts from MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            document.getElementById("requestAccounts").remove();

            // get list of accounts
            const accounts = await web3.eth.getAccounts();
            // get the first account and populate placeholder
            document.getElementById("connectedAccount").innerText =
              `Account: ${accounts[0]}`;

            // highlight-start
            // enable signing input
            const messageToSign = document.getElementById("messageToSign");
            const sign = document.getElementById("signMessage");
            messageToSign.disabled = false;
            sign.disabled = false;

            // click event for "Sign Message" button
            sign.addEventListener("click", async () => {
              // sign message with first MetaMask account
              const signature = await web3.eth.personal.sign(
                messageToSign.value,
                accounts[0],
                "",
              );

              // update placeholder with signed message
              document.getElementById("signingResult").innerText =
                `Signed Message: ${signature}`;
            });
            // highlight-end
          });
      } else {
        // no Ethereum provider - instruct user to install MetaMask
        document.getElementById("warn").innerHTML =
          "Please <a href='https://metamask.io/download/'>install MetaMask</a>.";
        document.getElementById("requestAccounts").disabled = true;
      }
    </script>
  </body>
</html>
```

`index.html` has been updated to include inputs for signing a message with the MetaMask account. Initially, these inputs are disabled - they will be enabled once the page has access to the MetaMask account. A placeholder has been added for the result of the signing operation.

Inside the click event for the "Request MetaMask Accounts" button, the signing inputs are initialized. First, the inputs are enabled. Then, a click event is registered for the "Sign" button. This click event calls the [`web3.eth.personal.sign`](/api/web3-eth-personal/class/Personal#sign) method. The first parameter to this method is the message to be signed, which is taken from the input field. The second parameter is the address of the account to use for signing. The third parameter is the passphrase to decrypt the account, which is not used in this example since MetaMask is managing the account. Once the message has been signed, the placeholder is updated with the signed message.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. There should now be disabled input fields below the "Request MetaMask Accounts" button. Click the button to request the accounts (remember, it will not be necessary to accept any MetaMask notifications this time). If everything is working properly, the address of the MetaMask account should be displayed on the webpage and the input fields should become enabled. Type a message (e.g. "Hello, Web3.js!") in the input field and click the "Sign Message" button. If everything is working properly, a MetaMask notification will appear. After the notification has been accepted, the signed message should appear beneath the input fields.

## Step #6: Verify the Account Used to Sign a Message

Replace the contents of `index.html` with the following (take note of the highlighted sections, which are new):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3.js MetaMask Tutorial</title>
    <!-- import Web3.js -->
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  </head>
  <body>
    <!-- placeholders -->
    <div id="provider"></div>
    <div id="chainId"></div>
    <div id="latestBlock"></div>
    <div id="connectedAccount"></div>
    <div id="warn" style="color: red"></div>

    <div>
      <button id="requestAccounts">Request MetaMask Accounts</button>
    </div>

    <div>
      <input id="messageToSign" placeholder="Message to Sign" disabled />
      <button id="signMessage" disabled>Sign Message</button>
      <div id="signingResult"></div>
    </div>

    <!-- highlight-start -->
    <div>
      <input id="originalMessage" placeholder="Original Message" disabled />
      <input id="signedMessage" placeholder="Signed Message" disabled />
      <button id="recoverAccount" disabled>Recover Account</button>
      <div id="signingAccount"></div>
    </div>
    <!-- highlight-end -->
    <script type="module">
      // ensure that there is an injected the Ethereum provider
      if (window.ethereum) {
        // use the injected Ethereum provider to initialize Web3.js
        const web3 = new Web3(window.ethereum);

        // check if Ethereum provider comes from MetaMask
        if (window.ethereum.isMetaMask) {
          document.getElementById("provider").innerText =
            "Connected to Ethereum with MetaMask.";
        } else {
          document.getElementById("provider").innerText =
            "Non-MetaMask Ethereum provider detected.";
        }

        // get chain ID and populate placeholder
        document.getElementById("chainId").innerText =
          `Chain ID: ${await web3.eth.getChainId()}`;
        // get latest block and populate placeholder
        document.getElementById("latestBlock").innerText =
          `Latest Block: ${await web3.eth.getBlockNumber()}`;

        // subscribe to new blocks and update UI when a new block is created
        const blockSubscription = await web3.eth.subscribe("newBlockHeaders");
        blockSubscription.on("data", (block) => {
          document.getElementById("latestBlock").innerText =
            `Latest Block: ${block.number}`;
        });

        // click event for "Request MetaMask Accounts" button
        document
          .getElementById("requestAccounts")
          .addEventListener("click", async () => {
            // request accounts from MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            document.getElementById("requestAccounts").remove();

            // get list of accounts
            const accounts = await web3.eth.getAccounts();
            // get the first account and populate placeholder
            document.getElementById("connectedAccount").innerText =
              `Account: ${accounts[0]}`;

            // enable signing input
            const messageToSign = document.getElementById("messageToSign");
            const sign = document.getElementById("signMessage");
            messageToSign.disabled = false;
            sign.disabled = false;

            // click event for "Sign Message" button
            sign.addEventListener("click", async () => {
              // sign message with first MetaMask account
              const signature = await web3.eth.personal.sign(
                messageToSign.value,
                accounts[0],
                "",
              );

              // update placeholder with signed message
              document.getElementById("signingResult").innerText =
                `Signed Message: ${signature}`;
            });

            // highlight-start
            // enable signature verification input
            const originalMessage = document.getElementById("originalMessage");
            const signedMessaged = document.getElementById("signedMessage");
            const recoverAccount = document.getElementById("recoverAccount");
            originalMessage.disabled = false;
            signedMessaged.disabled = false;
            recoverAccount.disabled = false;

            // click event for "Recover Account" button
            recoverAccount.addEventListener("click", async () => {
              // recover account from signature
              const account = await web3.eth.personal.ecRecover(
                originalMessage.value,
                signedMessaged.value,
              );

              // update placeholder with recovered signature account
              document.getElementById("signingAccount").innerText =
                `Signing Account: ${account}`;
            });
            // highlight-end
          });
      } else {
        // no Ethereum provider - instruct user to install MetaMask
        document.getElementById("warn").innerHTML =
          "Please <a href='https://metamask.io/download/'>install MetaMask</a>.";
        document.getElementById("requestAccounts").disabled = true;
      }
    </script>
  </body>
</html>
```

As in the previous step, `index.html` has been updated to include inputs for recovering the account that was used to sign a message. As before, these inputs are disabled - they will be enabled once the page has access to the MetaMask account. A placeholder has been added for the result of the recovery operation.

Inside the click event for the "Request MetaMask Accounts" button, the recovery inputs are initialized. First, the inputs are enabled. Then, a click event is registered for the "Recover" button. This click event calls the [`web3.eth.personal.ecRecover`](/api/web3-eth-personal/class/Personal#ecRecover) method. The first parameter to this method is the original unsigned message, which is taken from the first input field. The second parameter is the signed message, which is taken from the second input field. Once the account has been recovered, the placeholder is updated with the address of the account.

Go back to the MetaMask-enabled browser and review the webpage, which should have been automatically refreshed to display the changes. There should now be additional disabled input fields below those from the previous step. Follow the same steps as before to request the accounts from MetaMask and sign a message, then copy and paste the original message and message signature (starting with the leading `0x` characters) into the new input fields. Click the "Recover Account" button. If everything is working properly, the address of the account that was used to sign the message should appear below the new input fields. This address should match the one that is displayed above the input fields that were used to sign the message.

## Conclusion

This tutorial demonstrated using Web3.js with MetaMask, including using the MetaMask injected provider and using a MetaMask account to sign a message. To use the MetaMask injected provider with Web3.js, simply construct a new instance of the `Web3` class with the `window.ethereum` property. To request access to the MetaMask accounts, use `window.ethereum.request({ method: "eth_requestAccounts" })` - once the user has confirmed this request, the MetaMask accounts will be available with `web3.eth.getAccounts()`. When the MetaMask injected provider handles a request that requires the use of a MetaMask account, MetaMask will prompt the user to confirm the request.
