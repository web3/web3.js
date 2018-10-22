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
 * @file RpcMethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import CallContractMethodModel from '../models/methods/CallContractMethodModel';
import ContractDeployMethodModel from '../models/methods/ContractDeployMethodModel';
import PastEventLogsMethodModel from '../models/methods/PastEventLogsMethodModel';
import SendContractMethodModel from '../models/methods/SendContractMethodModel';
import {EstimateGasMethodModel} from 'web3-core-method';

export default class RpcMethodModelFactory {
    /**
     * @param {CallMethodResponseDecoder} callMethodResponseDecoder
     * @param {Accounts} accounts
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(callMethodResponseDecoder, accounts, utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
        this.callMethodResponseDecoder = callMethodResponseDecoder;
        this.accounts = accounts;
    }

    /**
     * Returns the correct JSON-RPC MethodModel
     *
     * @method createRpcMethod
     *
     * @param {AbiItemModel} abiItemModel
     * @param {Contract} contract
     *
     * @returns {AbstractMethodModel}
     */
    createRpcMethodByRequestType(abiItemModel, contract) {
        let rpcMethod;

        switch (abiItemModel.requestType) {
            case 'call':
                rpcMethod = this.createCallContractMethodModel(abiItemModel);
                break;
            case 'send':
                rpcMethod = this.createSendContractMethodModel(abiItemModel);
                break;
            case 'estimate':
                rpcMethod = this.createEstimateGasMethodModel();
                break;
            case 'contract-deployment':
                rpcMethod = this.createContractDeployMethodModel(contract);
                break;
        }

        if (typeof rpcMethod === 'undefined') {
            throw new TypeError(`Unknown RPC call with requestType "${abiItemModel.requestType}"`);
        }

        return rpcMethod;
    }

    /**
     * Returns an object of type PastEventLogsMethodModel
     *
     * @method createPastEventLogsMethodModel
     *
     * @param {AbiItemModel} abiItemModel
     *
     * @returns {PastEventLogsMethodModel}
     */
    createPastEventLogsMethodModel(abiItemModel) {
        return new PastEventLogsMethodModel(abiItemModel, this.utils, this.formatters);
    }

    /**
     * Returns an object of type CallContractMethodModel
     *
     * @method createCallContractMethodModel
     *
     * @param {AbiItemModel} abiItemModel
     *
     * @returns {CallContractMethodModel}
     */
    createCallContractMethodModel(abiItemModel) {
        return new CallContractMethodModel(abiItemModel, this.callMethodResponseDecoder, this.utils, this.formatters);
    }

    /**
     * Returns an object of type SendContractMethodModel
     *
     * @method createSendContractMethodModel
     *
     * @param {AbiItemModel} abiItemModel
     *
     * @returns {SendContractMethodModel}
     */
    createSendContractMethodModel(abiItemModel) {
        return new SendContractMethodModel(
            abiItemModel,
            this.allEventsLogDecoder,
            this.utils,
            this.formatters,
            this.accounts
        );
    }

    /**
     * Returns an object of type ContractDeployMethodModel
     *
     * @method createContractDeployMethodModel
     *
     * @param {Contract} contract
     *
     * @returns {ContractDeployMethodModel}
     */
    createContractDeployMethodModel(contract) {
        return new ContractDeployMethodModel(contract, this.utils, this.formatters, this.accounts);
    }

    /**
     * Returns an object of type EstimateGasMethodModel
     *
     * @method createEstimateGasMethodModel
     *
     * @returns {EstimateGasMethodModel}
     */
    createEstimateGasMethodModel() {
        return new EstimateGasMethodModel(this.utils, this.formatters);
    }
}
