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

import Method from "../../../../../core/src/json-rpc/methods/Method";
import Address from "../../../../lib/types/input/Address";
import BlockNumber from "../../../../lib/types/input/BlockNumber";
import Hex from "../../../../../core/src/utility/Hex";

export default class GetProofMethod extends Method {
    /**
     * @param {EthereumConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    constructor(config, parameters) {
        super('eth_getProof', 3, config, parameters);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @returns {Promise}
     */
    async beforeExecution() {
        this.parameters[0] = new Address(this.parameters[0]).toString();
        this.parameters[2] = new BlockNumber(this.parameters[2]).toString();
    }

    /**
     * TODO: This should be handled with a output Proof type object
     *
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Promise<Proof>}
     */
    async afterExecution(response) {
        response.nonce = new Hex(response.nonce).toNumberString();
        response.balance = new Hex(response.balance).toNumberString();

        for (let i = 0; i < response.storageProof.length; i++) {
            response.storageProof[i].value = new Hex(response.storageProof[i].value).toNumberString();
        }

        return response;
    }
}
