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

"use strict";


var core = require('../packages/web3-core');

var Eth = require('../packages/web3-eth');
var Net = require('../packages/web3-net');
var Shh = require('../packages/web3-shh');
var Personal = require('../packages/web3-personal');

var utils = require('../packages/web3-utils');



var Web3 = function () {

    // sets _requestmanager etc
    core.packageInit(this, arguments);


    this.net = new Net(this);
    this.eth = new Eth(this);
    this.personal = new Personal(this); // move to -> web3.eth.accounts
    this.shh = new Shh(this);

    this.utils = utils;

    this.setProvider = function (provider) {
        this._requestManager.setProvider(provider);
        this.eth.setProvider(provider);
        this.net.setProvider(provider);
        this.shh.setProvider(provider);
        this.personal.setProvider(provider);
        return true;
    };
};



core.addProviders(Web3);



module.exports = Web3;

