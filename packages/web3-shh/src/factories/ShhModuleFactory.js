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
 * @file MethodModelFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Shh} from '../Shh';
import MethodModelFactory from "./MethodModelFactory";

export default class ShhModuleFactory {

    /**
     * Returns an object of type Shh
     *
     * @method createShhModule
     *
     * @param {AbstractProviderAdapter} provider
     * @param {ProvidersPackage} providersPackage
     * @param {MethodController} methodController
     * @param {SubscriptionsFacotry} subscriptionsFactory
     * @param {Network} net
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @returns {Shh}
     */
    createShhModule(provider, providersPackage, methodController, subscriptionsFactory, net, utils, formatters) {
        return new Shh(
            provider,
            providersPackage,
            methodController,
            this.createMethodModelFactory(utils, formatters),
            subscriptionsFactory,
            net
        );
    }

    /**
     * Returns an object of type MethodModelFactory
     *
     * @method createMethodModelFactory
     *
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @returns {MethodModelFactory}
     */
    createMethodModelFactory(utils, formatters) {
        return new MethodModelFactory(utils, formatters)
    }
}
