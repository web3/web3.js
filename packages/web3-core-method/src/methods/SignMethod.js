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
 * @file SignMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Address, Hex} from 'web3-core';
import AbstractMethod from '../../lib/methods/AbstractMethod';

export default class SignMethod extends AbstractMethod {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(moduleInstance) {
        super('eth_sign', 2, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     */
    beforeExecution() {
        if (!Hex.isValid(this.parameters[0])) {
            this.parameters[0] = Hex.fromUTF8(this.parameters[0]).toString();
        }

        this.parameters[1] = new Address(this.parameters[1]).toString();
        this.parameters.reverse();
    }
}
