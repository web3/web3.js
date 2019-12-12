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
 * @file UnlockAccountMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import Method from "../../../../core/src/json-rpc/methods/Method";
import Address from "../../../lib/types/input/Address";

export default class UnlockAccountMethod extends Method {
    /**
     * @param {EthereumConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    constructor(config, parameters) {
        super('personal_unlockAccount', 3, config, parameters);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @returns {Promise}
     */
    async beforeExecution() {
        this.parameters[0] = new Address(this.parameters[0]);
    }
}
