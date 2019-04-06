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
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2018
 */

import {Network} from 'web3-net';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {ProviderResolver} from 'web3-providers';
import MethodFactory from './factories/MethodFactory';
import AdminModule from './Admin.js';

/**
 * Returns the Admin object
 *
 * @method Admin
 *
 * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Net.Socket} net
 * @param {Object} options
 *
 * @returns {Admin}
 */
export function Admin(provider, net = null, options = {}) {
    const resolvedProvider = new ProviderResolver().resolve(provider, net);

    return new AdminModule(
        resolvedProvider,
        new MethodFactory(Utils, formatters),
        new Network(resolvedProvider, null, options),
        Utils,
        formatters,
        options,
        null
    );
}
