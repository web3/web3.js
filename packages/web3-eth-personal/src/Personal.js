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
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import {AbstractWeb3Module} from 'web3-core';

export default class Personal extends AbstractWeb3Module {
    /**
     * TODO: Add missing documentation for getAccounts, lockAccount, importRawKey and sendTransaction!
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {MethodModelFactory} methodModelFactory
     * @param {Network} net
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        providers,
        methodController,
        methodModelFactory,
        net,
        utils,
        formatters
    ) {
        super(
            provider,
            providersModuleFactory,
            providers,
            methodController,
            methodModelFactory
        );

        this.utils = utils;
        this.formatters = formatters;
        this.net = net;
        this._defaultAccount = null;
        this._defaultBlock = 'latest';
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    get defaultAccount() {
        return this._defaultAccount;
    }

    /**
     * Setter for the defaultAccount property
     *
     * @property defaultAccount
     */
    set defaultAccount(value) {
        this._defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(value));
    }

    /**
     * Getter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String}
     */
    get defaultBlock() {
        return this._defaultBlock;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param value
     */
    set defaultBlock(value) {
        this._defaultBlock = value;
    }

    /**
     * Extends setProvider method from AbstractWeb3Module.
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(super.setProvider(provider, net) && this.net.setProvider(provider, net));
    }
}
