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
 * @file EthModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {MethodModelFactory} from './MethodModelFactory';
import {Eth} from '../Eth';

export default class EthModuleFactory {

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
     * Returns an object of type Eth
     *
     * @method createEthModule
     *
     * @param {AbstractProviderAdapter} provider
     * @param {Network} net
     * @param {ContractPackage} contractPackage
     * @param {Accounts} accounts
     * @param {Personal} personal
     * @param {Iban} iban
     * @param {Abi} abi
     * @param {ENS} ens
     * @param {ProvidersPackage} providersPackage
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {MethodController} methodController
     *
     * @returns {Eth}
     */
    createEthModule(
        provider,
        net,
        contractPackage,
        accounts,
        personal,
        iban,
        abi,
        ens,
        providersPackage,
        subscriptionsFactory,
        methodController
    ) {
        return new Eth(
            provider,
            net,
            contractPackage,
            accounts,
            personal,
            iban,
            abi,
            ens,
            this.utils,
            this.formatters,
            providersPackage,
            subscriptionsFactory,
            methodController,
            this.createMethodModelFactory(accounts)
        );
    }

    /**
     * Returns an object of type MethodModelFactory
     *
     * @method createMethodModelFactory
     *
     * @param {Accounts} accounts
     *
     * @returns {MethodModelFactory}
     */
    createMethodModelFactory(accounts) {
        return new MethodModelFactory(this.utils, this.formatters, accounts);
    }
}
