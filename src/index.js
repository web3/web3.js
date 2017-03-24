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

// providers
var providers = {
    WebsocketProvider: require('../packages/web3-providers-ws'),
    HttpProvider: require('../packages/web3-providers-http'),
    IpcProvider: require('../packages/web3-providers-ipc')
}


var Web3 = function Web3() {

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = version.version;

    this.providers = providers;


    this.eth = new Eth(this);
    this.shh = new Shh(this);
    this.bzz = new Bzz(this);

    this.utils = utils;

    this.setProvider = function (provider) {
        this._requestManager.setProvider(provider);

        this.eth.setProvider(provider);
        this.eth.net.setProvider(provider);
        this.eth.personal.setProvider(provider);

        this.shh.setProvider(provider);
        this.shh.net.setProvider(provider);

        this.bzz.setProvider(provider);
        this.bzz.net.setProvider(provider);
        return true;
    };
};

Web3.prototype.version = version.version;

Web3.providers = providers;

core.addProviders(Web3);


Web3.modules = {
    Eth: Eth,
    Net: Net,
    Personal: Personal,
    Shh: Shh,
    Bzz: Bzz
};



module.exports = Web3;

