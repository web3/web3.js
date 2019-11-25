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
 * @file Network.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import isFunction from 'lodash/isFunction';

export default class Network extends AbstractWeb3Module {
    /**
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {MethodFactory} methodFactory
     * @param {Object} options
     * @param {Net.Socket} nodeNet
     *
     * @constructor
     */
    constructor(provider, methodFactory, options, nodeNet) {
        super(provider, options, methodFactory, nodeNet);
    }

    /**
     * Determines to which network web3 is currently connected
     *
     * @method getNetworkType
     *
     * @param {Function} callback
     *
     * @callback callback(error, result)
     * @returns {Promise<String|Error>}
     */
    async getNetworkType(callback) {
        try {
            const id = await this.getId();
            let networkType = 'private';

            switch (id) {
                case 1:
                    networkType = 'main';
                    break;
                case 2:
                    networkType = 'morden';
                    break;
                case 3:
                    networkType = 'ropsten';
                    break;
                case 4:
                    networkType = 'rinkeby';
                    break;
                case 5:
                    networkType = 'goerli';
                    break;
                case 42:
                    networkType = 'kovan';
                    break;
            }

            if (isFunction(callback)) {
                callback(null, networkType);
            }

            return networkType;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }
    }
}
