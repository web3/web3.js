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
var formatters = require('web3-core-helpers').formatters;
var Registry = require('./contracts/Registry');
var ResolverMethodHandler = require('./lib/ResolverMethodHandler');

/**
 * Constructs a new instance of ENS
 *
 * @method ENS
 * @param {Object} eth
 * @constructor
 */
function ENS(eth) {
    this.eth = eth;
    var registryAddress = null;
    this._detectedAddress = null;
    this._lastSyncCheck = null;

    Object.defineProperty(this, 'registry', {
        get: function () {
            return new Registry(this);
        },
        enumerable: true
    });

    Object.defineProperty(this, 'resolverMethodHandler', {
        get: function () {
            return new ResolverMethodHandler(this.registry);
        },
        enumerable: true
    });

    Object.defineProperty(this, 'registryAddress', {
        get: function () {
            return registryAddress;
        },
        set: function (value) {
            if (value === null) {
                registryAddress = value;

                return;
            }

            registryAddress = formatters.inputAddressFormatter(value);
        },
        enumerable: true
    });
}

/**
 * @param {string} name
 * @returns {Promise<Contract>}
 */
ENS.prototype.resolver = function (name) {
    return this.registry.resolver(name);
};

/**
 * Does set the resolver of the given name
 *
 * @method setResolver
 *
 * @param {String} name
 * @param {String} address
 * @param {Object} sendOptions
 * @param {Function} callback
 *
 * @returns {eventifiedPromise}
 */
ENS.prototype.setResolver = function (name, address, sendOptions, callback) {
    return this.registry.setResolver(name, address, sendOptions, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setSubnodeOwner
 *
 * @param {string} name
 * @param {string} label
 * @param {string} address
 * @param {Object} sendOptions
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
ENS.prototype.setSubnodeOwner = function (name, label, address, sendOptions, callback) {
    return this.registry.setSubnodeOwner(name, label, address, sendOptions, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setTTL
 *
 * @param {string} name
 * @param {number} ttl
 * @param {Object} sendOptions
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
ENS.prototype.setTTL = function (name, ttl, sendOptions, callback) {
    return this.registry.setTTL(name, ttl, sendOptions, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setOwner
 *
 * @param {string} name
 * @param {Object} sendOptions
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
ENS.prototype.setOwner = function (name, sendOptions, callback) {
    return this.registry.setOwner(name, sendOptions, callback);
};

/**
 * Returns the address record associated with a name.
 *
 * @method getAddress
 * @param {string} name
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
 * @param {string} name
 * @param {string} address
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
 * @param {string} name
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ENS.prototype.getPubkey = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'pubkey', [], callback).call(callback);
};

/**
 * Set the new public key
 *
 * @method setPubkey
 * @param {string} name
 * @param {string} x
 * @param {string} y
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
 * @param {string} name
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
 * @param {string} name
 * @param {string} hash
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
 * @param {string} name
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
 * @param {string} name
 * @param {string} hash
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
 * @returns {Promise<String>}
 */
ENS.prototype.checkNetwork = async function () {
    var now = new Date() / 1000;

    if (!this._lastSyncCheck || (now - this._lastSyncCheck) > 3600) {
        var block = await this.eth.getBlock('latest');
        var headAge = now - block.timestamp;

        if (headAge > 3600) {
            throw new Error("Network not synced; last block was " + headAge + " seconds ago");
        }

        this._lastSyncCheck = now;
    }

    if (this.registryAddress) {
        return this.registryAddress;
    }

    if (!this._detectedAddress) {
        var networkType = await this.eth.net.getNetworkType();
        var addr = config.addresses[networkType];

        if (typeof addr === 'undefined') {
            throw new Error("ENS is not supported on network " + networkType);
        }

        this._detectedAddress = addr;

        return this._detectedAddress;
    }

    return this._detectedAddress;
};

module.exports = ENS;
