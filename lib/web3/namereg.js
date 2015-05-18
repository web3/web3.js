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
 * @file namereg.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var contract = require('./contract');

var address = '0xb9b5002e4d93944eb47050a16512bc576c7508c0';
//var address = '0xc6d9d2cd449a754c494264e1809c50e34d64562b';
var abi = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getName","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"register","outputs":[],"type":"function"},
    {"constant":true,"inputs":[{"name":"name","type":"bytes32"}],"name":"addressOf","outputs":[{"name":"addr","type":"address"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getAddress","outputs":[{"name":"o_owner","type":"address"}],"type":"function"},
    {"constant":false,"inputs":[],"name":"unregister","outputs":[],"type":"function"},
    {"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"nameOf","outputs":[{"name":"name","type":"bytes32"}],"type":"function"},
    {"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"AddressRegistered","type":"event"},
    {"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"AddressDeregistered","type":"event"}
];

module.exports = contract(abi).at(address);

