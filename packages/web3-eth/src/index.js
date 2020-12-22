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
 * @date 2017
 */

"use strict";

const _ = require('underscore');
const core = require('web3-core');
const helpers = require('web3-core-helpers');
const Subscriptions = require('web3-core-subscriptions').subscriptions;
const Method = require('web3-core-method');
const utils = require('web3-utils');
const Net = require('web3-net');

const ENS = require('web3-eth-ens');
const Personal = require('web3-eth-personal');
const BaseContract = require('web3-eth-contract');
const Iban = require('web3-eth-iban');
const Accounts = require('web3-eth-accounts');
const abi = require('web3-eth-abi');

const methodConfigs = require('./methods.js')

const getNetworkType = require('./getNetworkType.js');
const formatter = helpers.formatters;

class Eth  {
    constructor () {

        core.packageInit(this, arguments);
        this._values = {
            handleRevert: false,
            defaultAccount: null,
            defaultBlock: 'latest',
            transactionBlockTimeout: 50,
            transactionConfirmationBlocks: 24,
            transactionPollingTimeout: 750,
            maxListenersWarningThreshold: 100,
        }
        // sets _requestmanager

        // overwrite package setRequestManager
        const setRequestManager = this.setRequestManager;
        this.setRequestManager = (manager) => {
            setRequestManager(manager);

            this.net.setRequestManager(manager);
            this.personal.setRequestManager(manager);
            this.accounts.setRequestManager(manager);
            this.Contract._requestManager = this._requestManager;
            this.Contract.currentProvider = this._provider;

            return true;
        };

        // overwrite setProvider
        const setProvider = this.setProvider.bind(this);
        this.setProvider = () => {
            setProvider(arguments);

            this.setRequestManager(this._requestManager);

            // Set detectedAddress/lastSyncCheck back to null because the provider could be connected to a different chain now
            this.ens._detectedAddress = null;
            this.ens._lastSyncCheck = null;
        };

        // create a proxy Contract type for this instance, as a Contract's provider
        // is stored as a class member rather than an instance variable. If we do
        // not create this proxy type, changing the provider in one instance of
        // web3-eth would subsequently change the provider for _all_ contract
        // instances!
        const self = this;
        const Contract = function Contract() {
            BaseContract.apply(this, arguments);

            // when Eth.setProvider is called, call packageInit
            // on all contract instances instantiated via this Eth
            // instances. This will update the currentProvider for
            // the contract instances
            var setProvider = self.setProvider;
            self.setProvider = () => {
              setProvider.apply(self, arguments);
              core.packageInit(this, [self]);
            };
        };

        Contract.setProvider = function() {
            BaseContract.setProvider.apply(this, arguments);
        };

        // make our proxy Contract inherit from web3-eth-contract so that it has all
        // the right functionality and so that instanceof and friends work properly
        Contract.prototype = Object.create(BaseContract.prototype);
        Contract.prototype.constructor = Contract;
        // add contract
        this.Contract = Contract;
        this.Contract.defaultAccount = this.defaultAccount;
        this.Contract.defaultBlock = this.defaultBlock;
        this.Contract.transactionBlockTimeout = this.transactionBlockTimeout;
        this.Contract.transactionConfirmationBlocks = this.transactionConfirmationBlocks;
        this.Contract.transactionPollingTimeout = this.transactionPollingTimeout;
        this.Contract.handleRevert = this.handleRevert;
        this.Contract._requestManager = this._requestManager;
        this.Contract._ethAccounts = this.accounts;
        this.Contract.currentProvider = this._requestManager.provider;

        // add IBAN
        this.Iban = Iban;

        // add ABI
        this.abi = abi;

        // add ENS
        this.ens = new ENS(this);
        // add accounts
        this.accounts = new Accounts(this);


        this.clearSubscriptions = this._requestManager.clearSubscriptions.bind(this._requestManager);

        // add net
        this.net = new Net(this);
        // add chain detection
        this.net.getNetworkType = getNetworkType.bind(this);

        // add personal
        this.personal = new Personal(this);
        this.personal.defaultAccount = this.defaultAccount;

        const methods = methodConfigs.map((methodConfig) => {
            return new Method(methodConfig)
        });

        const subscriptions = new Subscriptions({
            name: 'subscribe',
            type: 'eth',
            subscriptions: {
                'newBlockHeaders': {
                    // TODO rename on RPC side?
                    subscriptionName: 'newHeads', // replace subscription with this name
                    params: 0,
                    outputFormatter: formatter.outputBlockFormatter
                },
                'pendingTransactions': {
                    subscriptionName: 'newPendingTransactions', // replace subscription with this name
                    params: 0
                },
                'logs': {
                    params: 1,
                    inputFormatter: [formatter.inputLogFormatter],
                    outputFormatter: formatter.outputLogFormatter,
                    // DUBLICATE, also in web3-eth-contract
                    subscriptionHandler: function (output) {
                        if(output.removed) {
                            this.emit('changed', output);
                        } else {
                            this.emit('data', output);
                        }

                        if (_.isFunction(this.callback)) {
                            this.callback(null, output, this);
                        }
                    }
                },
                'syncing': {
                    params: 0,
                    outputFormatter: formatter.outputSyncingFormatter,
                    subscriptionHandler: function (output) {
                        // fire TRUE at start
                        if(this._isSyncing !== true) {
                            this._isSyncing = true;
                            this.emit('changed', this._isSyncing);

                            if (_.isFunction(this.callback)) {
                                this.callback(null, this._isSyncing, this);
                            }

                            setTimeout(() => {
                                this.emit('data', output);

                                if (_.isFunction(this.callback)) {
                                    this.callback(null, output, this);
                                }
                            }, 0);

                            // fire sync status
                        } else {
                            this.emit('data', output);
                            if (_.isFunction(this.callback)) {
                                this.callback(null, output, this);
                            }

                            // wait for some time before fireing the FALSE
                            clearTimeout(this._isSyncingTimeout);
                            this._isSyncingTimeout = setTimeout(() => {
                                if(output.currentBlock > output.highestBlock - 200) {
                                    this._isSyncing = false;
                                    this.emit('changed', this._isSyncing);

                                    if (_.isFunction(this.callback)) {
                                        this.callback(null, this._isSyncing, this);
                                    }
                                }
                            }, 500);
                        }
                    }
                }
            }
        })
        methods.push(subscriptions)
        methods.forEach((method) => {
            method.attachToObject(this);
            method.setRequestManager(this._requestManager, this.accounts); // second param is the eth.accounts module (necessary for signing transactions locally)
            method.defaultBlock = this._values.defaultBlock;
            method.defaultAccount = this._values.defaultAccount;
            method.transactionBlockTimeout = this._values.transactionBlockTimeout;
            method.transactionConfirmationBlocks = this._values.transactionConfirmationBlocks;
            method.transactionPollingTimeout = this._values.transactionPollingTimeout;
            method.handleRevert = this._values.handleRevert;
        });

    }

