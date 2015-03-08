/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file eth.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

// var formatters = require('./formatters');

/// @returns an array of objects describing web3.eth api methods
var methods = [
    // { name: 'getBalance', call: 'eth_balanceAt', outputFormatter: formatters.convertToBigNumber},
];

/// @returns an array of objects describing web3.eth api properties
var properties = [
    { name: 'listening', getter: 'net_listening'},
    { name: 'peerCount', getter: 'net_peerCount'},
];


module.exports = {
    methods: methods,
    properties: properties
};

