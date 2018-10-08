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
    along with web3.js.  If not, see <Legacy://www.gnu.org/licenses/>.
*/
/**
 * @file InpageProviderAdapter.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractProviderAdapter = require('../../lib/adapters/AbstractProviderAdapter');

/**
 * @param {Object} inpageProvider
 *
 * @constructor
 */
function InpageProviderAdapter(inpageProvider) {// TODO: Check if there is a way to set a host property (will be used on setProvider)
    AbstractProviderAdapter.call(this, inpageProvider);
    this.provider.send = this.provider.sendAsync;
    delete this.provider.sendAsync;
}

/**
 * Checks if the provider is connected
 *
 * @method isConnected
 *
 * @returns {Boolean}
 */
InpageProviderAdapter.prototype.isConnected = function () {
    return this.provider.isConnected;
};

InpageProviderAdapter.prototype = Object.create(AbstractProviderAdapter.prototype);
InpageProviderAdapter.prototype.constructor = InpageProviderAdapter;

module.exports = InpageProviderAdapter;
