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
 * @method ENSRegistry
 * @varructor
 * @param {Object} ens
 */
function Registry(ens) {
    this.ens = ens;
    this.registry = ens.checkNetwork().then(function (address) {
        return new Contract(REGISTRY_ABI, address);
    });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method owner
 * @param {string} name
 * @return {Promise<any>}
 */
Registry.prototype.owner = function(name) {
    return this.registry.then(function (contract) {
        return contract.methods.owner(namehash.hash(name)).call();
    }).catch(function (error) {
        throw error;
    });
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method resolver
 * @param {string} name
 * @return {Promise<Resolver>}
 */
Registry.prototype.resolver = function(name) {
    var node = namehash.hash(name);
    return this.registry.then(function (contract) {
        return contract.methods.resolver(node).call();
    }).then(function (address) {
        return new Resolver(address, node);
    }).catch(function (error) {
        throw error;
    });
};

module.exports = Registry;
