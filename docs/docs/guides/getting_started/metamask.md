---
sidebar_position: 4
sidebar_label: Connecting to Metamask
---

# Connecting to Metamask

## React app

After creating your react app `npx create-react-app app-name`, and installing web3 `npm i web3` you can go to `src/app.js`, you can clean up the code and import `{Web3}`. It should look like this:

```jsx
import { useState } from 'react';
import { Web3 } from 'web3';

function App() {
  return <> </>;
}

export default App;
```

Let's divide this into 2 small steps:

### 1. Create Button to Connect and Display Connected Address
In this step, we'll add a button to the front end for users to connect to Metamask. We'll also include an `<h2></h2>` element to display the connected address once the connection is established.

```jsx
import { useState } from 'react';
import { Web3 } from 'web3';

function App() {
    //highlight-start
  //react state to store and show the connected account
  const [connectedAccount, setConnectedAccount] = useState('null');
    //highlight-end

  return (
      <>
    //highlight-start
      {/* Button to trigger Metamask connection */}
      <button onClick={() => connectMetamask()}>Connect to Metamask</button>

      {/* Display the connected account */}
      <h2>{connectedAccount}</h2>
    //highlight-end
    </>
  );
}

export default App;
```

### 2. Implement the Function to Connect Metamask
In this step, we'll implement the function that triggers Metamask to prompt the user to connect their wallet.

```jsx {}
import { useState } from 'react';
import { Web3 } from 'web3';

function App() {
  //state to store and show the connected account
  const [connectedAccount, setConnectedAccount] = useState('null');
    
    //highlight-start
  async function connectMetamask() {
    //check metamask is installed
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      setConnectedAccount(accounts[0]);
    } else {
      alert('Please download metamask');
    }
  }
  //highlight-end

  return (
    <>
      {/* Button to trigger Metamask connection */}
      <button onClick={() => connectMetamask()}>Connect to Metamask</button>

      {/* Display the connected account */}
      <h2>{connectedAccount}</h2>
    </>
  );
}

export default App;
```

## HTML Single page

### 1. Create an html file and import Web3 from CDN

```html
<!DOCTYPE html>
<html>
  <head>
    //highlight-start
    <title>Metamask Connection</title>
    <!-- Import Web3 library from CDN -->
    <script src='https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'></script>
    //highlight-end
  </head>
  <body>
  </body>
</html>
```

### 2. Create Button to Connect and Display Connected Address

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Metamask Connection</title>
    <!-- Import Web3 library from CDN -->
    <script src='https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'></script>
  </head>
  <body>
    //highlight-start
    <h1>Metamask Connection</h1>

    <!-- button to connect Metamask -->
    <button id='connectButton'>Connect to Metamask</button>

    <!-- display the connected account -->
    <h2 id='connectedAccount'>null</h2>
    //highlight-end
  </body>
</html>
```

### 3. Implement Script to Connect Metamask

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Metamask Connection</title>
    <!-- Import Web3 library from CDN -->
    <script src='https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'></script>
  </head>
  <body>
    <h1>Metamask Connection</h1>

    <!-- button to connect Metamask -->
    <button id='connectButton'>Connect to Metamask</button>

    <!-- display the connected account -->
    <h2 id='connectedAccount'>null</h2>

    //highlight-start
    <script type='module'>
      //listen for a `click` to connect when clicking the button
      document.getElementById('connectButton').addEventListener('click', async () => {
        //check if Metamask is installed
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          // Request the user to connect accounts (Metamask will prompt)
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Get the connected accounts
          const accounts = await web3.eth.getAccounts();

          // Display the connected account
          document.getElementById('connectedAccount').innerText = accounts[0];
        } else {
          // Alert the user to download Metamask
          alert('Please download Metamask');
        }
      });
    </script>
    //highlight-end

  </body>
</html>
```

<!-- take example from wallet/examples -->