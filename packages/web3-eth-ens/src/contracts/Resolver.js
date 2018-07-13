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
 * @author Samuel Furter <sam@tokenate.io>
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
 * @varructor
 */
function Resolver(address, node) {
    var self = this;
    self.node = node;
    self.resolver = new Contract(RESOLVER_ABI, address);
}

/**
 * Returns the address
 *
 * @method addr
 * @returns {Promise<any>}
 */
Resolver.prototype.addr = function () {
    return this.resolver.methods.addr(this.node).call();
};

/**
 * Sets a new address
 *
 * @method setAddr
 * @param {string} address
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setAddr = function(address) {
    return this.resolver.methods.setAddr(this.node, address).send();
};

/**
 * Returns the public key
 *
 * @returns {Promise<any>}
 */
Resolver.prototype.pubkey = function() {
    return this.resolver.method.pubkey(this.node).call();
};

/**
 * Sets a new public key
 *
 * @method setPubkey
 * @param x
 * @param y
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setPubkey = function(x, y) {
    return this.resolver.methods.setPubkey(this.node, y, y).send();
};

/**
 * Returns the content of this resolver
 *
 * @method getContent
 * @returns {Promise<any>}
 */
Resolver.prototype.content = function() {
    return this.resolver.methods.content(this.node).call();
};

/**
 * Set the content of this resolver
 *
 * @param {string} hash
 * @returns {Promise<Transaction>}
 */
Resolver.prototype.setContent = function(hash) {
    return this.resolver.method.setContent(this.node, hash).send();
};

module.exports = Resolver;
