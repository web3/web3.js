import { assert } from 'chai';
import Accounts from './../packages/web3-eth-accounts/src/index.js';
import Web3 from '../packages/web3';

const web3 = new Web3();

const tests = [
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data',
        // signature done with personal_sign
        signature: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b'
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data!%$$%&@*',
        // signature done with personal_sign
        signature: '0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e12866b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c1c'
    }
];

describe('eth', () => {
    describe('accounts', () => {
        tests.forEach((test) => {
            it('sign data using a string', () => {
                const ethAccounts = new Accounts();

                const data = ethAccounts.sign(test.data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it('sign data using a utf8 encoded hex string', () => {
                const ethAccounts = new Accounts();

                const data = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it('recover signature using a string', () => {
                const ethAccounts = new Accounts();

                const address = ethAccounts.recover(test.data, test.signature);

                assert.equal(address, test.address);
            });

            it('recover signature using a hashed message', () => {
                const ethAccounts = new Accounts();

                const hash = ethAccounts.hashMessage(test.data);
                const address = ethAccounts.recover(hash, test.signature);

                assert.equal(address, test.address);
            });

            it('recover signature (pre encoded) using a signature object', () => {
                const ethAccounts = new Accounts();

                const sig = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);
                const address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it('recover signature using a signature object', () => {
                const ethAccounts = new Accounts();

                const sig = ethAccounts.sign(test.data, test.privateKey);
                const address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it('recover signature (pre encoded) using a hash and r s v values', () => {
                const ethAccounts = new Accounts();

                const sig = ethAccounts.sign(web3.utils.utf8ToHex(test.data), test.privateKey);
                const address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });

            it('recover signature using a hash and r s v values', () => {
                const ethAccounts = new Accounts();

                const sig = ethAccounts.sign(test.data, test.privateKey);
                const address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });
        });
    });
});
