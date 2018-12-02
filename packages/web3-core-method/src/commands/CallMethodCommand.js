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
 * @file CallMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class CallMethodCommand {
    /**
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethodModel} methodModel
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object|String>}
     */
    async execute(moduleInstance, methodModel) {
        try {
            methodModel.beforeExecution(moduleInstance);
            const response = await moduleInstance.currentProvider.send(methodModel.rpcMethod, methodModel.parameters);
            const mappedResponse = methodModel.afterExecution(response);

            if (methodModel.callback) {
                methodModel.callback(false, mappedResponse);
            }

            return mappedResponse;
        } catch (error) {
            if (methodModel.callback) {
                methodModel.callback(error, null);

                return;
            }

            throw error;
        }
    }
}
