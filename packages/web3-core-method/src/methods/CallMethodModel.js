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
 * @file CallMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');

/**
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function CallMethodModel(utils, formatters) {
    AbstractMethodModel.call(
        this,
        'eth_call',
        2,
        [
            formatters.inputCallFormatter,
            formatters.inputDefaultBlockNumberFormatter
        ],
        null
    );
}

/**
 * This method will be executed before the effective execution.
 *
 * @method beforeExecution
 *
 * @param {Array} parameters
 * @param {Object} parentObject
 */
CallMethodModel.prototype.beforeExecution = function (parameters, parentObject) {
    if (!parameters[1]) {
        parameters[1] = parentObject.defaultBlock;
    }
};

CallMethodModel.prototype = Object.create(AbstractMethodModel.prototype);

module.exports = CallMethodModel;
