import {PromiEvent} from 'web3-core-promievent';
import isFunction from 'underscore-es/isFunction';

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

export default class AbstractMethod {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {AbstractCommand} command
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, command, utils, formatters) {
        this.command = command;
        this.utils = utils;
        this.formatters = formatters;
        this.promiEvent = new PromiEvent();
        this._arguments = null;
        this._rpcMethod = null;
        this._parametersAmount = null;
    }

    /**
     * Returns the commandType of this Method
     *
     * @property CommandType
     *
     * @returns {String}
     */
    static get CommandType() {
        return 'CALL';
    }

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
     * @param {IArguments} arguments
     */
    set arguments(arguments) {
        let parameters = arguments,
            callback = null;

        if (arguments.length < this.parametersAmount) {
            throw new Error(
                `Arguments length is not correct: expected: ${this.parametersAmount}, given: ${arguments.length}`
            );
        }

        if (arguments.length > this.parametersAmount) {
            callback = arguments.slice(-1)[0];

            if (!isFunction(callback)) {
                throw new TypeError(
                    'The latest parameter should be a function otherwise it can\'t be used as callback'
                );
            }

            parameters = arguments.slice(0, -1);
        }

        this._arguments = {
            callback,
            parameters
        };
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
    execute(moduleInstance) {
        this.command.execute(
            moduleInstance,
            this
        );
    }
}
