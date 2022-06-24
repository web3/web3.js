/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * # web3.eth.accounts
 * The web3.eth.accounts contains functions to generate Ethereum accounts and sign transactions and data.
 *
 * **_NOTE:_** This package has NOT been audited and might potentially be unsafe. Take precautions to clear memory properly, store the private keys safely, and test transaction receiving and sending functionality properly before using in production!
 *
 *
 * To use this package standalone and use its methods use:
 * ```ts
 * import { create, decrypt } from 'web3-eth-accounts'; // ....
 * ```
 *
 * To use this package within the web3 object use:
 * ```ts
 * import { Web3 } from 'web3';
 *
 * const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
 * // now you have access to the accounts class
 * web3.eth.accounts.create();
 * ```
 *
 * ## create
 *
 * Generates and returns a Web3Account object that includes the private and public key
 *
 * ### Parameters
 * No parameters
 * ### Returns
 * Returns a {@link Web3Account} object that includes the private and public key
 *
 * ### Example
 * ```ts
 * web3.eth.accounts.create();
 * {
 * address: '0xbD504f977021b5E5DdccD8741A368b147B3B38bB',
 * privateKey: '0x964ced1c69ad27a311c432fdc0d8211e987595f7eb34ab405a5f16bdc9563ec5',
 * signTransaction: [Function: signTransaction],
 * sign: [Function: sign],
 * encrypt: [AsyncFunction: encrypt]
 * }
 * ```
 *
 * ## privateKeyToAccount
 *
 * Get an Account object from the privateKey
 *
 * ### Parameters
 * privateKey -  string or buffer of 32 bytes
 *
 * ### Returns
 * Returns a {@link Web3Account} object from the private key
 *
 * ### Example
 * ```ts
 * privateKeyToAccount("0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709");
 * >    {
 * 			address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
 * 			privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
 * 			sign,
 * 			signTransaction,
 * 			encrypt,
 * 	}
 *
 * ```
 *
 * ## privateKeyToAddress
 *
 * Using a private key get the ethereum Address
 *
 * ### Parameters
 * privateKey - string or buffer of 32 bytes
 *
 * ### Returns
 *  Returns the Ethereum address
 *
 * ### Example
 *
 * privateKeyToAddress("0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709")
 * >0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01
 *
 * ## signTransaction
 *
 * Signs an Ethereum transaction with a given private key.
 * ### Parameters
 * transaction - Takes a transaction object, see {@link TxData} {@link AccessListEIP2930TxData} {@link FeeMarketEIP1559TxData}
 *
 * ### Returns
 *
 * ### Examples
 * signing a legacy transaction
 * ```ts
 * signTransaction({
 *	to: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
 *	value: '0x186A0',
 *	gasLimit: '0x520812',
 *	gasPrice: '0x09184e72a000',
 *	data: '',
 *	chainId: 1,
 *	nonce: 0,
 * }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'))
 * }
 * > {
 * messageHash: '0x28b7b75f7ba48d588a902c1ff4d5d13cc0ca9ac0aaa39562368146923fb853bf',
 * v: '0x25',
 * r: '0x601b0017b0e20dd0eeda4b895fbc1a9e8968990953482214f880bae593e71b5',
 * s: '0x690d984493560552e3ebdcc19a65b9c301ea9ddc82d3ab8cfde60485fd5722ce',
 * rawTransaction: '0xf869808609184e72a0008352081294118c2e5f57fd62c2b5b46a5ae9216f4ff4011a07830186a08025a00601b0017b0e20dd0eeda4b895fbc1a9e8968990953482214f880bae593e71b5a0690d984493560552e3ebdcc19a65b9c301ea9ddc82d3ab8cfde60485fd5722ce',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * ```
 * signing an eip 1559 transaction
 * ```ts
 * signTransaction({
 *	to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
 *	maxPriorityFeePerGas: '0x3B9ACA00',
 *	maxFeePerGas: '0xB2D05E00',
 *	gasLimit: '0x6A4012',
 *	value: '0x186A0',
 *	data: '',
 *	chainId: 1,
 *	nonce: 0,
 * },"0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318")
 * > {
 *  messageHash: '0x5744f24d5f0aff6c70487c8e85adf07d8564e50b08558788f00479611d7bae5f',
 * v: '0x25',
 * r: '0x78a5a6b2876c3985f90f82073d18d57ac299b608cc76a4ba697b8bb085048347',
 * s: '0x9cfcb40cc7d505ed17ff2d3337b51b066648f10c6b7e746117de69b2eb6358d',
 * rawTransaction: '0xf8638080836a401294f0109fc8df283027b6285cc889f5aa624eac1f55830186a08025a078a5a6b2876c3985f90f82073d18d57ac299b608cc76a4ba697b8bb085048347a009cfcb40cc7d505ed17ff2d3337b51b066648f10c6b7e746117de69b2eb6358d',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * }
 * ```
 * signing an eip 2930 transaction
 * ```ts
 * signTransaction({
 *	chainId: 1,
 *	nonce: 0,
 *	gasPrice: '0x09184e72a000',
 *	gasLimit: '0x2710321',
 *	to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
 *	value: '0x186A0',
 *	data: '',
 *	accessList: [
 *		{
 *			address: '0x0000000000000000000000000000000000000101',
 *			storageKeys: [
 *				'0x0000000000000000000000000000000000000000000000000000000000000000',
 *				'0x00000000000000000000000000000000000000000000000000000000000060a7',
 *			],
 *		},
 *	],
 * },"0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318")
 * > {
 * messageHash: '0xc55ea24bdb4c379550a7c9a6818ac39ca33e75bc78ddb862bd82c31cc1c7a073',
 * v: '0x26',
 * r: '0x27344e77871c8b2068bc998bf28e0b5f9920867a69c455b2ed0c1c150fec098e',
 * s: '0x519f0130a1d662841d4a28082e9c9bb0a15e0e59bb46cfc39a52f0e285dec6b9',
 * rawTransaction: '0xf86a808609184e72a000840271032194f0109fc8df283027b6285cc889f5aa624eac1f55830186a08026a027344e77871c8b2068bc998bf28e0b5f9920867a69c455b2ed0c1c150fec098ea0519f0130a1d662841d4a28082e9c9bb0a15e0e59bb46cfc39a52f0e285dec6b9',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * }
 * ```
 *
 * ## recoverTransaction
 *
 * Recovers the Ethereum address which was used to sign the given RLP encoded transaction.
 * ### Parameters
 * signature - `string`
 *
 * ### Example
 * ```ts
 * recoverTransaction('0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68');
 * > "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"
 *
 * ## hashMessage
 *
 * Hashes the given message. The data will be UTF-8 HEX decoded and enveloped as follows: "\x19Ethereum Signed Message:\n" + message.length + message and hashed using keccak256.
 * ### Parameters
 * message - `string`
 *
 * ### Returns
 * Returns the hashed message
 *
 * ### Example
 * ```ts
 * hashMessage("Hello world")
 * > "0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede"
 * hashMessage(utf8ToHex("Hello world")) // Will be hex decoded in hashMessage
 * > "0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede"
 * ```
 *
 * ## sign
 * Signs arbitrary data.
 * **_NOTE:_** The value passed as the data parameter will be UTF-8 HEX decoded and wrapped as follows: "\x19Ethereum Signed Message:\n" + message.length + message
 * ### Parameters
 * data  - `string` The data to sign.
 * privateKey - `string`: The private key to sign with.
 * ### Return
 * Returns the signature object. See more {@link signatureObject}
 * ### Example
 * ```ts
 * web3.eth.accounts.sign('Some data', '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
 * > {
 * message: 'Some data',
 * messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
 * v: '0x1c',
 * r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
 * s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029',
 * signature: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c'
 * }
 * ```
 *
 * ## recover
 * Recovers the Ethereum address which was used to sign the given data
 * ### Parameters
 * data - Either a signatureObject, signed message or hash
 * signature - The raw RLP encoded signature
 * hashed - (optional, default: false) If this parameter is false, the given message will be prefixed with `"\x19Ethereum Signed Message:\n" + message.length + message`
 * ### Returns
 * Returns the ethereum address used to sign this data.
 * ### Example
 * ```ts
 * sign('Some data', '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
 * > {
 * message: 'Some data',
 * messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
 * v: '0x1b',
 * r: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f9',
 * s: '0x53e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb150',
 * signature: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b'
 * }
 * recover('0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b');
 * > '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0'
 * ```
 *
 * ## encrypt
 * Encrypt a private key given a password, returns a V3 JSON Keystore
 *
 * Read more: https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 * ### Parameters
 * privateKey - The private key to encrypt
 * password - The password used for encryption
 * options - {@link CipherOptions} (optional) options to configure to encrypt the keystore either scrypt or pbkdf2
 * ### Returns
 * The encrypted keystore v3 JSON {@link KeyStore}
 * ### Example
 *
 * Encrypt using scrypt options
 * ```ts
 * encrypt('0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
 * '123',
 * {
 *   n: 8192,
 *	 iv: Buffer.from('bfb43120ae00e9de110f8325143a2709', 'hex'),
 *	 salt: Buffer.from(
 *		'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *		'hex',
 *	),
 * }).then(console.log)
 * > {
 * version: 3,
 * id: 'c0cb0a94-4702-4492-b6e6-eb2ac404344a',
 * address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
 * crypto: {
 *   ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
 *   cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *   cipher: 'aes-128-ctr',
 *   kdf: 'scrypt',
 *   kdfparams: {
 *     n: 8192,
 *     r: 8,
 *     p: 1,
 *     dklen: 32,
 *     salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
 *   },
 *   mac: 'efbf6d3409f37c0084a79d5fdf9a6f5d97d11447517ef1ea8374f51e581b7efd'
 * }
 *}
 *```
 * encrypting with pbkdf2
 * ```ts
 * encrypt('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
 *'123',
 *{
 *	iv: 'bfb43120ae00e9de110f8325143a2709',
 *	salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *	c: 262144,
 *	kdf: 'pbkdf2',
 *}).then(console.log)
 * >
 * {
 * version: 3,
 * id: '77381417-0973-4e4b-b590-8eb3ace0fe2d',
 * address: 'b8ce9ab6943e0eced004cde8e3bbed6568b2fa01',
 * crypto: {
 *   ciphertext: '76512156a34105fa6473ad040c666ae7b917d14c06543accc0d2dc28e6073b12',
 *   cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *   cipher: 'aes-128-ctr',
 *   kdf: 'pbkdf2',
 *   kdfparams: {
 *     dklen: 32,
 *     salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *     c: 262144,
 *      prf: 'hmac-sha256'
 *   },
 *   mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7'
 * }
 *}
 *```
 *
 * ## decrypt
 *  Decrypts a v3 keystore JSON, and creates the account.
 * ### Parameters
 * encryptedPrivateKey - {@link Keystore} | `string` the encryptedPrivateKey object or string
 * password - `string` The password used for encryption
 *
 * ### Returns
 * The decrypted account
 * ### Example
 * Decrypting scrpt
 *
 * ```ts
 * decrypt({
 *   version: 3,
 *   id: 'c0cb0a94-4702-4492-b6e6-eb2ac404344a',
 *   address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
 *   crypto: {
 *   ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
 *      cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *      cipher: 'aes-128-ctr',
 *      kdf: 'scrypt',
 *      kdfparams: {
 *        n: 8192,
 *        r: 8,
 *        p: 1,
 *        dklen: 32,
 *        salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
 *      },
 *      mac: 'efbf6d3409f37c0084a79d5fdf9a6f5d97d11447517ef1ea8374f51e581b7efd'
 *    }
 *   }, '123').then(console.log)
 * > {
 * address: '0xcdA9A91875fc35c8Ac1320E098e584495d66e47c',
 * privateKey: '67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
 * signTransaction: [Function: signTransaction],
 * sign: [Function: sign],
 * encrypt: [AsyncFunction: encrypt]
 * }
 * ```
 *
 * # Wallet
 * Contains an in memory wallet with multiple accounts. These accounts can be used when using web3.eth.sendTransaction().
 * ### Example
 * ```ts
 * import Web3 from 'web3';
 * const web3 = new Web3("https://localhost:8454")
 * web3.eth.accounts.wallet
 * > Wallet {
 *  0: {...}, // account by index
 *  "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},  // same account by address
 *  "0xf0109fc8df283027b6285cc889f5aa624eac1f55": {...},  // same account by address lowercase
 *  1: {...},
 *  "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...},
 *  "0xd0122fc8df283027b6285cc889f5aa624eac1d23": {...},
 *
 *  add: function(){},
 *  remove: function(){},
 *  save: function(){},
 *  load: function(){},
 * clear: function(){},
 * length: 2,
 * }
 * Wallet {
  _accountProvider: {
    create: [Function: create],
    privateKeyToAccount: [Function: privateKeyToAccount],
    decrypt: [Function: decrypt]
  },
  _defaultKeyName: 'web3js_wallet',
  _accounts: {}
}
 * ```
 *
 *
 * ## wallet.create
 * Generates one or more accounts in the wallet. If wallets already exist they will not be overridden.
 * ### Parameters
 * numberOfAccounts - `number` 
 * entropy
 * ### Returns
 * Returns the wallet object
 * ### Example
 * ```ts
 * import Web3 from 'web3';
 *
 * const web3 = new Web3("https://localhost:8454")
 * web3.eth.accounts.wallet.create(3)
 * > Wallet {
  _accountProvider: {
    create: [Function: create],
    privateKeyToAccount: [Function: privateKeyToAccount],
    decrypt: [Function: decrypt]
  },
  _defaultKeyName: 'web3js_wallet',
  _accounts: {
    '0x5d01efd47a37ca79bb63834fc105835c3d1cdcb5': {
      address: '0x5D01eFd47A37CA79bB63834fc105835c3d1CDcb5',
      privateKey: '0x02684a681146848fd0ff9c69e63e955bd9cc26020737e3762f0bf6280464aa20',
      signTransaction: [Function: signTransaction],
      sign: [Function: sign],
      encrypt: [Function: encrypt]
    },
    '0x85d70633b90e03e0276b98880286d0d055685ed7': {
      address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
      privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
      signTransaction: [Function: signTransaction],
      sign: [Function: sign],
      encrypt: [Function: encrypt]
    },
    '0x2c3dd207645e2c0a10956124d21920f104f0b06d': {
      address: '0x2C3dd207645e2c0a10956124d21920F104f0b06D',
      privateKey: '0x9d66bece56a14b4017900b2113334db14ebf240fb4e5abc93f1d9e701ddd3108',
      signTransaction: [Function: signTransaction],
      sign: [Function: sign],
      encrypt: [Function: encrypt]
    }
  }
}
 * 
 * ```
 * ## wallet.add
 * Adds an account using a private key or account object to the wallet.
 * ### Parameters
 * account - `string` | {@link Wallet<T extends Web3BaseWalletAccount>}
 *
 * ### Returns
 * Object - Returns the added account
 * ### Example
 * ```ts
 * import Web3 from 'web3';
 *
 *   const web3 = new Web3("https://localhost:8454")
 *
 * console.log(web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387'));
 * console.log(web3.eth.accounts)
 * 
 * ## wallet.remove
 * Removes an account from the wallet.
 * ### Parameters
 * account - `String`| `Number`: The account address, or index in the wallet.
 * ### Returns
 * `Boolean`: true if the wallet was removed. false if it couldn’t be found.
 * ### Example
 *
 * import Web3 from 'web3';
 *
 * const web3 = new Web3("https://localhost:8454")
 *
 * web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387');
 * 
 * web3.eth.accounts.wallet.remove('0x85D70633b90e03e0276B98880286D0D055685ed7'); // FIX THIS
 * ```
 * ## wallet.clear
 * Securely empties the wallet and removes all its accounts.
 * 
 * ### Parameters
 * none
 * ### Returns
 * The wallet object
 * ### Example
 * 
 * ```ts 
 * import Web3 from 'web3';
 *
 * const web3 = new Web3("https://localhost:8454")
 *
 * web3.eth.accounts.wallet.add('0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387');
 * Wallet {
  _accountProvider: {
    create: [Function: create],
    privateKeyToAccount: [Function: privateKeyToAccount],
    decrypt: [Function: decrypt]
  },
  _defaultKeyName: 'web3js_wallet',
  _accounts: {
    '0x85d70633b90e03e0276b98880286d0d055685ed7': {
      address: '0x85D70633b90e03e0276B98880286D0D055685ed7',
      privateKey: '0xbce9b59981303e76c4878b1a6d7b088ec6b9dd5c966b7d5f54d7a749ff683387',
      signTransaction: [Function: signTransaction],
      sign: [Function: sign],
      encrypt: [Function: encrypt]
    }
  }
}
 * web3.eth.accounts.wallet.clear(); 
Wallet {
  _accountProvider: {
    create: [Function: create],
    privateKeyToAccount: [Function: privateKeyToAccount],
    decrypt: [Function: decrypt]
  },
  _defaultKeyName: 'web3js_wallet',
  _accounts: {}
}
 * ```
 *
 *
 * ## wallet.encrypt
 *
 * Encrypts all wallet accounts to an array of encrypted keystore v3 objects.
 * 
 * ### Parameters
 * password - String: The password which will be used for encryption.
 * ### Returns
 *
 * ### Example
 *
 * ## wallet.decrypt
 *
 * ### Parameters
 *
 * ### Returns
 *
 * ### Example
 *
 *
 * ## wallet.save
 *
 * ### Parameters
 *
 * ### Returns
 *
 * ### Example
 *
 *
 * ## wallet.load
 *
 * ### Parameters
 *
 * ### Returns
 *
 * ### Example
 */
/**
 *
 */

export * from './wallet';
export * from './account';
export * from './types';
