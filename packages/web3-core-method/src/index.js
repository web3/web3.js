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

/* eslint-disable no-underscore-dangle, class-methods-use-this */

import _ from 'lodash';
import { InvalidNumberOfParams } from 'web3-core-helpers/lib/errors';
import * as formatters from 'web3-core-helpers/lib/formatters';
import { fireError } from 'web3-utils/lib/utils';
import promiEvent from 'web3-core-promievent';
import { subscriptions as Subscriptions } from 'web3-core-subscriptions';

const TIMEOUTBLOCK = 50;
const CONFIRMATIONBLOCKS = 24;
const getWallet = (from, accounts) => {
    let wallet = null;

    // is index given
    if (_.isNumber(from)) {
        wallet = accounts.wallet[from];

        // is account given
    } else if (_.isObject(from) && from.address && from.privateKey) {
        wallet = from;

        // search in wallet for address
    } else {
        wallet = accounts.wallet[from.toLowerCase()];
    }

    return wallet;
};

class Method {
    constructor (options = {}) {
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

        this.requestManager = options.requestManager;

        // reference to eth.accounts
        this.accounts = options.accounts;

        this.defaultBlock = options.defaultBlock || 'latest';
        this.defaultAccount = options.defaultAccount || null;
    }

    setRequestManager (requestManager, accounts) {
        this.requestManager = requestManager;

        // reference to eth.accounts
        if (accounts) {
            this.accounts = accounts;
        }
    }

    createFunction (requestManager, accounts) {
        const func = this.buildCall();
        func.call = this.call;
        this.setRequestManager(requestManager || this.requestManager, accounts || this.accounts);
        return func;
    }

    attachToObject (obj) {
        /* eslint-disable no-param-reassign */
        const func = this.buildCall();
        func.call = this.call;
        const name = this.name.split('.');
        if (name.length > 1) {
            obj[name[0]] = obj[name[0]] || {};
            obj[name[0]][name[1]] = func;
        } else {
            obj[name[0]] = func;
        }
        /* eslint-enable no-param-reassign */
    }

    /**
      * Should be used to determine name of the jsonrpc method based on arguments
      *
      * @method getCall
      * @param {Array} arguments
      * @return {String} name of jsonrpc method
      */
    getCall (args) {
        return _.isFunction(this.call) ? this.call(args) : this.call;
    }

    /**
     * Should be used to extract callback from array of arguments. Modifies input param
     *
     * @method extractCallback
     * @param {Array} arguments
     * @return {Function|Null} callback, if exists
     */
    extractCallback (args) {
        /* eslint-disable no-param-reassign */
        if (_.isFunction(args[args.length - 1])) {
            return args.pop(); // modify the args array!
        }
        return undefined;
        /* eslint-enable no-param-reassign */
    }

    /**
      * Should be called to check if the number of arguments is correct
      *
      * @method validateArgs
      * @param {Array} arguments
      * @throws {Error} if it is not
      */
    validateArgs (args) {
        if (args.length !== this.params) {
            throw InvalidNumberOfParams(args.length, this.params, this.name);
        }
    }

    /**
      * Should be called to format input args of method
      *
      * @method formatInput
      * @param {Array}
      * @return {Array}
      */
    formatInput (args) {
        if (!this.inputFormatter) {
            return args;
        }
        return this.inputFormatter.map((formatter, index) => {
            // bind this for defaultBlock, and defaultAccount
            if (formatter) {
                return formatter.call(this, args[index]);
            }
            return args[index];
        });
    }

    /**
      * Should be called to format output(result) of method
      *
      * @method formatOutput
      * @param {Object}
      * @return {Object}
      */
    formatOutput (result) {
        if (_.isArray(result)) {
            return result.map((res) => {
                if (this.outputFormatter && res) {
                    return this.outputFormatter(res);
                }
                return res;
            });
        }
        return this.outputFormatter && result ? this.outputFormatter(result) : result;
    }

    /**
      * Should create payload from given input args
      *
      * @method toPayload
      * @param {Array} args
      * @return {Object}
      */
    toPayload (args) {
        const call = this.getCall(args);
        const callback = this.extractCallback(args);
        const params = this.formatInput(args);
        this.validateArgs(params);

        let payload = {
            method: call,
            params,
            callback,
        };

        if (this.transformPayload) {
            payload = this.transformPayload(payload);
        }

        return payload;
    }

