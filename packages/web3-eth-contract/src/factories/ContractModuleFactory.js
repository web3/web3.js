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

import ABIModel from '../models/abi/ABIModel';
import ABIItemModel from '../models/abi/ABIItemModel';
import MethodEncoder from '../encoders/MethodEncoder';
import EventFilterEncoder from '../encoders/EventFilterEncoder';
import AllEventsFilterEncoder from '../encoders/AllEventsFilterEncoder';
import CallMethodResponseDecoder from '../decoders/CallMethodResponseDecoder';
import EventLogDecoder from '../decoders/EventLogDecoder';
import AllEventsLogDecoder from '../decoders/AllEventsLogDecoder';
import ABIMapper from '../mappers/ABIMapper';
import RpcMethodOptionsMapper from '../mappers/RpcMethodOptionsMapper';
import EventOptionsMapper from '../mappers/EventOptionsMapper';
import AllEventsOptionsMapper from '../mappers/AllEventsOptionsMapper';
import MethodsProxy from '../proxies/MethodsProxy';
import EventSubscriptionsProxy from '../proxies/EventSubscriptionsProxy';
import RpcMethodOptionsValidator from '../validators/RpcMethodOptionsValidator';
import RpcMethodFactory from '../factories/RpcMethodModelFactory';
import EventSubscriptionFactory from '../factories/EventSubscriptionFactory';

export default class ContractModuleFactory {

    /**
     * @param {Object} utils
     * @param {Object} formatters
     * @param {ABICoder} abiCoder
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(utils, formatters, abiCoder, accounts) {
        this.utils = utils;
        this.formatters = formatters;
        this.abiCoder = abiCoder;
        this.accounts = accounts;
    }

    /**
     * Returns an object of type Contract
     *
     * @method createContract
     *
     * @param {*} provider
     * @param {ProvidersPackage} providersPackage
     * @param {MethodController} methodController
     * @param {PromiEventPackage} promiEventPackage
     * @param {Object} abi
     * @param {String} address
     * @param {Object} options
     *
     * @returns {Contract}
     */
    createContract(
        provider,
        providersPackage,
        methodController,
        promiEventPackage,
        abi,
        address,
        options
    ) {
        return new Contract(
            provider,
            providersPackage,
            new MethodController(),
            this,
            promiEventPackage,
            this.abiCoder,
            this.utils,
            this.formatters,
            this.accounts,
            this.createABIMapper(),
            abi,
            address,
            options
        );
    }

    /**
     * Returns an object of type ABIModel
     *
     * @method createABIModel
     *
     * @param {Object} mappedAbi
     *
     * @returns {ABIModel}
     */
    createABIModel(mappedAbi) {
        return new ABIModel(mappedAbi);
    }

    /**
     * Returns an object of type ABIItemModel
     *
     * @method createABIItemModel
     *
     * @param {Object} abiItem
     *
     * @returns {ABIItemModel}
     */
    createABIItemModel(abiItem) {
        return new ABIItemModel(abiItem);
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
        return new EventFilterEncoder(this.abiCoder)
    }

    /**
     * Returns an object of type AllEventsFilterEncoder
     *
     * @method createAllEventsFilterEncoder
     *
     * @returns {AllEventsFilterEncoder}
     */
    createAllEventsFilterEncoder() {
        return new AllEventsFilterEncoder(this.abiCoder)
    }

    /**
     * Returns an object oftype ABIMapper
     *
     * @method createABIMapper
     *
     * @returns {ABIMapper}
     */
    createABIMapper() {
        return new ABIMapper(this, this.abiCoder, this.utils);
    }

    /**
     * Returns an object of type CallMethodResponseDecoder
     *
     * @method createCallMethodResponseDecoder
     *
     * @returns {CallMethodResponseDecoder}
     */
    createCallMethodResponseDecoder() {
        return new CallMethodResponseDecoder(this.abiCoder);
    }

    /**
     * Returns an object of type EventLogDecoder
     *
     * @method createEventLogDecoder
     *
     * @returns {EventLogDecoder}
     */
    createEventLogDecoder() {
        return new EventLogDecoder(this.abiCoder, this.formatters);
    }

    /**
     * Returns an object of type AllEventsLogDecoder
     *
     * @method createAllEventsLogDecoder
     *
     * @returns {AllEventsLogDecoder}
     */
    createAllEventsLogDecoder() {
        return new AllEventsLogDecoder(this.abiCoder, this.formatters);
    }

    /**
     * Returns an object of type RpcMethodOptionsValidator
     *
     * @method createRpcMethodOptionsValidator
     *
     * @returns {RpcMethodOptionsValidator}
     */
    createRpcMethodOptionsValidator() {
        return new RpcMethodOptionsValidator(this.utils);
    }

    /**
     * Returns an object of type RpcMethodOptionsMapper
     *
     * @method createRpcMethodOptionsMapper
     *
     * @returns {RpcMethodOptionsMapper}
     */
    createRpcMethodOptionsMapper() {
        return new RpcMethodOptionsMapper(this.utils, this.formatters);
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
     * Returns an object of type RpcMethodModelFactory
     *
     * @method createRpcMethodModelFactory
     *
     * @returns {RpcMethodModelFactory}
     */
    createRpcMethodModelFactory() {
        return new RpcMethodFactory(
            this.createCallMethodResponseDecoder(),
            this.accounts,
            this.utils,
            this.formatters
        );
    }

    /**
     * Returns an object of type MethodsProxy
     *
     * @method createMethodsProxy
     *
     * @param {Contract} contract
     * @param {ABIModel} abiModel
     * @param {MethodController} methodController
     * @param {PromiEventPackage} promiEventPackage
     *
     * @returns {MethodsProxy}
     */
    createMethodsProxy(contract, abiModel, methodController, promiEventPackage) {
        return new MethodsProxy(
            contract,
            abiModel,
            this.createRpcMethodModelFactory(),
            methodController,
            this.createMethodEncoder(),
            this.createRpcMethodOptionsValidator(),
            this.createRpcMethodOptionsMapper(),
            promiEventPackage
        );
    }

    /**
     * Returns an object of type EventSubscriptionsProxy
     *
     * @method createEventSubscriptionsProxy
     *
     * @param {Contract} contract
     * @param {ABIModel} abiModel
     * @param {MethodController} methodController
     *
     * @returns {EventSubscriptionsProxy}
     */
    createEventSubscriptionsProxy(contract, abiModel, methodController) {
        new EventSubscriptionsProxy(
            contract,
            abiModel,
            this.createEventSubscriptionFactory(methodController),
            this.createEventOptionsMapper(),
            this.createEventLogDecoder(),
            this.createAllEventsLogDecoder(),
            this.createAllEventsOptionsMapper()
        );
    }

    /**
     * Returns an object of type EventSubscriptionFactory
     *
     * @method createEventSubscriptionFactory
     *
     * @param {MethodController} methodController
     *
     * @returns {EventSubscriptionFactory}
     */
    createEventSubscriptionFactory(methodController) {
        new EventSubscriptionFactory(
            this.utils,
            this.formatters,
            methodController
        );
    }
}
