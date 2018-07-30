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
 * @file Resolver.js
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var RESOLVER_ABI = require('../ressources/ABI/Resolver');
var Contract = require('web3-eth-contract');

/**
 * Creates an instance of Resolver
 *
 * @param {string} address
 * @param {string} node
 * @param {ENS} ens
 * @constructor
 */
function Resolver(address, node, ens) {
    var self = this;
    self.node = node;
    self.ens = ens;
    self.contract = new Contract(RESOLVER_ABI, address);
    self.contract.setProvider(self.ens.eth.currentProvider);
}

/**
 * Returns the address
 *
 * @method addr
 * @returns {Promise<any>}
 */
Resolver.prototype.addr = function () {
    return this.contract.methods.addr(this.node).call();
};

/**
 * Sets a new address
 *
 * @method setAddr
 * @param {string} address
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setAddr = function (address, from) {
    return this.contract.methods.setAddr(this.node, address).send({from: from});
};

/**
 * Returns the public key
 *
 * @method pubkey
 * @returns {Promise<any>}
 */
Resolver.prototype.pubkey = function () {
    return this.contract.methods.pubkey(this.node).call();
};

/**
 * Sets a new public key
 *
 * @method setPubkey
 * @param {string} x
 * @param {string} y
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setPubkey = function (x, y, from) {
    return this.contract.methods.setPubkey(this.node, y, y).send({from: from});
};

/**
 * Returns the content of this resolver
 *
 * @method content
 * @returns {Promise<any>}
 */
Resolver.prototype.content = function () {
    return this.contract.methods.content(this.node).call();
};

/**
 * Set the content of this resolver
 *
 * @method setContent
 * @param {string} hash
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setContent = function (hash, from) {
    return this.contract.methods.setContent(this.node, hash).send({from: from});
};

/**
 * Returns the multihash of this resolver
 *
 * @method multihash
 * @returns {Promise<any>}
 */
Resolver.prototype.multihash = function () {
    return this.contract.methods.multihash(this.node).call();
}

/**
 * Set the multihash for this resolver
 *
 * @method setMultihash
 * @param {string} hash
 * @param {string} from
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setMultihash = function (hash, from) {
    return this.contract.methods.setMultihash(this.node).send({from: from});
};

module.exports = Resolver;
