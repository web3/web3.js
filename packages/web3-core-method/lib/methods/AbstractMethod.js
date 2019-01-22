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
 * @file AbstractMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import {PromiEvent} from 'web3-core-promievent';

export default class AbstractMethod {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
        this.promiEvent = new PromiEvent();
        this._arguments = {
            parameters: []
        };
        this._rpcMethod = rpcMethod;
        this._parametersAmount = parametersAmount;
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {}

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {*} response
     *
     * @returns {*}
     */
    afterExecution(response) {
        return response;
    }

    /**
     * Checks which command should be executed
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<Object|String>|PromiEvent|String}
     */
    execute(moduleInstance) {}

    /**
     * Setter for the rpcMethod property
     *
     * @property rpcMethod
     *
     * @param {String} value
     */
    set rpcMethod(value) {
        this._rpcMethod = value;
    }

    /**
     * Getter for the rpcMethod property
     *
     * @property rpcMethod
     *
     * @returns {String}
     */
    get rpcMethod() {
        return this._rpcMethod;
    }

    /**
     * Setter for the parametersAmount property
     *
     * @property parametersAmount
     *
     * @param {Number} value
     */
    set parametersAmount(value) {
        this._parametersAmount = value;
    }

    /**
     * Getter for the parametersAmount property
     *
     * @property parametersAmount
     *
     * @returns {Number}
     */
    get parametersAmount() {
        return this._parametersAmount;
    }

    /**
     * Getter for the parameters property
     *
     * @property parameters
     *
     * @returns {Array}
     */
    get parameters() {
        return this._arguments.parameters;
    }

    /**
     * Setter for the parameters property
     *
     * @property parameters
     *
     * @param {Array} value
     */
    set parameters(value) {
        this._arguments.parameters = value;
    }

    /**
     * Getter for the callback property
     *
     * @property callback
     *
     * @returns {Function}
     */
    get callback() {
        return this._arguments.callback;
    }

    /**
     * Setter for the callback property
     *
     * @property callback
     *
     * @param {Function} value
     */
    set callback(value) {
        this._arguments.callback = value;
    }

    /**
     * Setter for the arguments property
     *
     * @property arguments
     *
     * @param {IArguments} args
     */
    set arguments(args) {
        let parameters = [...args];

        let callback = null;

        if (parameters.length > this.parametersAmount) {
            if (!isFunction(parameters[parameters.length - 1])) {
                throw new TypeError("The latest parameter should be a function otherwise it can't be used as callback");
            }

            callback = parameters.pop();
        }

        this._arguments = {
            callback,
            parameters
        };
    }

    /**
     * Getter for the arguments property
     *
     * @property arguments
     *
     * @returns {{callback: Function|null, parameters: Array}}
     */
    get arguments() {
        return this._arguments;
    }

    /**
     * Checks if the given parameter is of type hash
     *
     * @method isHash
     *
     * @param {String} parameter
     *
     * @returns {Boolean}
     */
    isHash(parameter) {
        return isString(parameter) && parameter.indexOf('0x') === 0;
    }

    /**
     * Returns this Method with the arguments set.
     *
     * @method request
     *
     * @returns {AbstractMethod}
     */
    request() {
        this.arguments = arguments;

        return this;
    }

    /**
     * Checks if accounts is defined and if wallet is not empty
     *
     * @method hasWallet
     *
     * @returns {Boolean}
     */
    hasWallets() {
        return this.accounts && this.accounts.wallet.length > 0;
    }
}
