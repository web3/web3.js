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

"use strict";

import MethodModelFactory from './factories/MethodModelFactory';
import {MethodController} from 'web3-core-method';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import ProvidersPackage from 'web3-providers';
import Utils from 'web3-utils';
import {Accounts} from 'web3-eth-accounts';
import {Personal} from 'web3-eth-personal';
import {ENS} from 'web3-eth-ens';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {AbiCoder} from 'web3-eth-abi';
import {Iban} from 'web3-eth-iban';
import ContractPackage from 'web3-eth-contract';

/**
 * Creates the Eth object
 *
 * @method Eth
 *
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 *
 * @returns {Eth}
 */
export const Eth = (provider) => {
    const accounts = new Accounts(provider);

    return new Eth(
        provider,
        new Network(provider),
        ContractPackage,
        accounts,
        new Personal(provider),
        Iban,
        new AbiCoder(utils),
        new ENS(provider),
        Utils,
        formatters,
        ProvidersPackage,
        new SubscriptionsFactory(),
        new MethodController(),
        new MethodModelFactory(Utils, formatters, accounts)
    );
};
