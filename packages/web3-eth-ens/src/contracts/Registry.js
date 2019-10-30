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
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var namehash = require('eth-ens-namehash');
var PromiEvent = require('web3-core-promievent');
var REGISTRY_ABI = require('../ressources/ABI/Registry');
var RESOLVER_ABI = require('../ressources/ABI/Resolver');


/**
 * A wrapper around the ENS registry contract.
 *
 * @method Registry
 * @param {Ens} ens
 * @constructor
 */
function Registry(ens) {
    const self = this;
    this.ens = ens;
    this.contract = ens.checkNetwork().then(function (address) {
        return new self.ens.eth.Contract(REGISTRY_ABI, address);
        // contract.setProvider(self.ens.eth.currentProvider);
    });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method owner
 * @param {string} name
 * @param {function} callback
 * @return {Promise<any>}
 */
Registry.prototype.owner = function (name, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.owner(namehash.hash(name)).call()
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    callback(receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method resolver
 * @param {string} name
 * @return {Promise<Contract>}
 */
Registry.prototype.resolver = function (name) {
    const self = this;

    return this.contract.then(function (contract) {
        return contract.methods.resolver(namehash.hash(name)).call();
    }).then(function (address) {
        return new self.ens.eth.Contract(RESOLVER_ABI, address);
    });
};

module.exports = Registry;
