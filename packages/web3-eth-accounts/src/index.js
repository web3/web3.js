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
var wallet = require('ethereumjs-wallet');


var Accounts = function Accounts(eth) {

    this.eth = eth;
    this.wallet = new Wallet(this);
};

Accounts.prototype.create = function create(entropy) {
    return EthFP.Account.create(entropy || utils.randomHex(32));
};

Accounts.prototype.privateToAccount = function privateToAccount(privateKey) {
    return EthFP.Account.fromPrivate(privateKey);
};

Accounts.prototype.signTransaction = function signTransaction(tx, privateKey, callback) {
    var _this = this;

    function signed (tx) {

        if (!tx.gas) {
            throw new Error('"gas" is missing');
        }

        var transaction = {
            nonce: utils.numberToHex(tx.nonce),
            to: tx.to ? helpers.formatters.inputAddressFormatter(tx.to) : '0x',
            data: tx.data || '0x',
            value: tx.value ? utils.numberToHex(tx.value) : "0x",
            gas: utils.numberToHex(tx.gas),
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
        return Promise.reject(new Error('The Eth package is not bound. Please bind using "signTransaction.bind(eth)", or provide "nonce", "chainId" and "gasPrice" in the transaction yourself.'));
    }

    // Otherwise, get the missing info from the Ethereum Node
    return Promise.all([
        tx.chainId || _this.eth.net.getId(),
        tx.gasPrice || _this.eth.getGasPrice(),
        tx.nonce || _this.eth.getTransactionCount(_this.privateToAccount(privateKey).address)
    ]).then(function (args) {
        return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
    });
};

Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx) {
    return EthFP.Account.recoverTransaction(rawTx);
};

Accounts.prototype.sign = function sign(data, privateKey) {
    // TODO / FIXME: the specs isn't clear on how this is encoded
    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
    // I'm guessing it means to encode len as the decimal UTF8
    // representation, and message as the string encoded by the
    // given hex, as opposed to the hex itself. Requires testing
    var message = /^0x/.test(data) ? new Buffer(data.slice(2),"hex").toString() : data; // string encoded by the hex
    var hash = EthFP.Hash.keccak256s("\x19Ethereum Signed Message:\n" + message.length + message);
    var signature = EthFP.Account.sign(hash, privateKey);
    var vrs = EthFP.Account.decodeSignature(signature);
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
};

Accounts.prototype.recover = function recover(hash, signature) {
    if (typeof hash === "object") {
        return this.recover(hash.messageHash, EthFP.Account.encodeSignature([hash.v, hash.r, hash.s]));
    }
    if (arguments.length === 4) {
        return this.recover(hash, EthFP.Account.encodeSignature([].slice.call(arguments, 1, 4)));
    }
    return EthFP.Account.recover(hash, signature);
};

Accounts.prototype.decrypt = function decrypt(jsonString, password) {
    return this.privateToAccount("0x" + wallet.fromV3(jsonString, password)._privKey.toString("hex"));
};

Accounts.prototype.encrypt = function encrypt(privateKey, password) {
    return JSON.stringify(this.wallet.fromPrivateKey(new Buffer(privateKey.slice(2), "hex")).toV3(password));
};

// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet(accounts) {
    this.length = 0;
    this.accounts = accounts;
}

Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function (account) {
    if (typeof account === "string") {
        account = this.accounts.privateToAccount(account);
    }
    if (!this[account.address]) {
        this[this.length++] = account;
        this[account.address] = account;
    }

    return account;
};

Wallet.prototype.remove = function (addressOrIndex) {
    var account = this[addressOrIndex];
    for (var i = 0; i < this.length; ++i) {
        if (this[i] && this[i].address === account.address) {
            delete this[account.address];
            this[i].address = null;
            this[i].privateKey = null;
            delete this[i];
        }
        if (!this[i]) {
            if (i < this.length - 1) {
                this[i] = this[i + 1];
                delete this[i + 1];
            } else {
                --this.length;
            }
        }
    }
};

Wallet.prototype.clear = function () {
    for (var i = 0; i < this.length; ++i) {
        delete this[this[i].address];
        this[i].address = null;
        this[i].privateKey = null;
        delete this[i];
    }
    this.length = 0;
};

// TODO encrypt!
Wallet.prototype.encrypt = function (password) {
    var accounts = [];
    for (var i = 0; i < this.length; ++i) {
        accounts.push(this[i]);
    }
    return JSON.stringify(accounts.map(encrypt));
};

Wallet.prototype.decrypt = function (encryptedWallet) {
    JSON.parse(encryptedWallet).map(decrypt).forEach(function (account) {
        this.add(account);
    }.bind(this));
};

Wallet.prototype.defaultKeyName = "web3js_wallet";

Wallet.prototype.save = function (password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, this.encrypt());
};

Wallet.prototype.load = function (password, keyName) {
    this.decrypt(localStorage.getItem(keyName || this.defaultKeyName));
};


module.exports = Accounts;
