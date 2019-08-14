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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {ProviderResolver} from 'web3-providers';
import {ContractModuleFactory} from 'web3-eth-contract';
import {AbiCoder} from 'web3-eth-abi';
import {Network} from 'web3-net';
import EnsModuleFactory from './factories/EnsModuleFactory';

/**
 * Returns the Ens object
 *
 * @method Ens
 *
 * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 * @param {Accounts} accounts
 *
 * @constructor
 * @returns {Ens}
 */
export function Ens(provider, net = null, options = {}, accounts = {}) {
    const abiCoder = new AbiCoder();
    const resolvedProvider = new ProviderResolver().resolve(provider, net);

    return new EnsModuleFactory().createENS(
        resolvedProvider,
        new ContractModuleFactory(abiCoder),
        accounts,
        abiCoder,
        new Network(resolvedProvider, null, options),
        options,
        null
    );
}
