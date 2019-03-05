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
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {AbiCoder} abiCoder
     * @param {Accounts} accounts
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Array} abi
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
        accounts,
        abiCoder,
        utils,
        formatters,
        abi = [],
        address = '',
        options = {}
    ) {
        super(provider, providersModuleFactory, methodModuleFactory, null, options);

        this.contractModuleFactory = contractModuleFactory;
        this.abiCoder = abiCoder;
        this.utils = utils;
        this.formatters = formatters;
        this.abiMapper = this.contractModuleFactory.createAbiMapper();
        this.options = options;
        this.accounts = accounts;
        this.methodFactory = this.contractModuleFactory.createMethodFactory();
        this.abiModel = this.abiMapper.map(abi);
        this.transactionSigner = options.transactionSigner;
        this.methods = this.contractModuleFactory.createMethodsProxy(this);
        this.events = this.contractModuleFactory.createEventSubscriptionsProxy(this);

        if (address) {
            this.address = address;
        }
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
     * Getter for the contract address
     *
     * @property address
     *
     * @returns {String}
     */
    get address() {
        return this.options.address;
    }

    /**
     * Setter for the contract address
     *
     * @property address
     *
     * @param {String} value
     */
    set address(value) {
        this.options.address = value;
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

        const eventSubscription = this.events[eventName](options, callback);

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
    async getPastEvents(eventName, options, callback) {
        let method;

        if (eventName !== 'allEvents') {
            if (!this.abiModel.hasEvent(eventName)) {
                throw new Error(`Event with name "${eventName}" does not exists.`);
            }

            method = this.methodFactory.createPastEventLogsMethod(this.abiModel.getEvent(eventName));
        } else {
            method = this.methodFactory.createAllPastEventLogsMethod(this.abiModel);
        }

        method.parameters = [options];
        method.callback = callback;

        const response = await method.execute(this);

        return response;
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
     * TODO: It was and is just a shallow copy here and not a deep copy of the object.
     *
     * Return an new instance of the Contract object
     *
     * @method clone
     *
     * @returns {AbstractContract}
     */
    clone() {
        const clone = this.contractModuleFactory.createContract(
            this.currentProvider,
            this.providersModuleFactory,
            this.accounts,
            [],
            '',
            this.options
        );

        clone.abiModel = this.abiModel;

        return clone;
    }
}
