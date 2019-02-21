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

import MethodFactory from './MethodFactory';
import Eth from '../Eth';
import {GetGasPriceMethod} from '../../../web3-core-method/types';
import TransactionSigner from '../signers/TransactionSigner';

export default class EthModuleFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(
        utils,
        formatters,
    ) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Returns an object of type Eth
     *
     * @method createEthModule
     *
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Network} net
     * @param {Accounts} accounts
     * @param {Personal} personal
     * @param {Iban} iban
     * @param {AbiCoder} abiCoder
     * @param {Ens} ens
     * @param {SubscriptionsFactory} subscriptionsFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Object} options
     *
     * @returns {Eth}
     */
    createEthModule(
        provider,
        providersModuleFactory,
        methodModuleFactory,
        net,
        accounts,
        personal,
        iban,
        abiCoder,
        ens,
        subscriptionsFactory,
        contractModuleFactory,
        options
    ) {
        return new Eth(
            providersModuleFactory,
            methodModuleFactory,
            this.createMethodFactory(),
            net,
            accounts,
            personal,
            iban,
            abiCoder,
            ens,
            this.utils,
            this.formatters,
            subscriptionsFactory,
            contractModuleFactory,
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

    /**
     * Returns an object of type TransactionSigner
     *
     * @returns {TransactionSigner}
     */
    createTransactionSigner() {
        return new TransactionSigner(this.formatters, this.utils);
    }
}
