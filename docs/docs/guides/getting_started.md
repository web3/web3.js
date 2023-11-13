---
slug: /
sidebar_position: 1
sidebar_label: Getting Started
---

# Getting Started

Welcome to Web3.js Documentation.

web3.js is a collection of libraries that allow you to interact with a local or remote Ethereum node using HTTP, IPC or WebSocket.
The following documentation will guide you through different use cases of Web3.js, upgrading from older versions, as well as providing an API reference documentation with examples.

### Some major features of Web3.js v4 are:

-    Web3.js [Plugins Feature](/guides/web3_plugin_guide/) for extending functionality ( [List of Existing Plugins](https://web3js.org/plugins) )
-    ESM and CJS builds 
-    [Tree shakable with ESM](/guides/advanced/web3_tree_shaking_support_guide/)
-    [Contracts dynamic types](/guides/smart_contracts/infer_contract_types_guide/) & full API in TypeScript
-    Using native BigInt instead of large BigNumber libraries
-    More efficient ABI Encoder & Decoder
-    Custom Output formatters
-    In compliance with Eth EL API

### Installation

If NPM is being used as package manager, use the following for installing the web3.js library. 

```
npm i web3
```

For installing using yarn package manager:

```
yarn add web3
```

Note: Installing web3.js in this way will bring in all web3.js sub-packages, if you only need specific packages, it is recommended to install the specific required packages. 

### Importing and using Web3.js

Web3.js v4 supports both CJS ( CommonJS ) and native ESM module imports. For importing the main Web3 class in CJS you can use:

``` js
const { Web3 } = require('web3');
```

and for ESM style imports, you can use:

``` ts
import { Web3 } from 'web3';

```

### Providers and Transport

Web3.js is in compliance with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) so any EIP-1193 provider can be injected in web3.js . There are HTTP, WebSocket and IPC providers also available as web3.js packages for using.

Following are examples of creating web3 instance with HTTP provider. 

``` ts
import { Web3, HttpProvider } from 'web3';
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_PROJ_ID');
web3.eth.getBlock('latest').then(console.log);
// or
const web3_2 = new Web3(new HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJ_ID'));
web3_2.eth.getBlock('latest').then(console.log);
```

Following are examples of creating web3 instance with Websocket provider. 

``` ts
import { Web3, WebSocketProvider } from 'web3';

const web3 = new Web3('wss://mainnet.infura.io/ws/v3/YOUR_PROJ_ID');
web3.eth.getBlock('latest').then(console.log);

// or

const web3_2 = new Web3(new WebSocketProvider('wss://mainnet.infura.io/ws/v3/YOUR_PROJ_ID'));
web3_2.eth.getBlock('latest').then(console.log);

```

Following is an example of creating web3 instance with IPC provider. 

``` ts
import { Web3 } from 'web3';
import {IpcProvider} from 'web3-providers-ipc';

const web3 = new Web3(new IpcProvider('/users/myuser/.ethereum/geth.ipc'));
web3.eth.getBlock('latest').then(console.log);
```

Further details are listed in the [Providers section](https://docs.web3js.org/guides/web3_providers_guide/).

Once Web3 is instantiated, the following packages are available for usage:

- Web3 Accounts :         For signing transactions & data, and accounts management using Web3 Basic Wallet. 
- Web3 Eth :              This package allows you to interact with an Ethereum blockchain.
- Web3 Eth ABI :          Functions in this package let you encode and decode parameters to ABI (Application  - Binary Interface)
- Web3 Eth contract :     This package allows deploying and interacting with Ethereum Contracts. 
- Web3 ETH ENS :          Functions in this package let you interact with ENS ( Ethereum Name Service ).  
- Web3 ETH IBAN :         It has functions for converting Ethereum addresses from and to IBAN and BBAN.
- Web3 ETH Personal :     This package allows you to interact with the Ethereum node’s accounts.
- Web3 NET :              This package allows you to interact with an Ethereum node’s network properties.

Additional Supporting Packages
- Web3 Types :            This package has common typescript types. 
- Web3 Utils :            This package provides utility functions for Ethereum DApps and other web3.js packages.
- Web3 Validator :        This package offers functionality for validation using provided Schema. 
- Web3 Core :             Web3 Core has configuration, Subscriptions and Requests management functionality used by other Web3 packages. 
- Web3 Errors :           Web3 Errors has error codes and common error classes that are used by other Web3 packages. 
- Web3 RPC Methods :      This is for advanced uses for building more lightweight applications. It has functions for making RPC requests to Ethereum using a given provider. 