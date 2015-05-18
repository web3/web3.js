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

var transfer = function (iban, from, value, callback) {
    var icap = new ICAP(iban); 
    if (!icap.isValid()) {
        var err = new Error('invalid');
        if (callback) {
            return callback(err);
        }
        throw err;
    }

    if (icap.isDirect()) {
        return transferToAddress(icap.address(), from, value, null, callback);
    }
    
    if (!callback) {
        var address = namereg.addressOf(icap.insitution());
        return transferToAddress(address, from, value, icap.client());
    }

    namereg.addressOf(icap.insitution(), function (err, address) {
        return transferToAddress(address, from, value, icap.client(), callback);
    });
    
};

var transferToAddress = function (address, from, value, data, callback) {
    return web3.eth.sendTransaction({
        address: address,
        from: from,
        value: value,
        data: data
    }, callback);
};

module.exports = transfer;

