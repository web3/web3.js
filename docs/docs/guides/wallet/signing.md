---
sidebar_position: 4
sidebar_label: 'Tutorial: Signing operations'
---

# Signing operations

In this guide, we'll cover how to sign `data` and `transactions` using web3.js. Whether it's signing data with an account, signing transactions, or using wallets and private keys, we'll walk you through the basic steps. Let's get started!


## Sign Data With an `Account`

In this example we are creating a random account `web3.eth.account.create()`, but you can also import a specific account by using `web3.eth.accounts.privateKeyToAccount('0x...')`

``` ts
import { create } from 'web3-eth-accounts';

// the create method returns a `Web3Account` object
// the account contains an `address` and `privateKey` and allows you to be able to encrypt, signData and signTransaction.
const account = create(); //this is the same as web3.eth.accounts.create();

/* ↳
{
address: '0xbD504f977021b5E5DdccD8741A368b147B3B38bB',
privateKey: 'privateKey',
signTransaction: [Function: signTransaction],
sign: [Function: sign],
encrypt: [AsyncFunction: encrypt]
}
*/

account.sign('hello world');
/* ↳ 
{
  message: 'hello world',
  messageHash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68',
  v: '0x1b',
  r: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec758',
  s: '0x37ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f2008288',
  signature: '0xe4fce466ef18f6cd8b4f4175a9a04cd2872a1a6a8cfc2ff67fb0cfd6d78ec75837ca3a789976f1854d16e50a04caf2e06ee14b0ac4a5878b43929767f20082881b'
}
*/
```

## Sign a Transaction With an `Account`

In this example we are importing a specific account by using `web3.eth.accounts.privateKeyToAccount('0x...')` but you can also create a random account by using `web3.eth.account.create()`.

``` ts
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER */);

const privateKey = '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba'
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// Magic happens inside signTransaction. If a transaction is sent from an account that exists in a wallet, it will be automatically signed using that account.
signedTransaction = await account.signTransaction({
  from: account.address,
  to: '0xe4beef667408b99053dc147ed19592ada0d77f59',
  value: '0x1',
  gas: '300000',
  gasPrice: await web3.eth.getGasPrice(),
});

console.log(signedTransaction);
/* ↳
{
messageHash: '0xfad22c3ab5ecbb6eec934a21243ee1866fbbd3786f4e8e8ec631b917ef65174d',
v: '0xf4f6',
r: '0xc0035636d9417f63fdd418bc545190e59b58a4ff921bbf4efebf352dac211f11',
s: '0x4944d746ff12c7bca41f77c8f7d75301cea8b205e021dfde34d09d5bdccc713d',
rawTransaction:
    '0xf866808477359400830493e094e4beef667408b99053dc147ed19592ada0d77f59018082f4f6a0c0035636d9417f63fdd418bc545190e59b58a4ff921bbf4efebf352dac211f11a04944d746ff12c7bca41f77c8f7d75301cea8b205e021dfde34d09d5bdccc713d',
transactionHash: '0xa3fed275c97abc4a160cd9bef3ec90206686f32821a8fd4e01a04130bff35c1a',
};
*/
```

## Signing data/messages using a wallet

``` ts title='Signing with a wallet'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER */);

// create a `Wallet` with 1 account inside
const wallet = web3.eth.accounts.wallet.create(1);

const message = web3.utils.utf8ToHex('Hello world'); // sign only takes hexstrings, so turn message to hexstring

const signedMessage = web3.eth.sign(message, wallet[0].address);

console.log(signedMessage);
/* ↳
{
  message: '0x48656c6c6f20776f726c64',
  messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede',
  v: '0x1c',
  r: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f36',
  s: '0x32ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a',
  signature: '0x3a420906f331896cb5db1366cdaeef1f0b14f9f71d72c178e87b76f8b31f3f3632ffccc78638c1d7e46dbf16041ddaef90ab50a85eeeaa46f8c496a39237831a1c'
}
*/
```

## Signing data/messages using a privateKey

```ts title= 'Signing with a private key'
import { Web3 } from 'web3';

const web3 = new Web3(/* PROVIDER */);

const privateKey = '0x4651f9c219fc6401fe0b3f82129467c717012287ccb61950d2a8ede0687857ba';

const message = 'Hello world';
const signedMessage = web3.eth.accounts.sign(message, privateKey);

console.log(signedMessage);
/* ↳
{
  message: 'Hello world',
  messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede',
  v: '0x1c',
  r: '0xb669ef385082d7c4393522ab2fc37f8684fe948b313fb64b7cb8bee851b765f1',
  s: '0x26eec81e9900d25500c13024b273e238cfb2a4d4554b79f74b372e1132b6cb2f',
  signature: '0xb669ef385082d7c4393522ab2fc37f8684fe948b313fb64b7cb8bee851b765f126eec81e9900d25500c13024b273e238cfb2a4d4554b79f74b372e1132b6cb2f1c'
}
*/
```

