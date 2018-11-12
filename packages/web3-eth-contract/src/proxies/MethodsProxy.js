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

import isArray from 'underscore-es/isArray';
import isFunction from 'underscore-es/isFunction';

export default class MethodsProxy {
    /**
     * @param {AbstractContract} contract
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
        let abiItemModel = this.abiModel.getMethod(name);

        if (abiItemModel) {
            let requestType = abiItemModel.requestType;

            const anonymousFunction = () => {
                let methodArguments = arguments;

                // Because of the possibility to overwrite the contract data if I call contract.deploy() have I to check
                // here if it is a contract deployment. If this call is a contract deployment then I have to set the right
                // contract data and to map the arguments. TODO: Change API or improve this
                if (!isArray(abiItemModel) && abiItemModel.isOfType('constructor')) {
                    if (arguments[0]['data']) {
                        target.contract.options.data = arguments[0]['data'] || target.contract.options.data;
                    }

                    if (arguments[0]['arguments']) {
                        methodArguments = arguments[0]['arguments'];
                    }
                }

                // TODO: Find a better solution for the handling of the contractMethodParameters
                // If there exists more than one method with this name then find the correct abiItemModel
                if (isArray(abiItemModel)) {
                    const abiItemModelFound = abiItemModel.some((model) => {
                        model.contractMethodParameters = methodArguments;

                        try {
                            model.givenParametersLengthIsValid();
                        } catch (error) {
                            return false;
                        }

                        abiItemModel = model;
                        return true;
                    });

                    if (!abiItemModelFound) {
                        throw new Error(`Methods with name "${name}" found but the given parameters are wrong`);
                    }
                } else {
                    abiItemModel.contractMethodParameters = methodArguments;
                }

                return anonymousFunction;
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

            return anonymousFunction;
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
     * @param {AbiItemModel} abiItemModel
     * @param {IArguments} methodArguments
     *
     * @returns {AbstractMethodModel}
     */
    createRpcMethodModel(abiItemModel, methodArguments) {
        abiItemModel.givenParametersLengthIsValid();

        // Get correct rpc method model
        const rpcMethodModel = this.rpcMethodModelFactory.createRpcMethodByRequestType(abiItemModel, this.contract);
        rpcMethodModel.methodArguments = methodArguments;

        // Encode contract method
        rpcMethodModel.parameters[0]['data'] = this.methodEncoder.encode(abiItemModel, this.contract.options.data);

        // Set default options in the TxObject if required
        rpcMethodModel.parameters[0] = this.rpcMethodOptionsMapper.map(this.contract, rpcMethodModel.parameters[0]);

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
