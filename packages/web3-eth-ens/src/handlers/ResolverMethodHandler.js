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
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var namehash = require('eth-ens-namehash');

/**
 * @param {Registry} registry
 * @param {PromiEventPackage} promiEventPackage
 *
 * @constructor
 */
function ResolverMethodHandler(registry, promiEventPackage) {
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
ResolverMethodHandler.prototype.method = function (ensName, methodName, methodArguments) {
    return {
        call: this.call.bind({
            ensName: ensName,
            methodName: methodName,
            methodArguments: methodArguments,
            parent: this
        }),
        send: this.send.bind({
            ensName: ensName,
            methodName: methodName,
            methodArguments: methodArguments,
            parent: this
        })
    };
};

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
ResolverMethodHandler.prototype.call = function (callback) {
    var self = this,
        promiEvent = new this.promiEventPackage.PromiEvent(),
        preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

    this.parent.registry.resolver(this.ensName).then(function (resolver) {
        self.parent.handleCall(promiEvent, resolver.methods[self.methodName], preparedArguments, callback);
    }).catch(function (error) {
        promiEvent.reject(error);
    });

    return promiEvent;
};


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
ResolverMethodHandler.prototype.send = function (sendOptions, callback) {
    var self = this,
        promiEvent = new this.promiEventPackage.PromiEvent(),
        preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

    this.parent.registry.resolver(this.ensName).then(function (resolver) {
        self.parent.handleSend(promiEvent, resolver.methods[self.methodName], preparedArguments, sendOptions, callback);
    }).catch(function (error) {
        promiEvent.reject(error);
    });

    return promiEvent;
};

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
ResolverMethodHandler.prototype.handleCall = function (promiEvent, method, preparedArguments, callback) {
    method.apply(this, preparedArguments).call()
        .then(function (receipt) {
            promiEvent.resolve(receipt);

            if (_.isFunction(callback)) {
                callback(receipt);
            }
        }).catch(function (error) {
            promiEvent.reject(error);

            if (_.isFunction(callback)) {
                callback(error);
            }
        });

    return promiEvent;
};

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
ResolverMethodHandler.prototype.handleSend = function (promiEvent, method, preparedArguments, sendOptions, callback) {
    method.apply(this, preparedArguments).send(sendOptions)
        .on('transactionHash', function (hash) {
            promiEvent.emit('transactionHash', hash);
        })
        .on('confirmation', function (confirmationNumber, receipt) {
            promiEvent.emit('confirmation', confirmationNumber, receipt);
        })
        .on('receipt', function (receipt) {
            promiEvent.emit('receipt', receipt);
            promiEvent.resolve(receipt);

            if (_.isFunction(callback)) {
                callback(receipt);
            }
        })
        .on('error', function (error) {
            promiEvent.emit('error', error);
            promiEvent.reject(error);

            if (_.isFunction(callback)) {
                callback(error);
            }
        });

    return promiEvent;
};

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
ResolverMethodHandler.prototype.prepareArguments = function (name, methodArguments) {
    var node = namehash.hash(name);

    if (methodArguments.length > 0) {
        methodArguments.unshift(node);

        return methodArguments;
    }

    return [node];
};

module.exports = ResolverMethodHandler;
