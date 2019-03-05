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
 * @file MethodFactory
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Shh from '../Shh';
import MethodFactory from './MethodFactory';

export default class ShhModuleFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {MethodModuleFactory} methodModuleFactory
     *
     * @constructor
     */
    constructor(utils, formatters, methodModuleFactory) {
        this.utils = utils;
        this.formatters = formatters;
        this.methodModuleFactory = methodModuleFactory;
    }

    /**
     * Returns an object of type Shh
     *
     * @method createShhModule
     *
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {Network} net
     * @param {Object} options
     *
     * @returns {Shh}
     */
    createShhModule(provider, providersModuleFactory, subscriptionsFactory, net, options) {
        return new Shh(
            provider,
            providersModuleFactory,
            this.methodModuleFactory,
            this.createMethodFactory(),
            subscriptionsFactory,
            net,
            options
        );
    }

    /**
     * Returns an object of type MethodFactory
     *
     * @method createMethodFactory
     *
     * @returns {MethodFactory}
     */
    createMethodFactory() {
        return new MethodFactory(this.methodModuleFactory, this.utils, this.formatters);
    }
}
