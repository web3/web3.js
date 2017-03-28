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

var helpers = require('web3-core-helpers');
var utils = require('web3-utils');

var _ = require('underscore');
var Promise = require("bluebird");
var accounts = require('ethjs-account');
var signer = require('ethjs-signer');

var elliptic = require('elliptic');
var secp256k1 = new (elliptic.ec)('secp256k1'); // eslint-disable-line



module.exports = {
    new: function newAccount(randomString) {
        if(!randomString) {
            randomString = utils.randomHex(32);
        }
        return accounts.generate(randomString);
    },
    privateToAddress: function privateToAddress(privKey) {
        privKey = '0x'+ privKey.replace(/^0x/i,'');
        return accounts.privateToAccount(privKey).address;
    },
    privateToPublic: function privateToPublic(privKey) {
        privKey = '0x'+ privKey.replace(/^0x/i,'');
        return '0x'+ accounts.privateToPublic(privKey).toString('hex');
    },
    privateToAccount: function privateToAccount(privKey) {
        privKey = '0x'+ privKey.replace(/^0x/i,'');
        return accounts.privateToAccount(privKey);
    },
    publicToAddress: function publicToAddress(pubKey) {
        pubKey = new Buffer(pubKey.replace(/^0x/i,''), 'hex');
        return accounts.publicToAddress(pubKey);
    },



    signTransaction: function sign(tx, privKey, callback) {
        var _this = this;

        if(tx.to) {
            tx.to = helpers.formatters.inputAddressFormatter(tx.to);
        }

        // return synchronous
        if(tx.gas && _.isFinite(tx.gasPrice) && _.isFinite(tx.chainId) && _.isFinite(tx.nonce)) {
            return signer.sign(tx, privKey);
        }

        // make it async and retrive missing values
        // probably need to convert gas, chainId, nonce to HEX using utils.numberToHex()

        var account = this.privateToAccount(privKey);
        privKey = null;


        // get chain id
        return Promise.try(function(){
            if(tx.chainId) {
                return tx.chainId;
            } else {
                return _this._eth.net.getId();
            }
        })
        // get transaction count
        .then(function (chainId) {
            tx.chainId = chainId;

            if(tx.gasPrice) {
                return tx.gasPrice;
            } else {
                return _this._eth.getGasPrice();
            }
        })
        // get transaction count
        .then(function (gasPrice) {
            tx.gasPrice = gasPrice;

            if(tx.nonce) {
                return tx.nonce;
            } else {
                return _this._eth.getTransactionCount(account.address);
            }
        })
        .then(function (nonce) {
            tx.nonce = nonce;

            var signature = signer.sign(tx, account.privateKey);
            delete account.privateKey;

            if (_.isFunction(callback)) {
                callback(null, signature);
            }

            return signature;
        });
    },
    secp256k1: secp256k1,
    sign: function sign(data, privKey) {
        privKey = privKey.replace(/^0x/i,'');

        var hash = utils.sha3(data);
        var signature = secp256k1.keyFromPrivate(privKey, 16)
        .sign(hash.replace(/^0x/i,''), 16);//{ canonical: true }

        console.log(signature);

        return signature;
    },
    ecrecover: function recover(data, v, r, s) {
        var hash = utils.sha3(data);


        var publicKey = secp256k1.recoverPubKey(hash.replace(/^0x/i,''), { r:r, s:s }, v - 27);
        console.log(publicKey);
        return (new Buffer(publicKey.encode('hex', false), 'hex')).slice(1);
    },
    recover: signer.recover
};
