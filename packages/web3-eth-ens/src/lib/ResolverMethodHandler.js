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

var { hexDataSlice } = require("@ethersproject/bytes");
var PromiEvent = require('web3-core-promievent');
var namehash = require('eth-ens-namehash');
var { errors, formatters } = require('web3-core-helpers');
var interfaceIds = require('../config').interfaceIds;
var AbiCoder = require('web3-eth-abi');
var Method = require('web3-core-method');

var { dnsEncode } = require('../utils');

var resolverAbi = require('../resources/ABI/Resolver');

const wildcardInterfaceId = "0x9061b923";


/**
 * @param {Registry} registry
 * @constructor
 */
function ResolverMethodHandler(registry) {
    this.registry = registry;
}

/**
 * Executes an resolver method and returns an eventifiedPromise
 *
 * @param {string} ensName
 * @param {string} methodName
 * @param {array} methodArguments
 * @param {function} callback
 * @returns {Object}
 */
ResolverMethodHandler.prototype.method = function (ensName, methodName, methodArguments, outputFormatter, callback) {
    return {
        call: this.call.bind({
            ensName: ensName,
            methodName: methodName,
            methodArguments: methodArguments,
            callback: callback,
            parent: this,
            outputFormatter: outputFormatter
        }),
        send: this.send.bind({
            ensName: ensName,
            methodName: methodName,
            methodArguments: methodArguments,
            callback: callback,
            parent: this
        })
    };
};

ResolverMethodHandler.prototype.resolve = async function (resolver, name, func, args, promiEvent, outputFormatter, callback) {
    if (resolver.options.address === null) {
        return null;
    }
    const methodJsonInterface = resolverAbi.find(x => x.name === func)
    const calldata = AbiCoder.encodeFunctionCall(methodJsonInterface, args);

    const resolveJsonInterface = {
        name: 'resolve',
        type: 'function',
        inputs: [{
            type: 'bytes',
            name: 'name',
        }, {
            type: 'bytes',
            name: 'data',
        }],
    };
    const encodedFunctionCall = AbiCoder.encodeFunctionCall(resolveJsonInterface, [dnsEncode(name), calldata]);

    const tx = {
        to: resolver.options.address,
        data: encodedFunctionCall,
    };

    const method = new Method({
        name: 'call',
        call: 'eth_call',
        params: 2,
        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter],
        abiCoder: AbiCoder
    });

    method.setRequestManager(this.registry.ens.eth._requestManager);
    method.defaultBlock = 'latest';
    method.handleRevert = false;
    method.defaultAccount = null;
    method.defaultBlock = 'latest';
    method.transactionBlockTimeout = 50;
    method.transactionConfirmationBlocks = 24;
    method.transactionPollingTimeout = 750;
    method.transactionPollingInterval = 1000;
    method.blockHeaderTimeout = 10; // 10 seconds
    method.maxListenersWarningThreshold = 100;
    method.ccipReadGatewayCallback = null;
    method.ccipReadGatewayUrls = [];
    method.ccipReadGatewayAllowList = [];
    method.ccipReadMaxRedirectCount = 4;

    const send = method.buildCall();
    const result = await send(tx);

    let parsedBytes = null;
    const offset = Number(BigInt.asIntN(16, BigInt(hexDataSlice(result, 0, 32))));
    const length = Number(BigInt.asIntN(16, BigInt(hexDataSlice(result, offset, offset + 32))));
    parsedBytes = hexDataSlice(result, offset + 32, offset + 32 + length);

    const outputs = methodJsonInterface.outputs
    const decoded = AbiCoder.decodeParameters(outputs, parsedBytes);

    let finalResult;
    if (outputs.length === 1) {
        finalResult = decoded[0];
    } else {
        finalResult = decoded;
    }

    if (outputFormatter) {
        finalResult = outputFormatter(finalResult);
    }

    if (typeof callback === 'function') {
        // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
        callback(finalResult, finalResult);
        return;
    }

    promiEvent.resolve(finalResult);
};

