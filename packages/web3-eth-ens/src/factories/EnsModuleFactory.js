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
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Accounts} accounts
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Network} net
     * @param {Object} ensModuleOptions
     * @param {Net.Socket} nodeNet
     *
     * @returns {Ens}
     */
    createENS(provider, contractModuleFactory, accounts, abiCoder, utils, formatters, net, ensModuleOptions, nodeNet) {
        return new Ens(
            provider,
            ensModuleOptions,
            this,
            contractModuleFactory,
            accounts,
            abiCoder,
            utils,
            formatters,
            net,
            nodeNet
        );
    }

    /**
     * Returns an object of type Registry
     *
     * @method createRegistry
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Accounts} accounts
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     * @param {Network} net
     *
     * @returns {Registry}
     */
    createRegistry(provider, contractModuleFactory, accounts, abiCoder, utils, formatters, options, net) {
        return new Registry(provider, contractModuleFactory, accounts, abiCoder, utils, formatters, options, net);
    }
}
