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

var AbstractWeb3Object = require('web3-core-package').AbstractWeb3Object;
var formatters = require('web3-core-helpers').formatters;
var MethodPackage = require('web3-core-method');
var ProvidersPackage = require('web3-providers');
var EthPackage = require('web3-eth');
var PersonalPackage = require('web3-eth-personal');
var Utils = require('web3-utils');
var ShhPackage = require('web3-shh');
var BzzPackage = require('web3-bzz');
var NetworkPackage = require('web3-net');
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

    AbstractWeb3Object.call(
        this,
        provider,
        ProvidersPackage,
        MethodPackage.createMethodController(),
        new MethodPackage.AbstractMethodModelFactory({}, utils, formatters)
    );

    this.utils = Utils;
    this.eth = EthPackage.createEth(provider);
    this.shh = ShhPackage.createShh(provider);
    this.bzz = BzzPackage.createBzz(provider);
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
        AbstractWeb3Object.prototype.setProvider.call(this, provider, net) &&
        this.eth.setProvider(provider, net) &&
        this.shh.setProvider(provider, net) &&
        this.bzz.setProvider(provider)
    );
};

Web3.prototype = Object.create(AbstractWeb3Object.prototype);
Web3.prototype.constructor = Web3;

Web3.givenProvider = ProvidersPackage.detect();

Web3.version = version;

Web3.utils = Utils;

Web3.modules = {
    Eth: function (provider, net) {
        return EthPackage.createEth(ProvidersPackage.resolve(provider, net));
    },
    Net: function (provider, net) {
        return NetworkPackage.createNetwork(ProvidersPackage.resolve(provider, net));
    },
    Personal: function (provider, net) {
        return PersonalPackage.createPersonal(ProvidersPackage.resolve(provider, net));
    },
    Shh: function (provider, net) {
        return ShhPackage.createShh(ProvidersPackage.resolve(provider, net));
    },
    Bzz: function (provider, net) {
        return new BzzPackage.createBzz(ProvidersPackage.resolve(provider, net));
    }
};

Web3.providers = {
    HttpProvider: ProvidersPackage.HttpProvider,
    WebsocketProvider: ProvidersPackage.WebsocketProvider,
    IpcProvider: ProvidersPackage.IpcProvider
};

module.exports = Web3;
