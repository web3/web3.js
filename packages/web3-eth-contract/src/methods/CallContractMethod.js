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
 * @file CallContractMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {CallMethod} from 'web3-core-method';

export default class CallContractMethod extends CallMethod {
    /**
     * @param {CallMethodCommand} callMethodCommand
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbiItem} abiItem
     *
     * @constructor
     */
    constructor(callMethodCommand, utils, formatters, abiItem) {
        super(callMethodCommand, utils, formatters);
        this.abiItem = abiItem;
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Array} response
     *
     * @returns {Array}
     */
    afterExecution(response) {
        if (!response) {
            return null;
        }

        if (response.length >= 2) {
            response = response.slice(2);
        }

        const result = this.abiCoder.decodeParameters(this.abiItem, response);

        if (result.__length__ === 1) {
            return result[0];
        }

        return result;
    }
}
