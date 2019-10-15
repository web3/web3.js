/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import {AbstractConfluxWebModule} from 'conflux-web-core';
import isFunction from 'lodash/isFunction';

export default class Network extends AbstractConfluxWebModule {
    /**
     * @param {ConfluxWebCfxProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {MethodFactory} methodFactory
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     * @param {Net.Socket} nodeNet
     *
     * @constructor
     */
    constructor(provider, methodFactory, utils, formatters, options, nodeNet) {
        super(provider, options, methodFactory, nodeNet);

        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Determines to which network confluxWeb is currently connected
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
