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
 * @file index.js
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var version = require('./package.json').version;
var ProvidersPackageFactory = require('./factories/ProvidersPackageFactory');
var HttpProvider = require('./providers/HttpProvider');
var IpcProvider = require('./providers/IpcProvider');
var WebsocketProvider = require('./providers/WebsocketProvider');

module.exports = {
    version: version,
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider,
    WebsocketProvider: WebsocketProvider,

    /**
     * Resolves the right provider adapter by the given parameters
     *
     * @method resolve
     *
     * @param {Object} provider
     * @param {Net} net
     *
     * @returns {Object}
     */
    resolve: function (provider, net) {
        return new ProvidersPackageFactory().createProviderAdapterResolver().resolve(provider, net);
    },

    /**
     * Detects the given provider in the global scope
     *
     * @method detect
     *
     * @returns {Object}
     */
    detect: function () {
        return new ProvidersPackageFactory().createProviderDetector().detect();
    }
};
