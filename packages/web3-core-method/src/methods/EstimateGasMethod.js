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
 * @file EstimateGasMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Hex, TransactionOptions} from 'web3-core';
import AbstractMethod from '../../lib/methods/AbstractMethod';

export default class EstimateGasMethod extends AbstractMethod {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(moduleInstance) {
        super('eth_estimateGas', 1, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     */
    beforeExecution() {
        if (!this.parameters[0].from) {
            this.parameters[0].from = this.moduleInstance.defaultAccount;
        }

        this.parameters[0] = new TransactionOptions(this.parameters[0]);
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {string} response
     *
     * @returns {Number}
     */
    afterExecution(response) {
        return new Hex(response).toNumber();
    }
}
