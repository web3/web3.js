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
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Gav Wood <gav@ethcore.io>
 *   Jeffrey Wilcke <jeffrey.wilcke@ethereum.org>
 *   Marek Kotewicz <marek@ethcore.io>
 *   Marian Oancea <marian@ethereum.org>
 * @date 2017
 */


var core = require('../packages/web3-core');

var Eth = require('../packages/web3-eth');
var Net = require('../packages/web3-net');




var Web3 = function (provider) {

    // sets _requestmanager etc
    core.packageInit(this, arguments);


    this.eth = new Eth(this);
    this.net = new Net(this);
};

core.addProviders(Web3);



module.exports = Web3;

