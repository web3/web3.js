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

import {PromiEvent} from 'web3-core-promievent';
import cloneDeep from 'lodash/cloneDeep';

export default class MethodProxy {
    /**
     * @param {AbstractWeb3Module} target
     * @param {AbstractMethodFactory} methodFactory
     *
     * @constructor
     */
    constructor(target, methodFactory) {
        return new Proxy(target, {
            /**
             * @param {AbstractWeb3Module} target
             * @param {String|Symbol} name
             *
             * @returns {any}
             */
            get: (target, name) => {
                if (methodFactory.hasMethod(name)) {
                    if (typeof target[name] !== 'undefined') {
                        throw new TypeError(
                            `Duplicated method ${name}. This method is defined as RPC call and as Object method.`
                        );
                    }

                    const method = methodFactory.createMethod(name);

                    /* eslint-disable no-inner-declarations */
                    function anonymousFunction() {
                        method.arguments = cloneDeep([...arguments]);

                        if (method.Type === 'CALL') {
                            return method.execute(target);
                        }

                        return method.execute(target, new PromiEvent());
                    }
                    /* eslint-enable no-inner-declarations */

                    anonymousFunction.method = method;
                    anonymousFunction.request = function() {
                        method.arguments = cloneDeep([...arguments]);

                        return method;
                    };

                    return anonymousFunction;
                }

                return target[name];
            }
        });
    }
}
