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
 * @file EnsModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Ens from '../Ens';
import Registry from '../contracts/Registry';

export default class EnsModuleFactory {
    /**
     * Returns an object of type Ens
     *
     * @method createENS
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {PromiEvent} promiEvent
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Network} net
     * @param {Object} registryOptions
     * @param {Object} ensModuleOptions
     *
     * @returns {Ens}
     */
    createENS(
        provider,
        providersModuleFactory,
        methodModuleFactory,
        contractModuleFactory,
        promiEvent,
        abiCoder,
        utils,
        formatters,
        net,
        registryOptions,
        ensModuleOptions
    ) {
        return new Ens(
            provider,
            providersModuleFactory,
            methodModuleFactory,
            ensModuleOptions,
            this,
            contractModuleFactory,
            promiEvent,
            abiCoder,
            utils,
            formatters,
            registryOptions,
            net
        );
    }

    /**
     * Returns an object of type Registry
     *
     * @method createRegistry
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {PromiEvent} promiEvent
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     * @param {Network} net
     *
     * @returns {Registry}
     */
    createRegistry(
        provider,
        providersModuleFactory,
        methodModuleFactory,
        contractModuleFactory,
        promiEvent,
        abiCoder,
        utils,
        formatters,
        options,
        net
    ) {
        return new Registry(
            provider,
            providersModuleFactory,
            methodModuleFactory,
            contractModuleFactory,
            promiEvent,
            abiCoder,
            utils,
            formatters,
            options,
            net
        );
    }
}
