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
 * @file shh-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import ShhDefault, { Info, Notification, Shh } from 'web3-shh';

// $ExpectType Shh
const shh_default_empty = new ShhDefault();

// $ExpectType Shh
const shh_empty = new Shh();

// $ExpectType Shh
const shh = new Shh('https://localhost:5000');

// $ExpectType provider
shh.currentProvider;

// $ExpectType any
Shh.givenProvider;

// $ExpectType any
shh.givenProvider;

// $ExpectType boolean
shh.setProvider('https://localhost:2100');

// $ExpectType BatchRequest
new shh.BatchRequest();

// $ExpectType any
shh.extend({property: 'test', methods: [{name: 'method', call: 'method'}]});

// $ExpectType Promise<number>
shh.net.getId();
// $ExpectType Promise<number>
shh.net.getId((error: Error, id: number) => {});

// $ExpectType Promise<boolean>
shh.net.isListening();
// $ExpectType Promise<boolean>
shh.net.isListening((error: Error, listening: boolean) => {});

// $ExpectType Promise<number>
shh.net.getPeerCount();
// $ExpectType Promise<number>
shh.net.getPeerCount((error: Error, peerCount: number) => {});

// $ExpectType Promise<string>
shh.getVersion();
// $ExpectType Promise<string>
shh.getVersion((error: Error, version: string) => {});

// $ExpectType Promise<Info>
shh.getInfo();
// $ExpectType Promise<Info>
shh.getInfo((error: Error, info: Info) => {});

// $ExpectType Promise<boolean>
shh.setMaxMessageSize(1234565);
// $ExpectType Promise<boolean>
shh.setMaxMessageSize(1234565, (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
shh.setMinPoW(0.9);
// $ExpectType Promise<boolean>
shh.setMinPoW(0.9, (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
shh.markTrustedPeer('test');
// $ExpectType Promise<boolean>
shh.markTrustedPeer('test', (error: Error, result: boolean) => {});

// $ExpectType Promise<string>
shh.newKeyPair();
// $ExpectType Promise<string>
shh.newKeyPair((error: Error, key: string) => {});

// $ExpectType Promise<string>
shh.addPrivateKey(
    '0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15'
);
// $ExpectType Promise<string>
shh.addPrivateKey(
    '0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15',
    (error: Error, privateKey: string) => {}
);

// $ExpectType Promise<boolean>
shh.deleteKeyPair(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<boolean>
shh.deleteKeyPair(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<boolean>
shh.hasKeyPair(
    'fe22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<boolean>
shh.hasKeyPair(
    'fe22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<string>
shh.getPublicKey(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<string>
shh.getPublicKey(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, publicKey: string) => {}
);

// $ExpectType Promise<string>
shh.getPrivateKey(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<string>
shh.getPrivateKey(
    '3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, privateKey: string) => {}
);

// $ExpectType Promise<string>
shh.newSymKey();
// $ExpectType Promise<string>
shh.newSymKey((error: Error, key: string) => {});

// $ExpectType Promise<string>
shh.addSymKey(
    '0x5e11b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<string>
shh.addSymKey(
    '0x5e11b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, key: string) => {}
);

// $ExpectType Promise<string>
shh.generateSymKeyFromPassword('Never use this password - password!');
// $ExpectType Promise<string>
shh.generateSymKeyFromPassword(
    'Never use this password - password!',
    (error: Error, key: string) => {}
);

// $ExpectType Promise<boolean>
shh.hasSymKey(
    'f6dcf21ed6a17bd78d8c4c63195ab997b3b65ea683705501eae82d32667adc92'
);
// $ExpectType Promise<boolean>
shh.hasSymKey(
    'f6dcf21ed6a17bd78d8c4c63195ab997b3b65ea683705501eae82d32667adc92',
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<string>
shh.getSymKey(
    'af33b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<string>
shh.getSymKey(
    'af33b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, key: string) => {}
);

// $ExpectType Promise<boolean>
shh.deleteSymKey(
    'bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f'
);
// $ExpectType Promise<boolean>
shh.deleteSymKey(
    'bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<string>
shh.post({
    symKeyID: 'sd3',
    sig: 'sds5',
    ttl: 10,
    topic: '0xffaadd11',
    payload: '0xffffffdddddd1122',
    powTime: 3,
    powTarget: 0.5
});
// $ExpectType Promise<string>
shh.post(
    {
        symKeyID: 'sd3',
        sig: 'sds5',
        ttl: 10,
        topic: '0xffaadd11',
        payload: '0xffffffdddddd1122',
        powTime: 3,
        powTarget: 0.5
    },
    (error: Error, result: string) => {}
);

// $ExpectType Subscribe
shh.subscribe('messages', {
    symKeyID:
        'bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
    sig:
        '0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6',
    ttl: 20,
    topics: ['0xffddaa11'],
    minPow: 0.8
});
// $ExpectType Subscribe
shh.subscribe(
    'messages',
    {
        symKeyID:
            'bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
        sig:
            '0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6',
        ttl: 20,
        topics: ['0xffddaa11'],
        minPow: 0.8
    },
    (error: Error, message: Notification, subscription: any) => {}
);

// $ExpectType Promise<string>
shh.newMessageFilter();

// $ExpectType Promise<boolean>
shh.deleteMessageFilter(
    '2b47fbafb3cce24570812a82e6e93cd9e2551bbc4823f6548ff0d82d2206b326'
);

// $ExpectType Promise<Notification[]>
shh.getFilterMessages(
    '2b47fbafb3cce24570812a82e6e93cd9e2551bbc4823f6548ff0d82d2206b326'
);
