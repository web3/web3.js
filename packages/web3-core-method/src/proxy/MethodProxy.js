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
 * @file MethodProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class MethodProxy extends Proxy {
    /**
     * @param {AbstractWeb3Module} target
     * @param {MethodModelFactory} methodModelFactory
     * @param {MethodController} methodController
     *
     * @constructor
     */
    constructor(target, methodModelFactory, methodController) {
        super(
            target,
            {
                /**
                 * @param {AbstractWeb3Module} target
                 * @param {String|Symbol} name
                 *
                 * @returns {any}
                 */
                get: (target, name) => {
                    if (methodModelFactory.hasMethodModel(name)) {
                        if (typeof target[name] !== 'undefined') {
                            throw new Error(
                                `Duplicated method ${name}. This method is defined as RPC call and as Object method.`
                            );
                        }

                        const methodModel = methodModelFactory.createMethodModel(name);

                        const anonymousFunction = () => {
                            methodModel.methodArguments = arguments;

                            if (methodModel.parameters.length !== methodModel.parametersAmount) {
                                throw new Error(
                                    `Invalid parameters length the expected length would be 
                                    ${methodModel.parametersAmount}
                                     and not 
                                    ${methodModel.parameters.length}`
                                );
                            }

                            return methodController.execute(methodModel, target.accounts, target);
                        };

                        anonymousFunction.methodModel = methodModel;
                        anonymousFunction.request = methodModel.request;

                        return anonymousFunction;
                    }

                    return target[name];
                }
            });
    }
};
