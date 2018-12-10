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
import SendTransactionMethod from '../../src/methods/transaction/SendTransactionMethod';

/**
 * @file AbstractMethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class AbstractMethodFactory {
    /**
     * @param {{name: String, method: AbstractMethod}} methods
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(methods, methodModuleFactory, utils, formatters) {
        this.methods = methods;
        this.methodModuleFactory = methodModuleFactory;
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Checks if the method exists
     *
     * @method hasMethodModel
     *
     * @param {String} name
     *
     * @returns {Boolean}
     */
    hasMethod(name) {
        return typeof this.methods[name] !== 'undefined';
    }

    /**
     * TODO: Find a cleaner way for the dependency resolution here.
     *
     * Returns an MethodModel
     *
     * @param {String} name
     *
     * @returns {AbstractMethod}
     */
    createMethod(name) {
        const method = this.methods[name];

        switch (method.Type) {
            case 'CALL':
                if (method.name === 'SignMethod') {
                    return new method(
                        this.utils,
                        this.formatters,
                        this.methodModuleFactory.accounts,
                        this.methodModuleFactory.createMessageSigner()
                    )
                }

                return new method(this.utils, this.formatters);
            case 'SEND':
                if (method.name === 'SendTransactionMethod') {
                    return new method(
                        this.utils,
                        this.formatters,
                        this.methodModuleFactory.createTransactionConfirmationWorkflow(),
                        this.methodModuleFactory.accounts,
                        this.methodModuleFactory.createTransactionSigner()
                    );
                }

                return new method(
                    this.utils,
                    this.formatters,
                    this.methodModuleFactory.createTransactionConfirmationWorkflow(),
                );
        }
    }
}
