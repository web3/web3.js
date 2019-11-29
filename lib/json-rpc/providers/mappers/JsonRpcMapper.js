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
 * @file JsonRpcMapper.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

let messageId = 0;

//TODO: Should be a static method of the AbstractProvider. Each provider has his own ID counter.
export default class JsonRpcMapper {
    /**
     * Creates a valid json payload object
     *
     * @method toPayload
     *
     * @param {String} method
     * @param {Array} params
     *
     * @returns {Object}
     */
    static toPayload(method, params) {
        if (!method) {
            throw new Error(`JSONRPC method should be specified for params: "${JSON.stringify(params)}"!`);
        }

        const id = messageId;
        messageId++;

        return {
            jsonrpc: '2.0',
            id,
            method,
            params: params || []
        };
    }
}
