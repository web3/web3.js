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
 * @file VerbosityMethod.js
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import Method from "../../../../core/src/json-rpc/methods/Method";

export default class VerbosityMethod extends Method {
    /**
     * @param {Array} parameters
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(parameters, config) {
        super('debug_verbosity', 1, parameters, config);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {Configuration} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.utils.numberToHex(this.parameters[0]);
    }
}
