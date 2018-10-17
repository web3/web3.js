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
 * @file JSONRpcResponseValidator.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

export default class JSONRpcResponseValidator {

    /**
     * Executes JSON-RPC response validation
     *
     * @method isValid
     *
     * @param {Object} response
     *
     * @returns {Boolean}
     */
    static isValid(response) {
        if (Array.isArray(response)) {
            return response.every(this.isResponseItemValid)
        }

        return this.isResponseItemValid(response);
    }

    /**
     * Validates response item from a JSON-RPC response
     *
     * @method isResponseItemValid
     *
     * @param {Object} response
     *
     * @returns {Boolean}
     */
    static isResponseItemValid(response) {
        return !!response &&
            !response.error &&
            response.jsonrpc === '2.0' &&
            (typeof response.id === 'number' || typeof response.id === 'string') &&
            response.result !== undefined;
    }
}
