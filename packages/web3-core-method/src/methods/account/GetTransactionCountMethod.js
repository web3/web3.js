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
 * @file GetTransactionCountMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import AbstractMethod from '../../../lib/methods/AbstractMethod';

export default class GetTransactionCountMethod extends AbstractMethod {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(moduleInstance) {
        super('eth_getTransactionCount', 2, moduleInstance);
    }

    /**
     * This method will be executed before the effective execution.
     *
     * @method beforeExecution
     */
    beforeExecution() {
        this.parameters[0] = new Address(this.parameters[0]).toString();

        // Optional second parameter 'defaultBlock' could also be the callback
        if (isFunction(this.parameters[1])) {
            this.callback = this.parameters[1];
            this.parameters[1] = this.moduleInstance.defaultBlock;
        }

        if (this.parameters[1]) {
            this.parameters[1] = new BlockNumber(this.parameters[1]).toString();
        } else {
            this.parameters[1] = new BlockNumber(this.moduleInstance.defaultBlock).toString();
        }
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Number}
     */
    afterExecution(response) {
        return new Hex(response).toNumber();
    }
}
