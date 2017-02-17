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
 * @file index.js
 * @author Marek Kotewicz <marek@ethcore.io>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var _ = require('underscore');
var errors = require('web3-core-helpers').errors;
var utils = require('web3-utils');
var promiEvent = require('web3-core-promiEvent');

var TIMEOUTBLOCK = 50;
var CONFIRMATIONBLOCKS = 12;

var Method = function (options) {

    if(!options.call || !options.name) {
        throw new Error('When creating a method you need to provide at least the "name" and "call" property.');
    }

    this.name = options.name;
    this.call = options.call;
    this.params = options.params || 0;
    this.inputFormatter = options.inputFormatter;
    this.outputFormatter = options.outputFormatter;
    this.requestManager = null;
};

Method.prototype.setRequestManager = function (rm, eth) {
    this.requestManager = rm;

    if (eth) {
        this.eth = eth;
    }
};

/**
 * Should be used to determine name of the jsonrpc method based on arguments
 *
 * @method getCall
 * @param {Array} arguments
 * @return {String} name of jsonrpc method
 */
Method.prototype.getCall = function (args) {
    return utils.isFunction(this.call) ? this.call(args) : this.call;
};

/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */
Method.prototype.extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

/**
 * Should be called to check if the number of arguments is correct
 *
 * @method validateArgs
 * @param {Array} arguments
 * @throws {Error} if it is not
 */
Method.prototype.validateArgs = function (args) {
    if (args.length !== this.params) {
        throw errors.InvalidNumberOfParams(args.length, this.params, this.name);
    }
};

