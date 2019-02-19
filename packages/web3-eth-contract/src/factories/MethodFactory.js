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

import CallContractMethod from '../methods/CallContractMethod';
import ContractDeployMethod from '../methods/ContractDeployMethod';
import PastEventLogsMethod from '../methods/PastEventLogsMethod';
import AllPastEventLogsMethod from '../methods/AllPastEventLogsMethod';
import SendContractMethod from '../methods/SendContractMethod';
import {EstimateGasMethod} from 'web3-core-method';

export default class MethodFactory {
    /**
     * @param {Accounts} accounts
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(accounts, utils, formatters, contractModuleFactory, methodModuleFactory, abiCoder) {
        this.accounts = accounts;
        this.utils = utils;
        this.formatters = formatters;
        this.contractModuleFactory = contractModuleFactory;
        this.methodModuleFactory = methodModuleFactory;
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
                rpcMethod = this.createCallContractMethod(abiItem);
                break;
            case 'send':
                rpcMethod = this.createSendContractMethod(abiItem, contract.abiModel);
                break;
            case 'estimate':
                rpcMethod = this.createEstimateGasMethod();
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
     *
     * @returns {PastEventLogsMethod}
     */
    createPastEventLogsMethod(abiItem) {
        return new PastEventLogsMethod(
            this.utils,
            this.formatters,
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
     *
     * @returns {AllPastEventLogsMethod}
     */
    createAllPastEventLogsMethod(abiModel) {
        return new AllPastEventLogsMethod(
            this.utils,
            this.formatters,
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
     *
     * @returns {CallContractMethod}
     */
    createCallContractMethod(abiItem) {
        return new CallContractMethod(this.utils, this.formatters, this.abiCoder, abiItem);
    }

    /**
     * Returns an object of type SendContractMethod
     *
     * @method createSendContractMethod
     *
     * @param {AbiItemModel} abiItem
     * @param {AbiModel} abiModel
     *
     * @returns {SendContractMethod}
     */
    createSendContractMethod(abiItem, abiModel) {
        return new SendContractMethod(
            this.utils,
            this.formatters,
            this.methodModuleFactory.createTransactionConfirmationWorkflow(),
            this.accounts,
            this.methodModuleFactory.createTransactionSigner(),
            this.methodModuleFactory.createSendRawTransactionMethod(),
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
            this.methodModuleFactory.createTransactionConfirmationWorkflow(),
            this.accounts,
            this.methodModuleFactory.createTransactionSigner(),
            this.methodModuleFactory.createSendRawTransactionMethod(),
            contract
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
