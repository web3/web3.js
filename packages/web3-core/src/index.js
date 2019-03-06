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

import {ProviderDetector, ProviderResolver} from 'web3-providers';
import Web3Module from './AbstractWeb3Module.js';

/**
 * Returns a object of type AbstractWeb3Module
 *
 * @param {HttpProvider|WebsocketProvider|IpcProvider|EthereumProvider|String} provider
 * @param {Object} options
 * @param {MethodFactory} methodFactory
 *
 * @constructor
 */
export const AbstractWeb3Module = (provider, options, methodFactory = null) => {
    return new Web3Module(provider, new ProviderDetector(), new ProviderResolver(), methodFactory, options);
};
