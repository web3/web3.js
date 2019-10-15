/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Contract} from 'conflux-web-cfx-contract';

const contract = new Contract('http://localhost:500', []);

// $ExpectType string
contract.address;

// $ExpectType string
contract.options.address;

// $ExpectType string
contract.options.data;

// $ExpectType AbiModel
contract.jsonInterface;

// $ExpectType Contract
contract.clone();

// $ExpectType ContractSendMethod
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
});

// $ExpectType void
contract.once('MyEvent', {
    filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
    fromBlock: 0
}, (error, event) => { console.log(event); });

// $ExpectType void
contract.once('MyEvent', (error, event) => { console.log(event); });

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent');

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', {
    filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
    fromBlock: 0,
    toBlock: 'latest_state'
});

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', {});

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', {
    filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
    fromBlock: 0,
    toBlock: 'latest_state'
}, (error, events) => { console.log(events); });

// $ExpectType Promise<EventData[]>
contract.getPastEvents('MyEvent', (error, events) => { console.log(events); });

// $ExpectType Promise<number>
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).estimateGas();

// $ExpectType Promise<number>
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).estimateGas({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});

// $ExpectType Promise<number>
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).estimateGas((err: Error, gas: number) => { console.log(gas) });

// $ExpectType string
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).encodeABI();

// $ExpectType PromiEvent<Contract>
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'});

// $ExpectType PromiEvent<Contract>
contract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
}).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, (err: Error, contract: Contract) => { console.log(contract) });
