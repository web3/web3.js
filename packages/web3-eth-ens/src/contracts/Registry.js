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
var Contract = require('web3-eth-contract');
var namehash = require('eth-ens-namehash');
var PromiEvent = require('web3-core-promievent');
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');
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
 * @deprecated Please use the "getOwner" method instead of "owner"
 *
 * @method owner
 *
 * @param {string} name
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.owner = function (name, callback) {
    console.warn('Deprecated: Please use the "getOwner" method instead of "owner".');

    return this.getOwner(name, callback);
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method getOwner
 *
 * @param {string} name
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.getOwner = function (name, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.owner(namehash.hash(name)).call()
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setOwner
 *
 * @param {string} name
 * @param {string} address
 * @param {Object} txConfig
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.setOwner = function (name, address, txConfig, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.setOwner(namehash.hash(name), formatters.inputAddressFormatter(address)).send(txConfig)
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the TTL of the given node by his name
 *
 * @method ttl
 *
 * @param {String} name
 * @param {Function} callback
 *
 * @returns {eventifiedPromise}
 */
Registry.prototype.getTTL = function (name, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.ttl(namehash.hash(name)).call()
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setTTL
 *
 * @param {string} name
 * @param {number} ttl
 * @param {Object} txConfig
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.setTTL = function (name, ttl, txConfig, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.setTTL(namehash.hash(name), ttl)
            .send(txConfig)
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setSubnodeOwner
 *
 * @param {string} name
 * @param {string} label
 * @param {string} address
 * @param {Object} txConfig
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.setSubnodeOwner = function (name, label, address, txConfig, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.setSubnodeOwner(namehash.hash(name), utils.sha3(label), formatters.inputAddressFormatter(address))
            .send(txConfig)
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @deprecated Please use the "getResolver" method instead of "resolver"
 *
 * @method resolver
 *
 * @param {string} name
 * @param {Function} callback
 *
 * @return {Promise<Contract>}
 */
Registry.prototype.resolver = function (name, callback) {
    console.warn('Deprecated: Please use the "getResolver" method instead of "resolver".');

    return this.getResolver(name, callback);
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method getResolver
 *
 * @param {string} name
 * @param {Function} callback
 *
 * @return {Promise<Contract>}
 */
Registry.prototype.getResolver = function (name, callback) {
    var self = this;

    return this.contract.then(function (contract) {
        return contract.methods.resolver(namehash.hash(name)).call();
    }).then(function (address) {
        var contract = new Contract(RESOLVER_ABI, address);
        contract.setProvider(self.ens.eth.currentProvider);

        if (_.isFunction(callback)) {
            // It's required to pass the contract to the second argument to be backwards compatible and to have the required consistency
            callback(contract, contract);
        }

        return contract;
    }).catch(function(error) {
        if (_.isFunction(callback)) {
            callback(error, null);

            return;
        }

        throw error;
    });
};

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method setResolver
 *
 * @param {string} name
 * @param {string} address
 * @param {Object} txConfig
 * @param {function} callback
 *
 * @return {eventifiedPromise}
 */
Registry.prototype.setResolver = function (name, address, txConfig, callback) {
    var promiEvent = new PromiEvent(true);

    this.contract.then(function (contract) {
        contract.methods.setResolver(namehash.hash(name), formatters.inputAddressFormatter(address))
            .send(txConfig)
            .then(function (receipt) {
                promiEvent.resolve(receipt);

                if (_.isFunction(callback)) {
                    // It's required to pass the receipt to the second argument to be backwards compatible and to have the required consistency
                    callback(receipt, receipt);
                }
            })
            .catch(function (error) {
                promiEvent.reject(error);

                if (_.isFunction(callback)) {
                    callback(error, null);
                }
            });
    });

    return promiEvent.eventEmitter;
};

module.exports = Registry;
