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
 * @file eth-tests.ts
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

import {
    Log,
    RLPEncodedTransaction,
    Transaction,
    TransactionReceipt
} from 'web3-core';
import { BlockTransactionObject, BlockTransactionString, BlockHeader, Eth, GetProof, Syncing } from 'web3-eth';

// $ExpectType Eth
const eth_empty = new Eth();

// $ExpectType Eth
const eth = new Eth('http://localhost:8545');

// $ExpectType string | null
eth.defaultAccount;

// $ExpectType string | number
eth.defaultBlock;

// $ExpectType Common
eth.defaultCommon;

// $ExpectType hardfork
eth.defaultHardfork;

// $ExpectType chain
eth.defaultChain;

// $ExpectType number
eth.transactionPollingTimeout;

// $ExpectType number
eth.transactionConfirmationBlocks;

// $ExpectType number
eth.transactionBlockTimeout;

// $ExpectType new (jsonInterface: AbiItem | AbiItem[], address?: string | undefined, options?: ContractOptions | undefined) => Contract
eth.Contract;

// $ExpectType new (iban: string) => Iban
eth.Iban;

// $ExpectType Personal
eth.personal;

// $ExpectType Accounts
eth.accounts;

// $ExpectType any
eth.extend({property: 'test', methods: [{name: 'method', call: 'method'}]});

// $ExpectType Ens
eth.ens;

// $ExpectType AbiCoder
eth.abi;

// $ExpectType Network
eth.net;

// $ExpectType void
eth.clearSubscriptions(() => {});

// $ExpectType Subscription<Log>
eth.subscribe('logs', {});
// $ExpectType Subscription<Log>
eth.subscribe('logs', {}, (error: Error, log: Log) => {});

// $ExpectType Subscription<Syncing>
eth.subscribe('syncing');
// $ExpectType Subscription<Syncing>
eth.subscribe(
    'syncing',
    (error: Error, result: Syncing) => {}
);

// $ExpectType Subscription<BlockHeader>
eth.subscribe('newBlockHeaders');
// $ExpectType Subscription<BlockHeader>
eth.subscribe(
    'newBlockHeaders',
    (error: Error, blockHeader: BlockHeader) => {}
);

// $ExpectType Subscription<string>
eth.subscribe('pendingTransactions');
// $ExpectType Subscription<string>
eth.subscribe(
    'pendingTransactions',
    (error: Error, transactionHash: string) => {}
);

// $ExpectType provider
eth.currentProvider;

// $ExpectType any
eth.givenProvider;

// $ExpectType string | null
eth.defaultAccount;

// $ExpectType string | number
eth.defaultBlock;

// $ExpectType boolean
eth.setProvider('https://localhost:2100');

// $ExpectType BatchRequest
new eth.BatchRequest();

// $ExpectType Promise<string>
eth.getProtocolVersion();
// $ExpectType Promise<string>
eth.getProtocolVersion((error: Error, protocolVersion: string) => {});

// $ExpectType Promise<boolean | Syncing>
eth.isSyncing();
// $ExpectType Promise<boolean | Syncing>
eth.isSyncing((error: Error, syncing: Syncing) => {});

// $ExpectType Promise<string>
eth.getCoinbase();
// $ExpectType Promise<string>
eth.getCoinbase((error: Error, coinbaseAddress: string) => {});

// $ExpectType Promise<boolean>
eth.isMining();
// $ExpectType Promise<boolean>
eth.isMining((error: Error, mining: boolean) => {});

// $ExpectType Promise<number>
eth.getHashrate();
// $ExpectType Promise<number>
eth.getHashrate((error: Error, hashes: number) => {});

// $ExpectType Promise<string>
eth.getNodeInfo();
// $ExpectType Promise<string>
eth.getNodeInfo((error: Error, version: string) => {});

// $ExpectType Promise<number>
eth.getChainId();
// $ExpectType Promise<number>
eth.getChainId((error: Error, chainId: number) => {});

// $ExpectType Promise<string>
eth.getGasPrice();
// $ExpectType Promise<string>
eth.getGasPrice((error: Error, gasPrice: string) => {});

// $ExpectType Promise<string[]>
eth.getAccounts();
// $ExpectType Promise<string[]>
eth.getAccounts((error: Error, accounts: string[]) => {});

// $ExpectType Promise<number>
eth.getBlockNumber();
// $ExpectType Promise<number>
eth.getBlockNumber((error: Error, blockNumber: number) => {});

