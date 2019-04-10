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
 * @file GetStorageAtMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import AbstractMethod from '../../lib/methods/AbstractMethod';

export default class GetStorageAtMethod extends AbstractMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractConfluxWebModule} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('eth_getStorageAt', 3, utils, formatters, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractConfluxWebModule} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputAddressFormatter(this.parameters[0]);
        this.parameters[1] = this.utils.numberToHex(this.parameters[1]);

        // Optional second parameter 'defaultBlock' could also be the callback
        if (isFunction(this.parameters[2])) {
            this.callback = this.parameters[2];
            this.parameters[2] = moduleInstance.defaultBlock;
        }

        this.parameters[2] = this.formatters.inputDefaultBlockNumberFormatter(this.parameters[2], moduleInstance);
    }
}
