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
 * @file contract-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ContractDefault, { Contract } from 'web3-eth-contract';

// $ExpectType Contract
const contract_default = new ContractDefault([]);

// $ExpectType Contract
const contract = new Contract([]);

// $ExpectType string | null
contract.defaultAccount;

// $ExpectType BlockNumber
contract.defaultBlock;

// $ExpectType Common
contract.defaultCommon;

// $ExpectType hardfork
contract.defaultHardfork;

// $ExpectType chain
contract.defaultChain;

// $ExpectType number
contract.transactionPollingTimeout;

// $ExpectType number
contract.transactionConfirmationBlocks;

// $ExpectType number
contract.transactionBlockTimeout;

// $ExpectType boolean
contract.handleRevert;

// $ExpectType string
contract.options.address;

// $ExpectType AbiItem[]
contract.options.jsonInterface;

// $ExpectType string | undefined
contract.options.from;

// $ExpectType number | undefined
contract.options.gas;

// $ExpectType string | undefined
contract.options.gasPrice;

// $ExpectType string | undefined
contract.options.data;

// $ExpectType Contract
contract.clone();

// $ExpectType ContractSendMethod
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
});

// $ExpectType void
contract.once(
    'MyEvent',
    {
        filter: {
            myIndexedParam: [20, 23],
            myOtherIndexedParam: '0x123456789...'
        },
        fromBlock: 0
    },
    (error, event) => {}
);

// $ExpectType void
contract.once('MyEvent', (error, event) => {});

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent');

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', {
    filter: { myIndexedParam: [20, 23], myOtherIndexedParam: '0x123456789...' },
    fromBlock: 0,
    toBlock: 'latest'
});

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', {});

// $ExpectType Promise<EventData[]>
contract.getPastEvents(
    'MyEvent',
    {
        filter: {
            myIndexedParam: [20, 23],
            myOtherIndexedParam: '0x123456789...'
        },
        fromBlock: 0,
        toBlock: 'latest'
    },
    (error, events) => {}
);

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', (error, events) => {});

// $ExpectType Promise<number>
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .estimateGas();

// $ExpectType Promise<number>
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .estimateGas({ from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' });

// $ExpectType Promise<number>
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .estimateGas((err: Error, gas: number) => {});

// $ExpectType string
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .encodeABI();

// $ExpectType PromiEvent<Contract>
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .send({ from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' });

// $ExpectType PromiEvent<Contract>
contract
    .deploy({
        data: '0x12345...',
        arguments: [123, 'My String']
    })
    .send(
        { from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe' },
        (err: Error, transactionHash: string) => {}
    );
