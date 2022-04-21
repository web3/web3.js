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

var {hexConcat, arrayify} = require('@ethersproject/bytes');
var { formatters } = require('web3-core-helpers');
var utils = require('web3-utils');
var Method = require('web3-core-method');
var AbiEncoder = require('web3-eth-abi');


var config = require('./config');
var Registry = require('./contracts/Registry');
var ResolverMethodHandler = require('./lib/ResolverMethodHandler');
var contenthash = require('./lib/contentHash');
var { dnsEncode } = require('./utils');


function numPad(value) {
    const result = arrayify(value);
    if (result.length > 32) { throw new Error("internal; should not happen"); }

    const padded = new Uint8Array(32);
    padded.set(result, 32 - result.length);
    return padded;
}

function bytesPad(value) {
    if ((value.length % 32) === 0) { return value; }

    const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
    result.set(value);
    return result;
}

function encodeBytes(datas) {
    const result = [ ];
    let byteCount = 0;

    // Add place-holders for pointers as we add items
    for (let i = 0; i < datas.length; i++) {
        result.push(null);
        byteCount += 32;
    }

    for (let i = 0; i < datas.length; i++) {
        const data = arrayify(datas[i]);

        // Update the bytes offset
        result[i] = numPad(byteCount);

        // The length and padded value of data
        result.push(numPad(data.length));
        result.push(bytesPad(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
    }

    return hexConcat(result);
}

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
    }).catch(function(error) {
        if (typeof callback === 'function') {
            callback(error, null);

            return;
        }

        throw error;
    });
};

ENS.prototype.parent = function(name) {
    if(!name) throw 'No name provided';
    if(typeof name !== 'string') throw 'name should be a string';

    const splitString = name.split('.');
    if(splitString.length <= 1) return '';

    return splitString.slice(1).join('.');
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
 * Returns the Resolver by the given name
 *
 * @method getResolver
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<Contract>}
 */
ENS.prototype.getResolver = async function (name, callback) {
    return this.registry.getResolver(name, callback);
};

