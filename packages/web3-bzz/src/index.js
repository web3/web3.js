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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var Net = require('web3-net');


var swarm = require("swarm-js");



var Bzz = function Bzz(url) {
    url = url || 'http://swarm-gateways.net'; // default to gateway

    // check for ethereum provider
    if (typeof ethereum === 'object' && ethereum.swarm) {
        url = ethereum.swarm;
    }

    var bzz = swarm.at(url);
    bzz.url = url;
    return bzz;
};


module.exports = Bzz;

