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
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2017
 */

'use strict';

var errors = require('web3-core-helpers').errors;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');
var promiEvent = require('web3-core-promievent');
var Subscriptions = require('web3-core-subscriptions').subscriptions;

var EthersTransactionUtils = require('@ethersproject/transactions');

var Method = function Method(options) {

    if (!options.call || !options.name) {
        throw new Error('When creating a method you need to provide at least the "name" and "call" property.');
    }

    this.name = options.name;
    this.call = options.call;
    this.params = options.params || 0;
    this.inputFormatter = options.inputFormatter;
    this.outputFormatter = options.outputFormatter;
    this.transformPayload = options.transformPayload;
    this.extraFormatters = options.extraFormatters;
    this.abiCoder = options.abiCoder; // Will be used to encode the revert reason string

    this.requestManager = options.requestManager;

    // reference to eth.accounts
    this.accounts = options.accounts;

    this.defaultBlock = options.defaultBlock || 'latest';
    this.defaultAccount = options.defaultAccount || null;
    this.transactionBlockTimeout = options.transactionBlockTimeout || 50;
    this.transactionConfirmationBlocks = options.transactionConfirmationBlocks || 24;
    this.transactionPollingTimeout = options.transactionPollingTimeout || 750;
    this.defaultCommon = options.defaultCommon;
    this.defaultChain = options.defaultChain;
    this.defaultHardfork = options.defaultHardfork;
    this.handleRevert = options.handleRevert;
};

Method.prototype.setRequestManager = function (requestManager, accounts) {
    this.requestManager = requestManager;

    // reference to eth.accounts
    if (accounts) {
        this.accounts = accounts;
    }

};

Method.prototype.createFunction = function (requestManager, accounts) {
    var func = this.buildCall();
    func.call = this.call;

    this.setRequestManager(requestManager || this.requestManager, accounts || this.accounts);

    return func;
};

