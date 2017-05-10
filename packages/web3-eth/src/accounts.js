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

var EthFP = require("ethfp");
var utils = require('web3-utils');
var helpers = require('web3-core-helpers');
var _ = require("underscore");


function create (entropy) {
    return EthFP.Account.create(entropy || utils.randomHex(32));
}

function privateToAccount (privateKey) {
    return EthFP.Account.fromPrivate(privateKey);
}

function signTransaction (tx, privateKey, callback) {
    function signed (tx) {
        var transaction = {
            nonce: utils.numberToHex(tx.nonce),
            to: tx.to ? helpers.formatters.inputAddressFormatter(tx.to) : "0x",
            data: tx.data || "0x",
            value: utils.numberToHex(tx.value),
            gasLimit: utils.numberToHex(tx.gas),
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

    // Otherwise, get the missing info from the Ethereum Node
    return Promise.all([
        tx.chainId || this._eth.net.getId(),
        tx.gasPrice || this._eth.getGasPrice(),
        tx.nonce || this._eth.getTransactionCount(privateToAccount(privateKey).address)
    ]).then(function (args) {
        return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
    });
}

function recoverTransaction (rawTx) {
    return EthFP.Account.recoverTransaction(rawTx);
}

function sign (data, privateKey) {
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
}

function recover (hash, signature) {
    if (typeof hash === "object") {
        return recover(hash.messageHash, EthFP.Account.encodeSignature([hash.v, hash.r, hash.s]));
    }
    if (arguments.length === 4) {
        return recover(hash, EthFP.Account.encodeSignature([].slice.call(arguments, 1, 4)));
    }
    return EthFP.Account.recover(hash, signature);
}

function encrypt (account, password) {
    // TODO: implement
    return JSON.stringify(account);
}

function decrypt (account, password) {
    return JSON.parse(account);
}

// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet() {
    this.length = 0;
}

Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function (account) {
    if (typeof account === "string") {
        account = privateToAccount(account);
    }
    if (!this[account.address]) {
        this[this.length++] = account;
        this[account.address] = account;
    }
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
}

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

module.exports = {
    create: create,
    privateToAccount: privateToAccount,
    signTransaction: signTransaction,
    recoverTransaction: recoverTransaction,
    sign: sign,
    recover: recover,
    wallet: new Wallet()
}
