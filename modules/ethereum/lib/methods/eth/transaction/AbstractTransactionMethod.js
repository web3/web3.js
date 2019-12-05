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
 * @file EthSendTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import Method from "../../../../../core/src/json-rpc/methods/Method";
import TransactionOptions from "../../../../lib/types/input/TransactionOptions";

export default class AbstractTransactionMethod extends Method {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmmount
     * @param {Array} parameters
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmmount, parameters, config) {
        super(rpcMethod, parametersAmmount, parameters, config);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @returns {Promise}
     */
    async beforeExecution() {
        if (this.rpcMethod !== 'eth_sendRawTransaction') {
            this.parameters[0] = new TransactionOptions(this.parameters[0]);
        }
    }

    /**
     * TODO: Create a Transaction object with all required methods (mined, confirmations, etc.) could probably also be created and handled on the public_api layer
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {String} response
     *
     * @returns {Promise<Transaction>}
     */
    async afterExecution(response) {
        return new Transaction(response);
    }
}
