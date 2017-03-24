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

var randomhex = require('randomhex');
var accounts = require('ethjs-account');



module.exports = {
    generate: function generate(randomString) {
        if(!randomString) {
            randomString = randomhex(32);
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
        return '0x'+ accounts.privateToAccount(privKey);
    },
    publicToAddress: function publicToAddress(pubKey) {
        pubKey = new Buffer(pubKey.replace(/^0x/i,''), 'hex');
        return accounts.publicToAddress(pubKey);
    }
};
