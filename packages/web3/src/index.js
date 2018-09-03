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
var MethodPackage = require('web3-core-method');
var Utils = require('web3-utils');
var ShhPackage = require('web3-shh');
var BzzPackage = require('web3-bzz');
var HelpersPackage = require('web3-helpers');
var version = require('../package.json').version;

/**
 * @param {Object} provider
 * @param {Net} net
 *
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.version = version;
    this.connectionModel = Web3.createConnectionModel(
        ProvidersPackage.resolve(provider, net)
    );
    this.utils = Utils;
    this.eth = EthPackage.create(this.connectionModel);
    this.shh = ShhPackage.create(this.connectionModel);
    this.bzz = BzzPackage.create(this.connectionModel);
};

/**
 * Defines accessors for connectionModel
 */
Object.defineProperty(Web3, 'connectionModel', {
    get: function () {
        return this.connectionModel;
    },
    set: function (connectionModel) {
        if (this.connectionModel) {
            return;
        }

        this.connectionModel = connectionModel;
    },
    enumerable: true
});

/**
 * Defines accessors for connectionModel
 */
Object.defineProperty(Web3, 'givenProvider', {
    get: function () {
        return this.connectionModel.givenProvider;
    },
    set: function (connectionModel) {
        if (this.connectionModel) {
            return;
        }

        this.connectionModel = connectionModel;
    },
    enumerable: true
});

Web3.version = version;

Web3.utils = Utils;

Web3.modules = {
    Eth: function (provider, net) {
        return EthPackage.create(this.createConnectionModel(provider, net));
    },
    Net: function (provider, net) {
        return this.createConnectionModel(provider, net).getNetworkMethodsAsObject();
    },
    Personal: function (provider, net) {
        return PersonalPackage.create(this.createConnectionModel(provider, net));
    },
    Shh: function (provider, net) {
        return ShhPackage.create(this.createConnectionModel(provider, net));
    },
    Bzz: function (provider, net) {
        return new BzzPackage.create(this.createConnectionModel(provider, net));
    }
};

Web3.createConnectionModel = function(provider, net) {
    return new ConnectionModel(
        ProvidersPackage.resolve(provider, net),
        MethodPackage,
        UtilsPackage.create(),
        HelpersPackage.create().formatters
    )
};


Web3.providers = {
    HttpProvider: ProvidersPackage.HttpProvider,
    WebsocketProvider: ProvidersPackage.WebsocketProvider,
    IpcProvider: ProvidersPackage.IpcProvider
};

module.exports = Web3;