/**
 * Should be called to format input args of method
 *
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */
Method.prototype.formatInput = function (args) {
    if (!this.inputFormatter) {
        return args;
    }

    return this.inputFormatter.map(function (formatter, index) {
        return formatter ? formatter(args[index]) : args[index];
    });
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */
Method.prototype.formatOutput = function (result) {
    var _this = this;

    if(utils.isArray(result)) {
        return result.map(function(res){
            return _this.outputFormatter && res ? _this.outputFormatter(res) : res;
        });
    } else {
        return this.outputFormatter && result ? this.outputFormatter(result) : result;
    }
};

/**
 * Should create payload from given input args
 *
 * @method toPayload
 * @param {Array} args
 * @return {Object}
 */
Method.prototype.toPayload = function (args) {
    var call = this.getCall(args);
    var callback = this.extractCallback(args);
    var params = this.formatInput(args);
    this.validateArgs(params);

    return {
        method: call,
        params: params,
        callback: callback
    };
};

Method.prototype.attachToObject = function (obj) {
    var func = this.buildCall();
    func.call = this.call; // TODO!!! that's ugly. filter.js uses it
    var name = this.name.split('.');
    if (name.length > 1) {
        obj[name[0]] = obj[name[0]] || {};
        obj[name[0]][name[1]] = func;
    } else {
        obj[name[0]] = func;
    }
};

Method.prototype._confirmTransaction = function (defer, result, payload) {
    var method = this,
        promiseResolved = false,
        canUnsubscribe = true,
        timeoutCount = 0,
        confirmationCount = 0,
        gasProvided = (_.isObject(payload.params[0]) && payload.params[0].gas) ? payload.params[0].gas : null,
        isContractDeployment = _.isObject(payload.params[0]) &&
            payload.params[0].data &&
            payload.params[0].from &&
            !payload.params[0].to,
        receiptError = new Error('Failed to check for transaction receipt.');


    // fire "receipt" and confirmation events and resolve after
    method.eth.subscribe('newBlockHeaders', function (err, block, sub) {
        if(!err) {

            method.eth.getTransactionReceipt(result)
            // catch error from requesting receipt
            .catch(function () {
                sub.unsubscribe();
                promiseResolved = true;
                utils._fireError(receiptError, defer.eventEmitter, defer.reject);
            })
            // if CONFIRMATION listener exists check for confirmations
            .then(function(receipt) {

                if (!receipt) {
                    throw new Error('Receipt is null');
                }

                if (defer.eventEmitter.listeners('confirmation').length > 0) {

                    defer.eventEmitter.emit('confirmation', confirmationCount, receipt);

                    canUnsubscribe = false;
                    confirmationCount++;

                    if (confirmationCount === CONFIRMATIONBLOCKS + 1) { // add 1 so we account for conf 0
                        sub.unsubscribe();
                        defer.eventEmitter.removeAllListeners();
                    }
                }

                return receipt;
            })
            // CHECK for CONTRACT DEPLOYMENT
            .then(function(receipt) {

                if (isContractDeployment && !promiseResolved) {

                    if (!receipt.contractAddress) {
                        promiseResolved = true;
                        utils._fireError(new Error('The transaction receipt didn\'t contain a contract address.'), defer.eventEmitter, defer.reject);
                        return;
                    }

                    method.eth.getCode(receipt.contractAddress, function (e, code) {

                        if (!code) {
                            return;
                        }


                        if (code.length > 2) {
                            defer.eventEmitter.emit('receipt', receipt);
                            defer.resolve(receipt);

                        } else {
                            utils._fireError(new Error('The contract code couldn\'t be stored, please check your gas limit.'), defer.eventEmitter, defer.reject);
                        }

                        if (canUnsubscribe) {
                            sub.unsubscribe();
                            defer.eventEmitter.removeAllListeners();
                        }
                        promiseResolved = true;
                    });
                }

                return receipt;
            })
           // CHECK for normal tx check for receipt only
            .then(function(receipt) {

                if (!isContractDeployment && !promiseResolved) {

                    if(!receipt.outOfGas &&
                       (!gasProvided || gasProvided !== receipt.gasUsed)) {
                        defer.eventEmitter.emit('receipt', receipt);
                        defer.resolve(receipt);

                    } else {
                        utils._fireError([new Error('Transaction ran out of gas. Please provide more gas.'), receipt], defer.eventEmitter, defer.reject);
                    }

                    if (canUnsubscribe) {
                        sub.unsubscribe();
                        defer.eventEmitter.removeAllListeners();
                    }
                    promiseResolved = true;
                }

            })
            // time out the transaction if not mined after 50 blocks
            .catch(function () {
                if (timeoutCount >= TIMEOUTBLOCK) {
                    sub.unsubscribe();
                    promiseResolved = true;
                    utils._fireError(new Error('Transaction was not mined within 50 blocks, please make sure your transaction was properly send. Be aware that it might still be mined!'), defer.eventEmitter, defer.reject);
                }

                timeoutCount++;
            });


        } else {
            sub.unsubscribe();
            promiseResolved = true;
            utils._fireError(receiptError, defer.eventEmitter, defer.reject);
        }
    });
};

Method.prototype.buildCall = function() {
    var method = this,
        isSendTx = (method.call === 'eth_sendTransaction' || method.call === 'eth_sendRawTransaction');



    // actual send function
    var send = function () {
        var defer = promiEvent(!isSendTx),
            payload = method.toPayload(Array.prototype.slice.call(arguments));


        method.requestManager.send(payload, function (err, result) {
            result = method.formatOutput(result);


            if (!err) {
                if (payload.callback) {
                    payload.callback(null, result);
                }
            } else {
                if(err.error) {
                    err = err.error;
                }

                utils._fireError(err, defer.eventEmitter, defer.reject, payload.callback);
                return;
            }

            // return PROMISE
            if (!isSendTx) {

                if (!err) {
                    defer.resolve(result);

                }

            // return PROMIEVENT
            } else if (method.eth) {

                defer.eventEmitter.emit('transactionHash', result);


                method._confirmTransaction(defer, result, payload);


            }

        });

        return defer.eventEmitter;
    };

    send.request = this.request.bind(this);
    return send;
};

/**
 * Should be called to create the pure JSONRPC request which can be used in a batch request
 *
 * @method request
 * @return {Object} jsonrpc request
 */
Method.prototype.request = function () {
    var payload = this.toPayload(Array.prototype.slice.call(arguments));
    payload.format = this.formatOutput.bind(this);
    return payload;
};

module.exports = Method;
