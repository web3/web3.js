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

import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import {AbiCoder} from 'conflux-web-cfx-abi';
import ContractModuleFactory from './factories/ContractModuleFactory';

export AbstractContract from './AbstractContract';
export ContractModuleFactory from './factories/ContractModuleFactory';

/**
 * TODO: Improve this factory method for the TransactionSigner handling.
 *
 * Returns an object of type Contract
 *
 * @method Contract
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Array} abi
 * @param {Accounts} accounts
 * @param {String} address
 * @param {Object} options
 *
 * @returns {AbstractContract}
 *
 * @constructor
 */
export function Contract(provider, abi, accounts, address, options) {
    return new ContractModuleFactory(Utils, formatters, new AbiCoder(), accounts).createContract(
        provider,
        accounts,
        abi,
        address,
        options
    );
}
