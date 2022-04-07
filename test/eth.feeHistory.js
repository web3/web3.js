var BigNumber = require('bignumber.js');

var testMethod = require('./helpers/test.method.js');

var method = 'getFeeHistory';
var methodCall = 'eth_feeHistory';

var tests = [
    {
        args: [4, "0xA30953", []],
        formattedArgs: ['0x4', "0xa30953", []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    },
    {
        args: ['0x4', 10684755, []],
        formattedArgs: ['0x4', "0xa30953", []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    },
    {
        args: [new BigNumber(4), '10684755', []],
        formattedArgs: ["0x4", "0xa30953", []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    },
    {
        args: [4, 'latest', []],
        formattedArgs: ["0x4", 'latest', []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    },
    {
        args: [4, 'earliest', []],
        formattedArgs: ["0x4", 'earliest', []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    },
    {
        args: [4, 'pending', []],
        formattedArgs: ['0x4', 'pending', []],
        result: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        formattedResult: {
            "baseFeePerGas": [
            "0xa",
            "0x9",
            "0x8",
            "0x9",
            "0x9"
            ],
            "gasUsedRatio": [
            0.003920375,
            0.002625,
            0.904999125,
            0.348347625
            ],
            "oldestBlock": 10684752
        },
        call: methodCall
    }
];


testMethod.runTests('eth', method, tests);

