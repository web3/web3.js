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

import { TransactionRevertInstructionError } from 'web3-core-helpers';
import { TransactionReceipt } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { Ens } from 'web3-eth-ens';
import { Eth } from 'web3-eth';

const ens = new Ens(new Eth('http://localhost:8545'));

// $ExpectType string | null
ens.registryAddress;

// $ExpectType Registry
ens.registry;

// $ExpectType Promise<Contract>
ens.resolver('name');
// $ExpectType Promise<Contract>
ens.resolver('name', (value: any) => {});
// $ExpectType Promise<Contract>
ens.resolver('name', (error: Error, contract: Contract) => {});
// $ExpectType Promise<Contract>
ens.getResolver('name');
// $ExpectType Promise<Contract>
ens.getResolver('name', (error: Error, contract: Contract) => {});
// $ExpectType Promise<Contract>
ens.getResolver('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setResolver('name', '0x0...');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setResolver('name', '0x0...', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setResolver('name', '0x0...', {}, (error: Error, receipt: TransactionReceipt) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setSubnodeOwner('name', 'label', '0x...');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setSubnodeOwner('name', 'label', '0x...', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setSubnodeOwner('name', 'label', '0x...', {}, (error: Error, receipt: TransactionReceipt) => {});

// $ExpectType Promise<string>
ens.getTTL('name');
// $ExpectType Promise<string>
ens.getTTL('name', (error: Error, ttl: string) => {});
// $ExpectType Promise<string>
ens.getTTL('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setTTL('name', 10000);
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setTTL('name', 10000, {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setTTL('name', '0xa', {}, (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => {});

// $ExpectType Promise<string>
ens.getOwner('name');
// $ExpectType Promise<string>
ens.getOwner('name', (value: any) => {});
// $ExpectType Promise<string>
ens.getOwner('name', (error: Error, owner: string) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setOwner('name', '0x...');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setOwner('name', '0x...', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setOwner('name', '0x...', {}, (error: Error | TransactionRevertInstructionError, receipt: TransactionReceipt) => {});

// $ExpectType Promise<boolean>
ens.supportsInterface('name', 'interfaceId');
// $ExpectType Promise<boolean>
ens.supportsInterface(
    'name',
    'interfaceId',
    (error: Error, supportsInterface: boolean) => {}
);
// $ExpectType Promise<boolean>
ens.supportsInterface(
    'name',
    'interfaceId',
    (value: any) => {}
);

// $ExpectType Promise<string>
ens.getAddress('name');
// $ExpectType Promise<string>
ens.getAddress('name', (error: Error, address: string) => {});
// $ExpectType Promise<string>
ens.getAddress('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setAddress('name', 'address');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setAddress('name', 'address', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setAddress('name', 'address', {}, (error: Error, result: any) => {});

// $ExpectType Promise<{ [x: string]: string; }>
ens.getPubkey('name');
// $ExpectType Promise<{ [x: string]: string; }>
ens.getPubkey('name', (error: Error, result: { [x: string]: string }) => {});
// $ExpectType Promise<{ [x: string]: string; }>
ens.getPubkey('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setPubkey('name', 'x', 'y');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setPubkey('name', 'x', 'y', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setPubkey('name', 'x', 'y', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getText('name', 'key');
// $ExpectType Promise<string>
ens.getText('name', 'key', (error: Error, ensName: string) => {});
// $ExpectType Promise<string>
ens.getText('name', 'key', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setText('name', 'key', 'value');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setText('name', 'key', 'value', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setText('name', 'key', 'value', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getContent('name');
// $ExpectType Promise<string>
ens.getContent('name', (error: Error, contentHash: string) => {});
// $ExpectType Promise<string>
ens.getContent('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContent('name', 'hash');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContent('name', 'hash', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContent('name', 'hash', {}, (error: Error, result: any) => {});

// $ExpectType Promise<string>
ens.getMultihash('name');
// $ExpectType Promise<string>
ens.getMultihash('name', (error: Error, multihash: string) => {});
// $ExpectType Promise<string>
ens.getMultihash('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setMultihash('name', 'hash');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setMultihash('name', 'hash', {}, (error: Error, result: any) => {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setMultihash('name', 'hash', {});

// $ExpectType Promise<string>
ens.getContenthash('name');
// $ExpectType Promise<string>
ens.getContenthash('name', (error: Error, contenthash: string) => {});
// $ExpectType Promise<string>
ens.getContenthash('name', (value: any) => {});

// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContenthash('name', 'hash');
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContenthash('name', 'hash', {});
// $ExpectType PromiEvent<TransactionReceipt | TransactionRevertInstructionError>
ens.setContenthash('name', 'hash', {}, (error: Error, result: any) => {});
