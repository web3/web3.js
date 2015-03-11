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
/** @file signature.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var web3 = require('../web3'); 
var c = require('../utils/config');

/// @param function name for which we want to get signature
/// @returns signature of function with given name
var functionSignatureFromAscii = function (name) {
    return web3.sha3(web3.fromAscii(name)).slice(0, 2 + c.ETH_SIGNATURE_LENGTH * 2);
};

/// @param event name for which we want to get signature
/// @returns signature of event with given name
var eventSignatureFromAscii = function (name) {
    return web3.sha3(web3.fromAscii(name));
};

module.exports = {
    functionSignatureFromAscii: functionSignatureFromAscii,
    eventSignatureFromAscii: eventSignatureFromAscii
};