// $ExpectType Promise<string>
eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<string>
eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<string>
eth.getBalance(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    '1000',
    (error: Error, balance: string) => {}
);
// $ExpectType Promise<string>
eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<string>
eth.getBalance(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    1000,
    (error: Error, balance: string) => {}
);

// $ExpectType Promise<string>
eth.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2);
// $ExpectType Promise<string>
eth.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, '1000');
// $ExpectType Promise<string>
eth.getStorageAt(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    2,
    '1000',
    (error: Error, balance: string) => {}
);
// $ExpectType Promise<string>
eth.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, 1000);
// $ExpectType Promise<string>
eth.getStorageAt(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    2,
    1000,
    (error: Error, balance: string) => {}
);

// $ExpectType Promise<string>
eth.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<string>
eth.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<string>
eth.getCode(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    '1000',
    (error: Error, balance: string) => {}
);
// $ExpectType Promise<string>
eth.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<string>
eth.getCode(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    1000,
    (error: Error, balance: string) => {}
);

// $ExpectType Promise<BlockTransactionString>
eth.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<BlockTransactionString>
eth.getBlock(345);
// $ExpectType Promise<BlockTransactionObject>
eth.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', true);
// $ExpectType Promise<BlockTransactionString>
eth.getBlock(345);
// $ExpectType Promise<BlockTransactionObject>
eth.getBlock(345, true);
// $ExpectType Promise<BlockTransactionString>
eth.getBlock(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, block: BlockTransactionString) => {}
);
// $ExpectType Promise<BlockTransactionString>
eth.getBlock(345, (error: Error, block: BlockTransactionString) => {});
// $ExpectType Promise<BlockTransactionObject>
eth.getBlock(345, true, (error: Error, block: BlockTransactionObject) => {});
// $ExpectType Promise<BlockTransactionObject>
eth.getBlock(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    true,
    (error: Error, block: BlockTransactionObject) => {}
);

// $ExpectType Promise<number>
eth.getBlockTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, numberOfTransactions: number) => {}
);
// $ExpectType Promise<number>
eth.getBlockTransactionCount(345);
// $ExpectType Promise<number>
eth.getBlockTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, numberOfTransactions: number) => {}
);
// $ExpectType Promise<number>
eth.getBlockTransactionCount(345);

// $ExpectType Promise<BlockTransactionString>
eth.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4);
// $ExpectType Promise<BlockTransactionString>
eth.getUncle(345, 4);
// $ExpectType Promise<BlockTransactionObject>
eth.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, true);
// $ExpectType Promise<BlockTransactionString>
eth.getUncle(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    4,
    (error: Error, uncle: {}) => {}
);
// $ExpectType Promise<BlockTransactionString>
eth.getUncle(345, 4, (error: Error, uncle: {}) => {});
// $ExpectType Promise<BlockTransactionObject>
eth.getUncle(345, 4, true);
// $ExpectType Promise<BlockTransactionObject>
eth.getUncle(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    4,
    true,
    (error: Error, uncle: {}) => {}
);
// $ExpectType Promise<BlockTransactionObject>
eth.getUncle(345, 4, true, (error: Error, uncle: {}) => {});

// $ExpectType Promise<Transaction>
eth.getTransaction('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<Transaction>
eth.getTransaction(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, transaction: Transaction) => {}
);

// $ExpectType Promise<Transaction>
eth.getTransactionFromBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2);
// $ExpectType Promise<Transaction>
eth.getTransactionFromBlock(345, 2);
// $ExpectType Promise<Transaction>
eth.getTransactionFromBlock(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    2,
    (error: Error, transaction: Transaction) => {}
);
// $ExpectType Promise<Transaction>
eth.getTransactionFromBlock(
    345,
    2,
    (error: Error, transaction: Transaction) => {}
);

// $ExpectType Promise<TransactionReceipt>
eth.getTransactionReceipt('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<TransactionReceipt>
eth.getTransactionReceipt(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, transactionReceipt: TransactionReceipt) => {}
);

// $ExpectType Promise<number>
eth.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<number>
eth.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<number>
eth.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<number>
eth.getTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, count: number) => {}
);
// $ExpectType Promise<number>
eth.getTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, count: number) => {}
);
// $ExpectType Promise<number>
eth.getTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    1000,
    (error: Error, count: number) => {}
);
// $ExpectType Promise<number>
eth.getTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    '1000',
    (error: Error, count: number) => {}
);

