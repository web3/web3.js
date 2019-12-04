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
 * @file AbstractGetBlockMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import Method from "../../../../../../core/src/json-rpc/methods/Method";
import BlockNumber from "../../../../../../ethereum/lib/types/input/BlockNumber";
import Block from "../../../../../../ethereum/lib/types/output/Block";

export default class AbstractGetBlockMethod extends Method {
    /**
     * @param {String} rpcMethod
     * @param {Array} parameters
     * @param {JsonRpcConfiguration} config
     *
     * @constructor
     */
    constructor(rpcMethod, parameters, config) {
        super(rpcMethod, 2, parameters, config);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {Configuration} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = new BlockNumber(this.parameters[0]).toString();
        this.parameters[1] = !!this.parameters[1];
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Block}
     */
    afterExecution(response) {
        return new Block(response);
    }
}
