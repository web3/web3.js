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

var Contract = require('web3-eth-contract');
var namehash = require('eth-ens-namehash');
var REGISTRY_ABI = require('../ressources/ABI/Registry');
var Resolver = require('./Resolver');


/**
 * A wrapper around the ENS registry contract.
 *
 * @method Registry
 * @param {Object} ens
 * @constructor
 */
function Registry(ens) {
    var self = this;
    this.ens = ens;
    this.contract = ens.checkNetwork().then(function (address) {
        var contract = new Contract(REGISTRY_ABI, address);
        contract.setProvider(self.ens.eth.currentProvider);

        return contract;
    });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method owner
 * @param {string} name
 * @return {Promise<any>}
 */
Registry.prototype.owner = function (name) {
    return this.contract.then(function (contract) {
        return contract.methods.owner(namehash.hash(name)).call();
    });
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method resolver
 * @param {string} name
 * @return {Promise<Resolver>}
 */
Registry.prototype.resolver = function (name) {
    var self = this;
    var node = namehash.hash(name);
    return this.contract.then(function (contract) {
        return contract.methods.resolver(node).call();
    }).then(function (address) {
        return new Resolver(address, node, self.ens);
    });
};

module.exports = Registry;
