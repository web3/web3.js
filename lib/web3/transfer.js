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
 * @file transfer.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Iban = require('./iban');
var exchangeAbi = require('../contracts/SmartExchange.json');

/**
 * Should be used to make Iban transfer
 *
 * @method transfer
 * @param {String} from
 * @param {String} to iban
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transfer = function (eth, from, to, value, callback) {
    var iban = new Iban(to); 
    if (!iban.isValid()) {
        throw new Error('invalid iban address');
    }

    if (iban.isDirect()) {
        return transferToAddress(eth, from, iban.address(), value, callback);
    }
    
    if (!callback) {
        var address = eth.icapNamereg().addr(iban.institution());
        return deposit(eth, from, address, value, iban.client());
    }

    eth.icapNamereg().addr(iban.institution(), function (err, address) {
        return deposit(eth, from, address, value, iban.client(), callback);
    });
    
};

/**
 * Should be used to transfer funds to certain address
 *
 * @method transferToAddress
 * @param {String} from
 * @param {String} to
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transferToAddress = function (eth, from, to, value, callback) {
    return eth.sendTransaction({
        address: to,
        from: from,
        value: value
    }, callback);
};

/**
 * Should be used to deposit funds to generic Exchange contract (must implement deposit(bytes32) method!)
 *
 * @method deposit
 * @param {String} from
 * @param {String} to
 * @param {Value} value to be transfered
 * @param {String} client unique identifier
 * @param {Function} callback, callback
 */
var deposit = function (eth, from, to, value, client, callback) {
    var abi = exchangeAbi;
    return eth.contract(abi).at(to).deposit(client, {
        from: from,
        value: value
    }, callback);
};

module.exports = transfer;

