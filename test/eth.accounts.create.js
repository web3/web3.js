import _ from 'lodash';
import { assert } from 'chai';
import ethereumWallet from 'ethereumjs-wallet';
import Accounts from './../packages/web3-eth-accounts';

describe('eth', () => {
    describe('accounts', () => {
        _.times(1000, () => {
            it('create eth.account, and compare to ethereumjs-wallet', () => {
                const ethAccounts = new Accounts();

                // create account
                const acc = ethAccounts.create();

                // create ethereumjs-wallet account
                const ethWall = ethereumWallet.fromPrivateKey(Buffer.from(acc.privateKey.replace('0x', ''), 'hex'));

                // compare addresses
                assert.equal(acc.address, ethWall.getChecksumAddressString());
            });
        });
    });
});
