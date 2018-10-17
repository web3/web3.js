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
 * @file JSONRpcMapper.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @constructor
 */
const JSONRpcMapper = { //TODO: Find a better solution to handle this property as "singleton" globally over the web3 lib
    messageId: 0
};

/**
 * Creates a valid json payload object
 *
 * @method toPayload
 *
 * @param {String} method of jsonrpc call, required
 * @param {Array} params, an Array of method params, optional
 *
 * @returns {Object} valid jsonrpc payload object
 */
JSONRpcMapper.toPayload = (method, params) => {
    if (!method) {
        throw new Error(`JSONRPC method should be specified for params: "${JSON.stringify(params)}"!`);
    }

    JSONRpcMapper.messageId++;

    return {
        jsonrpc: '2.0',
        id: JSONRpcMapper.messageId,
        method,
        params: params || []
    };
};

/**
 * Creates a batch payload object
 *
 * @method toBatchPayload
 *
 * @param {Array} requests, an array of objects with method (required) and params (optional) fields
 *
 * @returns {Array} batch payload
 */
JSONRpcMapper.toBatchPayload = requests => {
    return requests.map(request => {
        request.beforeExecution();

        return JSONRpcMapper.toPayload(request.rpcMethod, request.parameters);
    });
};

export default JSONRpcMapper;
