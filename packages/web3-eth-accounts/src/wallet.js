/* eslint-disable no-underscore-dangle */

// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

import _ from 'lodash';

export default class Wallet {
    constructor (accounts) {
        this.length = 0;
        this.accounts = accounts;
        this.defaultKeyName = 'web3js_wallet';

        // add save and load in local storage if available
        if (typeof localStorage !== 'undefined') {
            this.save = this._save;
            this.load = this._load;
        }
    }

    create (numberOfAccounts, entropy) {
        let i;
        for (i = 0; i < numberOfAccounts; i += 1) {
            this.add(this.accounts.create(entropy).privateKey);
        }
        return this;
    }

    add (accountValue) {
        let account = accountValue;

        if (_.isString(account)) {
            account = this.accounts.privateKeyToAccount(account);
        }

        if (!this[account.address]) {
            account = this.accounts.privateKeyToAccount(account.privateKey);
            account.index = this.length;

            this[this.length] = account;
            this[account.address] = account;
            this[account.address.toLowerCase()] = account;

            this.length += 1;

            return account;
        }
        return this[account.address];
    }

    remove (addressOrIndex) {
        const account = this[addressOrIndex];

        if (account) {
            // address
            this[account.address].privateKey = null;
            delete this[account.address];
            // address lowercase
            this[account.address.toLowerCase()].privateKey = null;
            delete this[account.address.toLowerCase()];
            // index
            this[account.index].privateKey = null;
            delete this[account.index];

            this.length -= 1;

            return true;
        }
        return false;
    }

    clear () {
        const { length } = this;
        let i;
        for (i = 0; i < length; i += 1) {
            this.remove(i);
        }
        return this;
    }

    encrypt (password, options) {
        const accounts = [];
        let i;
        for (i = 0; i < this.length; i += 1) {
            accounts[i] = this[i].encrypt(password, options);
        }
        return accounts;
    }


    decrypt (encryptedWallet, password) {
        encryptedWallet.forEach((keystore) => {
            const account = this.accounts.decrypt(keystore, password);
            if (account) {
                this.add(account);
            } else {
                throw new Error('Couldn\'t decrypt accounts. Password wrong?');
            }
        });
        return this;
    }

    _save (password, keyName) {
        localStorage.setItem(
            keyName || this.defaultKeyName,
            JSON.stringify(this.encrypt(password)),
        );
        return true;
    }

    _load (password, keyName) {
        let keystore = localStorage.getItem(keyName || this.defaultKeyName);

        if (keystore) {
            try {
                keystore = JSON.parse(keystore);
            } catch (e) {} // eslint-disable-line no-empty
        }

        return this.decrypt(keystore || [], password);
    }
}
