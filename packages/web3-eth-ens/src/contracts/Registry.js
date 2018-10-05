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

    this.contract = ens.checkNetwork().then(function (address) {
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

module.exports = Registry;
