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
 * @file givenProvider.js
 * @author Patryk Matyjasiak <patryk.matyjasiak@arianelabs.com>
 * @date 2022
 */

"use strict";

var givenProvider = null;

// ADD GIVEN PROVIDER
/* jshint ignore:start */
var global = typeof globalThis === 'object' ? globalThis : undefined;
if(!global) {
    try {
        global = Function('return this')();
    } catch (e) {
        global = self;
    }
}

// EIP-1193: window.ethereum
if (typeof global.hedera !== 'undefined') {
    givenProvider = global.hedera;

// Legacy web3.currentProvider
} else if(typeof global.hweb3 !== 'undefined' && global.hweb3.currentProvider) {

    if(global.hweb3.currentProvider.sendAsync) {
        global.hweb3.currentProvider.send = global.hweb3.currentProvider.sendAsync;
        delete global.hweb3.currentProvider.sendAsync;
    }

    givenProvider = global.hweb3.currentProvider;
}
/* jshint ignore:end */


module.exports = givenProvider;
