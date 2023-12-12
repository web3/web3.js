---
sidebar_position: 6
sidebar_label: 'Web3 Wallet'
---

# web3.js Wallet Guide

## Introduction

The web3-eth-accounts package contains functions to generate Ethereum accounts and sign transactions and data.

:::tip
In Ethereum, a private key is a crucial component of the cryptographic key pair used for securing and controlling ownership of Ethereum addresses. Ethereum uses a public-key cryptography system, where each Ethereum address has a corresponding pair of public and private keys. This key pair will allow you to have ownership associated with the ethereum address, store and access funds and send transactions.

Be sure to have your private key stored and encrypted in a safe place, as losing or sharing it may result in permament loss of access to the asscoiated Ethereum address and funds.

To generate a private key: `const privateKey = web3.eth.accounts.create().privateKey;`

Learn more about wallets [here](https://ethereum.org/en/wallets/)
:::


## web3-eth-accounts

### Methods

The following is a list of web3-eth-account [methods]( /api/web3-eth-accounts/class/Wallet#Methods) with descriptions and examples of usage: 

- [create](https://docs.web3js.org/libdocs/Accounts#create)
- [privateKeytoAccount](https://docs.web3js.org/libdocs/Accounts#privatekeytoaccount)
- [privateKeytoAddress](https://docs.web3js.org/libdocs/Accounts#privatekeytoaddress)
- [privateKeytoPublicKey](https://docs.web3js.org/libdocs/Accounts#privatekeytopublickey)
- [parseAndValidatePrivateKey](https://docs.web3js.org/libdocs/Accounts#parseandvalidateprivatekey)
- [sign](https://docs.web3js.org/libdocs/Accounts#sign)
- [signTransaction](https://docs.web3js.org/libdocs/Accounts#signtransaction)
- [recoverTransaction](https://docs.web3js.org/libdocs/Accounts#recovertransaction)
- [hashMessage](https://docs.web3js.org/libdocs/Accounts#hashmessage)
- [recover](https://docs.web3js.org/libdocs/Accounts#recover)
- [encrypt](https://docs.web3js.org/libdocs/Accounts#encrypt)
- [decrypt](https://docs.web3js.org/libdocs/Accounts#decrypt)


### Creating a Web3Account with the web3-eth-accounts package and signing a message


``` ts
import { create } from 'web3-eth-accounts';


// the create method returns a Web3Account object. It contains an address and private key and allows you to be able to encrypt, sign and signTransaction.
const account = create();
{
address: '0xbD504f977021b5E5DdccD8741A368b147B3B38bB',
privateKey: 'privateKey',
signTransaction: [Function: signTransaction],
sign: [Function: sign],
encrypt: [AsyncFunction: encrypt]
}

account.sign("hello world");
{
  message: 'hello world',
  messageHash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68',
  v: '0x1b',
  r: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec758',
  s: '0x37ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f2008288',
  signature: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec75837ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f20082881b'
}

```
### Import a private key and sign a transaction with the web3 package

``` ts
import Web3 from 'web3';

const web3 = new Web3("provider");

const account = web3.eth.accounts.privateKeyToAccount("privateKey");

signedTransaction = await account.signTransaction({
        from: a.address,
        to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
        value: '0x1',
        gas: '300000',
        gasPrice: await web3.eth.getGasPrice()
    })
> {
  messageHash: '0xfad22c3ab5ecbb6eec934a21243ee1866fbbd3786f4e8e8ec631b917ef65174d',
  v: '0xf4f6',
  r: '0xc0035636d9417f63fdd418bc545190e59b58a4ff921bbf4efebf352dac211f11',
  s: '0x4944d746ff12c7bca41f77c8f7d75301cea8b205e021dfde34d09d5bdccc713d',
  rawTransaction: '0xf866808477359400830493e094e4beef667408b99053dc147ed19592ada0d77f59018082f4f6a0c0035636d9417f63fdd418bc545190e59b58a4ff921bbf4efebf352dac211f11a04944d746ff12c7bca41f77c8f7d75301cea8b205e021dfde34d09d5bdccc713d',
  transactionHash: '0xa3fed275c97abc4a160cd9bef3ec90206686f32821a8fd4e01a04130bff35c1a'
}

```
### Local wallets

Local wallets are an in-memory [wallet](/api/web3-eth-accounts/class/Wallet/) that can hold multiple accounts.
Wallets are a convenient way to sign and send transactions in web3.js.

:::warning

If used within the browser, wallets are not saved anywhere and disappear when the page is refreshed.
If used within your application, wallets will disappear after the program is completed.

:::

### Methods

The following is a list of Wallet [methods]( /api/web3-eth-accounts/class/Wallet#Methods) in the web3-eth-accounts package with description and example usage: 

- [add]( /api/web3-eth-accounts/class/Wallet/#add)
- [clear]( /api/web3-eth-accounts/class/Wallet/#clear)
- [create]( /api/web3-eth-accounts/class/Wallet/#create)
- [decrypt]( /api/web3-eth-accounts/class/Wallet/#decrypt)
- [encrypt]( /api/web3-eth-accounts/class/Wallet/#encrypt)
- [get]( /api/web3-eth-accounts/class/Wallet/#get)
- [load]( /api/web3-eth-accounts/class/Wallet/#load)
- [remove]( /api/web3-eth-accounts/class/Wallet/#remove)
- [save]( /api/web3-eth-accounts/class/Wallet/#save)
- [getStorage]( /api/web3-eth-accounts/class/Wallet/#getStorage) 


## Creating a local wallet

```ts

// creating a new wallet
web3.eth.accounts.create() 
> Wallet(0) [
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(0) {},
  _defaultKeyName: 'web3js_wallet'
]

// add a wallet using a private key
web3.eth.accounts.wallet.add("PrivateKey");
```

## Signing a message using a wallet

``` ts

import Web3 from 'web3';

web3.eth.accounts.wallet.create(1);

const message = web3.utils.utf8ToHex('Hello world'); // sign only takes hexstrings, so turn message to hexstring
web3.eth.sign(message, 0).then(console.log); // 0 refers to using the first index of the wallet to sign the message
> {
  message: '0x48656c6c6f20776f726c64',
  messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede',
  v: '0x1c',
  r: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f36',
  s: '0x32ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a',
  signature: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f3632ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a1c'
}
```

## Browser injection - Sending a transaction with Metamask

This is an example html file that will send a transaction when the button element is clicked.

To run this example you'll need Metamask, the `index.html` file below in your folder and you'll need a local server:

`npm i http-server`

`npx http-server`

Afterwards your file will be served on a local port, which will usually be on `http://127.0.0.1:8080`

### index.html
``` html

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Send Transaction Example</title>
	<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
</head>

<body>
	<button id="sendButton">Send Transaction</button>
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
						await web3.eth.sendTransaction({from: accounts[0],to:"0x38E2fb54587208f29B1452Bb8136d271BE0912EF"})
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

## Sending a transaction using a local wallet with contract methods

``` ts
// First step: initialize `web3` instance
import { Web3 } from 'web3';
const web3 = new Web3(/* PROVIDER*/);

// Second step: add an account to wallet
const privateKeyString = 'Private key';
const account = web3.eth.accounts.wallet.add(privateKeyString).get(0);

// Make sure the account has enough eth on balance to send the transaction

// fill ContractAbi and ContractBytecode with your contract's abi and bytecode

async function contractMethod() {
	try {

    // add the contract details of which method you want to call, using the contract abi and contract address
		const contract = new web3.eth.Contract(ContractAbi, "contract address");
		
		// call contract method and send 
		await contractDeployed.methods
			.method('0xe2597eb05cf9a87eb1309e86750c903ec38e527e')
			.send({
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
	await contractMethod();
})();

```