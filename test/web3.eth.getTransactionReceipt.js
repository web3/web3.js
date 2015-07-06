var chai = require('chai');
var web3 = require('../index');
var BigNumber = require('bignumber.js');
var testMethod = require('./helpers/test.method.js');

var method = 'getTransactionReceipt';

var txResult = {
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": "0x15df",
    "transactionHash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "transactionIndex":  "0x1",
    "contractAddress":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "cumulativeGasUsed":"0x7f110",
    "gasUsed": "0x7f110",
    "logs": [{
        transactionIndex: '0x3e8',
        logIndex: '0x3e8',
        blockNumber: '0x3e8',
        transactionHash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
        blockHash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
        data: '0x7b2274657374223a2274657374227',
        topics: ['0x68656c6c6f','0x6d79746f70696373']      
    },{
        transactionIndex: null,
        logIndex: null,
        blockNumber: null,
        transactionHash: null,
        blockHash: null,
        data: '0x7b2274657374223a2274657374227',
        topics: ['0x68656c6c6f','0x6d79746f70696373']                
    }]
};
var formattedTxResult = {
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": 5599,
    "transactionHash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "transactionIndex":  1,
    "contractAddress":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "cumulativeGasUsed": 520464,
    "gasUsed": 520464,
    "logs": [{
        transactionIndex: 1000,
        logIndex: 1000,
        blockNumber: 1000,
        transactionHash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
        blockHash: '0xd6960376d6c6dea93647383ffb245cfced97ccc5c7525397a543a72fdaea5265',
        data: '0x7b2274657374223a2274657374227',
        topics: ['0x68656c6c6f','0x6d79746f70696373']
    },{
        transactionIndex: null,
        logIndex: null,
        blockNumber: null,
        transactionHash: null,
        blockHash: null,
        data: '0x7b2274657374223a2274657374227',
        topics: ['0x68656c6c6f','0x6d79746f70696373']
    }]
};

var tests = [{
    args: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855'],
    formattedArgs: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855'],
    result: txResult,
    formattedResult: formattedTxResult,
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