    async _confirmTransaction (defer, result, payload) {
        const method = this;
        let promiseResolved = false;
        let canUnsubscribe = true;
        let timeoutCount = 0;
        let confirmationCount = 0;
        let intervalId = null;
        let gasProvided = null;
        if (_.isObject(payload.params[0]) && payload.params[0].gas) {
            gasProvided = payload.params[0].gas;
        }

        const isContractDeployment = _.isObject(payload.params[0]) &&
             payload.params[0].data &&
             payload.params[0].from &&
             !payload.params[0].to;

        // add custom send Methods
        const _ethereumCalls = [
            new Method({
                name: 'getTransactionReceipt',
                call: 'eth_getTransactionReceipt',
                params: 1,
                inputFormatter: [null],
                outputFormatter: formatters.outputTransactionReceiptFormatter,
            }),
            new Method({
                name: 'getCode',
                call: 'eth_getCode',
                params: 2,
                inputFormatter: [
                    formatters.inputAddressFormatter,
                    formatters.inputDefaultBlockNumberFormatter,
                ],
            }),
            new Subscriptions({
                name: 'subscribe',
                type: 'eth',
                subscriptions: {
                    newBlockHeaders: {
                        subscriptionName: 'newHeads', // replace subscription with this name
                        params: 0,
                        outputFormatter: formatters.outputBlockFormatter,
                    },
                },
            }),
        ];

        // attach methods to this._ethereumCall
        const _ethereumCall = {};
        _.each(_ethereumCalls, (mthd) => {
            mthd.attachToObject(_ethereumCall);
            // assign rather than call setRequestManager()
            mthd.requestManager = this.requestManager; // eslint-disable-line no-param-reassign
        });

        // fire "receipt" and confirmation events and resolve after
        const checkConfirmation = async (err, blockHeader, sub, existingReceipt) => {
            // create fake unsubscribe
            if (!sub) {
                sub = { // eslint-disable-line no-param-reassign
                    unsubscribe () {
                        clearInterval(intervalId);
                    },
                };
            }

            if (err) {
                sub.unsubscribe();
                promiseResolved = true;
                return fireError({
                    message: 'Failed to subscribe to new newBlockHeaders to confirm the transaction receipts.',
                    data: err,
                }, defer.eventEmitter, defer.reject);
            }

            // if we have a valid receipt we don't need to send a request
            let promise = null;
            if (existingReceipt) {
                promise = promiEvent.resolve(existingReceipt);
            } else {
                promise = _ethereumCall.getTransactionReceipt(result);
            }

            let receipt = null;
            try {
                receipt = await promise;
            } catch (e) {
                sub.unsubscribe();
                promiseResolved = true;
                fireError({
                    message: 'Failed to check for transaction receipt:',
                    data: err,
                }, defer.eventEmitter, defer.reject);

                // TODO fix timeout block

                // time out the transaction if not mined after 50 blocks
                timeoutCount += 1;

                if (timeoutCount - 1 >= TIMEOUTBLOCK) {
                    sub.unsubscribe();
                    promiseResolved = true;
                    const notMined = new Error('Transaction was not mined within 50 blocks, please make sure your transaction was properly send. Be aware that it might still be mined!');
                    return fireError(notMined, defer.eventEmitter, defer.reject);
                }
            }

            if (!receipt || !receipt.blockHash) {
                throw new Error('Receipt missing or blockHash null');
            }

            // apply extra formatters
            if (method.extraFormatters && method.extraFormatters.receiptFormatter) {
                receipt = method.extraFormatters.receiptFormatter(receipt);
            }

            // check if confirmation listener exists
            if (defer.eventEmitter.listeners('confirmation').length > 0) {
                defer.eventEmitter.emit('confirmation', confirmationCount, receipt);

                // if CONFIRMATION listener exists check for confirmations,
                // by setting canUnsubscribe = false
                canUnsubscribe = false;
                // add 1 so we account for conf 0
                confirmationCount += 1;

                if (confirmationCount === CONFIRMATIONBLOCKS + 1) {
                    sub.unsubscribe();
                    defer.eventEmitter.removeAllListeners();
                }
            }

            // CHECK for CONTRACT DEPLOYMENT
            if (isContractDeployment && !promiseResolved) {
                if (!receipt.contractAddress) {
                    if (canUnsubscribe) {
                        sub.unsubscribe();
                        promiseResolved = true;
                    }

                    const contractAddressTxError = new Error('The transaction receipt didn\'t contain a contract address.');
                    return fireError(contractAddressTxError, defer.eventEmitter, defer.reject);
                }

                let code;
                try {
                    code = await _ethereumCall.getCode(receipt.contractAddress);
                } catch (codeError) {} // eslint-disable-line no-empty

                if (code && code.length > 2) {
                    defer.eventEmitter.emit('receipt', receipt);

                    // if contract, return instance instead of receipt
                    if (method.extraFormatters && method.extraFormatters.contractDeployFormatter) {
                        defer.resolve(method.extraFormatters.contractDeployFormatter(receipt));
                    } else {
                        defer.resolve(receipt);
                    }

                    // need to remove listeners,
                    // as they aren't removed automatically when successful
                    if (canUnsubscribe) {
                        defer.eventEmitter.removeAllListeners();
                    }
                } else {
                    const contractCodeError = new Error('The contract code couldn\'t be stored, please check your gas limit.');
                    fireError(contractCodeError, defer.eventEmitter, defer.reject);
                }

                if (canUnsubscribe) {
                    sub.unsubscribe();
                }
                promiseResolved = true;
            }

            // CHECK for normal tx check for receipt only
            if (!isContractDeployment && !promiseResolved) {
                if (!receipt.outOfGas && (!gasProvided || gasProvided !== receipt.gasUsed)) {
                    defer.eventEmitter.emit('receipt', receipt);
                    defer.resolve(receipt);

                    // need to remove listeners,
                    // as they aren't removed automatically when successful
                    if (canUnsubscribe) {
                        defer.eventEmitter.removeAllListeners();
                    }
                } else {
                    if (receipt) {
                        receipt = JSON.stringify(receipt, null, 2);
                    }
                    const outOfGasError = new Error(`Transaction ran out of gas. Please provide more gas:\n${receipt}`);
                    fireError(outOfGasError, defer.eventEmitter, defer.reject);
                }

                if (canUnsubscribe) {
                    sub.unsubscribe();
                }
                promiseResolved = true;
            }

            return null;
        };

        // start watching for confirmation depending on the support features of the provider
        const startWatching = () => {
            // if provider allows PUB/SUB
            if (_.isFunction(this.requestManager.provider.on)) {
                _ethereumCall.subscribe('newBlockHeaders', checkConfirmation);
            } else {
                intervalId = setInterval(checkConfirmation, 1000);
            }
        };

        // first check if we already have a confirmed transaction
        try {
            const receipt = await _ethereumCall.getTransactionReceipt(result);
            if (receipt && receipt.blockHash) {
                if (defer.eventEmitter.listeners('confirmation').length > 0) {
                    // if a confirmation listener is present and
                    // the promise has not been resolved,
                    // we must keep on watching for new blocks
                    setTimeout(() => {
                        if (!promiseResolved) {
                            startWatching();
                        }
                    }, 1000);
                }
                return checkConfirmation(null, null, null, receipt);
            } else if (!promiseResolved) {
                startWatching();
            }
        } catch (e) {
            if (!promiseResolved) {
                startWatching();
            }
        }

        return null;
    }

