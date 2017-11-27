import { assert } from 'chai';
import Eth from '../packages/web3-eth';
import FakeIpcProvider from './helpers/FakeIpcProvider';

const abi = [
    {
        constant: true,
        inputs: [
            {
                name: 'a',
                type: 'bytes32'
            },
            {
                name: 'b',
                type: 'bytes32'
            }
        ],
        name: 'takesTwoBytes32',
        outputs: [
            {
                name: '',
                type: 'bytes32'
            }
        ],
        payable: false,
        type: 'function',
        stateMutability: 'view'
    }
];

describe('contract', () => {
    describe('method.encodeABI', () => {
        it('should handle bytes32 arrays that only contain 1 byte', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const result = contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(2)), '0x'.concat('b'.repeat(2))).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aa00000000000000000000000000000000000000000000000000000000000000',
                'bb00000000000000000000000000000000000000000000000000000000000000'
            ].join(''));
        });

        it('should handle bytes32 arrays that are short 1 byte', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const result = contract.methods.takesTwoBytes32('0x'.concat('a'.repeat(62)), '0x'.concat('b'.repeat(62))).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00',
                'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'
            ].join(''));
        });

        it('should throw an exception on bytes32 arrays that have an invalid length', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const test = () => {
                const param1 = `0x${'a'.repeat(63)}`;
                const param2 = `0x${'b'.repeat(63)}`;
                contract.methods.takesTwoBytes32(param1, param2).encodeABI();
            };

            assert.throws(test, 'Given parameter bytes has an invalid length: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"');
        });

        it('should handle bytes32 arrays that are full', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const param1 = `0x${'a'.repeat(64)}`;
            const param2 = `0x${'b'.repeat(64)}`;
            const result = contract.methods.takesTwoBytes32(param1, param2).encodeABI();

            assert.equal(result, [
                '0x1323517e',
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
            ].join(''));
        });

        it('should throw an exception on bytes32 arrays that are too long', () => {
            const provider = new FakeIpcProvider();
            const eth = new Eth(provider);

            const contract = new eth.Contract(abi);

            const test = () => {
                const param1 = `0x${'a'.repeat(66)}`;
                const param2 = `0x${'b'.repeat(66)}`;
                contract.methods.takesTwoBytes32(param1, param2).encodeABI();
            };

            assert.throws(test, 'Given parameter bytes is too long: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"');
        });
    });
});
