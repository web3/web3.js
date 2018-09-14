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

var ProvidersPackage = require('web3-core-providers');
var EthPackage = require('web3-eth');
var Utils = require('web3-utils');
var ShhPackage = require('web3-shh');
var BzzPackage = require('web3-bzz');
var version = require('../package.json').version;

/**
 * @param {Object} provider
 * @param {Net} net
 *
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.version = version;

    if (typeof provider === 'undefined') {
        throw new Error('No provider given as constructor parameter!');
    }

    this._provider = ProvidersPackage.resolve(provider, net);

    if (!this._provider) {
        throw new Error('Invalid provider given as constructor parameter!');
    }

    this.utils = Utils;
    this.eth = EthPackage.create(this._provider);
    this.shh = ShhPackage.create(this._provider);
    this.bzz = BzzPackage.create(this._provider);

    /**
     * Defines accessors for connectionModel
     */
    Object.defineProperty(this, 'givenProvider', {
        get: function () {
            return this.givenProvider;
        },
        set: function (provider) {
            this.givenProvider = provider;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'currentProvider', {
        get: function () {
            return this._provider
        },
        set: function (provider) {
            if (typeof this._provider.clearSubscriptions !== 'undefined') {
                this._provider.clearSubscriptions();
            }

            this._provider = ProvidersPackage.resolve(provider, net);
            this.eth.setProvider(provider);
            this.shh.setProvider(provider);
            this.bzz.setProvider(provider);
        },
        enumerable: true
    });
};

Web3.givenProvider = ProvidersPackage.detect();

Web3.version = version;

Web3.utils = Utils;

Web3.modules = {
    Eth: function (provider, net) {
        return EthPackage.create(ProvidersPackage.resolve(provider, net));
    },
    Net: function (provider, net) {
        // return this.createConnectionModel(provider, net).getNetworkMethodsAsObject();
    },
    Personal: function (provider, net) {
        return PersonalPackage.create(ProvidersPackage.resolve(provider, net));
    },
    Shh: function (provider, net) {
        return ShhPackage.create(ProvidersPackage.resolve(provider, net));
    },
    Bzz: function (provider, net) {
        return new BzzPackage.create(ProvidersPackage.resolve(provider, net));
    }
};

Web3.providers = {
    HttpProvider: ProvidersPackage.HttpProvider,
    WebsocketProvider: ProvidersPackage.WebsocketProvider,
    IpcProvider: ProvidersPackage.IpcProvider
};

module.exports = Web3;

