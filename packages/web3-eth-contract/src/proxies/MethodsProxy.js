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
 * @file MethodsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {isArray, isFunction} from 'underscore';

export default class MethodsProxy {
    /**
     * @param {Contract} contract
     * @param {AbiModel} abiModel
     * @param {RpcMethodModelFactory} rpcMethodModelFactory
     * @param {MethodController} methodController
     * @param {MethodEncoder} methodEncoder
     * @param {RpcMethodOptionsValidator} rpcMethodOptionsValidator
     * @param {RpcMethodOptionsMapper} rpcMethodOptionsMapper
     * @param {PromiEvent} PromiEvent
     *
     * @constructor
     */
    constructor(
        contract,
        abiModel,
        rpcMethodModelFactory,
        methodController,
        methodEncoder,
        rpcMethodOptionsValidator,
        rpcMethodOptionsMapper,
        PromiEvent
    ) {
        this.contract = contract;
        this.abiModel = abiModel;
        this.rpcMethodModelFactory = rpcMethodModelFactory;
        this.methodController = methodController;
        this.methodEncoder = methodEncoder;
        this.rpcMethodOptionsValidator = rpcMethodOptionsValidator;
        this.rpcMethodOptionsMapper = rpcMethodOptionsMapper;
        this.PromiEvent = PromiEvent;

        return new Proxy(this, {
            get: this.proxyHandler
        });
    }

    /**
     * Checks if a contract event exists by the given name and returns the subscription otherwise it throws an error
     *
     * @method proxyHandler
     *
     * @param {MethodsProxy} target
     * @param {String} name
     *
     * @returns {Function|Error}
     */
    proxyHandler(target, name) {
        const abiItemModel = this.abiModel.getMethod(name);

        if (abiItemModel) {
            let requestType = abiItemModel.requestType;

            const anonymousFunction = () => {
                let methodArguments = arguments;

                // Because of the possibility to overwrite the contract data if I call contract.deploy() have I to check
                // here if it is a contract deployment. If this call is a contract deployment then I have to set the right
                // contract data and to map the arguments. TODO: Change API or improve this
                if (requestType === 'contract-deployment') {
                    if (arguments[0]['data']) {
                        target.contract.options.data = arguments[0]['data'] || target.contract.options.data;
                    }

                    if (arguments[0]['arguments']) {
                        methodArguments = arguments[0]['arguments'];
                    }

                    requestType = 'send';
                }

                abiItemModel.contractMethodParameters = methodArguments;
            };

            anonymousFunction[requestType] = () => {
                return target.executeMethod(abiItemModel, arguments);
            };

            anonymousFunction[requestType].request = () => {
                return target.createRpcMethodModel(abiItemModel, arguments);
            };

            anonymousFunction.estimateGas = () => {
                abiItemModel.requestType = 'estimate';

                return target.executeMethod(abiItemModel, arguments);
            };

            anonymousFunction.encodeAbi = () => {
                return target.methodEncoder.encode(abiItemModel, target.contract.options.data);
            };
        }

        if (target[name]) {
            return this[name];
        }

        throw new Error(`Method with name "${name}" not found`);
    }

    /**
     * Executes the RPC method with the methodController
     *
     * @param {AbiItemModel} abiItemModel
     * @param {IArguments} methodArguments
     *
     * @returns {Promise|PromiEvent|String|Boolean}
     */
    executeMethod(abiItemModel, methodArguments) {
        let rpcMethodModel;

        try {
            rpcMethodModel = this.createRpcMethodModel(abiItemModel, methodArguments);
        } catch (error) {
            return this.handleValidationError(error, methodArguments);
        }

        return this.methodController.execute(rpcMethodModel, this.contract.accounts, this.contract);
    }

    /**
     * Creates the rpc method, encodes the contract method and validate the objects.
     *
     * @param {AbiItemModel|Array} abiItemModel
     * @param {IArguments} methodArguments
     *
     * @returns {AbstractMethodModel|Object}
     */
    createRpcMethodModel(abiItemModel, methodArguments) {
        let rpcMethodModel, encodedContractMethod;

        // If it is an array than check which AbiItemModel should be used.
        // This will be used if two methods with the same name exists but with different arguments.
        if (isArray(abiItemModel)) {
            let parameterValidationError;

            // Check if one of the AbiItemModel in this array does match the arguments length
            const correctAbiItemModelFound = abiItemModel.some((method) => {
                rpcMethodModel = this.rpcMethodModelFactory.createRpcMethodByRequestType(method, this.contract);
                rpcMethodModel.methodArguments = methodArguments;

                try {
                    abiItemModel.givenParametersLengthIsValid();
                } catch(error) {
                    parameterValidationError = error;

                    return false;
                }

                return true;
            });

            if (!correctAbiItemModelFound) {
                throw parameterValidationError;
            }
        } else {
            rpcMethodModel = this.rpcMethodModelFactory.createRpcMethodByRequestType(abiItemModel, this.contract);
            rpcMethodModel.methodArguments = methodArguments;

            // Validate contract method parameters length
            abiItemModel.givenParametersLengthIsValid();
        }

        // Encode contract method
        encodedContractMethod = this.methodEncoder.encode(abiItemModel, this.contract.options.data);
        rpcMethodModel.parameters[0]['data'] = encodedContractMethod;

        // Set default options in the TxObject if required
        rpcMethodModel.parameters = this.rpcMethodOptionsMapper.map(this.contract, rpcMethodModel.parameters[0]);

        // Validate TxObject
        this.rpcMethodOptionsValidator.validate(abiItemModel, rpcMethodModel);

        return rpcMethodModel;
    }

    /**
     * Creates an PromiEvent object and rejects it with an error
     *
     * @method handleValidationError
     *
     * @param {Error} error
     * @param {IArguments} methodArguments
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    handleValidationError(error, methodArguments) {
        const promiEvent = new this.PromiEvent();
        const rpcMethodModel = this.rpcMethodModelFactory.createRpcMethodByRequestType(abiItemModel, this.contract);
        rpcMethodModel.methodArguments = methodArguments;

        promiEvent.resolve(null);
        promiEvent.reject(error);
        promiEvent.emit('error', error);

        if (isFunction(rpcMethodModel.callback)) {
            rpcMethodModel.callback(error, null);
        }

        return promiEvent;
    }
}
