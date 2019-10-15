/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
 */

export default class MethodProxy {
    /**
     * @param {AbstractConfluxWebModule} target
     * @param {AbstractMethodFactory} methodFactory
     *
     * @constructor
     */
    constructor(target, methodFactory) {
        return new Proxy(target, {
            /**
             * @param {AbstractConfluxWebModule} target
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

                    const method = methodFactory.createMethod(name, target);

                    /* eslint-disable no-inner-declarations */
                    function RpcMethod() {
                        method.setArguments(arguments);

                        return method.execute();
                    }
                    /* eslint-enable no-inner-declarations */

                    RpcMethod.method = method;
                    RpcMethod.request = function() {
                        method.setArguments(arguments);

                        return method;
                    };

                    return RpcMethod;
                }

                return target[name];
            }
        });
    }
}
