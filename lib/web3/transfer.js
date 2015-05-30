/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file transfer.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var web3 = require('../web3');
var ICAP = require('./icap');
var namereg = require('./namereg');
var contract = require('./contract');

/**
 * Should be used to make ICAP transfer
 *
 * @method transfer
 * @param {String} iban number
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transfer = function (from, iban, value, callback) {
    var icap = new ICAP(iban); 
    if (!icap.isValid()) {
        throw new Error('invalid iban address');
    }

    if (icap.isDirect()) {
        return transferToAddress(from, icap.address(), value, callback);
    }
    
    if (!callback) {
        var address = namereg.addr(icap.institution());
        return deposit(from, address, value, icap.client());
    }

    namereg.addr(icap.insitution(), function (err, address) {
        return deposit(from, address, value, icap.client(), callback);
    });
    
};

/**
 * Should be used to transfer funds to certain address
 *
 * @method transferToAddress
 * @param {String} address
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transferToAddress = function (from, address, value, callback) {
    return web3.eth.sendTransaction({
        address: address,
        from: from,
        value: value
    }, callback);
};

/**
 * Should be used to deposit funds to generic Exchange contract (must implement deposit(bytes32) method!)
 *
 * @method deposit
 * @param {String} address
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {String} client unique identifier
 * @param {Function} callback, callback
 */
var deposit = function (from, address, value, client, callback) {
    var abi = [{"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"deposit","outputs":[],"type":"function"}];
    return contract(abi).at(address).deposit(client, {
        from: from,
        value: value
    }, callback);
};

module.exports = transfer;

