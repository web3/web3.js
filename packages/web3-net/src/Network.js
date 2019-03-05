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
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {MethodFactory} methodFactory
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     *
     * @constructor
     */
    constructor(provider, providersModuleFactory, methodModuleFactory, methodFactory, utils, formatters, options) {
        super(provider, providersModuleFactory, methodModuleFactory, methodFactory, options);

        this.utils = utils;
        this.formatters = formatters;
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
            const genesisBlock = await this.getBlock(0, false);
            let returnValue = 'private';

            if (
                genesisBlock.hash === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' &&
                id === 1
            ) {
                returnValue = 'main';
            }

            if (genesisBlock.hash === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303' && id === 2) {
                returnValue = 'morden';
            }

            if (
                genesisBlock.hash === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d' &&
                id === 3
            ) {
                returnValue = 'ropsten';
            }

            if (
                genesisBlock.hash === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177' &&
                id === 4
            ) {
                returnValue = 'rinkeby';
            }

            if (
                genesisBlock.hash === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9' &&
                id === 42
            ) {
                returnValue = 'kovan';
            }

            if (isFunction(callback)) {
                callback(null, returnValue);
            }

            return returnValue;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }
    }
}
