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
 * @file Ens.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module, PromiEvent} from 'web3-core';
import isFunction from 'lodash/isFunction';
import namehash from 'eth-ens-namehash';

// TODO: Remove the wrapped methods and create a proxy for handling a ENS method call.
export default class Ens extends AbstractWeb3Module {
    /**
     * @param {HttpProvider|WebsocketProvider|IpcProvider|EthereumProvider|String} provider
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Object} options
     * @param {EnsModuleFactory} ensModuleFactory
     * @param {Accounts} accounts
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Network} net
     *
     * @constructor
     */
    constructor(
        provider,
        options,
        ensModuleFactory,
        contractModuleFactory,
        accounts,
        abiCoder,
        utils,
        formatters,
        net
    ) {
        super(provider, options);

        this.accounts = accounts;
        this.ensModuleFactory = ensModuleFactory;
        this.contractModuleFactory = contractModuleFactory;
        this.abiCoder = abiCoder;
        this.utils = utils;
        this.formatters = formatters;
        this.registryOptions = options;
        this.net = net;
        this.transactionSigner = options.transactionSigner;
        this._registry = false;
    }

    /**
     * Getter for the registry property
     *
     * @property registry
     *
     * @returns {Registry}
     */
    get registry() {
        if (!this._registry) {
            this._registry = this.ensModuleFactory.createRegistry(
                this.currentProvider,
                this.contractModuleFactory,
                this.accounts,
                this.abiCoder,
                this.utils,
                this.formatters,
                this.registryOptions,
                this.net
            );
        }

        return this._registry;
    }

    /**
     * Sets the provider for the registry and resolver object.
     * This method will also set the provider in the NetworkPackage and AccountsPackage because they are used here.
     *
     * @method setProvider
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|EthereumProvider|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(super.setProvider(provider, net) && this.registry.setProvider(provider, net));
    }

    /**
     * Returns an contract of type resolver
     *
     * @method resolver
     *
     * @param {String} name
     *
     * @returns {Promise<AbstractContract>}
     */
    resolver(name) {
        return this.registry.resolver(name);
    }

    /**
     * Returns the address record associated with a name.
     *
     * @method supportsInterface
     *
     * @param {String} name
     * @param {String} interfaceId
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async supportsInterface(name, interfaceId, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.supportsInterface(interfaceId).call(callback);
    }

    /**
     * Returns the address record associated with a name.
     *
     * @method getAddress
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getAddress(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.addr(namehash.hash(name)).call(callback);
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
    setAddress(name, address, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setAddr(namehash.hash(name), address)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
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
     * @returns {Promise<String>}
     */
    async getPubkey(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.pubkey(namehash.hash(name)).call(callback);
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
    setPubkey(name, x, y, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setPubkey(namehash.hash(name), x, y)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }

    /**
     * Returns the text by the given key
     *
     * @method getText
     *
     * @param {String} name
     * @param {String} key
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getText(name, key, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.text(namehash.hash(name), key).call(callback);
    }

    /**
     * Set a new text item in the resolver.
     *
     * @method setText
     *
     * @param {String} name
     * @param {String} key
     * @param {String} value
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setText(name, key, value, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setText(namehash.hash(name), key, value)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
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
     * @returns {Promise<String>}
     */
    async getContent(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.content(namehash.hash(name)).call(callback);
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
    setContent(name, hash, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setContent(namehash.hash(name), hash)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
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
     * @returns {Promise<String>}
     */
    async getMultihash(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.multihash(namehash.hash(name)).call(callback);
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
    setMultihash(name, hash, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setMultihash(namehash.hash(name), hash)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }

    /**
     * Get the contenthash
     *
     * @method getContenthash
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getContenthash(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.contenthash(namehash.hash(name)).call(callback);
    }

    /**
     * Set the contenthash
     *
     * @method setContenthash
     *
     * @param {String} name
     * @param {String} hash
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setContenthash(name, hash, sendOptions, callback = null) {
        const promiEvent = new PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setContenthash(namehash.hash(name), hash)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }
}
