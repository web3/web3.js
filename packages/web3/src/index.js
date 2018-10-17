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
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractWeb3Module = require('web3-core').AbstractWeb3Module;
var formatters = require('web3-core-helpers').formatters;
var MethodPackage = require('web3-core-method');
var ProvidersPackage = require('web3-providers');
var Utils = require('web3-utils');
var Eth = require('web3-eth').Eth;
var Shh = require('web3-shh').Shh;
var Bzz = require('web3-bzz').Bzz;
var Network = require('web3-net').Network;
var Personal = require('web3-eth-personal').Personal;
var version = require('../package.json').version;

/**
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.version = version;
    provider = ProvidersPackage.resolve(provider, net);

    AbstractWeb3Module.call(
        this,
        provider,
        ProvidersPackage,
        MethodPackage.createMethodController(),
        new MethodPackage.AbstractMethodModelFactory({}, utils, formatters)
    );

    this.utils = Utils;
    this.eth = new Eth(provider);
    this.shh = new Shh(provider);
    this.bzz = new Bzz(provider);
};

/**
 * Sets the provider for all packages
 *
 * @method setProvider
 *
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @returns {Boolean}
 */
Web3.prototype.setProvider = function (provider, net) {
    return !!(
        AbstractWeb3Module.prototype.setProvider.call(this, provider, net) &&
        this.eth.setProvider(provider, net) &&
        this.shh.setProvider(provider, net) &&
        this.bzz.setProvider(provider)
    );
};

Web3.prototype = Object.create(AbstractWeb3Module.prototype);
Web3.prototype.constructor = Web3;

Web3.givenProvider = ProvidersPackage.detect();

Web3.version = version;

Web3.utils = Utils;

Web3.modules = {
    Eth: function (provider, net) {
        return new Eth(ProvidersPackage.resolve(provider, net));
    },
    Net: function (provider, net) {
        return new Network(ProvidersPackage.resolve(provider, net));
    },
    Personal: function (provider, net) {
        return new Personal(ProvidersPackage.resolve(provider, net));
    },
    Shh: function (provider, net) {
        return new Shh(ProvidersPackage.resolve(provider, net));
    },
    Bzz: function (provider, net) {
        return new Bzz(ProvidersPackage.resolve(provider, net));
    }
};

Web3.providers = {
    HttpProvider: ProvidersPackage.HttpProvider,
    WebsocketProvider: ProvidersPackage.WebsocketProvider,
    IpcProvider: ProvidersPackage.IpcProvider
};

module.exports = Web3;
