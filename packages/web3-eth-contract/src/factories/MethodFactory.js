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
 * @file MethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    EstimateGasMethod,
    ChainIdMethod,
    GetTransactionCountMethod,
    GetTransactionReceiptMethod,
    GetBlockMethod,
    NewHeadsSubscription,
    SendSignedTransactionMethod
} from 'web3-core-method';
import {TransactionObserver} from 'web3-eth'; // TODO: This can be removed with the new folder structure
import CallContractMethod from '../methods/CallContractMethod';
import ContractDeployMethod from '../methods/ContractDeployMethod';
import PastEventLogsMethod from '../methods/PastEventLogsMethod';
import AllPastEventLogsMethod from '../methods/AllPastEventLogsMethod';
import SendContractMethod from '../methods/SendContractMethod';

export default class MethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(utils, formatters, contractModuleFactory, abiCoder) {
        this.utils = utils;
        this.formatters = formatters;
        this.contractModuleFactory = contractModuleFactory;
        this.abiCoder = abiCoder;
    }

    /**
     * Returns the correct Method
     *
     * @method createMethod
     *
     * @param {AbiItemModel} abiItem
     * @param {AbstractContract} contract
     * @param {String} requestType
     *
     * @returns {AbstractMethod}
     */
    createMethodByRequestType(abiItem, contract, requestType) {
        let rpcMethod;

        switch (requestType) {
            case 'call':
                rpcMethod = this.createCallContractMethod(abiItem, contract);
                break;
            case 'send':
                rpcMethod = this.createSendContractMethod(abiItem, contract);
                break;
            case 'estimate':
                rpcMethod = this.createEstimateGasMethod(contract);
                break;
            case 'contract-deployment':
                rpcMethod = this.createContractDeployMethod(contract);
                break;
        }

        if (typeof rpcMethod === 'undefined') {
            throw new TypeError(`RPC call not found with requestType: "${requestType}"`);
        }

        return rpcMethod;
    }

    /**
     * Returns an object of type PastEventLogsMethod
     *
     * @method createPastEventLogsMethod
     *
     * @param {AbiItemModel} abiItem
     * @param {AbstractContract} contract
     *
     * @returns {PastEventLogsMethod}
     */
    createPastEventLogsMethod(abiItem, contract) {
        return new PastEventLogsMethod(
            this.utils,
            this.formatters,
            contract,
            this.contractModuleFactory.createEventLogDecoder(),
            abiItem,
            this.contractModuleFactory.createEventOptionsMapper()
        );
    }

    /**
     * Returns an object of type PastEventLogsMethod
     *
     * @method createPastEventLogsMethod
     *
     * @param {AbiModel} abiModel
     * @param {AbstractContract} contract
     *
     * @returns {AllPastEventLogsMethod}
     */
    createAllPastEventLogsMethod(abiModel, contract) {
        return new AllPastEventLogsMethod(
            this.utils,
            this.formatters,
            contract,
            this.contractModuleFactory.createAllEventsLogDecoder(),
            abiModel,
            this.contractModuleFactory.createAllEventsOptionsMapper()
        );
    }

    /**
     * Returns an object of type CallContractMethod
     *
     * @method createCallContractMethod
     *
     * @param {AbiItemModel} abiItem
     * @param {AbstractContract} contract
     *
     * @returns {CallContractMethod}
     */
    createCallContractMethod(abiItem, contract) {
        return new CallContractMethod(this.utils, this.formatters, contract, this.abiCoder, abiItem);
    }

    /**
     * Returns an object of type SendContractMethod
     *
     * @method createSendContractMethod
     *
     * @param {AbiItemModel} abiItem
     * @param {AbiModel} abiModel
     * @param {AbstractContract} contract
     *
     * @returns {SendContractMethod}
     */
    createSendContractMethod(abiItem, abiModel, contract) {
        let timeout = contract.transactionBlockTimeout;
        const providerName = contract.currentProvider.constructor.name;

        if (providerName === 'HttpProvider' || providerName === 'CustomProvider') {
            timeout = moduleInstance.transactionPollingTimeout;
        }

        const transactionObserver = new TransactionObserver(
            moduleInstance.currentProvider,
            timeout,
            transactionConfirmationBlocks,
            new GetTransactionReceiptMethod(this.utils, this.formatters, contract),
            new GetBlockMethod(this.utils, this.formatters, contract),
            new NewHeadsSubscription(this.utils, this.formatters, contract)
        );

        return new SendContractMethod(
            this.utils,
            this.formatters,
            contract
            transactionObserver,
            new ChainIdMethod(this.utils, this.formatters, contract),
            new GetTransactionCountMethod(this.utils, this.formatters, contract),
            new SendSignedTransactionMethod(this.utils, this.formatters, contract, transactionObserver),
            this.contractModuleFactory.createAllEventsLogDecoder(),
            abiModel
        );
    }

    /**
     * Returns an object of type ContractDeployMethod
     *
     * @method createContractDeployMethod
     *
     * @param {AbstractContract} contract
     *
     * @returns {ContractDeployMethod}
     */
    createContractDeployMethod(contract) {
        return new ContractDeployMethod(
            this.utils,
            this.formatters,
            contract,
            new TransactionObserver(
                new GetTransactionReceiptMethod(this.utils, this.formatters),
                new GetBlockMethod(this.utils, this.formatters),
                new NewHeadsSubscription(this.utils, this.formatters, {})
            ),
            new ChainIdMethod(this.utils, this.formatters),
            new GetTransactionCountMethod(this.utils, this.formatters),
            new SendSignedTransactionMethod(this.utils, this.formatters)
        );
    }

    /**
     * Returns an object of type EstimateGasMethod
     *
     * @method createEstimateGasMethod
     *
     * @returns {EstimateGasMethod}
     */
    createEstimateGasMethod() {
        return new EstimateGasMethod(this.utils, this.formatters);
    }
}
