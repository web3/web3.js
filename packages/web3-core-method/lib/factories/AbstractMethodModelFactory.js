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

"use strict";

/**
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @constructor
 */
function AbstractMethodModelFactory(formatters, accounts) {
    this.formatters = formatters;
    this.accounts = accounts;
    this.methodModels = {};
}

AbstractMethodModelFactory.prototype.hasMethodModel = function (name) {
    return typeof this.methodModels[name] !== 'undefined';
};

AbstractMethodModelFactory.prototype.createMethodModel = function (name) {
    return new this.methodModels[name](this.formatters, this.accounts);
};

module.exports = AbstractMethodModelFactory;