ENS.prototype.resolve = async function (name, func, ...args) {
    const resolver = await this.getResolver(name);
    if(resolver.options.address === null) {
        return null;
    }
    const supportsENSIP10 = await resolver.methods.supportsInterface('0x9061b923').call();
    if(supportsENSIP10) {

        const jsonInterfaceAddr = {
            name: 'addr',
            type: 'function',
            inputs: [{
                type: 'bytes32',
                name: 'node',
            }],
        };

        const calldata = AbiEncoder.encodeFunctionCall(jsonInterfaceAddr, args);

        // const calldata = resolver.methods[func](...args).encodeABI();
        // const result = resolver.methods.resolve(dnsEncode(name), calldata);

        const jsonInterface = {
            name: 'resolve',
            type: 'function',
            inputs: [{
                type: 'bytes',
                name: 'name',
            }, {
                type: 'bytes',
                name: 'data',
            }],
        };

        const encodedFunctionCall = AbiEncoder.encodeFunctionCall(jsonInterface, [dnsEncode(name), calldata]);

        // const dnsEncoding = dnsEncode(name);
        // const encodedBytes = encodeBytes([ dnsEncode(name), calldata ]);
        // const hexConcated = hexConcat([ "0x9061b923", encodeBytes([ dnsEncode(name), calldata ]) ]);

        const tx = {
            to: resolver.options.address,
            data: encodedFunctionCall,
        };

        const method = new Method({
            name: 'call',
            call: 'eth_call',
            params: 2,
            inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter],
            abiCoder: AbiEncoder
        });
        method.setRequestManager(this.eth._requestManager);
        method.defaultBlock = 'latest';
        method.handleRevert = false;
        method.defaultAccount = null;
        method.defaultBlock = 'latest';
        method.transactionBlockTimeout = 50;
        method.transactionConfirmationBlocks = 24;
        method.transactionPollingTimeout = 750;
        method.transactionPollingInterval = 1000;
        method.blockHeaderTimeout = 10; // 10 seconds
        method.maxListenersWarningThreshold = 100;
        method.ccipReadGatewayCallback = null;
        method.ccipReadGatewayUrls = [];
        method.ccipReadGatewayAllowList = [];
        method.ccipReadMaxRedirectCount = 4;

        const send = method.buildCall();
        const result = await send(tx);

        function _parseBytes(result, start) {
            if (result === "0x") { return null; }
        
            const offset = BigNumber.from(hexDataSlice(result, start, start + 32)).toNumber();
            const length = BigNumber.from(hexDataSlice(result, offset, offset + 32)).toNumber();
        
            return hexDataSlice(result, offset + 32, offset + 32 + length);
        }


        console.log('result: ', result);
        const decoded = AbiEncoder.decodeParameter('address', result);
        console.log('decoded; ', decoded);
        return decoded;

        // return resolver[func].decodeReturnData(result);
    } else if(name === resolver.currentName) {
        return resolver[func](...args);
    } else {
        return null;
    }
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
 * Sets the owner, resolver, and TTL for an ENS record in a single operation.
 *
 * @method setRecord
 *
 * @param {string} name
 * @param {string} owner
 * @param {string} resolver
 * @param {string | number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setRecord = function (name, owner, resolver, ttl, txConfig, callback) {
    return this.registry.setRecord(name, owner, resolver, ttl, txConfig, callback);
};

/**
 * Sets the owner, resolver and TTL for a subdomain, creating it if necessary.
 *
 * @method setSubnodeRecord
 *
 * @param {string} name
 * @param {string} label
 * @param {string} owner
 * @param {string} resolver
 * @param {string | number} ttl
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setSubnodeRecord = function (name, label, owner, resolver, ttl, txConfig, callback) {
    return this.registry.setSubnodeRecord(name, label, owner, resolver, ttl, txConfig, callback);
};

/**
 * Sets or clears an approval by the given operator.
 *
 * @method setApprovalForAll
 *
 * @param {string} operator
 * @param {boolean} approved
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setApprovalForAll = function (operator, approved, txConfig, callback) {
    return this.registry.setApprovalForAll(operator, approved, txConfig, callback);
};

/**
 * Returns true if the operator is approved
 *
 * @method isApprovedForAll
 *
 * @param {string} owner
 * @param {string} operator
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<boolean>}
 */
ENS.prototype.isApprovedForAll = function (owner, operator, callback) {
    return this.registry.isApprovedForAll(owner, operator, callback);
};

/**
 * Returns true if the record exists
 *
 * @method recordExists
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise<boolean>}
 */
ENS.prototype.recordExists = function (name, callback) {
    return this.registry.recordExists(name, callback);
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
 * @param {string} address
 * @param {TransactionConfig} txConfig
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<TransactionReceipt | TransactionRevertInstructionError>}
 */
ENS.prototype.setOwner = function (name, address, txConfig, callback) {
    return this.registry.setOwner(name, address, txConfig, callback);
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
    debugger
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
    return this.resolverMethodHandler.method(name, 'pubkey', [], null, callback).call(callback);
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
 * Returns the contenthash
 *
 * @method getContenthash
 *
 * @param {string} name
 * @param {function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent<ContentHash>}
 */
ENS.prototype.getContenthash = function (name, callback) {
    return this.resolverMethodHandler.method(name, 'contenthash', [], contenthash.decode).call(callback);
};

/**
 * Set the contenthash
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
ENS.prototype.setContenthash = function (name, hash, txConfig, callback) {
    var encoded;
    try {
        encoded = contenthash.encode(hash);
    } catch(err){
        var error = new Error('Could not encode ' + hash + '. See docs for supported hash protocols.');

        if (typeof callback === 'function') {
            callback(error, null);

            return;
        }

        throw error;
    }
    return this.resolverMethodHandler.method(name, 'setContenthash', [encoded]).send(txConfig, callback);
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
