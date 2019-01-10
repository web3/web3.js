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
import MethodFactory from './MethodFactory';

export default class NetworkModuleFactory {
    /**
     * @param {Utils} utils
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
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Object} options
     *
     * @returns {Network}
     */
    createNetworkModule(provider, providersModuleFactory, methodModuleFactory, options) {
        return new Network(
            provider,
            providersModuleFactory,
            methodModuleFactory,
            this.createMethodFactory(methodModuleFactory),
            this.utils,
            this.formatters,
            options
        );
    }

    /**
     * Returns an object of MethodFactory
     *
     * @method createMethodFactory
     *
     * @param {MethodModuleFactory} methodModuleFactory
     *
     * @returns {MethodFactory}
     */
    createMethodFactory(methodModuleFactory) {
        return new MethodFactory(methodModuleFactory, this.utils, this.formatters);
    }
}
