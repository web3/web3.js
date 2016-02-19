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
 * @file contract.js
 * @author Fabian <marek@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');


/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @param {Array} abi
 * @param {Array} abi
 * @param {Address} contract address
 */
var Contract = function(eth, abi, address, options) {
    console.log(this);
    this._eth = eth;
    this.transactionHash = null;
    this.address = address;
    this.abi = abi;
};

module.exports = Contract;
