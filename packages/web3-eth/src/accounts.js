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
var accounts = require('ethjs-account');
var signer = require('ethjs-signer');

var elliptic = require('elliptic');
var secp256k1 = new (elliptic.ec)('secp256k1'); // eslint-disable-line



module.exports = {
    generate: function generate(randomString) {
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



    signTransaction: function sign(tx, privKey) {

        if(tx.to) {
            tx.to = helpers.formatters.inputAddressFormatter(tx.to);
        }

        return signer.sign(tx, privKey);
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
