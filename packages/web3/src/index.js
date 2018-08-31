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

var PackageFactory = require('./factories/PackageFactory');
var CoreFactory = require('./factories/CoreFactory');
var version = require('../package.json').version;

/**
 * @param {Object} provider
 * @param {Net} net
 *
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.coreFactory = new CoreFactory();
    this.packageFactory = new PackageFactory(this.coreFactory);
    this.connectionModel = new ConnectionModel(
        this.packageFactory.createProvidersPackageFactory().createProviderAdapterResolver().resolve(provider, net),
        this.coreFactory
    );

    this.version = version;

    this.utils = this.coreFactory.createUtils();
    this.eth = this.packageFactory.createEthPackage(this.connectionModel);
    this.shh = this.packageFactory.createShhPackage(this.connectionModel);
    this.bzz = this.packageFactory.createBzzPackage(this.connectionModel);
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

Web3.version = version;

Web3.utils = new CoreFactory().createUtils();

Web3.modules = {
    Eth: function (provider) {
        var coreFactory = new CoreFactory();
        return new PackageFactory(coreFactory).createEthPackage(new ConnectionModel(provider, coreFactory));
    },
    Net: function (provider) {
        var coreFactory = new CoreFactory();
        return new ConnectionModel(provider, coreFactory).getNetworkMethodsAsObject();
    },
    Personal: function (provider) {
        var coreFactory = new CoreFactory();
        return new PackageFactory(coreFactory).createPersonalPackage(new ConnectionModel(provider, coreFactory));
    },
    Shh: function (provider) {
        var coreFactory = new CoreFactory();
        return new PackageFactory(coreFactory).createShhPackage(new ConnectionModel(provider, coreFactory));
    },
    Bzz: function (provider) {
        var coreFactory = new CoreFactory();
        return new PackageFactory(coreFactory).createBzzPackage(new ConnectionModel(provider, coreFactory));
    }
};


Web3.providers = {
    HttpProvider: require('web3-core-providers').HttpProvider,
    WebsocketProvider: require('web3-core-providers').WebsocketProvider,
    IpcProvider: require('web3-core-providers').IpcProvider
};

Web3.givenProvider = function () {
    return new PackageFactory(new CoreFactory()).createProvidersPackageFactory().createProviderDetector().detect();
};

module.exports = Web3;