    buildCall () {
        const method = this; // || method.call === 'personal_sendTransaction'
        const isSendTx = (method.call === 'eth_sendTransaction' || method.call === 'eth_sendRawTransaction');

        // actual send function
        const send = (...args) => {
            const defer = promiEvent(!isSendTx);
            const payload = method.toPayload(args);

            // CALLBACK function
            const sendTxCallback = (err, result) => {
                /* eslint-disable no-param-reassign */
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

                    fireError(err, defer.eventEmitter, defer.reject, payload.callback);
                    return;
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

                /* eslint-enable no-param-reassign */
            };

            // SENDS the SIGNED SIGNATURE
            const sendSignedTx = (sign) => {
                payload.method = 'eth_sendRawTransaction';
                payload.params = [sign.rawTransaction];

                method.requestManager.send(payload, sendTxCallback);
            };

            const sendRequest = (pload, mtd) => {
                if (mtd
                  && mtd.accounts
                  && mtd.accounts.wallet
                  && mtd.accounts.wallet.length) {
                    let wallet;

                    // ETH_SENDTRANSACTION
                    if (pload.mtd === 'eth_sendTransaction') {
                        const tx = pload.params[0];
                        wallet = getWallet((_.isObject(tx)) ? tx.from : null, mtd.accounts);

                        // If wallet was found, sign tx, and send using sendRawTransaction
                        if (wallet && wallet.privateKey) {
                            delete tx.from;
                            const signature = mtd.accounts.signTransaction(
                                tx,
                                wallet.privateKey,
                            );

                            if (_.isFunction(signature.then)) {
                                return signature.then(sendSignedTx);
                            }
                            return sendSignedTx(signature);
                        }

                        // ETH_SIGN
                    } else if (pload.mtd === 'eth_sign') {
                        const data = pload.params[1];
                        wallet = getWallet(pload.params[0], mtd.accounts);

                        // If wallet was found, sign tx, and send using sendRawTransaction
                        if (wallet && wallet.privateKey) {
                            const sign = mtd.accounts.sign(data, wallet.privateKey);

                            if (pload.callback) {
                                pload.callback(null, sign.signature);
                            }

                            return defer.resolve(sign.signature);
                        }
                    }
                }

                return mtd.requestManager.send(pload, sendTxCallback);
            };

            // Send the actual transaction
            if (isSendTx && _.isObject(payload.params[0]) && !payload.params[0].gasPrice) {
                const getGasPrice = (new Method({
                    name: 'getGasPrice',
                    call: 'eth_gasPrice',
                    params: 0,
                })).createFunction(method.requestManager);

                getGasPrice((err, gasPrice) => {
                    if (gasPrice) {
                        payload.params[0].gasPrice = gasPrice;
                    }
                    sendRequest(payload, method);
                });
            } else {
                sendRequest(payload, method);
            }


            return defer.eventEmitter;
        };

        // necessary to attach things to the method
        send.method = method;
        // necessary for batch requests
        send.request = this.request.bind(this);
        return send;
    }

    /**
      * Should be called to create the pure JSONRPC request which can be used in a batch request
      *
      * @method request
      * @return {Object} jsonrpc request
      */
    request (...args) {
        const payload = this.toPayload(args);
        payload.format = this.formatOutput.bind(this);
        return payload;
    }
}

module.exports = Method;
