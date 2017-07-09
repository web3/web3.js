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
var EthLib = require("eth-lib");
var crypto = require('crypto');
var scryptsy = require('scrypt.js');
var uuid = require('uuid');
var utils = require('web3-utils');
var helpers = require('web3-core-helpers');

var isNot = function(value) {
    return (_.isUndefined(value) || _.isNull(value));
};

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

    account.encrypt = function encrypt(password, options) {
        return _this.encrypt(account.privateKey, password, options);
    };


    return account;
};

Accounts.prototype.create = function create(entropy) {
    return this._addAccountFunctions(EthLib.Account.create(entropy || utils.randomHex(32)));
};

Accounts.prototype.privateKeyToAccount = function privateKeyToAccount(privateKey) {
    return this._addAccountFunctions(EthLib.Account.fromPrivate(privateKey));
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



        var hash = EthLib.Hash.keccak256(EthLib.Account.transactionSigningData(transaction));
        var rawTransaction = EthLib.Account.signTransaction(transaction, privateKey);
        var values = EthLib.RLP.decode(rawTransaction);
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
        isNot(tx.chainId) ? _this.eth.net.getId() : tx.chainId,
        isNot(tx.gasPrice) ? _this.eth.getGasPrice() : tx.gasPrice,
        isNot(tx.nonce) ? _this.eth.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce
    ]).then(function (args) {
        if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
            throw new Error('One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: '+ JSON.stringify(args));
        }
        return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
    });
};

Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx) {
    return EthLib.Account.recoverTransaction(rawTx);
};

Accounts.prototype.hashMessage = function hashMessage(data) {
    var message = utils.isHex(data) ? utils.hexToUtf8(data) : data;
    var ethMessage = "\x19Ethereum Signed Message:\n" + message.length + message;
    return EthLib.Hash.keccak256s(ethMessage);
};

Accounts.prototype.sign = function sign(data, privateKey) {

    var hash = this.hashMessage(data);
    var signature = EthLib.Account.sign(hash, privateKey);
    var vrs = EthLib.Account.decodeSignature(signature);
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
        return this.recover(hash.messageHash, EthLib.Account.encodeSignature([hash.v, hash.r, hash.s]));
    }

    if (!utils.isHex(hash)) {
        hash = this.hashMessage(hash);
    }

    if (arguments.length === 4) {
        return this.recover(hash, EthLib.Account.encodeSignature([].slice.call(arguments, 1, 4))); // v, r, s
    }
    return EthLib.Account.recover(hash, signature);
};

// Taken from https://github.com/ethereumjs/ethereumjs-wallet
Accounts.prototype.decrypt = function (v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if(!_.isString(password)) {
        throw new Error('No password given.');
    }

    var json = (_.isObject(v3Keystore)) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
        throw new Error('Not a valid V3 wallet');
    }

    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams;

        // FIXME: support progress reporting callback
        derivedKey = scryptsy(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams;

        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }

        derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new Error('Unsupported key derivation scheme');
    }

    var ciphertext = new Buffer(json.crypto.ciphertext, 'hex');

    var mac = utils.sha3(Buffer.concat([ derivedKey.slice(16, 32), ciphertext ])).replace('0x','');
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }

    var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'));
    var seed = '0x'+ Buffer.concat([ decipher.update(ciphertext), decipher.final() ]).toString('hex');

    return this.privateKeyToAccount(seed);
};

Accounts.prototype.encrypt = function (privateKey, password, opts) {
    /* jshint maxcomplexity: 20 */
    var account = this.privateKeyToAccount(privateKey);

    opts = opts || {};
    var salt = opts.salt || crypto.randomBytes(32);
    var iv = opts.iv || crypto.randomBytes(16);

    var derivedKey;
    var kdf = opts.kdf || 'scrypt';
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString('hex')
    };

    if (kdf === 'pbkdf2') {
        kdfparams.c = opts.c || 262144;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 262144;
        kdfparams.r = opts.r || 8;
        kdfparams.p = opts.p || 1;
        derivedKey = scryptsy(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else {
        throw new Error('Unsupported kdf');
    }

    var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
    if (!cipher) {
        throw new Error('Unsupported cipher');
    }

    var ciphertext = Buffer.concat([ cipher.update(new Buffer(account.privateKey.replace('0x',''), 'hex')), cipher.final() ]);

    var mac = utils.sha3(Buffer.concat([ derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex') ])).replace('0x','');

    return {
        version: 3,
        id: uuid.v4({ random: opts.uuid || crypto.randomBytes(16) }),
        address: account.address.toLowerCase().replace('0x',''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: opts.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    };
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
    this.defaultKeyName = "web3js_wallet";
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

Wallet.prototype.encrypt = function (password) {
    var accounts = [];
    for (var i = 0; i < this.length; ++i) {
        accounts[i] = this[i].encrypt(password);
    }
    return JSON.stringify(accounts);
};


Wallet.prototype.decrypt = function (encryptedWallet, password) {
    var _this = this;

    JSON.parse(encryptedWallet).forEach(function (account) {
        account = _this._accounts.decrypt(account, password);

        if (account) {
            _this.add(account);
        } else {
            throw new Error('Couldn\'t decrypt accounts. Password wrong?');
        }
    });
    return true;
};

Wallet.prototype.save = function (password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, this.encrypt());
};

Wallet.prototype.load = function (password, keyName) {
    this.decrypt(localStorage.getItem(keyName || this.defaultKeyName));
};


module.exports = Accounts;
