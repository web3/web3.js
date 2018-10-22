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
 * @file ResolverMethodHandler.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import _ from 'underscore';
import namehash from 'eth-ens-namehash';

export default class ResolverMethodHandler {
    /**
     * @param {Registry} registry
     * @param {PromiEventPackage} promiEventPackage
     *
     * @constructor
     */
    constructor(registry, promiEventPackage) {
        this.registry = registry;
        this.promiEventPackage = promiEventPackage;
    }

    /**
     * Executes an resolver method and returns an eventifiedPromise
     *
     * @param {String} ensName
     * @param {String} methodName
     * @param {Array} methodArguments
     * @param {Function} callback
     *
     * @returns {Object}
     */
    method(ensName, methodName, methodArguments) {
        return {
            call: this.call.bind({
                ensName,
                methodName,
                methodArguments,
                parent: this
            }),
            send: this.send.bind({
                ensName,
                methodName,
                methodArguments,
                parent: this
            })
        };
    }

    /**
     * Executes call
     *
     * @method call
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    call(callback) {
        const promiEvent = new this.promiEventPackage.PromiEvent();

        const preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

        this.parent.registry
            .resolver(this.ensName)
            .then((resolver) => {
                this.parent.handleCall(promiEvent, resolver.methods[this.methodName], preparedArguments, callback);
            })
            .catch((error) => {
                promiEvent.reject(error);
            });

        return promiEvent;
    }

    /**
     * Executes send
     *
     * @method send
     *
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    send(sendOptions, callback) {
        const promiEvent = new this.promiEventPackage.PromiEvent();

        const preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

        this.parent.registry
            .resolver(this.ensName)
            .then((resolver) => {
                this.parent.handleSend(
                    promiEvent,
                    resolver.methods[this.methodName],
                    preparedArguments,
                    sendOptions,
                    callback
                );
            })
            .catch((error) => {
                promiEvent.reject(error);
            });

        return promiEvent;
    }

    /**
     * Handles a call method
     *
     * @method handleCall
     *
     * @param {PromiEvent} promiEvent
     * @param {function} method
     * @param {Array} preparedArguments
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    handleCall(promiEvent, method, preparedArguments, callback) {
        method
            .apply(this, preparedArguments)
            .call()
            .then((receipt) => {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    callback(receipt);
                }
            })
            .catch((error) => {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error);
                }
            });

        return promiEvent;
    }

    /**
     * Handles a send method
     *
     * @method handleSend
     *
     * @param {PromiEvent} promiEvent
     * @param {function} method
     * @param {Array} preparedArguments
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    handleSend(promiEvent, method, preparedArguments, sendOptions, callback) {
        method
            .apply(this, preparedArguments)
            .send(sendOptions)
            .on('transactionHash', (hash) => {
                promiEvent.emit('transactionHash', hash);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                promiEvent.emit('confirmation', confirmationNumber, receipt);
            })
            .on('receipt', (receipt) => {
                promiEvent.emit('receipt', receipt);
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    callback(receipt);
                }
            })
            .on('error', (error) => {
                promiEvent.emit('error', error);
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error);
                }
            });

        return promiEvent;
    }

    /**
     * Adds the ENS node to the arguments
     *
     * @method prepareArguments
     *
     * @param {String} name
     * @param {Array} methodArguments
     *
     * @returns {Array}
     */
    prepareArguments(name, methodArguments) {
        const node = namehash.hash(name);

        if (methodArguments.length > 0) {
            methodArguments.unshift(node);

            return methodArguments;
        }

        return [node];
    }
}