Method.prototype.attachToObject = function (obj) {
    var func = this.buildCall();
    func.call = this.call;
    var name = this.name.split('.');
    if (name.length > 1) {
        obj[name[0]] = obj[name[0]] || {};
        obj[name[0]][name[1]] = func;
    } else {
        obj[name[0]] = func;
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
    return typeof this.call === 'function' ? this.call(args) : this.call;
};

/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */
Method.prototype.extractCallback = function (args) {
    if (typeof (args[args.length - 1]) === 'function') {
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
    var _this = this;

    if (!this.inputFormatter) {
        return args;
    }

    return this.inputFormatter.map(function (formatter, index) {
        // bind this for defaultBlock, and defaultAccount
        return formatter ? formatter.call(_this, args[index]) : args[index];
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

    if (Array.isArray(result)) {
        return result.map(function (res) {
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

    var payload = {
        method: call,
        params: params,
        callback: callback
    };

    if (this.transformPayload) {
        payload = this.transformPayload(payload);
    }

    return payload;
};


Method.prototype._confirmTransaction = function (defer, result, payload) {
    var method = this,
        promiseResolved = false,
        canUnsubscribe = true,
        timeoutCount = 0,
        confirmationCount = 0,
        intervalId = null,
        lastBlock = null,
        receiptJSON = '',
        gasProvided = ((!!payload.params[0] && typeof payload.params[0] === 'object') && payload.params[0].gas) ? payload.params[0].gas : null,
        isContractDeployment = (!!payload.params[0] && typeof payload.params[0] === 'object') &&
            payload.params[0].data &&
            payload.params[0].from &&
            !payload.params[0].to,
        hasBytecode = isContractDeployment && payload.params[0].data.length > 2;

    // add custom send Methods
    var _ethereumCalls = [
        new Method({
            name: 'getBlockByNumber',
            call: 'eth_getBlockByNumber',
            params: 2,
            inputFormatter: [formatters.inputBlockNumberFormatter, function (val) {
                return !!val;
            }],
            outputFormatter: formatters.outputBlockFormatter
        }),
        new Method({
            name: 'getTransactionReceipt',
            call: 'eth_getTransactionReceipt',
            params: 1,
            inputFormatter: [null],
            outputFormatter: formatters.outputTransactionReceiptFormatter
        }),
        new Method({
            name: 'getCode',
            call: 'eth_getCode',
            params: 2,
            inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
        }),
        new Method({
            name: 'getTransactionByHash',
            call: 'eth_getTransactionByHash',
            params: 1,
            inputFormatter: [null],
            outputFormatter: formatters.outputTransactionFormatter
        }),
        new Subscriptions({
            name: 'subscribe',
            type: 'eth',
            subscriptions: {
                'newBlockHeaders': {
                    subscriptionName: 'newHeads', // replace subscription with this name
                    params: 0,
                    outputFormatter: formatters.outputBlockFormatter
                }
            }
        })
    ];
    // attach methods to this._ethereumCall
    var _ethereumCall = {};
    _ethereumCalls.forEach(mthd =>  {
        mthd.attachToObject(_ethereumCall);
        mthd.requestManager = method.requestManager; // assign rather than call setRequestManager()
    });


    // fire "receipt" and confirmation events and resolve after
    var checkConfirmation = function (existingReceipt, isPolling, err, blockHeader, sub) {
        if (!err) {
            // create fake unsubscribe
            if (!sub) {
                sub = {
                    unsubscribe: function () {
                        clearInterval(intervalId);
                    }
                };
            }
            // if we have a valid receipt we don't need to send a request
            return (existingReceipt ? promiEvent.resolve(existingReceipt) : _ethereumCall.getTransactionReceipt(result))
            // catch error from requesting receipt
                .catch(function (err) {
                    sub.unsubscribe();
                    promiseResolved = true;
                    utils._fireError(
                        {
                            message: 'Failed to check for transaction receipt:',
                            data: err
                        },
                        defer.eventEmitter,
                        defer.reject
                    );
                })
                // if CONFIRMATION listener exists check for confirmations, by setting canUnsubscribe = false
                .then(async function (receipt) {
                    if (!receipt || !receipt.blockHash) {
                        throw new Error('Receipt missing or blockHash null');
                    }

                    // apply extra formatters
                    if (method.extraFormatters && method.extraFormatters.receiptFormatter) {
                        receipt = method.extraFormatters.receiptFormatter(receipt);
                    }

                    // check if confirmation listener exists
                    if (defer.eventEmitter.listeners('confirmation').length > 0) {
                        var block;

                        // If there was an immediately retrieved receipt, it's already
                        // been confirmed by the direct call to checkConfirmation needed
                        // for parity instant-seal
                        if (existingReceipt === undefined || confirmationCount !== 0) {
                            // Get latest block to emit with confirmation
                            var latestBlock = await _ethereumCall.getBlockByNumber('latest');
                            var latestBlockHash = latestBlock ? latestBlock.hash : null;

                            if (isPolling) { // Check if actually a new block is existing on polling
                                if (lastBlock) {
                                    block = await _ethereumCall.getBlockByNumber(lastBlock.number + 1);
                                    if (block) {
                                        lastBlock = block;
                                        defer.eventEmitter.emit('confirmation', confirmationCount, receipt, latestBlockHash);
                                    }
                                } else {
                                    block = await _ethereumCall.getBlockByNumber(receipt.blockNumber);
                                    lastBlock = block;
                                    defer.eventEmitter.emit('confirmation', confirmationCount, receipt, latestBlockHash);
                                }
                            } else {
                                defer.eventEmitter.emit('confirmation', confirmationCount, receipt, latestBlockHash);
                            }
                        }

                        if ((isPolling && block) || !isPolling) {
                            confirmationCount++;
                        }
                        canUnsubscribe = false;

                        if (confirmationCount === method.transactionConfirmationBlocks + 1) { // add 1 so we account for conf 0
                            sub.unsubscribe();
                            defer.eventEmitter.removeAllListeners();
                        }
                    }

                    return receipt;
                })
                // CHECK for CONTRACT DEPLOYMENT
                .then(async function (receipt) {

                    if (isContractDeployment && !promiseResolved) {

                        if (!receipt.contractAddress) {

                            if (canUnsubscribe) {
                                sub.unsubscribe();
                                promiseResolved = true;
                            }

                            utils._fireError(
                                errors.NoContractAddressFoundError(receipt),
                                defer.eventEmitter,
                                defer.reject,
                                null,
                                receipt
                            );
                            return;
                        }

                        var code;
                        try {
                            code = await _ethereumCall.getCode(receipt.contractAddress);
                        } catch(err){
                            // ignore;
                        }

                        if (!code) {
                            return;
                        }

                        // If deployment is status.true and there was a real
                        // bytecode string, assume it was successful.
                        var deploymentSuccess = receipt.status === true && hasBytecode;

                        if (deploymentSuccess || code.length > 2) {
                            defer.eventEmitter.emit('receipt', receipt);

                            // if contract, return instance instead of receipt
                            if (method.extraFormatters && method.extraFormatters.contractDeployFormatter) {
                                defer.resolve(method.extraFormatters.contractDeployFormatter(receipt));
                            } else {
                                defer.resolve(receipt);
                            }

                            // need to remove listeners, as they aren't removed automatically when succesfull
                            if (canUnsubscribe) {
                                defer.eventEmitter.removeAllListeners();
                            }

                        } else {
                            utils._fireError(
                                errors.ContractCodeNotStoredError(receipt),
                                defer.eventEmitter,
                                defer.reject,
                                null,
                                receipt
                            );
                        }

                        if (canUnsubscribe) {
                            sub.unsubscribe();
                        }
                        promiseResolved = true;
                    }

                    return receipt;
                })
                // CHECK for normal tx check for receipt only
                .then(async function (receipt) {
                    if (!isContractDeployment && !promiseResolved) {
                        if (!receipt.outOfGas &&
                            (!gasProvided || gasProvided !== receipt.gasUsed) &&
                            (receipt.status === true || receipt.status === '0x1' || typeof receipt.status === 'undefined')) {
                            defer.eventEmitter.emit('receipt', receipt);
                            defer.resolve(receipt);

                            // need to remove listeners, as they aren't removed automatically when succesfull
                            if (canUnsubscribe) {
                                defer.eventEmitter.removeAllListeners();
                            }

                        } else {
                            receiptJSON = JSON.stringify(receipt, null, 2);

                            if (receipt.status === false || receipt.status === '0x0') {
                                try {
                                    var revertMessage = null;

                                    if ( method.handleRevert &&
                                        (method.call === 'eth_sendTransaction' || method.call === 'eth_sendRawTransaction'))
                                    {
                                        var txReplayOptions = payload.params[0];

                                        // If send was raw, fetch the transaction and reconstitute the
                                        // original params so they can be replayed with `eth_call`
                                        if (method.call === 'eth_sendRawTransaction'){
                                            var rawTransactionHex = payload.params[0];

                                            var parsedTx = EthersTransactionUtils.parse(rawTransactionHex);

                                            txReplayOptions = formatters.inputTransactionFormatter({
                                                data: parsedTx.data,
                                                to: parsedTx.to,
                                                from: parsedTx.from,
                                                gas: parsedTx.gasLimit.toHexString(),
                                                gasPrice: parsedTx.gasPrice.toHexString(),
                                                value: parsedTx.value.toHexString()
                                            });
                                        }

                                        // Get revert reason string with eth_call
                                        revertMessage = await method.getRevertReason(
                                            txReplayOptions,
                                            receipt.blockNumber
                                        );

                                        if (revertMessage) { // Only throw a revert error if a revert reason is existing
                                            utils._fireError(
                                                errors.TransactionRevertInstructionError(revertMessage.reason, revertMessage.signature, receipt),
                                                defer.eventEmitter,
                                                defer.reject,
                                                null,
                                                receipt
                                            );
                                        } else {
                                            throw false; // Throw false and let the try/catch statement handle the error correctly after
                                        }
                                    } else {
                                        throw false; // Throw false and let the try/catch statement handle the error correctly after
                                    }
                                } catch (error) {
                                    // Throw an normal revert error if no revert reason is given or the detection of it is disabled
                                    utils._fireError(
                                        errors.TransactionRevertedWithoutReasonError(receipt),
                                        defer.eventEmitter,
                                        defer.reject,
                                        null,
                                        receipt
                                    );
                                }
                            } else {
                                // Throw OOG if status is not existing and provided gas and used gas are equal
                                utils._fireError(
                                    errors.TransactionOutOfGasError(receipt),
                                    defer.eventEmitter,
                                    defer.reject,
                                    null,
                                    receipt
                                );
                            }
                        }

                        if (canUnsubscribe) {
                            sub.unsubscribe();
                        }
                        promiseResolved = true;
                    }

                })
                // time out the transaction if not mined after 50 blocks
                .catch(function () {
                    timeoutCount++;

                    // check to see if we are http polling
                    if (!!isPolling) {
                        // polling timeout is different than transactionBlockTimeout blocks since we are triggering every second
                        if (timeoutCount - 1 >= method.transactionPollingTimeout) {
                            sub.unsubscribe();
                            promiseResolved = true;
                            utils._fireError(
                                errors.TransactionError('Transaction was not mined within ' + method.transactionPollingTimeout + ' seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!'),
                                defer.eventEmitter,
                                defer.reject
                            );
                        }
                    } else {
                        if (timeoutCount - 1 >= method.transactionBlockTimeout) {
                            sub.unsubscribe();
                            promiseResolved = true;
                            utils._fireError(
                                errors.TransactionError('Transaction was not mined within ' + method.transactionBlockTimeout + ' blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!'),
                                defer.eventEmitter,
                                defer.reject
                            );
                        }
                    }
                });


        } else {
            sub.unsubscribe();
            promiseResolved = true;
            utils._fireError({
                message: 'Failed to subscribe to new newBlockHeaders to confirm the transaction receipts.',
                data: err
            }, defer.eventEmitter, defer.reject);
        }
    };

    // start watching for confirmation depending on the support features of the provider
    var startWatching = function (existingReceipt) {
        const startInterval = () => {
            intervalId = setInterval(checkConfirmation.bind(null, existingReceipt, true), 1000);
        };

        if (!this.requestManager.provider.on) {
            startInterval();
        } else {
            _ethereumCall.subscribe('newBlockHeaders', function (err, blockHeader, sub) {
                if (err || !blockHeader) {
                    // fall back to polling
                    startInterval();
                } else {
                    checkConfirmation(existingReceipt, false, err, blockHeader, sub);
                }
            });
        }
    }.bind(this);


    // first check if we already have a confirmed transaction
    _ethereumCall.getTransactionReceipt(result)
        .then(function (receipt) {
            if (receipt && receipt.blockHash) {
                if (defer.eventEmitter.listeners('confirmation').length > 0) {
                    // We must keep on watching for new Blocks, if a confirmation listener is present
                    startWatching(receipt);
                }
                checkConfirmation(receipt, false);

            } else if (!promiseResolved) {
                startWatching();
            }
        })
        .catch(function () {
            if (!promiseResolved) startWatching();
        });

};


var getWallet = function (from, accounts) {
    var wallet = null;

    // is index given
    if (typeof from === 'number') {
        wallet = accounts.wallet[from];

        // is account given
    } else if (!!from && typeof from === 'object' && from.address && from.privateKey) {
        wallet = from;

        // search in wallet for address
    } else {
        wallet = accounts.wallet[from.toLowerCase()];
    }

    return wallet;
};

Method.prototype.buildCall = function () {
    var method = this,
        isSendTx = (method.call === 'eth_sendTransaction' || method.call === 'eth_sendRawTransaction'), // || method.call === 'personal_sendTransaction'
        isCall = (method.call === 'eth_call');

    // actual send function
    var send = function () {
        var defer = promiEvent(!isSendTx),
            payload = method.toPayload(Array.prototype.slice.call(arguments));

        // CALLBACK function
        var sendTxCallback = function (err, result) {
            if (method.handleRevert && isCall && method.abiCoder) {
                var reasonData;

                // Ganache / Geth <= 1.9.13 return the reason data as a successful eth_call response
                // Geth >= 1.9.15 attaches the reason data to an error object.
                // Geth 1.9.14 is missing revert reason (https://github.com/ethereum/web3.js/issues/3520)
                if (!err && method.isRevertReasonString(result)){
                    reasonData = result.substring(10);
                } else if (err && err.data){
                    reasonData = err.data.substring(10);
                }

                if (reasonData){
                    var reason = method.abiCoder.decodeParameter('string', '0x' + reasonData);
                    var signature = 'Error(String)';

                    utils._fireError(
                        errors.RevertInstructionError(reason, signature),
                        defer.eventEmitter,
                        defer.reject,
                        payload.callback,
                        {
                            reason: reason,
                            signature: signature
                        }
                    );

                    return;
                }
            }

            try {
                result = method.formatOutput(result);
            } catch (e) {
                err = e;
            }

            if (result instanceof Error) {
                err = result;
            }

            if (!err) {
                if (payload.callback) {
                    payload.callback(null, result);
                }
            } else {
                if (err.error) {
                    err = err.error;
                }

                return utils._fireError(err, defer.eventEmitter, defer.reject, payload.callback);
            }

            // return PROMISE
            if (!isSendTx) {
                if (!err) {
                    defer.resolve(result);
                }

                // return PROMIEVENT
            } else {
                defer.eventEmitter.emit('transactionHash', result);

                method._confirmTransaction(defer, result, payload);
            }

        };

        // SENDS the SIGNED SIGNATURE
        var sendSignedTx = function (sign) {

            var signedPayload = { ... payload, 
                method: 'eth_sendRawTransaction',
                params: [sign.rawTransaction]
            };

            method.requestManager.send(signedPayload, sendTxCallback);
        };


        var sendRequest = function (payload, method) {

            if (method && method.accounts && method.accounts.wallet && method.accounts.wallet.length) {
                var wallet;

                // ETH_SENDTRANSACTION
                if (payload.method === 'eth_sendTransaction') {
                    var tx = payload.params[0];
                    wallet = getWallet((!!tx && typeof tx === 'object') ? tx.from : null, method.accounts);


                    // If wallet was found, sign tx, and send using sendRawTransaction
                    if (wallet && wallet.privateKey) {
                        var tx = JSON.parse(JSON.stringify(tx));
                        delete tx.from;

                        if (method.defaultChain && !tx.chain) {
                            tx.chain = method.defaultChain;
                        }

                        if (method.defaultHardfork && !tx.hardfork) {
                            tx.hardfork = method.defaultHardfork;
                        }

                        if (method.defaultCommon && !tx.common) {
                            tx.common = method.defaultCommon;
                        }

                        method.accounts.signTransaction(tx, wallet.privateKey)
                            .then(sendSignedTx)
                            .catch(function (err) {
                                if (typeof defer.eventEmitter.listeners === 'function' && defer.eventEmitter.listeners('error').length) {
                                    try {
                                        defer.eventEmitter.emit('error', err);
                                    } catch (err) {
                                        // Ignore userland error prevent it to bubble up within web3.
                                    }
                                    defer.eventEmitter.removeAllListeners();
                                    defer.eventEmitter.catch(function () {
                                    });
                                }
                                defer.reject(err);
                            });
                        return;
                    }

                    // ETH_SIGN
                } else if (payload.method === 'eth_sign') {
                    var data = payload.params[1];
                    wallet = getWallet(payload.params[0], method.accounts);

                    // If wallet was found, sign tx, and send using sendRawTransaction
                    if (wallet && wallet.privateKey) {
                        var sign = method.accounts.sign(data, wallet.privateKey);

                        if (payload.callback) {
                            payload.callback(null, sign.signature);
                        }

                        defer.resolve(sign.signature);
                        return;
                    }


                }
            }


            return method.requestManager.send(payload, sendTxCallback);
        };

        // Send the actual transaction
        if (isSendTx
            && !!payload.params[0]
            && typeof payload.params[0] === 'object'
            && (
                typeof payload.params[0].gasPrice === 'undefined'
                && (
                    typeof payload.params[0].maxPriorityFeePerGas === 'undefined'
                    || typeof payload.params[0].maxFeePerGas === 'undefined'
                )
            )
        ) {
            _handleTxPricing(method, payload.params[0]).then(txPricing => {
                if (txPricing.gasPrice !== undefined) {
                    payload.params[0].gasPrice = txPricing.gasPrice;
                } else if (
                    txPricing.maxPriorityFeePerGas !== undefined
                    && txPricing.maxFeePerGas !== undefined
                ) {
                    payload.params[0].maxPriorityFeePerGas = txPricing.maxPriorityFeePerGas;
                    payload.params[0].maxFeePerGas = txPricing.maxFeePerGas;
                }

                if (isSendTx) {
                    setTimeout(() => {
                        defer.eventEmitter.emit('sending', payload);
                    }, 0);
                }

                sendRequest(payload, method);
            })
        } else {
            if (isSendTx) {
                setTimeout(() => {
                    defer.eventEmitter.emit('sending', payload);
                }, 0);
            }

            sendRequest(payload, method);
        }

        if (isSendTx) {
            setTimeout(() => {
                defer.eventEmitter.emit('sent', payload);
            }, 0);
        }

        return defer.eventEmitter;
    };

    // necessary to attach things to the method
    send.method = method;
    // necessary for batch requests
    send.request = this.request.bind(this);
    return send;
};

function _handleTxPricing(method, tx) {
    return new Promise((resolve, reject) => {
        try {
            var getBlockByNumber = (new Method({
                name: 'getBlockByNumber',
                call: 'eth_getBlockByNumber',
                params: 2,
                inputFormatter: [function(blockNumber) {
                    return blockNumber ? utils.toHex(blockNumber) : 'latest'
                }, function() {
                    return false
                }]
            })).createFunction(method.requestManager);
            var getGasPrice = (new Method({
                name: 'getGasPrice',
                call: 'eth_gasPrice',
                params: 0
            })).createFunction(method.requestManager);

            Promise.all([
                getBlockByNumber(),
                getGasPrice()
            ]).then(responses => {
                const [block, gasPrice] = responses;
                if (block && block.baseFeePerGas) {
                    // The network supports EIP-1559

                    // Taken from https://github.com/ethers-io/ethers.js/blob/ba6854bdd5a912fe873d5da494cb5c62c190adde/packages/abstract-provider/src.ts/index.ts#L230
                    let maxPriorityFeePerGas, maxFeePerGas;

                    if (tx.gasPrice) {
                        // Using legacy gasPrice property on an eip-1559 network,
                        // so use gasPrice as both fee properties
                        maxPriorityFeePerGas = tx.gasPrice;
                        maxFeePerGas = tx.gasPrice;
                        delete tx.gasPrice;
                    } else {
                        maxPriorityFeePerGas = tx.maxPriorityFeePerGas || '0x3B9ACA00'; // 1 Gwei
                        maxFeePerGas = tx.maxFeePerGas ||
                            utils.toHex(
                                utils.toBN(block.baseFeePerGas)
                                    .mul(utils.toBN(2))
                                    .add(utils.toBN(maxPriorityFeePerGas))
                            );
                    }
                    resolve({ maxFeePerGas, maxPriorityFeePerGas });
                } else {
                    if (tx.maxPriorityFeePerGas || tx.maxFeePerGas)
                        throw Error("Network doesn't support eip-1559")
                    resolve({ gasPrice });
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Returns the revert reason string if existing or otherwise false.
 *
 * @method getRevertReason
 *
 * @param {Object} txOptions
 * @param {Number} blockNumber
 *
 * @returns {Promise<Boolean|String>}
 */
Method.prototype.getRevertReason = function (txOptions, blockNumber) {
    var self = this;

    return new Promise(function (resolve, reject) {
        (new Method({
            name: 'call',
            call: 'eth_call',
            params: 2,
            abiCoder: self.abiCoder,
            handleRevert: true
        }))
            .createFunction(self.requestManager)(txOptions, utils.numberToHex(blockNumber))
            .then(function () {
                resolve(false);
            })
            .catch(function (error) {
                if (error.reason) {
                    resolve({
                        reason: error.reason,
                        signature: error.signature
                    });
                } else {
                    reject(error);
                }
            });
    });
};

/**
 * Checks if the given hex string is a revert message from the EVM
 *
 * @method isRevertReasonString
 *
 * @param {String} data - Hex string prefixed with 0x
 *
 * @returns {Boolean}
 */
Method.prototype.isRevertReasonString = function (data) {
    return typeof data === 'string' && ((data.length - 2) / 2) % 32 === 4 && data.substring(0, 10) === '0x08c379a0';
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
