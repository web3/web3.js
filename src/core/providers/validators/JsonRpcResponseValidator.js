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
 * @file JsonRpcResponseValidator.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'lodash/isObject';

export default class JsonRpcResponseValidator {
    /**
     * Executes JSON-RPC response validation
     *
     * @method isValid
     *
     * @param {Object} response
     * @param {Object|Array} payload
     *
     * @returns {Boolean}
     */
    static validate(response, payload = false) {
        if (isObject(response)) {
            if (response.error) {
                if (response.error instanceof Error) {
                    return new Error(`Node error: ${response.error.message}`);
                }

                return new Error(`Node error: ${JSON.stringify(response.error)}`);
            }

            if (payload && response.id !== payload.id) {
                return new Error(
                    `Validation error: Invalid JSON-RPC response ID (request: ${payload.id} / response: ${response.id})`
                );
            }

            if (response.result === undefined) {
                return new Error('Validation error: Undefined JSON-RPC result');
            }

            return true;
        }

        return new Error('Validation error: Response should be of type Object');
    }
}
