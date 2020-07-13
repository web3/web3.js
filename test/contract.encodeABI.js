var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');
var sha3 = require('../packages/web3-utils').sha3;
var FakeIpcProvider = require('./helpers/FakeIpcProvider');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

var abi = [
    {
        constant: true,
        inputs: [
            {
                name: "a",
                type: "bytes32"
            },
            {
                name: "b",
                type: "bytes32"
            }
        ],
        name: "takesTwoBytes32",
        outputs: [
            {
                name: "",
                type: "bytes32"
            }
        ],
        payable: false,
        type: "function",
        stateMutability: "view",
        gas: 175875
    }
];

describe('contract', function () {
    describe('method.encodeABI', function () {
        it('should handle bytes32 arrays that only contain 1 byte', function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);

            var contract = new eth.Contract(abi);

            var result = contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(2)), '0x'.concat('b'.repeat(2))).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aa00000000000000000000000000000000000000000000000000000000000000',
                'bb00000000000000000000000000000000000000000000000000000000000000'
            ].join(''));
        });

        it('should handle bytes32 arrays that are short 1 byte', function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);

            var contract = new eth.Contract(abi);

            var result = contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(62)), '0x'.concat('b'.repeat(62))).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00',
                'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'
            ].join(''));
        });

        // it('should throw an exception on bytes32 arrays that have an invalid length', function () {
        //     var provider = new FakeIpcProvider();
        //     var eth = new Eth(provider);
        //
        //     var contract = new eth.Contract(abi);
        //
        //     var test = function () {
        //         return contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(63)), '0x'.concat('b'.repeat(63))).encodeABI();
        //     };
        //
        //     assert.throws(test, 'Given parameter bytes has an invalid length: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"');
        // });

        it('should handle bytes32 arrays that are full', function () {
            var provider = new FakeIpcProvider();
            var eth = new Eth(provider);

            var contract = new eth.Contract(abi);

            var result = contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(64)), '0x'.concat('b'.repeat(64))).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
            ].join(''));
        });

        // it('should throw an exception on bytes32 arrays that are too long', function () {
        //     var provider = new FakeIpcProvider();
        //     var eth = new Eth(provider);
        //
        //     var contract = new eth.Contract(abi);
        //
        //     var test = function() {
        //         contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(66)), '0x'.concat('b'.repeat(66))).encodeABI();
        //     };
        //
        //     assert.throws(test, 'Given parameter bytes is too long: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"');
        // });
    });
});
