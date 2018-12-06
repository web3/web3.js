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

import AbstractCommand from '../../lib/commands/AbstractCommand';

export default class CallMethodCommand extends AbstractCommand {
    /**
     * @param {Accounts} accounts
     * @param {MessageSigner} messageSigner
     *
     * @constructor
     */
    constructor(accounts, messageSigner) {
        super(accounts);
        this.messageSigner = messageSigner;
    }

    /**
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object|String>}
     */
    async execute(moduleInstance, method) {
        method.beforeExecution(moduleInstance);

        if (method.rpcMethod === 'eth_sign' && this.hasWallets()) {
            return this.signOnClient(method);
        }

        return await this.signOnNode(moduleInstance, method);
    }

    /**
     * Signs the message over JSON-RPC on the connected node
     *
     * @method signOnNode
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     *
     * @returns {Promise<String|Error|undefined>}
     */
    async signOnNode(moduleInstance, method) {
        try {
            const response = await moduleInstance.currentProvider.send(method.rpcMethod, method.parameters);
            const mappedResponse = method.afterExecution(response);

            if (method.callback) {
                method.callback(false, mappedResponse);
            }

            return mappedResponse;
        } catch (error) {
            if (method.callback) {
                method.callback(error, null);

                return;
            }

            throw error;
        }
    }

    /**
     * Signs the message on the client.
     *
     * @method signOnClient
     *
     * @param {AbstractMethod} method
     *
     * @returns {String|undefined}
     */
    signOnClient(method) {
        let signedMessage;

        try {
            signedMessage = method.afterExecution(
                this.messageSigner.sign(method.parameters[0], method.parameters[1], this.accounts)
            );
        } catch (error) {
            if (method.callback) {
                method.callback(error, null);
            }

            throw error;
        }

        if (method.callback) {
            method.callback(false, signedMessage);
        }

        return signedMessage;
    }
}
