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
import SendContractMethod from '../methods/SendContractMethod';
import {EstimateGasMethod} from 'web3-core-method';

export default class MethodFactory {
    /**
     * @param {Accounts} accounts
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     *
     * @constructor
     */
    constructor(accounts, utils, formatters, contractModuleFactory, methodModuleFactory) {
        this.utils = utils;
        this.formatters = formatters;
        this.accounts = accounts;
        this.contractModuleFactory = contractModuleFactory;
        this.methodModuleFactory = methodModuleFactory;
    }

    /**
     * Returns the correct Method
     *
     * @method createMethod
     *
     * @param {AbiItem} abiItem
     * @param {AbstractContract} contract
     *
     * @returns {AbstractMethod}
     */
    createMethodByRequestType(abiItem, contract) {
        let rpcMethod;

        switch (abiItem.requestType) {
            case 'call':
                rpcMethod = this.createCallContractMethod(abiItem);
                break;
            case 'send':
                rpcMethod = this.createSendContractMethod(abiItem);
                break;
            case 'estimate':
                rpcMethod = this.createEstimateGasMethod();
                break;
            case 'contract-deployment':
                rpcMethod = this.createContractDeployMethod(contract);
                break;
        }

        if (typeof rpcMethod === 'undefined') {
            throw new TypeError(`RPC call not found with requestType "${abiItem.requestType}"`);
        }

        return rpcMethod;
    }

    /**
     * Returns an object of type PastEventLogsMethod
     *
     * @method createPastEventLogsMethod
     *
     * @param {AbiItem} abiItem
     *
     * @returns {PastEventLogsMethod}
     */
    createPastEventLogsMethod(abiItem) {
        return new PastEventLogsMethod(
            this.utils,
            this.formatters,
            this.contractModuleFactory.createEventLogDecoder(),
            abiItem
        );
    }

    /**
     * Returns an object of type CallContractMethod
     *
     * @method createCallContractMethod
     *
     * @param {AbiItem} abiItem
     *
     * @returns {CallContractMethod}
     */
    createCallContractMethod(abiItem) {
        return new CallContractMethod(
            this.utils,
            this.formatters,
            abiItem
        );
    }

    /**
     * Returns an object of type SendContractMethod
     *
     * @method createSendContractMethod
     *
     * @param {AbiItem} abiItem
     *
     * @returns {SendContractMethod}
     */
    createSendContractMethod(abiItem) {
        return new SendContractMethod(
            this.utils,
            this.formatters,
            this.accounts,
            this.methodModuleFactory.createTransactionConfirmationWorkflow(),
            this.methodModuleFactory.createTransactionSigner(),
            this.contractModuleFactory.createAllEventsLogDecoder(),
            abiItem,
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
            this.accounts,
            this.methodModuleFactory.createTransactionConfirmationWorkflow(),
            this.methodModuleFactory.createTransactionSigner(),
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
        return new EstimateGasMethod(
            this.utils,
            this.formatters
        );
    }
}
