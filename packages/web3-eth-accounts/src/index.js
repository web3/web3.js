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
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var _ = require("underscore");
var Promise = require('bluebird');
var EthFP = require("ethfp");
var utils = require('web3-utils');
var helpers = require('web3-core-helpers');


var Accounts = function Accounts(eth) {

    if (eth) {
        this.eth = (eth.eth) ? eth.eth : eth;
    }
    this.wallet = new Wallet(this);
};

Accounts.prototype._addAccountFunctions = function (account) {
    var _this = this;

    // add sign functions
    account.signTransaction = function signTransaction(tx, callback) {
        return _this.signTransaction(tx, account.privateKey, callback);
    };
    account.sign = function sign(data) {
        return _this.sign(data, account.privateKey);
    };

    return account;
};

Accounts.prototype.create = function create(entropy) {
    return this._addAccountFunctions(EthFP.Account.create(entropy || utils.randomHex(32)));
};

Accounts.prototype.privateKeyToAccount = function privateKeyToAccount(privateKey) {
    return this._addAccountFunctions(EthFP.Account.fromPrivate(privateKey));
};

Accounts.prototype.signTransaction = function signTransaction(tx, privateKey, callback) {
    var _this = this;

    function signed (tx) {

        if (!tx.gas && !tx.gasLimit) {
            throw new Error('"gas" is missing');
        }

        var transaction = {
            nonce: utils.numberToHex(tx.nonce),
            to: tx.to ? helpers.formatters.inputAddressFormatter(tx.to) : '0x',
            data: tx.data || '0x',
            value: tx.value ? utils.numberToHex(tx.value) : "0x",
            gas: utils.numberToHex(tx.gasLimit || tx.gas),
            gasPrice: utils.numberToHex(tx.gasPrice),
            chainId: utils.numberToHex(tx.chainId)
        };



        var hash = EthFP.Hash.keccak256(EthFP.Account.transactionSigningData(transaction));
        var rawTransaction = EthFP.Account.signTransaction(transaction, privateKey);
        var values = EthFP.RLP.decode(rawTransaction);
        var result = {
            messageHash: hash,
            v: values[6],
            r: values[7],
            s: values[8],
            rawTransaction: rawTransaction
        };
        if (_.isFunction(callback)) {
            callback(null, result);
        }
        return result;
    }

    // Returns synchronously if nonce, chainId and price are provided
    if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
        return signed(tx);
    }

    if (!_this || !_this.eth || !_this.eth.net) {
        return Promise.reject(new Error('The Eth package is set bound. Please set using "accounts.eth = eth", or provide "nonce", "chainId" and "gasPrice" in the transaction yourself.'));
    }

    // Otherwise, get the missing info from the Ethereum Node
    return Promise.all([
        tx.chainId || _this.eth.net.getId(),
        tx.gasPrice || _this.eth.getGasPrice(),
        tx.nonce || _this.eth.getTransactionCount(_this.privateKeyToAccount(privateKey).address)
    ]).then(function (args) {
        return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
    });
};

Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx) {
    return EthFP.Account.recoverTransaction(rawTx);
};

Accounts.prototype.hashMessage = function hashMessage(data) {
    var message = utils.isHex(data) ? utils.hexToUtf8(data) : data;
    var ethMessage = "\x19Ethereum Signed Message:\n" + message.length + message;
    return EthFP.Hash.keccak256s(ethMessage);
};

Accounts.prototype.sign = function sign(data, privateKey) {

    var hash = this.hashMessage(data);
    var signature = EthFP.Account.sign(hash, privateKey);
    var vrs = EthFP.Account.decodeSignature(signature);
    return {
        message: data,
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
};

Accounts.prototype.recover = function recover(hash, signature) {

    if (_.isObject(hash)) {
        return this.recover(hash.messageHash, EthFP.Account.encodeSignature([hash.v, hash.r, hash.s]));
    }

    if (!utils.isHex(hash)) {
        hash = this.hashMessage(hash);
    }

    if (arguments.length === 4) {
        return this.recover(hash, EthFP.Account.encodeSignature([].slice.call(arguments, 1, 4))); // v, r, s
    }
    return EthFP.Account.recover(hash, signature);
};

// Accounts.prototype.decrypt = function decrypt(jsonString, password) {
//     return this.privateKeyToAccount("0x" + wallet.fromV3(jsonString, password)._privKey.toString("hex"));
// };
//
// Accounts.prototype.encrypt = function encrypt(privateKey, password) {
//     return JSON.stringify(this.wallet.fromPrivateKey(utils.utf8ToHex(privateKey)).toV3(password));
// };


// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet(accounts) {
    this.length = 0;
    this._accounts = accounts;
}

Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(this._accounts.create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function (account) {

    if (_.isString(account)) {
        account = this._accounts.privateKeyToAccount(account);
    }
    if (!this[account.address]) {
        account = this._accounts.privateKeyToAccount(account.privateKey);
        account.index = this.length;

        this[this.length] = account;
        this[account.address] = account;
        this[account.address.toLowerCase()] = account;

        this.length++;

        return account;
    } else {
        return this[account.address];
    }
};

Wallet.prototype.remove = function (addressOrIndex) {
    var account = this[addressOrIndex];

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

        this.length--;

        return true;
    } else {
        return false;
    }
};

Wallet.prototype.clear = function () {
    var length = this.length;
    for (var i = 0; i < length; i++) {
        this.remove(i);
    }

    return this;
};

// TODO encrypt!
// Wallet.prototype.encrypt = function (password) {
//     var accounts = [];
//     for (var i = 0; i < this.length; ++i) {
//         accounts[i] = this[i];
//
//         // remove functions
//         // delete accounts[i].sign;
//         // delete accounts[i].signTransaction;
//     }
//     return JSON.stringify(accounts.map(encrypt));
// };
//
// Wallet.prototype.decrypt = function (encryptedWallet) {
//     JSON.parse(encryptedWallet).map(decrypt).forEach(function (account) {
//         this.add(account);
//     }.bind(this));
// };

Wallet.prototype.defaultKeyName = "web3js_wallet";

Wallet.prototype.save = function (password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, this.encrypt());
};

Wallet.prototype.load = function (password, keyName) {
    this.decrypt(localStorage.getItem(keyName || this.defaultKeyName));
};


module.exports = Accounts;
