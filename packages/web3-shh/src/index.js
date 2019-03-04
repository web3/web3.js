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

import {Network} from 'web3-net';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import ShhModule from './Shh.js';
import MethodFactory from './factories/MethodFactory';
import SubscriptionsFactory from './factories/SubscriptionsFactory';

/**
 * Returns the Shh object.
 *
 * @method Shh
 *
 * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
 * @param {Object} options
 *
 * @returns {Shh}
 */
export const Shh = (provider, options) => {
    return new ShhModule(
        provider,
        new MethodFactory(Utils, formatters),
        new SubscriptionsFactory(Utils, formatters),
        new Network(provider, options),
        options
    );
};
