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
 * @file ListAccountsMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractMethodModel = require('../../../../lib/models/AbstractMethodModel');

/**
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function ListAccountsMethodModel(utils, formatters) {
    AbstractMethodModel.call(this, 'personal_listAccounts', 0, utils, formatters);
}

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Object} response
 *
 * @returns {Array}
 */
ListAccountsMethodModel.prototype.afterExecution = function (response) {
    var self = this;

    return response.map(function(responseItem) {
        return self.utils.toChecksumAddress(responseItem);
    });
};

ListAccountsMethodModel.prototype = Object.create(AbstractMethodModel.prototype);
ListAccountsMethodModel.prototype.constructor = ListAccountsMethodModel;

module.exports = ListAccountsMethodModel;