const code = '603d80600c6000396000f3007c0';

// $ExpectType PromiEvent<TransactionReceipt>
eth.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    data: 'code'
});
// $ExpectType PromiEvent<TransactionReceipt>
eth.sendTransaction(
    {
        from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        data: 'code'
    },
    (error: Error, hash: string) => {}
);

// $ExpectType PromiEvent<TransactionReceipt>
eth.sendSignedTransaction('0xf889808609184e72a0008227109');
// $ExpectType PromiEvent<TransactionReceipt>
eth.sendSignedTransaction(
    '0xf889808609184e72a0008227109',
    (error: Error, hash: string) => {}
);

// $ExpectType Promise<string>
eth.sign('Hello world', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe');
// $ExpectType Promise<string>
eth.sign('Hello world', 3);
// $ExpectType Promise<string>
eth.sign(
    'Hello world',
    '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    (error: Error, signature: string) => {}
);
// $ExpectType Promise<string>
eth.sign('Hello world', 3, (error: Error, signature: string) => {});

// $ExpectType Promise<RLPEncodedTransaction>
eth.signTransaction({
    from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    gasPrice: '20000000000',
    gas: '21000',
    to: '0x3535353535353535353535353535353535353535',
    value: '1000000000000000000',
    data: ''
});
// $ExpectType Promise<RLPEncodedTransaction>
eth.signTransaction(
    {
        from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        gasPrice: '20000000000',
        gas: '21000',
        to: '0x3535353535353535353535353535353535353535',
        value: '1000000000000000000',
        data: ''
    },
    '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0'
);
// $ExpectType Promise<RLPEncodedTransaction>
eth.signTransaction(
    {
        from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        gasPrice: '20000000000',
        gas: '21000',
        to: '0x3535353535353535353535353535353535353535',
        value: '1000000000000000000',
        data: ''
    },
    (error: Error, signedTransaction: RLPEncodedTransaction) => {}
);
// $ExpectType Promise<RLPEncodedTransaction>
eth.signTransaction(
    {
        from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        gasPrice: '20000000000',
        gas: '21000',
        to: '0x3535353535353535353535353535353535353535',
        value: '1000000000000000000',
        data: ''
    },
    '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    (error: Error, signedTransaction: RLPEncodedTransaction) => {}
);

// $ExpectType Promise<string>
eth.call({
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
    data:
        '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
});
// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100
);
// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    '100'
);
// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    (error: Error, data: string) => {}
);
// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    '100',
    (error: Error, data: string) => {}
);
// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100,
    (error: Error, data: string) => {}
);

// $ExpectType Promise<string>
eth.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100,
    (error: Error, data: string) => {}
);

// $ExpectType Promise<number>
eth.estimateGas({
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    data:
        '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
});
// $ExpectType Promise<number>
eth.estimateGas(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
        data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    (error: Error, gas: number) => {}
);

// $ExpectType Promise<Log[]>
eth.getPastLogs({
    address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
});
// $ExpectType Promise<Log[]>
eth.getPastLogs(
    {
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
        topics: [
            '0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234'
        ]
    },
    (error: Error, logs: Log[]) => {}
);

// $ExpectType Promise<string[]>
eth.getWork();
// $ExpectType Promise<string[]>
eth.getWork((error: Error, result: string[]) => {});

// $ExpectType Promise<boolean>
eth.submitWork([
    '0x0000000000000001',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000'
]);

// $ExpectType Promise<boolean>
eth.submitWork(
    [
        '0x0000000000000001',
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000'
    ],
    (error: Error, result: boolean) => {}
);

// $ExpectType Promise<Transaction[]>
eth.getPendingTransactions();

// $ExpectType Promise<Transaction[]>
eth.getPendingTransactions((error: Error, result: Transaction[]) => {});

// $ExpectType Promise<GetProof>
eth.getProof(
    '0x1234567890123456789012345678901234567890',
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
    ],
    'latest'
);

// $ExpectType Promise<GetProof>
eth.getProof(
    '0x1234567890123456789012345678901234567890',
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
    ],
    'latest',
    (error: Error, result: GetProof) => {}
);

// $ExpectType Promise<GetProof>
eth.getProof(
    '0x1234567890123456789012345678901234567890',
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
    ],
    10
);

// $ExpectType Promise<GetProof>
eth.getProof(
    '0x1234567890123456789012345678901234567890',
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
    ],
    10,
    (error: Error, result: GetProof) => {}
);
