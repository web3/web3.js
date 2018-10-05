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
 * @file Registry.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var namehash = require('eth-ens-namehash');

/**
 * @param {Network} net
 * @param {Accounts} accounts
 * @param {ContractPackage} contractPackage
 * @param {Object} registryABI
 * @param {Object} resolverABI
 *
 * @constructor
 */
function Registry(net, accounts, contractPackage, registryABI, resolverABI) {
    var self = this;
    this.net = net;
    this.accounts = accounts;
    this.contractPackage = contractPackage;
    this.registryABI = registryABI;
    this.resolverABI = resolverABI;

    this.contract = this.checkNetwork().then(function (address) {
        return self.contractPackage.createContract(
            self.net.currentProvider,
            self.accounts,
            self.registryABI,
            address
        );
    });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method owner
 *
 * @param {String} name
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<any>}
 */
Registry.prototype.owner = function (name, callback) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.contract.then(function (contract) {
            contract.methods.owner(namehash.hash(name))
                .call()
                .then(function (receipt) {
                    resolve(receipt);

                    if (_.isFunction(callback)) {
                        callback(false, receipt);
                    }
                })
                .catch(function (error) {
                    reject(error);

                    if (_.isFunction(callback)) {
                        callback(error, null);
                    }
                });
        });
    });
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method resolver
 *
 * @param {String} name
 *
 * @returns {Promise<Contract>}
 */
Registry.prototype.resolver = function (name) {
    var self = this;

    return this.contract.then(function (contract) {
        return contract.methods.resolver(namehash.hash(name)).call();
    }).then(function (address) {
        return self.contractPackage.createContract(
            self.net.currentProvider,
            self.accounts,
            self.resolverABI,
            address
        );
    });
};

/**
 * Checks if the current used network is synced and looks for ENS support there.
 * Throws an error if not.
 *
 * @method checkNetwork
 *
 * @returns {Promise<Block>}
 */
Registry.prototype.checkNetwork = function () {
    var self = this, ensAddresses = {
        main: "0x314159265dD8dbb310642f98f50C066173C1259b",
        ropsten: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
        rinkeby: "0xe7410170f87102df0055eb195163a03b7f2bff4a"
    };

    return this.net.getBlock('latest', false).then(function (block) {
        var headAge = new Date() / 1000 - block.timestamp;
        if (headAge > 3600) {
            throw new Error("Network not synced; last block was " + headAge + " seconds ago");
        }

        return self.net.getNetworkType();
    }).then(function (networkType) {
        var addr = ensAddresses[networkType];
        if (typeof addr === 'undefined') {
            throw new Error("ENS is not supported on network " + networkType);
        }

        return addr;
    });
};

module.exports = Registry;
