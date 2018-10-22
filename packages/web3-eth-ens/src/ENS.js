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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class ENS {
    /**
     * @param {Registry} registry
     * @param {ResolverMethodHandler} resolverMethodHandler
     *
     * @constructor
     */
    constructor(registry, resolverMethodHandler) {
        this.registry = registry;
        this.resolverMethodHandler = resolverMethodHandler;
    }

    /**
     * Sets the provider for the registry and resolver object.
     * This method will also set the provider in the NetworkPackage and AccountsPackage because they are used here.
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return this.registry.setProvider(provider, net);
    }

    /**
     * Returns an contract of type resolver
     *
     * @method resolver
     *
     * @param {String} name
     *
     * @returns {Promise<Contract>}
     */
    resolver(name) {
        return this.registry.resolver(name);
    }

    /**
     * Returns the address record associated with a name.
     *
     * @method getAddress
     *
     * @method getAddress
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @return {PromiEvent}
     */
    getAddress(name, callback) {
        return this.resolverMethodHandler.method(name, 'addr', []).call(callback);
    }

    /**
     * Sets a new address
     *
     * @method setAddress
     *
     * @param {String} name
     * @param {String} address
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setAddress(name, address, sendOptions, callback) {
        return this.resolverMethodHandler.method(name, 'setAddr', [address]).send(sendOptions, callback);
    }

    /**
     * Returns the public key
     *
     * @method getPubkey
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    getPubkey(name, callback) {
        return this.resolverMethodHandler.method(name, 'pubkey', []).call(callback);
    }

    /**
     * Set the new public key
     *
     * @method setPubkey
     *
     * @param {String} name
     * @param {String} x
     * @param {String} y
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setPubkey(name, x, y, sendOptions, callback) {
        return this.resolverMethodHandler.method(name, 'setPubkey', [x, y]).send(sendOptions, callback);
    }

    /**
     * Returns the content
     *
     * @method getContent
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    getContent(name, callback) {
        return this.resolverMethodHandler.method(name, 'content', []).call(callback);
    }

    /**
     * Set the content
     *
     * @method setContent
     *
     * @param {String} name
     * @param {String} hash
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setContent(name, hash, sendOptions, callback) {
        return this.resolverMethodHandler.method(name, 'setContent', [hash]).send(sendOptions, callback);
    }

    /**
     * Get the multihash
     *
     * @method getMultihash
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    getMultihash(name, callback) {
        return this.resolverMethodHandler.method(name, 'multihash', []).call(callback);
    }

    /**
     * Set the multihash
     *
     * @method setMultihash
     *
     * @param {String} name
     * @param {String} hash
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setMultihash(name, hash, sendOptions, callback) {
        return this.resolverMethodHandler.method(name, 'multihash', [hash]).send(sendOptions, callback);
    }
}
