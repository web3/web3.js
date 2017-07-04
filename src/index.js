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


var version = require('../lerna.json');
var core = require('../packages/web3-core');

var Eth = require('../packages/web3-eth');
var Net = require('../packages/web3-net');
var Personal = require('../packages/web3-eth-personal');
var Shh = require('../packages/web3-shh');
var Bzz = require('../packages/web3-bzz');

var utils = require('../packages/web3-utils');



var Web3 = function Web3() {

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = version.version;


    this.eth = new Eth(this);
    this.shh = new Shh(this);
    this.bzz = new Bzz(this);

    this.utils = utils;

    // overwrite package setProvider
    this.setProvider = function (provider, net) {
        this._requestManager.setProvider(provider, net);
        this._provider = this._requestManager.provider;

        this.eth.setProvider(provider, net);
        this.eth.net.setProvider(provider, net);
        this.eth.personal.setProvider(provider, net);

        this.shh.setProvider(provider, net);
        this.shh.net.setProvider(provider, net);

        this.bzz.setProvider(provider);

        return true;
    };
};

Web3.prototype.version = version.version;

core.addProviders(Web3);


Web3.modules = {
    Eth: Eth,
    Net: Net,
    Personal: Personal,
    Shh: Shh,
    Bzz: Bzz
};



module.exports = Web3;

