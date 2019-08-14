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
 * @file GetProofMethod.js
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import AbstractMethod from '../../../lib/methods/AbstractMethod';

export default class GetProofMethod extends AbstractMethod {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(moduleInstance) {
        super('eth_getProof', 3, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     */
    beforeExecution() {
        this.parameters[0] = new Address(this.parameters[0]).toString();

        if (this.parameters[2]) {
            this.parameters[2] = new Block(this.parameters[2]).toString();
        } else {
            this.parameters[2] = new Block(this.moduleInstance.defaultBlock);
        }
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Object}
     */
    afterExecution(response) {
        response.nonce = new Hex(response.nonce).toNumberString();
        response.balance = new Hex(response.balance).toNumberString();

        for (let i = 0; i < response.storageProof.length; i++) {
            response.storageProof[i].value = new Hex(response.storageProof[i].value).toNumberString();
        }

        return response;
    }
}
