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
 * @file AbstractContract.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';

export default class AbstractContract extends AbstractWeb3Module {
    /**
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {PromiEvent} PromiEvent
     * @param {AbiCoder} abiCoder
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Accounts} accounts
     * @param {Object} abi
     * @param {String} address
     * @param {Object} options
     *
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        methodModuleFactory,
        contractModuleFactory,
        PromiEvent,
        abiCoder,
        utils,
        formatters,
        accounts,
        abi = AbstractWeb3Module.throwIfMissing('abi'),
        address,
        options
    ) {
        super(provider, providersModuleFactory, methodModuleFactory, null, options);
        this.contractModuleFactory = contractModuleFactory;
        this.abiCoder = abiCoder;
        this.utils = utils;
        this.formatters = formatters;
        this.accounts = accounts;
        this.abiMapper = contractModuleFactory.createAbiMapper();
        this.options = options;
        this.PromiEvent = PromiEvent;
        this.methodFactory = contractModuleFactory.createMethodFactory();
        this.abiModel = this.abiMapper.map(abi);

        if (address) {
            this.address = address;
        }

        this.options = options;

        this.methods = this.contractModuleFactory.createMethodsProxy(
            this,
            this.abiModel,
            this.PromiEvent
        );

        this.events = this.contractModuleFactory.createEventSubscriptionsProxy(
            this,
            this.abiModel,
            this.methodController,
            this.PromiEvent
        );
    }

    /**
     * Adds event listeners and creates a subscription, and remove it once its fired.
     *
     * @method once
     *
     * @param {String} eventName
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {undefined}
     */
    once(eventName, options, callback) {
        if (!callback) {
            throw new Error('Once requires a callback function.');
        }

        if (options) {
            delete options.fromBlock;
        }

        const eventSubscription = this.events[event](options, callback);

        eventSubscription.on('data', () => {
            eventSubscription.unsubscribe();
        });
    }

    /**
     * Returns the past event logs by his name
     *
     * @method getPastEvents
     *
     * @param {String} eventName
     * @param {Object} options
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Array>}
     */
    getPastEvents(eventName, options, callback) {
        if (!this.options.jsonInterface.hasEvent(eventName)) {
            throw new Error(`Event with name "${eventName}does not exists.`);
        }

        const pastEventLogsMethod = this.methodFactory.createPastEventLogsMethod(
            this.options.jsonInterface.getEvent(eventName)
        );

        pastEventLogsMethod.parameters = [options];
        pastEventLogsMethod.callback = callback;

        return pastEventLogsMethod.execute(this);
    }

    /**
     * Deploy an contract and returns an new Contract instance with the correct address set
     *
     * @method deploy
     *
     * @param {Object} options
     *
     * @returns {Promise<Contract>|EventEmitter}
     */
    deploy(options) {
        return this.methods.contractConstructor(options);
    }

    /**
     * Return an new instance of the Contract object
     *
     * @method clone
     *
     * @returns {AbstractContract}
     */
    clone() {
        const contract = new this.constructor(
            this.provider,
            this.providersModuleFactory,
            this.providers,
            this.methodModuleFactory,
            this.contractModuleFactory,
            this.PromiEvent,
            this.abiCoder,
            this.utils,
            this.formatters,
            this.accounts,
            this.abi,
            null,
            this.options
        );

        contract.abiModel = this.abiModel;

        return contract;
    }

    /**
     * Sets the currentProvider and provider property
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(super.setProvider(provider, net) && this.accounts.setProvider(provider, net));
    }

    /**
     * Returns the jsonInterface
     *
     * @property abiModel
     *
     * @returns {AbiModel}
     */
    get jsonInterface() {
        return this.abiModel;
    }

    /**
     * Sets the abiModel property
     *
     * @property abiModel
     *
     * @param {Object} value
     */
    set jsonInterface(value) {
        this.abiModel = this.abiMapper.map(value);
        this.methods.abiModel = this.abiModel;
        this.events.abiModel = this.abiModel;
    }

    /**
     * Sets the defaultGasPrice property on the current object and the accounts module
     *
     * @property defaultGasPrice
     *
     * @param {String} value
     */
    set defaultGasPrice(value) {
        super.defaultGasPrice = value;
        this.accounts.defaultGasPrice = value;
    }

    /**
     * Sets the defaultGas property on the current object and the accounts module
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        super.defaultGas = value;
        this.accounts.defaultGas = value;
    }

    /**
     * Sets the transactionBlockTimeout property on the current object and the accounts module
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        super.transactionBlockTimeout = value;
        this.accounts.transactionBlockTimeout = value;
    }

    /**
     * Sets the transactionConfirmationBlocks property on the current object and the accounts module
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        super.transactionConfirmationBlocks = value;
        this.accounts.transactionConfirmationBlocks = value;
    }

    /**
     * Sets the transactionPollingTimeout property on the current object and the accounts module
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        super.transactionPollingTimeout = value;
        this.accounts.transactionPollingTimeout = value;
    }

    /**
     * Sets the defaultAccount property on the current object and the accounts module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        super.defaultAccount = value;
        this.accounts.defaultAccount = value;
    }

    /**
     * Sets the defaultBlock property on the current object and the accounts module
     *
     * @property defaultBlock
     *
     * @param value
     */
    set defaultBlock(value) {
        super.defaultBlock = value;
        this.accounts.defaultBlock = value;
    }
}
