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
 * @file NetworkModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Network from '../Network';
import MethodModelFactory from './MethodModelFactory';

export default class NetworkModuleFactory {
    /**
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Returns an object of type Network
     *
     * @method createNetworkModule
     *
     * @param {AbstractProviderAdapter} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Object} options
     *
     * @returns {Network}
     */
    createNetworkModule(provider, providersModuleFactory, providers, methodModuleFactory, options) {
        return new Network(
            provider,
            providersModuleFactory,
            providers,
            methodModuleFactory,
            this.createMethodModelFactory(),
            this.formatters,
            this.utils,
            options
        );
    }

    /**
     * Returns an object of MethodFactory
     *
     * @method createMethodModelFactory
     *
     * @returns {MethodModelFactory}
     */
    createMethodModelFactory() {
        return new MethodModelFactory(this.utils, this.formatters);
    }
}
