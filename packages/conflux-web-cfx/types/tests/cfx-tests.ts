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

import {Log, Transaction, TransactionReceipt, RLPEncodedTransaction} from 'conflux-web-core';
import {Cfx, BlockHeader, Syncing, Block} from 'conflux-web-cfx';

const cfx = new Cfx('http://localhost:8545');

// $ExpectType new (jsonInterface: AbiItem | AbiItem[], address?: string | undefined, options?: ContractOptions | undefined) => Contract
cfx.Contract;

// $ExpectType Accounts
cfx.accounts;

// $ExpectType AbiCoder
cfx.abi;

// $ExpectType Network
cfx.net;

cfx.clearSubscriptions();

// $ExpectType Subscription<Log>
cfx.subscribe('logs');

// $ExpectType Subscription<Log>
cfx.subscribe('logs', {});
// $ExpectType Subscription<Log>
cfx.subscribe('logs', {}, (error: Error, log: Log) => {});

// $ExpectType Subscription<Syncing>
cfx.subscribe('syncing');
// $ExpectType Subscription<Syncing>
cfx.subscribe('syncing', null, (error: Error, result: Syncing) => {});

// $ExpectType Subscription<BlockHeader>
cfx.subscribe('newBlockHeaders');
// $ExpectType Subscription<BlockHeader>
cfx.subscribe('newBlockHeaders', null, (error: Error, blockHeader: BlockHeader) => {});

// $ExpectType Subscription<string>
cfx.subscribe('pendingTransactions');
// $ExpectType Subscription<string>
cfx.subscribe('pendingTransactions', null, (error: Error, transactionHash: string) => {});

// $ExpectType Providers
Cfx.providers;

// $ExpectType any
cfx.givenProvider;

// $ExpectType BatchRequest
new cfx.BatchRequest();

// $ExpectType string | null
cfx.defaultAccount;

// $ExpectType string | number
cfx.defaultEpoch;

// $ExpectType HttpProvider | IpcProvider | WebsocketProvider | Web3EthereumProvider | CustomProvider
cfx.currentProvider;

// $ExpectType Promise<string>
cfx.getProtocolVersion();
// $ExpectType Promise<string>
cfx.getProtocolVersion((error: Error, protocolVersion: string) => {});

// $ExpectType Promise<boolean | Syncing>
cfx.isSyncing();
// $ExpectType Promise<boolean | Syncing>
cfx.isSyncing((error: Error, syncing: Syncing) => {});

// $ExpectType Promise<string>
cfx.getCoinbase();
// $ExpectType Promise<string>
cfx.getCoinbase((error: Error, coinbaseAddress: string) => {});

// $ExpectType Promise<boolean>
cfx.isMining();
// $ExpectType Promise<boolean>
cfx.isMining((error: Error, mining: boolean) => {});

// $ExpectType Promise<number>
cfx.getHashrate();
// $ExpectType Promise<number>
cfx.getHashrate((error: Error, hashes: number) => {});

// $ExpectType Promise<string>
cfx.getGasPrice();
// $ExpectType Promise<string>
cfx.getGasPrice((error: Error, gasPrice: string) => {});

// $ExpectType Promise<string[]>
cfx.getAccounts();
// $ExpectType Promise<string[]>
cfx.getAccounts((error: Error, accounts: string[]) => {});

// $ExpectType Promise<number>
cfx.getBlockNumber();
// $ExpectType Promise<number>
cfx.getBlockNumber((error: Error, blockNumber: number) => {});

// $ExpectType Promise<string>
cfx.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<string>
cfx.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<string>
cfx.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000', (error: Error, balance: string) => {});
// $ExpectType Promise<string>
cfx.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<string>
cfx.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000, (error: Error, balance: string) => {});

// $ExpectType Promise<string>
cfx.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2);
// $ExpectType Promise<string>
cfx.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, '1000');
// $ExpectType Promise<string>
cfx.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, '1000', (error: Error, balance: string) => {});
// $ExpectType Promise<string>
cfx.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, 1000);
// $ExpectType Promise<string>
cfx.getStorageAt('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2, 1000, (error: Error, balance: string) => {});

// $ExpectType Promise<string>
cfx.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<string>
cfx.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<string>
cfx.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000', (error: Error, balance: string) => {});
// $ExpectType Promise<string>
cfx.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<string>
cfx.getCode('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000, (error: Error, balance: string) => {});

// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<Block>
cfx.getBlock(345);
// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', true);
// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', false);
// $ExpectType Promise<Block>
cfx.getBlock(345);
// $ExpectType Promise<Block>
cfx.getBlock(345, true);
// $ExpectType Promise<Block>
cfx.getBlock(345, false);
// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', (error: Error, block: Block) => {});
// $ExpectType Promise<Block>
cfx.getBlock(345, (error: Error, block: Block) => {});
// $ExpectType Promise<Block>
cfx.getBlock(345, true, (error: Error, block: Block) => {});
// $ExpectType Promise<Block>
cfx.getBlock(345, false, (error: Error, block: Block) => {});
// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', true, (error: Error, block: Block) => {});
// $ExpectType Promise<Block>
cfx.getBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', false, (error: Error, block: Block) => {});

// $ExpectType Promise<number>
cfx.getBlockTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, numberOfTransactions: number) => {}
);
// $ExpectType Promise<number>
cfx.getBlockTransactionCount(345);
// $ExpectType Promise<number>
cfx.getBlockTransactionCount(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, numberOfTransactions: number) => {}
);
// $ExpectType Promise<number>
cfx.getBlockTransactionCount(345);

// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4);
// $ExpectType Promise<Block>
cfx.getUncle(345, 4);
// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, true);
// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, false);
// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, (error: Error, uncle: {}) => {});
// $ExpectType Promise<Block>
cfx.getUncle(345, 4, (error: Error, uncle: {}) => {});
// $ExpectType Promise<Block>
cfx.getUncle(345, 4, true);
// $ExpectType Promise<Block>
cfx.getUncle(345, 4, false);
// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, true, (error: Error, uncle: {}) => {});
// $ExpectType Promise<Block>
cfx.getUncle('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 4, false, (error: Error, uncle: {}) => {});
// $ExpectType Promise<Block>
cfx.getUncle(345, 4, true, (error: Error, uncle: {}) => {});
// $ExpectType Promise<Block>
cfx.getUncle(345, 4, false, (error: Error, uncle: {}) => {});

// $ExpectType Promise<Transaction>
cfx.getTransaction('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<Transaction>
cfx.getTransaction('0x407d73d8a49eeb85d32cf465507dd71d507100c1', (error: Error, transaction: Transaction) => {});

// $ExpectType Promise<Transaction>
cfx.getTransactionFromBlock('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 2);
// $ExpectType Promise<Transaction>
cfx.getTransactionFromBlock(345, 2);
// $ExpectType Promise<Transaction>
cfx.getTransactionFromBlock(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    2,
    (error: Error, transaction: Transaction) => {}
);
// $ExpectType Promise<Transaction>
cfx.getTransactionFromBlock(345, 2, (error: Error, transaction: Transaction) => {});

// $ExpectType Promise<TransactionReceipt>
cfx.getTransactionReceipt('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<TransactionReceipt>
cfx.getTransactionReceipt(
    '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
    (error: Error, transactionReceipt: TransactionReceipt) => {}
);

// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1');
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000);
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000');
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', (error: Error, count: number) => {});
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', (error: Error, count: number) => {});
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', 1000, (error: Error, count: number) => {});
// $ExpectType Promise<number>
cfx.getTransactionCount('0x407d73d8a49eeb85d32cf465507dd71d507100c1', '1000', (error: Error, count: number) => {});

const code = '603d80600c6000396000f3007c0';

// $ExpectType PromiEvent<TransactionReceipt>
cfx.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    data: 'code'
});
// $ExpectType PromiEvent<TransactionReceipt>
cfx.sendTransaction(
    {
        from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        data: 'code'
    },
    (error: Error, hash: string) => {}
);

// $ExpectType PromiEvent<TransactionReceipt>
cfx.sendSignedTransaction('0xf889808609184e72a0008227109');
// $ExpectType PromiEvent<TransactionReceipt>
cfx.sendSignedTransaction('0xf889808609184e72a0008227109', (error: Error, gas: string) => {});

// $ExpectType Promise<string>
cfx.sign('Hello world', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe');
// $ExpectType Promise<string>
cfx.sign('Hello world', 3);
// $ExpectType Promise<string>
cfx.sign('Hello world', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', (error: Error, signature: string) => {});
// $ExpectType Promise<string>
cfx.sign('Hello world', 3, (error: Error, signature: string) => {});

// $ExpectType Promise<RLPEncodedTransaction>
cfx.signTransaction({
    from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    gasPrice: '20000000000',
    gas: '21000',
    to: '0x3535353535353535353535353535353535353535',
    value: '1000000000000000000',
    data: ''
});
// $ExpectType Promise<RLPEncodedTransaction>
cfx.signTransaction(
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
cfx.signTransaction(
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
cfx.signTransaction(
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
cfx.call({
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
    data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
});
// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100
);
// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    '100'
);
// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    (error: Error, data: string) => {}
);
// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    '100',
    (error: Error, data: string) => {}
);
// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100,
    (error: Error, data: string) => {}
);

// $ExpectType Promise<string>
cfx.call(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    100,
    (error: Error, data: string) => {}
);

// $ExpectType Promise<number>
cfx.estimateGas({
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
});
// $ExpectType Promise<number>
cfx.estimateGas(
    {
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
    },
    (error: Error, gas: number) => {}
);

// $ExpectType Promise<Log[]>
cfx.getPastLogs({
    address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
});
// $ExpectType Promise<Log[]>
cfx.getPastLogs(
    {
        address: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
        topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
    },
    (error: Error, logs: Log[]) => {}
);

// $ExpectType Promise<string[]>
cfx.getWork();
// $ExpectType Promise<string[]>
cfx.getWork((error: Error, result: string[]) => {});

// $ExpectType Promise<boolean>
cfx.submitWork([
    '0x0000000000000001',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000'
]);

// $ExpectType Promise<boolean>
cfx.submitWork(
    [
        '0x0000000000000001',
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000'
    ],
    (error: Error, result: boolean) => {}
);
