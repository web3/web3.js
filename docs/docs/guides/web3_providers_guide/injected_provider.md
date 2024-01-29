---
sidebar_position: 6
sidebar_label: 'Tutorial: Injected provider'
---

# Browser Injected Ethereum Provider

It is easy to connect to the Ethereum network using an Ethereum browser extension such as MetaMask, or an Ethereum-enabled browser like the browser inside TrustWallet. Because they inject their provider object into the browser's JavaScript context, enabling direct interaction with the Ethereum network from your web application. Moreover, the wallet management is conveniently handled by these extensions or browsers, making it the standard approach for DApp developers to facilitate user interactions with the Ethereum network.

Technically, you use `window.ethereum` when it is injected by the Ethereum browser extension or the Ethereum-enabled browser. However, before using this provider, you need to check if it is available and then call `enable()` to request access to the user's MetaMask account.

Before start coding you will need to setup and configure Ganache and MetaMask, if you have not already:

-   Ensure that Ganache is running as mentioned in the [Prerequisites](#prerequisites) section.
-   Install the MetaMask extension for your browser. You can download MetaMask from their website: https://metamask.io/.

Follow these steps to connect to the Ethereum network with MetaMask and web3.js, including the steps to create a local web server using Node.js:

1. Open a command prompt or terminal window and navigate to where you would like to create the folder for this example.
2. Create a new folder and navigate to it:

```bash
mkdir web3-browser-injected-providers
cd web3-browser-injected-providers
```

3. Use npm to initialize the folder. This will simply create a `package.json` file:

```bash
npm init -y
```

4. Install the Express module and add it to your project's dependencies:

```bash
npm i express
```

5. Create a new HTML file named `index.html` in your code editor (inside `web3-browser-injected-providers`).

6. Copy and paste the following code into `index.html`, and save it after:

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <title>Connecting to the Ethereum network with Web3.js and MetaMask</title>
  </head>
  <body>
    <h1>Connecting to the Ethereum network with Web3.js and MetaMask</h1>
    <pre id='log'>
  You need to approve connecting this website to MetaMask.
  Click on the MetaMask icon in the browser extension, if it did not show a popup already.
  </pre
    >

    <script src='https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js'></script>
    <script>
      window.addEventListener('load', async function () {
        // Check if web3 is available
        if (typeof window.ethereum !== 'undefined') {
          // Use the browser injected Ethereum provider
          web3 = new Web3(window.ethereum);
          // Request access to the user's MetaMask account (ethereum.enable() is deprecated)
          // Note: Even though, you can also get the accounts from `await web3.eth.getAccounts()`,
          // 	you still need to make a call to any MetaMask RPC to cause MetaMask to ask for concent.
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          console.log('Accounts requested from MetaMask RPC: ', accounts);

          document.getElementById('log').textContent = 'Sending a self transaction... Follow the instructions on MetaMask.';

          try {
            // Send a transaction to the network and wait for the transaction to be mined.
            const transactionReceipt = await web3.eth.sendTransaction({
              from: accounts[0],
              to: accounts[0], // sending a self-transaction
              value: web3.utils.toWei('0.001', 'ether'),
            });

            document.getElementById('log').textContent = 'Sending a self transaction succeeded';
            document.getElementById('log').textContent += `\n  Transaction hash: ${transactionReceipt.transactionHash}`;
            document.getElementById('log').textContent += `\n  Gas Used: ${transactionReceipt.gasUsed} gwei`;
          } catch (error) {
            console.log('error', error);
            document.getElementById('log').textContent = 'Error happened: ' + JSON.stringify(error, null, '  ');
          }
        } else {
          // If web3 is not available, give instructions to install MetaMask
          document.getElementById('log').innerHTML = 'Please install MetaMask to connect to the Ethereum network.';
        }
      });
    </script>
  </body>
</html>
```

7. Create a new file called `server.js` (inside `web3-browser-injected-providers`).
8. Copy and paste the following code into `server.js`, and save it after:

```js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '.')));

app.listen(8097, () => {
  console.log('Server started on port 8097');
});
```

9. Start the Node.js server by executing the following command. This will execute the content of `server.js` which will run the server on port 8097:

```bash
node server.js
```

10. Open your web browser and navigate to `http://localhost:8097/`. MetaMask should ask for your approval to connect to your website. Follow the steps and give your consent.
11. If everything is set up properly, you should be able to connect to the Ethereum network with MetaMask and see the logged account address.

Note that in the above steps you had created a local web server using Node.js and Express, serving your HTML file from the root directory of your project. You needs this local server because many browser does not allow extensions to inject objects for static files located on your machine. However, you can customize the port number and the root directory if needed.

Now you can start building your Ethereum application with web3.js and MetaMask!
