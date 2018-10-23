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
 * @author Samuel Furer <samuel@ethereum.org>
 * @date 2018
 */

import {ProvidersModuleFactory, providers} from 'web3-providers';
import {MethodController} from 'web3-core-method';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {Network} from 'web3-net';
import Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import ShhModuleFactory from './factories/ShhModuleFactory';

/**
 * Returns the Shh object.
 *
 * @method Shh
 *
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 *
 * @returns {Shh}
 */
export const Shh = (provider) => {
    const providersModuleFactory = new ProvidersModuleFactory();

    return new ShhModuleFactory(Utils, formatters).createShhModule(
        provider,
        providersModuleFactory,
        providers,
        new MethodController(),
        new SubscriptionsFactory(),
        new Network(provider)
    );
};