/**
 * Executes call
 *
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.call = function (callback) {
    var self = this;
    var promiEvent = new PromiEvent();
    var preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);
    var outputFormatter = this.outputFormatter || null;

    this.parent.registry.getResolver(this.ensName).then(async function (resolver) {
        const supportsENSIP10 = await resolver.methods.supportsInterface(wildcardInterfaceId).call();

        if (supportsENSIP10) {
            await self.parent.resolve(resolver, self.ensName, self.methodName, preparedArguments, promiEvent, outputFormatter, callback)
        } else {
            if (self.ensName !== resolver.currentName) {
                throw 'Can not call legacy resolver methods as part of wildcard lookup process';
            }
            await self.parent.checkInterfaceSupport(resolver, self.methodName);
            self.parent.handleCall(promiEvent, resolver.methods[self.methodName], preparedArguments, outputFormatter, callback);
        }

    }).catch(function (error) {
        if (typeof callback === 'function') {
            callback(error, null);
            return;
        }

        promiEvent.reject(error);
    });

    return promiEvent.eventEmitter;
};


/**
 * Executes send
 *
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.send = function (sendOptions, callback) {
    var self = this;
    var promiEvent = new PromiEvent();
    var preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

    this.parent.registry.getResolver(this.ensName).then(async function (resolver) {
        await self.parent.checkInterfaceSupport(resolver, self.methodName);
        self.parent.handleSend(promiEvent, resolver.methods[self.methodName], preparedArguments, sendOptions, callback);
    }).catch(function (error) {
        if (typeof callback === 'function') {
            callback(error, null);

            return;
        }

        promiEvent.reject(error);
    });

    return promiEvent.eventEmitter;
};

/**
 * Handles a call method
 *
 * @param {eventifiedPromise} promiEvent
 * @param {function} method
 * @param {array} preparedArguments
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.handleCall = function (promiEvent, method, preparedArguments, outputFormatter, callback) {
    method.apply(this, preparedArguments).call()
        .then(function (result) {
            if (outputFormatter) {
                result = outputFormatter(result);
            }

            if (typeof callback === 'function') {
                // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                callback(result, result);

                return;
            }

            promiEvent.resolve(result);
        }).catch(function (error) {
            if (typeof callback === 'function') {
                callback(error, null);

                return;
            }

            promiEvent.reject(error);
        });

    return promiEvent;
};

/**
 * Handles a send method
 *
 * @param {eventifiedPromise} promiEvent
 * @param {function} method
 * @param {array} preparedArguments
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.handleSend = function (promiEvent, method, preparedArguments, sendOptions, callback) {
    method.apply(this, preparedArguments).send(sendOptions)
        .on('sending', function () {
            promiEvent.eventEmitter.emit('sending');
        })
        .on('sent', function () {
            promiEvent.eventEmitter.emit('sent');
        })
        .on('transactionHash', function (hash) {
            promiEvent.eventEmitter.emit('transactionHash', hash);
        })
        .on('confirmation', function (confirmationNumber, receipt) {
            promiEvent.eventEmitter.emit('confirmation', confirmationNumber, receipt);
        })
        .on('receipt', function (receipt) {
            promiEvent.eventEmitter.emit('receipt', receipt);
            promiEvent.resolve(receipt);

            if (typeof callback === 'function') {
                // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                callback(receipt, receipt);
            }
        })
        .on('error', function (error) {
            promiEvent.eventEmitter.emit('error', error);

            if (typeof callback === 'function') {
                callback(error, null);

                return;
            }

            promiEvent.reject(error);
        });

    return promiEvent;
};

/**
 * Adds the ENS node to the arguments
 *
 * @param {string} name
 * @param {array} methodArguments
 *
 * @returns {array}
 */
ResolverMethodHandler.prototype.prepareArguments = function (name, methodArguments) {
    var node = namehash.hash(name);

    if (methodArguments.length > 0) {
        methodArguments.unshift(node);

        return methodArguments;
    }

    return [node];
};

/**
 *
 *
 * @param {Contract} resolver
 * @param {string} methodName
 *
 * @returns {Promise}
 */
ResolverMethodHandler.prototype.checkInterfaceSupport = async function (resolver, methodName) {
    // Skip validation for undocumented interface ids (ex: multihash)
    if (!interfaceIds[methodName]) return;

    var supported = false;
    try {
        supported = await resolver
            .methods
            .supportsInterface(interfaceIds[methodName])
            .call();
    } catch (err) {
        console.warn('Could not verify interface of resolver contract at "' + resolver.options.address + '". ');
    }

    if (!supported) {
        throw errors.ResolverMethodMissingError(resolver.options.address, methodName);
    }
};

module.exports = ResolverMethodHandler;
