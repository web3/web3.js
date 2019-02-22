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
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {Accounts} from 'web3-eth-accounts';
import {Ens} from 'web3-eth-ens';
import {ContractModuleFactory} from 'web3-eth-contract';
import {Personal} from 'web3-eth-personal';
import {AbiCoder} from 'web3-eth-abi';
import {Iban} from 'web3-eth-iban';
import {ProvidersModuleFactory} from 'web3-providers';
import {Network} from 'web3-net';
import * as Utils from 'web3-utils';
import EthModuleFactory from './factories/EthModuleFactory';

export TransactionSigner from './signers/TransactionSigner';

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
    const accounts = new Accounts(provider, options);
    const abiCoder = new AbiCoder();
    const methodModuleFactory = new MethodModuleFactory();

    return new EthModuleFactory(Utils, formatters).createEthModule(
        provider,
        new ProvidersModuleFactory(),
        methodModuleFactory,
        new Network(provider, options),
        accounts,
        new Personal(provider, accounts, options),
        Iban,
        abiCoder,
        new Ens(provider, accounts, options),
        new SubscriptionsFactory(),
        new ContractModuleFactory(Utils, formatters, abiCoder, accounts, methodModuleFactory),
        options
    );
};
