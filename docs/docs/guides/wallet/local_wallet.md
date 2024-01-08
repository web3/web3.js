---
sidebar_position: 3
sidebar_label: 'Tutorial: Local Wallets'
---

# Local Wallets

Local wallets are an in-memory [wallet](/api/web3-eth-accounts/class/Wallet/) that can hold multiple accounts.
Wallets are a convenient way to sign and send transactions in web3.js

:::warning
If used within the browser, wallets are not saved anywhere and disappear when the page is refreshed.
If used within your application, wallets will disappear after the program is completed.
:::

## Create an account and add it to an empty `Wallet`

```ts title='Creating an Account and Adding it to an Empty Wallet'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER */);

// 1st - creating a new empty wallet (0 accounts inside)
const wallet = web3.eth.accounts.wallet.create();

console.log(wallet);
/* ↳
Wallet(0) [
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(0) {},
  _defaultKeyName: 'web3js_wallet'
]
*/

// 2nd - create an account
const account = web3.eth.accounts.create();

console.log(account)
/* ↳
{
  address: '0x0770B4713B62E0c08C43743bCFcfBAA39Fa703EF',
  privateKey: '0x97b0c07e275a0d8d9983331ca1a7ecb1a4a6f7dcdd7657529fe07446fa4dfe23',
  signTransaction: [Function: signTransaction],
  sign: [Function: sign],
  encrypt: [Function: encrypt]
}
*/

// 3rd - add the account to the wallet
web3.eth.accounts.wallet.add(account);

console.log(wallet);
/* ↳
Wallet(1) [
  {
    address: '0x0770B4713B62E0c08C43743bCFcfBAA39Fa703EF',
    privateKey: '0x97b0c07e275a0d8d9983331ca1a7ecb1a4a6f7dcdd7657529fe07446fa4dfe23',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(1) { '0x0770b4713b62e0c08c43743bcfcfbaa39fa703ef' => 0 },
  _defaultKeyName: 'web3js_wallet'
]
*/
```

## Import a privateKey and add it to an empty `Wallet`

```ts title='Creating a wallet and adding an account with a private key'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER */);

// 1st - creating a new empty wallet
const wallet = web3.eth.accounts.wallet.create() 

console.log(wallet);
/* ↳
> Wallet(0) [
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(0) {},
  _defaultKeyName: 'web3js_wallet'
]
*/

// 2nd - add an account to the wallet using a private key
const privateKey = '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba'
web3.eth.accounts.wallet.add(privateKey);

console.log(wallet);
/* ↳
Wallet(1) [
  {
    address: '0x9E82491d1978217d631a3b467BF912933F54788f',
    privateKey: '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
  },
  _accountProvider: {
    create: [Function: createWithContext],
    privateKeyToAccount: [Function: privateKeyToAccountWithContext],
    decrypt: [Function: decryptWithContext]
  },
  _addressMap: Map(1) { '0x9e82491d1978217d631a3b467bf912933f54788f' => 0 },
  _defaultKeyName: 'web3js_wallet'
]
*/
```

