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
 *
 * To initialize a contract use:
 *
 *  var Contract = require('web3-eth-contract');
 *  Contract.prototype._eth = needsAEthInstance;
 *  var contract = new Contract(abi, address, ...);
 *
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2016
 */


"use strict";

var solidity = require('./solidity/coder');

module.exports = {
    solidity: solidity
};

