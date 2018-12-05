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
 * @file AbstractMethodModelFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class AbstractMethodFactory {
    /**
     * @param {Object} methodModels
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(methodModels, utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
        this.methodModels = methodModels;
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
    hasMethodModel(name) {
        return typeof this.methodModels[name] !== 'undefined';
    }

    /**
     * Returns an MethodModel
     *
     * @param {String} name
     * @param {AbstractCommand} command
     *
     * @returns {AbstractMethod}
     */
    createMethod(command, name) {
        return new this.methodModels[name](command, this.utils, this.formatters);
    }
}
