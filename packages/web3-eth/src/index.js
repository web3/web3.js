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

import {MethodModuleFactory} from 'web3-core-method';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import {ProvidersModuleFactory} from 'web3-providers';
import * as Utils from 'web3-utils';
import {Accounts} from 'web3-eth-accounts';
import {Personal} from 'web3-eth-personal';
import {Ens} from 'web3-eth-ens';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {AbiCoder} from 'web3-eth-abi';
import {Iban} from 'web3-eth-iban';
import {ContractModuleFactory} from 'web3-eth-contract';
import {PromiEvent} from 'web3-core-promievent';
import EthModuleFactory from './factories/EthModuleFactory';

/**
 * Creates the Eth object
 *
 * @method Eth
 *
 * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Object} options
 *
 * @returns {Eth}
 */
export const Eth = (provider, options) => {
    const accounts = new Accounts(provider, options),
          abiCoder = new AbiCoder();

    return new EthModuleFactory(
        provider,
        new ProvidersModuleFactory(),
        new MethodModuleFactory(accounts),
        accounts,
        PromiEvent,
        Utils,
        formatters,
        new ContractModuleFactory(Utils, formatters, abiCoder, accounts),
        abiCoder
    ).createEthModule(
        new Network(provider, options),
        new Personal(provider, options),
        Iban,
        new Ens(provider),
        new SubscriptionsFactory(),
        options
    );
};
