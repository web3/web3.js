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
 * @file ConnectionModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

/**
 * @param {Object} provider
 * @param {MethodPackage} method
 * @param {Utils} utils
 * @param {Object} formatters
 * @constructor
 */
function ConnectionModel(provider, method, utils, formatters) {
    this.provider = provider;
    this.coreFactory = coreFactory;
    this.utils = utils;
    this.formatters = formatters;
    this.method = method;
}

/**
 * Defines accessors for defaultAccount
 */
Object.defineProperty(Eth, 'defaultAccount', {
    get: function () {
        return this.defaultAccount || null;
    },
    set: function (val) {
        if (val) {
            this.defaultAccount = utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
        }
    },
    enumerable: true
});

/**
 * Defines accessors for defaultBlock
 */
Object.defineProperty(Eth, 'defaultBlock', {
    get: function () {
        return this.defaultBlock || 'latest';
    },
    set: function (val) {
        this.defaultBlock = val;
    },
    enumerable: true
});

/**
 * Determines to which network web3 is currently connected
 *
 * @method getNetworkType
 *
 * @param {Function} callback
 *
 * @callback callback(error, result)
 * @returns {Promise<String|Error>}
 */
ConnectionModel.prototype.getNetworkType = function (callback) {
    var self = this, id;

    return this.getId().then(function (givenId) {
        id = givenId;

        return self.getBlockByNumber(0, false);
    }).then(function (genesis) {
        var returnValue = 'private';
        switch (genesis) {
            case genesis.hash === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' && id === 1:
                returnValue = 'main';
                break;
            case genesis.hash === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303' && id === 2:
                returnValue = 'morden';
                break;
            case genesis.hash === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d' && id === 3:
                returnValue = 'ropsten';
                break;
            case genesis.hash === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177' && id === 4:
                returnValue = 'rinkeby';
                break;
            case genesis.hash === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9' && id === 42:
                returnValue = 'kovan';
                break;
        }

        if (_.isFunction(callback)) {
            callback(null, returnValue);
        }

        return returnValue;
    }).catch(function (err) {
        if (_.isFunction(callback)) {
            callback(err);

            return;
        }

        throw err;
    });
};

/**
 * Executes the JSON-RPC method net_version
 *
 * @method getId
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise|eventifiedPromise}
 */
ConnectionModel.prototype.getId = function (callback) {
    return this.method.create(this.provider, 'net_version', [], null, this.utils.hexToNumber).send(callback);
};

/**
 * Executes the JSON-RPC method net_listening
 *
 * @method isListening
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise|eventifiedPromise}
 */
ConnectionModel.prototype.isListening = function (callback) {
    return this.method.create(this.provider, 'net_listening', [], null, null).send(callback);
};

/**
 * Executes the JSON-RPC method net_peerCount
 *
 * @method getPeerCount
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise|eventifiedPromise}
 */
ConnectionModel.prototype.getPeerCount = function (callback) {
    return this.method.create(this.provider, 'net_peerCount', [], null, this.utils.hexToNumber).send(callback);
};

/**
 * Gets a block by his number
 *
 * @method getBlockByNumber
 *
 * @param {Number} blockNumber
 * @param {Boolean} returnTransactionObjects
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise|eventifiedPromise}
 */
ConnectionModel.prototype.getBlockByNumber = function (blockNumber, returnTransactionObjects, callback) {
    return this.method.create(
        this.provider,
        'eth_getBlockByNumber',
        [blockNumber, returnTransactionObjects],
        [this.formatters.inputBlockNumberFormatter, function (val) {
            return !!val
        }],
        this.formatters.outputBlockFormatter
    ).send(callback);
};

/**
 * Returns the network methods for the public API
 *
 * @method getNetworkMethodsAsObject
 *
 * @returns {Object}
 */
ConnectionModel.prototype.getNetworkMethodsAsObject = function () {
    return {
        getId: this.getId.bind(this),
        isListening: this.isListening.bind(this),
        getPeerCount: this.getPeerCount.bind(this),
        getNetworkType: this.getNetworkType.bind(this)
    }
};
