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
 * @file ContractModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbiModel from '../models/AbiModel';
import AbiItemModel from '../models/AbiItemModel';
import MethodEncoder from '../encoders/MethodEncoder';
import EventFilterEncoder from '../encoders/EventFilterEncoder';
import AllEventsFilterEncoder from '../encoders/AllEventsFilterEncoder';
import EventLogDecoder from '../decoders/EventLogDecoder';
import AllEventsLogDecoder from '../decoders/AllEventsLogDecoder';
import AbiMapper from '../mappers/AbiMapper';
import MethodOptionsMapper from '../mappers/MethodOptionsMapper';
import EventOptionsMapper from '../mappers/EventOptionsMapper';
import AllEventsOptionsMapper from '../mappers/AllEventsOptionsMapper';
import MethodsProxy from '../proxies/MethodsProxy';
import EventSubscriptionsProxy from '../proxies/EventSubscriptionsProxy';
import MethodOptionsValidator from '../validators/MethodOptionsValidator';
import MethodFactory from '../factories/MethodFactory';
import EventSubscriptionFactory from '../factories/EventSubscriptionFactory';
import AbstractContract from '../AbstractContract';

export default class ContractModuleFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbiCoder} abiCoder
     * @param {Accounts} accounts
     * @param {MethodModuleFactory} methodModuleFactory
     *
     * @constructor
     */
    constructor(utils, formatters, abiCoder, accounts, methodModuleFactory) {
        this.utils = utils;
        this.formatters = formatters;
        this.abiCoder = abiCoder;
        this.accounts = accounts;
        this.methodModuleFactory = methodModuleFactory;
    }

    /**
     * Returns an object of type AbstractContract
     *
     * @method createContract
     *
     * @param {EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {PromiEvent} PromiEvent
     * @param {Accounts} accounts
     * @param {Array} abi
     * @param {String} address
     * @param {Object} options
     *
     * @returns {AbstractContract}
     */
    createContract(provider, providersModuleFactory, PromiEvent, accounts, abi, address, options) {
        return new AbstractContract(
            provider,
            providersModuleFactory,
            this.methodModuleFactory,
            this,
            PromiEvent,
            accounts,
            this.abiCoder,
            this.utils,
            this.formatters,
            abi,
            address,
            options
        );
    }

    /**
     * Returns an object of type AbiModel
     *
     * @method createAbiModel
     *
     * @param {Object} mappedAbi
     *
     * @returns {AbiModel}
     */
    createAbiModel(mappedAbi) {
        return new AbiModel(mappedAbi);
    }

    /**
     * Returns an object of type AbiItemModel
     *
     * @method createAbiItemModel
     *
     * @param {Object} abiItem
     *
     * @returns {AbiItemModel}
     */
    createAbiItemModel(abiItem) {
        return new AbiItemModel(abiItem);
    }

    /**
     * Returns an object of type MethodEncoder
     *
     * @method createMethodEncoder
     *
     * @returns {MethodEncoder}
     */
    createMethodEncoder() {
        return new MethodEncoder(this.abiCoder);
    }

    /**
     * Returns an object of type EventFilterEncoder
     *
     * @method createEventFilterEncoder
     *
     * @returns {EventFilterEncoder}
     */
    createEventFilterEncoder() {
        return new EventFilterEncoder(this.abiCoder);
    }

    /**
     * Returns an object of type AllEventsFilterEncoder
     *
     * @method createAllEventsFilterEncoder
     *
     * @returns {AllEventsFilterEncoder}
     */
    createAllEventsFilterEncoder() {
        return new AllEventsFilterEncoder(this.abiCoder);
    }

    /**
     * Returns an object oftype AbiMapper
     *
     * @method createAbiMapper
     *
     * @returns {AbiMapper}
     */
    createAbiMapper() {
        return new AbiMapper(this, this.abiCoder, this.utils);
    }

    /**
     * Returns an object of type EventLogDecoder
     *
     * @method createEventLogDecoder
     *
     * @returns {EventLogDecoder}
     */
    createEventLogDecoder() {
        return new EventLogDecoder(this.abiCoder);
    }

    /**
     * Returns an object of type AllEventsLogDecoder
     *
     * @method createAllEventsLogDecoder
     *
     * @returns {AllEventsLogDecoder}
     */
    createAllEventsLogDecoder() {
        return new AllEventsLogDecoder(this.abiCoder);
    }

    /**
     * Returns an object of type MethodOptionsValidator
     *
     * @method createMethodOptionsValidator
     *
     * @returns {MethodOptionsValidator}
     */
    createMethodOptionsValidator() {
        return new MethodOptionsValidator(this.utils);
    }

    /**
     * Returns an object of type MethodOptionsMapper
     *
     * @method createMethodOptionsMapper
     *
     * @returns {MethodOptionsMapper}
     */
    createMethodOptionsMapper() {
        return new MethodOptionsMapper(this.utils, this.formatters);
    }

    /**
     * Returns an object of type EventOptionsMapper
     *
     * @method createEventOptionsMapper
     *
     * @returns {EventOptionsMapper}
     */
    createEventOptionsMapper() {
        return new EventOptionsMapper(this.formatters, this.createEventFilterEncoder());
    }

    /**
     * Returns an object of type AllEventsOptionsMapper
     *
     * @method createAllEventsOptionsMapper
     *
     * @returns {AllEventsOptionsMapper}
     */
    createAllEventsOptionsMapper() {
        return new AllEventsOptionsMapper(this.formatters, this.createAllEventsFilterEncoder());
    }

    /**
     * Returns an object of type MethodFactory
     *
     * @method createMethodFactory
     *
     * @returns {MethodFactory}
     */
    createMethodFactory() {
        return new MethodFactory(
            this.accounts,
            this.utils,
            this.formatters,
            this,
            this.methodModuleFactory,
            this.abiCoder
        );
    }

    /**
     * Returns an object of type MethodsProxy
     *
     * @method createMethodsProxy
     *
     * @param {AbstractContract} target
     * @param {AbiModel} abiModel
     * @param {PromiEvent} PromiEvent
     *
     * @returns {MethodsProxy}
     */
    createMethodsProxy(target, abiModel, PromiEvent) {
        return new MethodsProxy(
            target,
            abiModel,
            this.createMethodFactory(),
            this.createMethodEncoder(),
            this.createMethodOptionsValidator(),
            this.createMethodOptionsMapper(),
            PromiEvent
        );
    }

    /**
     * Returns an object of type EventSubscriptionsProxy
     *
     * @method createEventSubscriptionsProxy
     *
     * @param {Contract} contract
     * @param {AbiModel} abiModel
     * @param {PromiEvent} PromiEvent
     *
     * @returns {EventSubscriptionsProxy}
     */
    createEventSubscriptionsProxy(contract, abiModel, PromiEvent) {
        return new EventSubscriptionsProxy(
            contract,
            abiModel,
            this.createEventSubscriptionFactory(),
            this.createEventOptionsMapper(),
            this.createEventLogDecoder(),
            this.createAllEventsLogDecoder(),
            this.createAllEventsOptionsMapper(),
            PromiEvent
        );
    }

    /**
     * Returns an object of type EventSubscriptionFactory
     *
     * @method createEventSubscriptionFactory
     *
     * @returns {EventSubscriptionFactory}
     */
    createEventSubscriptionFactory() {
        return new EventSubscriptionFactory(this.utils, this.formatters);
    }
}
