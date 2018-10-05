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
 * @file ENS.js
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var config = require('./config');
var Registry = require('./contracts/Registry');
var ResolverMethodHandler = require('./lib/ResolverMethodHandler');

/**
 * @param {Network} net
 * @param {Accounts} accounts
 * @param {ContractPackage} contractPackage
 * @param {Object} registryAbi
 * @param {Object} resolverAbi
 * @param {PromiEventPackage} promiEventPackage
 *
 * @constructor
 */
function ENS(net, accounts, contractPackage, registryAbi, resolverAbi, promiEventPackage) {
    this.net = net;
    this.registry = new Registry(net, accounts, contractPackage, registryAbi, resolverAbi);
    this.resolverMethodHandler = new ResolverMethodHandler(this.registry, promiEventPackage);
}

/**
 * @param {String} name
 * @returns {Promise<Contract>}
 */
ENS.prototype.resolver = function (name) {
    return this.registry.resolver(name);
};

/**
 * Returns the address record associated with a name.
 *
 * @method getAddress
 * @param {String} name
 * @param {function} callback
 * @return {eventifiedPromise}
 */
ENS.prototype.getAddress = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'addr', []).call(callback);
};

/**
 * Sets a new address
 *
 * @method setAddress
 * @param {String} name
 * @param {String} address
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.setAddress = function (name, address, sendOptions, callback) {
    return this.resolverMethodHandler.method(name, 'setAddr', [address]).send(sendOptions, callback);
};

/**
 * Returns the public key
 *
 * @method getPubkey
 * @param {String} name
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.getPubkey = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'pubkey', []).call(callback);
};

/**
 * Set the new public key
 *
 * @method setPubkey
 * @param {String} name
 * @param {String} x
 * @param {String} y
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.setPubkey = function (name, x, y, sendOptions, callback) {
    return this.resolverMethodHandler.method(name, 'setPubkey', [x, y]).send(sendOptions, callback);
};

/**
 * Returns the content
 *
 * @method getContent
 * @param {String} name
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.getContent = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'content', []).call(callback);
};

/**
 * Set the content
 *
 * @method setContent
 * @param {String} name
 * @param {String} hash
 * @param {function} callback
 * @param {Object} sendOptions
 * @returns {eventifiedPromise}
 */
ENS.prototype.setContent = function (name, hash, sendOptions, callback) {
    return this.resolverMethodHandler.method(name, 'setContent', [hash]).send(sendOptions, callback);
};

/**
 * Get the multihash
 *
 * @method getMultihash
 * @param {String} name
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.getMultihash = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'multihash', []).call(callback);
};

/**
 * Set the multihash
 *
 * @method setMultihash
 * @param {String} name
 * @param {String} hash
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.setMultihash = function (name, hash, sendOptions, callback) {
    return this.resolverMethodHandler.method(name, 'multihash', [hash]).send(sendOptions, callback);
};

/**
 * Checks if the current used network is synced and looks for ENS support there.
 * Throws an error if not.
 *
 * @returns {Promise<Block>}
 */
ENS.prototype.checkNetwork = function () {
    var self = this;
    return self.net.getBlock('latest', false).then(function (block) {
        var headAge = new Date() / 1000 - block.timestamp;
        if (headAge > 3600) {
            throw new Error("Network not synced; last block was " + headAge + " seconds ago");
        }

        return self.net.getNetworkType();
    }).then(function (networkType) {
        var addr = config.addresses[networkType];
        if (typeof addr === 'undefined') {
            throw new Error("ENS is not supported on network " + networkType);
        }

        return addr;
    });
};

module.exports = ENS;
