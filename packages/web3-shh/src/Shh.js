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
 * @file Shh.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

/**
 * @param {ConnectionModel} connectionModel
 * @param {MethodPackage} methodPackage
 * @param {SubscriptionPackage} subscriptionPackage
 *
 * @constructor
 */
function Shh(connectionModel, methodPackage, subscriptionPackage) {
    this.connectionModel = connectionModel;
    this.methodPackage = methodPackage;
    this.subscriptionPackage = subscriptionPackage;
    this.clearSubscriptions = this.connectionModel.provider.clearSubscriptions;
    this.net = this.connectionModel.getNetworkMethodsAsObject();
}

/**
 * Subscribe to whisper streams
 *
 * @method subscribe
 *
 * @param {string} method
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise}
 */
Shh.prototype.subscribe = function (method, options, callback) {
    return this.subscriptionPackage.create(
        this.connectionModel.provider,
        method,
        [options],
        null,
        null,
        'shh'
    ).subscribe(callback);
};

/**
 * Gets the current version of whisper from the connected node
 *
 * @method getVersion
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.getVersion = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_version',
        null,
        null,
        null
    ).send(callback);
};

/**
 * Gets information about the current whisper node.
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Object>}
 */
Shh.prototype.getInfo = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_info',
        null,
        null,
        null
    ).send(callback);
};

/**
 * Sets the maximal message size allowed by this node.
 *
 * @param {Number} size
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.setMaxMessageSize = function (size, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_setMaxMessageSize',
        size,
        null,
        null
    ).send(callback);
};

/**
 * Sets the minimal PoW required by this node.
 *
 * @param {Number} pow
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.setMinPoW = function (pow, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_setMinPoW',
        pow,
        null,
        null
    ).send(callback);
};

/**
 * Marks specific peer trusted, which will allow it to send historic (expired) messages.
 *
 * @param {String} enode
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.markTrustedPeer = function (enode, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_markTrustedPeer',
        pow,
        null,
        null
    ).send(callback);
};

/**
 * Generates a new public and private key pair for message decryption and encryption.
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.newKeyPair = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_newKeyPair',
        null,
        null,
        null
    ).send(callback);
};

/**
 * Generates a new public and private key pair for message decryption and encryption.
 *
 * @param {String} privateKey
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.addPrivateKey = function (privateKey, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_addPrivateKey',
        privateKey,
        null,
        null
    ).send(callback);
};

/**
 * Deletes the specifies key if it exists.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.deleteKeyPair = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_deleteKeyPair',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Checks if the whisper node has a private key of a key pair matching the given ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.hasKeyPair = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_hasKeyPair',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Returns the public key for a key pair ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.getPublicKey = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'id',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Returns the private key for a key pair ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.getPrivateKey = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_getPrivateKey',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Generates a random symmetric key and stores it under an ID
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.newSymKey = function (callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_newSymKey',
        null,
        null,
        null
    ).send(callback);
};

/**
 * Generates a random symmetric key and stores it under an ID
 *
 * @param {String} symKey
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.addSymKey = function (symKey, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_addSymKey',
        symKey,
        null,
        null
    ).send(callback);
};

/**
 * Generates the key from password, stores it, and returns its ID.
 *
 * @param {String} password
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.generateSymKeyFromPassword = function (password, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_generateSymKeyFromPassword',
        password,
        null,
        null
    ).send(callback);
};

/**
 * Generates the key from password, stores it, and returns its ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.hasSymKey = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_hasSymKey',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Returns the symmetric key associated with the given ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.getSymKey = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_getSymKey',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Deletes the symmetric key associated with the given ID.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.deleteSymKey = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_deleteSymKey',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Create a new filter within the node.
 *
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.newMessageFilter = function (options, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_newMessageFilter',
        options,
        null,
        null
    ).send(callback);
};

/**
 * Deletes a message filter in the node.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Boolean>}
 */
Shh.prototype.deleteMessageFilter = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_deleteMessageFilter',
        id,
        null,
        null
    ).send(callback);
};

/**
 * Retrieve messages that match the filter criteria and are received between
 * the last time this function was called and now.
 *
 * @param {String} id
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.getFilterMessages = function (id, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_getFilterMessages',
        id,
        null,
        null
    ).send(callback);
};


/**
 * Retrieve messages that match the filter criteria and are received between
 * the last time this function was called and now.
 *
 * @param {object} object
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<String>}
 */
Shh.prototype.post = function (object, callback) {
    return this.methodPackage.create(
        this.connectionModel.provider,
        'shh_post',
        object,
        null,
        null
    ).send(callback);
};

module.exports = Shh;
