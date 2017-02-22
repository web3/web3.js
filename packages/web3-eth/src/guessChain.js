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
 * @file guessChain.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var _ = require('underscore');

var guessChain = function (callback) {
    return this.getBlock(0)
        .then(function (genesis) {
            var returnValue;

            switch (genesis.hash) {
                case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                    returnValue = 'main';
                    break;
                case '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
                    returnValue = 'morden';
                    break;
                case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
                    returnValue = 'ropsten';
                    break;
                default:
                    returnValue = 'private';
            }

            if (_.isFunction(callback)) {
                callback(null, returnValue);
            }

            return returnValue;
        })
        .catch(function (err) {
            if (_.isFunction(callback)) {
                callback(err);
            } else {
                throw err;
            }
        });
};

module.exports = guessChain;
