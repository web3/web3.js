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
 * @file ens-test.ts
 * @author Samuel Furter <samuel@ethereum.org>, Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import { Ens } from 'web3-eth-ens';
import { Eth } from 'web3-eth';

const ens = new Ens(new Eth('http://localhost:8545'));

// $ExpectType Registry
ens.registry;

// $ExpectType Promise<Contract>
ens.resolver('name');

// $ExpectType Promise<boolean>
ens.supportsInterface('name', 'interfaceId');
// $ExpectType Promise<boolean>
ens.supportsInterface(
    'name',
    'interfaceId',
    (error: Error, supportsInterface: boolean) => {}
);

// $ExpectType Promise<string>
ens.getAddress('name');
// $ExpectType Promise<string>
ens.getAddress('name', (error: Error, address: string) => {});

// $ExpectType PromiEvent<any>
ens.setAddress('name', 'address', {});
// $ExpectType PromiEvent<any>
ens.setAddress('name', 'address', {}, (error: Error, result: any) => {});

// $ExpectType Promise<{ [x: string]: string; }>
ens.getPubkey('name');
// $ExpectType Promise<{ [x: string]: string; }>
ens.getPubkey('name', (error: Error, result: { [x: string]: string }) => {});

// $ExpectType PromiEvent<any>
ens.setPubkey('name', 'x', 'y', {});
// $ExpectType PromiEvent<any>
ens.setPubkey('name', 'x', 'y', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getText('name', 'key');
// $ExpectType Promise<string>
ens.getText('name', 'key', (error: Error, ensName: string) => {});

// $ExpectType PromiEvent<any>
ens.setText('name', 'key', 'value', {});
// $ExpectType PromiEvent<any>
ens.setText('name', 'key', 'value', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getContent('name');
// $ExpectType Promise<string>
ens.getContent('name', (error: Error, contentHash: string) => {});

// $ExpectType PromiEvent<any>
ens.setContent('name', 'hash', {});
// $ExpectType PromiEvent<any>
ens.setContent('name', 'hash', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getMultihash('name');
// $ExpectType Promise<string>
ens.getMultihash('name', (error: Error, multihash: string) => {});

// $ExpectType PromiEvent<any>
ens.setMultihash('name', 'hash', {});
// $ExpectType PromiEvent<any>
ens.setMultihash('name', 'hash', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getContenthash('name');
// $ExpectType Promise<string>
ens.getContenthash('name', (error: Error, contenthash: string) => {});

// $ExpectType PromiEvent<any>
ens.setContenthash('name', 'hash', {});
// $ExpectType PromiEvent<any>
ens.setContenthash('name', 'hash', {}, (error: Error, result: any) => {});
