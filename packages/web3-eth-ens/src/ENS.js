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
var utils = require('web3-utils');
var Registry = require('./contracts/Registry');
var ResolverMethodHandler = require('./lib/ResolverMethodHandler');

/**
 * Constructs a new instance of ENS
 *
 * @param {Eth} eth
 *
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
 * Returns true if the given interfaceId is supported and otherwise false.
 *
 * @method supportsInterface
 *
 * @param {string} name
 * @param {string} interfaceId
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<boolean>}
 */
ENS.prototype.supportsInterface = function (name, interfaceId, callback) {
    return this.getResolver(name).then(function (resolver) {
        if (!utils.isHexStrict(interfaceId)) {
            interfaceId = utils.sha3(interfaceId).slice(0,10);
        }

        return resolver.methods.supportsInterface(interfaceId).call(callback);
    });
};

/**
 * Returns the Resolver by the given address
 *
 * @deprecated Please use the "getResolver" method instead of "resolver"
 *
 * @method resolver
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Contract>}
 */
ENS.prototype.resolver = function (name, callback) {
    return this.registry.resolver(name, callback);
};

/**
 * Returns the Resolver by the given address
 *
 * @method getResolver
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Contract>}
 */
ENS.prototype.getResolver = function (name, callback) {
    return this.registry.getResolver(name, callback);
};

/**
 * Does set the resolver of the given name
 *
 * @method setResolver
 *
 * @param {string} name
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setResolver = function (name, address, txConfig, callback) {
    return this.registry.setResolver(name, address, txConfig, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setSubnodeOwner
 *
 * @param {string} name
 * @param {string} label
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setSubnodeOwner = function (name, label, address, txConfig, callback) {
    return this.registry.setSubnodeOwner(name, label, address, txConfig, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method getTTL
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getTTL = function (name, callback) {
    return this.registry.getTTL(name, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setTTL
 *
 * @param {string} name
 * @param {number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setTTL = function (name, ttl, txConfig, callback) {
    return this.registry.setTTL(name, ttl, txConfig, callback);
};

/**
 * Returns the owner by the given name and current configured or detected Registry
 *
 * @method getOwner
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getOwner = function (name, callback) {
    return this.registry.getOwner(name, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setOwner
 *
 * @param {string} name
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setOwner = function (name, txConfig, callback) {
    return this.registry.setOwner(name, txConfig, callback);
};

/**
 * Returns the address record associated with a name.
 *
 * @method getAddress
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getAddress = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'addr', []).call(callback);
};

/**
 * Sets a new address
 *
 * @method setAddress
 *
 * @param {string} name
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setAddress = function (name, address, txConfig, callback) {
    return this.resolverMethodHandler.method(name, 'setAddr', [address]).send(txConfig, callback);
};

/**
 * Returns the public key
 *
 * @method getPubkey
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getPubkey = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'pubkey', [], callback).call(callback);
};

/**
 * Set the new public key
 *
 * @method setPubkey
 *
 * @param {string} name
 * @param {string} x
 * @param {string} y
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setPubkey = function (name, x, y, txConfig, callback) {
    return this.resolverMethodHandler.method(name, 'setPubkey', [x, y]).send(txConfig, callback);
};

/**
 * Returns the content
 *
 * @method getContent
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getContent = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'content', []).call(callback);
};

/**
 * Set the content
 *
 * @method setContent
 *
 * @param {string} name
 * @param {string} hash
 * @param {function} callback
 * @param {TransactionConfig} txConfig
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setContent = function (name, hash, txConfig, callback) {
    return this.resolverMethodHandler.method(name, 'setContent', [hash]).send(txConfig, callback);
};

/**
 * Get the multihash
 *
 * @method getMultihash
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.getMultihash = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'multihash', []).call(callback);
};

/**
 * Set the multihash
 *
 * @method setMultihash
 *
 * @param {string} name
 * @param {string} hash
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setMultihash = function (name, hash, txConfig, callback) {
    return this.resolverMethodHandler.method(name, 'multihash', [hash]).send(txConfig, callback);
};

/**
 * Checks if the current used network is synced and looks for ENS support there.
 * Throws an error if not.
 *
 * @returns {Promise<string>}
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
