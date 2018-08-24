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
 * @param {Object} net
 * @constructor
 */
var Web3 = function Web3(provider, net) {
    this.connectionModel = new ConnectionModel(provider);
    this.coreFactory = new CoreFactory();
    this.packageFactory = new PackageFactory(this.coreFactory, this.connectionModel);

    this.version = version;

    this.utils = this.coreFactory.createUtils();
    this.eth = this.packageFactory.createEthPackage();
    this.shh = this.packageFactory.createShhPackage();
    this.bzz = this.packageFactory.createBzzPackage();
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

Web3.version = version;

Web3.utils = new CoreFactory().createUtils();

Web3.modules = {
    Eth: function (provider) {
        return new PackageFactory(new CoreFactory(), new ConnectionModel(provider)).createEthPackage();
    },
    Net: function (provider) {
        return new PackageFactory(new CoreFactory(), new ConnectionModel(provider)).createEthPackage();
    },
    Personal: function (provider) {
        return new PackageFactory(new CoreFactory(), new ConnectionModel(provider)).createPersonalPackage();
    },
    Shh: function (provider) {
        return new PackageFactory(new CoreFactory(), new ConnectionModel(provider)).createShhPackage();
    },
    Bzz: function (provider) {
        return new PackageFactory(new CoreFactory(), new ConnectionModel(provider)).createBzzPackage();
    }
};

Web3.providers = {
    HttpProvider: require('web3-provider-http'),
    WebsocketProvider: require('web3-provider-ws'),
    IpcProvider: require('web3-provider-ipc')
};

// Web3.givenProvider = this.providerDetector.detect();

module.exports = Web3;