    get handleRevert () {
        return this._values.handleRevert;
    }

    set handleRevert (val) {
        this._values.handleRevert = val;

        // also set on the Contract object
        this.Contract.handleRevert = val;

        // update handleRevert
        methodConfigs.forEach((method) => {
            this[method.name].handleRevert = val;
        });
    }

    get defaultCommon () {
        return this._values.defaultCommon;
    }

    set defaultCommon (val) {
        this._values.defaultCommon = val;

        // also set on the Contract object
        this.Contract.defaultCommon = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].defaultCommon = val;
        });
    }

    get defaultHardfork () {
        return this._values.defaultHardfork;
    }

    set defaultHardfork (val) {
        this._values.defaultHardfork = val;

        // also set on the Contract object
        this.Contract.defaultHardfork = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].defaultHardfork = defaultHardfork;
        });
    }
    get defaultChain () {
        return this._values.defaultChain;
    }

    set defaultChain (val) {
        this._values.defaultChain = val;

        // also set on the Contract object
        this.Contract.defaultChain = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].defaultChain = val;
        });
    }

    get transactionPollingTimeout () {
        return this._values.transactionPollingTimeout;
    }

    set transactionPollingTimeout (val) {
        this._values.transactionPollingTimeout = val;

        // also set on the Contract object
        this.Contract.transactionPollingTimeout = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].transactionPollingTimeout = val;
        });
    }

    get transactionConfirmationBlocks () {
        return this._values.transactionConfirmationBlocks;
    }

    set transactionConfirmationBlocks (val) {
        this._values.transactionConfirmationBlocks = val;

        // also set on the Contract object
        this.Contract.transactionConfirmationBlocks = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].transactionConfirmationBlocks = val;
        });
    }

    get transactionBlockTimeout () {
        return this._values.transactionBlockTimeout;
    }

    set transactionBlockTimeout (val) {
        this._values.transactionBlockTimeout = val;

        // also set on the Contract object
        this.Contract.transactionBlockTimeout = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].transactionBlockTimeout = val;
        });
    }

    get defaultAccount () {
        return this._values.defaultAccount;
    }

    set defaultAccount (val) {
        if(val) {
            this._values.defaultAccount = utils.toChecksumAddress(formatter.inputAddressFormatter(val));
        }

        // also set on the Contract object
        this.Contract.defaultAccount = this._values.defaultAccount ;
        this.personal.defaultAccount = this._values.defaultAccount ;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].defaultAccount = this._values.defaultAccount ;
        });

        return val;
    }

    get defaultBlock () {
        return this._values.defaultBlock;
    }

    set defaultBlock (val) {
        this._values.defaultBlock = val;
        // also set on the Contract object
        this.Contract.defaultBlock = val;
        this.personal.defaultBlock = val;

        // update defaultBlock
        methodConfigs.forEach((method) => {
            this[method.name].defaultBlock = val;
        });

        return val;
    }

    get maxListenersWarningThreshold () {
        return this._values.maxListenersWarningThreshold;
    }

    set maxListenersWarningThreshold (val) {
        if (this.currentProvider && this.currentProvider.setMaxListeners){
            this._values.maxListenersWarningThreshold = val;
            this.currentProvider.setMaxListeners(val);
        }
    }

};

// Adds the static givenProvider and providers property to the Eth module
core.addProviders(Eth);


module.exports = Eth;

