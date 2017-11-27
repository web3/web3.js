import { assert } from 'chai';
import Eth from '../packages/web3-eth';

const eth = new Eth();

const tests = [
    {
        direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
        address: '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8' // checksum address
    },
    {
        direct: 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO',
        address: '0x11c5496AEE77c1bA1f0854206a26dDa82A81D6D8'
    },
    {
        direct: 'XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3',
        address: '0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B' // checksum address
    },
    {
        error: true,
        direct: 'XE81ETHXREGGAVOFYORK',
        address: '0xHELLO' // checksum address
    }
];

describe('eth', () => {
    describe('Iban', () => {
        tests.forEach((test) => {
            it(`toAddress() should transform iban to address: ${test.address}`, () => {
                if (test.error) {
                    assert.throws(eth.Iban.toAddress.bind(eth.Iban, test.direct));
                } else {
                    assert.deepEqual(eth.Iban.toAddress(test.direct), test.address);
                }
            });
            it(`toIban() should transform address to iban: ${test.address}`, () => {
                if (test.error) {
                    assert.throws(eth.Iban.toIban.bind(eth, test.address));
                } else {
                    assert.deepEqual(eth.Iban.toIban(test.address), test.direct);
                }
            });
        });
    });
});
