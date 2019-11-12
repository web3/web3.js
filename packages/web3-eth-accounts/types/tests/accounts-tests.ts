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
 * @file accounts-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */
import { Accounts } from 'web3-eth-accounts';

const accounts = new Accounts('http://localhost:8545');

// $ExpectType provider
accounts.currentProvider;

// $ExpectType any
accounts.givenProvider;

// $ExpectType boolean
accounts.setProvider('https://localhost:2100');

// $ExpectType Account
accounts.create();
// $ExpectType Account
accounts.create(
    '2435@#@#@±±±±!!!!678543213456764321§34567543213456785432134567'
);

// $ExpectType Account
accounts.privateKeyToAccount(
    '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
);

// $ExpectType Promise<SignedTransaction>
accounts.signTransaction(
    {
        to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        value: '1000000000',
        gas: 2000000
    },
    '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
);

// $ExpectType Promise<SignedTransaction>
accounts.signTransaction(
    {
        to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        value: '1000000000',
        gas: 2000000
    },
    '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    () => {
        console.log('hey');
    }
);

// $ExpectType string
accounts.recoverTransaction(
    '0xf861808084aefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9'
);

// $ExpectType string
accounts.hashMessage('hello world');

// $ExpectType Sign
accounts.sign(
    'Some data',
    '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
);

// $ExpectType string
accounts.recover({
    messageHash:
        '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
    v: '0x1c',
    r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
    s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029'
});

// $ExpectType string
accounts.recover(
    'Some data',
    '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c'
);

// $ExpectType string
accounts.recover(
    'Some data',
    '0x1c',
    '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
    '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029'
);

// $ExpectType EncryptedKeystoreV3Json
accounts.encrypt(
    '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    'test!'
);

// $ExpectType Account
accounts.decrypt(
    {
        version: 3,
        id: '04e9bcbb-96fa-497b-94d1-14df4cd20af6',
        address: '2c7536e3605d9c16a7a3d7b1898e529396a65c23',
        crypto: {
            ciphertext:
                'a1c25da3ecde4e6a24f3697251dd15d6208520efc84ad97397e906e6df24d251',
            cipherparams: { iv: '2885df2b63f7ef247d753c82fa20038a' },
            cipher: 'aes-128-ctr',
            kdf: 'scrypt',
            kdfparams: {
                dklen: 32,
                salt:
                    '4531b3c174cc3ff32a6a7a85d6761b410db674807b2d216d022318ceee50be10',
                n: 262144,
                r: 8,
                p: 1
            },
            mac:
                'b8b010fff37f9ae5559a352a185e86f9b9c1d7f7a9f1bd4e82a5dd35468fc7f6'
        }
    },
    'test!'
);

// $ExpectType WalletBase
accounts.wallet.create(2);

// $ExpectType Account
accounts.wallet[0];

// $ExpectType WalletBase
accounts.wallet.create(
    2,
    '54674321§3456764321§345674321§3453647544±±±§±±±!!!43534534534534'
);

// $ExpectType AddedAccount
accounts.wallet.add(
    '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'
);

// $ExpectType AddedAccount
accounts.wallet.add({
    privateKey:
        '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
    address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'
});

// $ExpectType boolean
accounts.wallet.remove('0xF0109fC8DF283027b6285cc889F5aA624EaC1F55');

// $ExpectType boolean
accounts.wallet.remove(3);

// $ExpectType WalletBase
accounts.wallet.clear();

// $ExpectType EncryptedKeystoreV3Json[]
accounts.wallet.encrypt('test');

// $ExpectType WalletBase
accounts.wallet.decrypt(
    [
        {
            version: 3,
            id: '83191a81-aaca-451f-b63d-0c5f3b849289',
            address: '06f702337909c06c82b09b7a22f0a2f0855d1f68',
            crypto: {
                ciphertext:
                    '7d34deae112841fba86e3e6cf08f5398dda323a8e4d29332621534e2c4069e8d',
                cipherparams: { iv: '497f4d26997a84d570778eae874b2333' },
                cipher: 'aes-128-ctr',
                kdf: 'scrypt',
                kdfparams: {
                    dklen: 32,
                    salt:
                        '208dd732a27aa4803bb760228dff18515d5313fd085bbce60594a3919ae2d88d',
                    n: 262144,
                    r: 8,
                    p: 1
                },
                mac:
                    '0062a853de302513c57bfe3108ab493733034bf3cb313326f42cf26ea2619cf9'
            }
        },
        {
            version: 3,
            id: '7d6b91fa-3611-407b-b16b-396efb28f97e',
            address: 'b5d89661b59a9af0b34f58d19138baa2de48baaf',
            crypto: {
                ciphertext:
                    'cb9712d1982ff89f571fa5dbef447f14b7e5f142232bd2a913aac833730eeb43',
                cipherparams: { iv: '8cccb91cb84e435437f7282ec2ffd2db' },
                cipher: 'aes-128-ctr',
                kdf: 'scrypt',
                kdfparams: {
                    dklen: 32,
                    salt:
                        '08ba6736363c5586434cd5b895e6fe41ea7db4785bd9b901dedce77a1514e8b8',
                    n: 262144,
                    r: 8,
                    p: 1
                },
                mac:
                    'd2eb068b37e2df55f56fa97a2bf4f55e072bef0dd703bfd917717d9dc54510f0'
            }
        }
    ],
    'test'
);

// $ExpectType boolean
accounts.wallet.save('test#!$');

// $ExpectType WalletBase
accounts.wallet.load('test#!$');

// $ExpectType WalletBase
accounts.wallet.load('test#!$', 'myWalletKey');
