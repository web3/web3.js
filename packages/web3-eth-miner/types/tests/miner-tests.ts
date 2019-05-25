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
 * @file miner-tests.ts
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import {Miner} from 'web3-eth-miner';

const miner = new Miner('http://localhost:7545');

// $ExpectType Promise<boolean>
miner.setEtherbase('0x3d80b31a78c30fc628f20b2c89d7ddbf6e53cedc');
// $ExpectType Promise<boolean>
miner.setEtherbase('0x3d80b31a78c30fc628f20b2c89d7ddbf6e53cedc', (error: Error, address: boolean) => {});

// $ExpectType Promise<boolean>
miner.setExtra('Hello world');
// $ExpectType Promise<boolean>
miner.setExtra('Hello world', (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
miner.setGasPrice('0x4a817c800');
// $ExpectType Promise<boolean>
miner.setGasPrice('0x4a817c800', (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
miner.startMining('0x1');
// $ExpectType Promise<boolean>
miner.startMining('0x1', (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
miner.stopMining();

// $ExpectType Promise<boolean>
miner.stopMining((error: Error, result: boolean) => {});
