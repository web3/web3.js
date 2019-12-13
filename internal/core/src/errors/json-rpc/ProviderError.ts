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
 * @file ProviderError.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import JsonRpcError from "./JsonRpcError";

export default class ProviderError extends JsonRpcError {
    /**
     * @property host
     */
    protected prefix: string = 'PROVIDER ERROR: ';

    /**
     * @param {String} message
     * @param {String} host
     * @param {Object} payload
     * @param {any} response
     *
     * @constructor
     */
    constructor(message: string, host: string, payload?: object, response?: any) {
        super(message, host, payload, response);
    }
}
