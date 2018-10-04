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
 * @file ENSNetworkDetector.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {MethodController} methodController
 * @param {Accounts} accounts
 * @param {AbstractWeb3Object} web3Package
 * @param {GetLatestBlockMethodModel} getLatestBlockMethodModel
 * @param {GetNetworkTypeMethodModel} getNetworkTypeMethodModel
 *
 * @constructor
 */
function ENSNetworkDetector(methodController, accounts, web3Package, getLatestBlockMethodModel, getNetworkTypeMethodModel) {
    this.methodController = methodController;
    this.accounts = accounts;
    this.web3Package = web3Package;
    this.getLatestBlockMethodModel = getLatestBlockMethodModel;
    this.getNetworkTypeMethodModel = getNetworkTypeMethodModel;

    this.addresses = {
        main: "0x314159265dD8dbb310642f98f50C066173C1259b",
        ropsten: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
        rinkeby: "0xe7410170f87102df0055eb195163a03b7f2bff4a"
    };
}

/**
 * Detects the current registry address of ENS and throws an error if the network is not supported.
 *
 * @method detect
 *
 * @returns {Promise<String>}
 */
ENSNetworkDetector.prototype.detect = function () {
    var self = this;

    return this.methodController.execute(this.getLatestBlockMethodModel, this.accounts, this.web3Package).then(function (block) {
        var headAge = new Date() / 1000 - block.timestamp;

        if (headAge > 3600) {
            throw new Error("Network not synced; last block was " + headAge + " seconds ago");
        }

        return self.methodController.execute(this.getNetworkTypeMethodModel, self.accounts, self.web3Package);
    }).then(function (networkType) {
        var addr = self.addresses[networkType];
        if (typeof addr === 'undefined') {
            throw new Error("ENS is not supported on network " + networkType);
        }

        return addr;
    });
};

module.exports = ENSNetworkDetector;
