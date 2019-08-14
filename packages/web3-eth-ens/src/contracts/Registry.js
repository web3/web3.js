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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isFunction from 'lodash/isFunction';
import namehash from 'eth-ens-namehash';
import {AbstractContract} from 'web3-eth-contract';
import {REGISTRY_ABI} from '../../ressources/ABI/Registry';
import {RESOLVER_ABI} from '../../ressources/ABI/Resolver';

export default class Registry extends AbstractContract {
    /**
     * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
     * @param {ContractModuleFactory} contractModuleFactory
     * @param {Accounts} accounts
     * @param {AbiCoder} abiCoder
     * @param {Object} options
     * @param {Network} net
     *
     * @constructor
     */
    constructor(provider, contractModuleFactory, accounts, abiCoder, options, net) {
        super(provider, contractModuleFactory, accounts, abiCoder, REGISTRY_ABI, '', options);
        this.net = net;
        this.resolverContract = null;
        this.resolverName = null;
    }

    /**
     * TODO: Remove setter
     *
     * Setter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @param {TransactionSigner} value
     */
    set transactionSigner(value) {
        if (this.resolverContract) {
            this.resolverContract.transactionSigner = value;
        }

        super.transactionSigner = value;
    }

    /**
     * Getter for the transactionSigner property
     *
     * @property transactionSigner
     *
     * @returns {TransactionSigner}
     */
    get transactionSigner() {
        return this._transactionSigner;
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @returns {Promise<Boolean|Error>}
     */
    clearSubscriptions() {
        if (this.resolverContract) {
            this.resolverContract.clearSubscriptions('eth_unsubscribe');
        }

        return super.clearSubscriptions('eth_unsubscribe');
    }

    /**
     * Sets the defaultGasPrice property on all contracts and on all sub-modules
     *
     * @property defaultGasPrice
     *
     * @param {String|Number} value
     */
    set defaultGasPrice(value) {
        if (this.resolverContract) {
            this.resolverContract.defaultGasPrice = value;
        }

        super.defaultGasPrice = value;
    }

    /**
     * Gets the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {String|Number} value
     */
    get defaultGasPrice() {
        return super.defaultGasPrice;
    }

    /**
     * Sets the defaultGas property on all contracts and on all sub-modules
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        if (this.resolverContract) {
            this.resolverContract.defaultGas = value;
        }

        super.defaultGas = value;
    }

    /**
     * Gets the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {String|Number} value
     */
    get defaultGas() {
        return super.defaultGas;
    }

    /**
     * Sets the transactionBlockTimeout property on all contracts and on all sub-modules
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        if (this.resolverContract) {
            this.resolverContract.transactionBlockTimeout = value;
        }

        super.transactionBlockTimeout = value;
    }

    /**
     * Gets the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number} value
     */
    get transactionBlockTimeout() {
        return super.transactionBlockTimeout;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on all sub-modules
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        if (this.resolverContract) {
            this.resolverContract.transactionConfirmationBlocks = value;
        }

        super.transactionConfirmationBlocks = value;
    }

    /**
     * Gets the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number} value
     */
    get transactionConfirmationBlocks() {
        return super.transactionConfirmationBlocks;
    }

    /**
     * Sets the transactionPollingTimeout property on all contracts and on all sub-modules
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        if (this.resolverContract) {
            this.resolverContract.transactionPollingTimeout = value;
        }

        super.transactionPollingTimeout = value;
    }

    /**
     * Gets the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number} value
     */
    get transactionPollingTimeout() {
        return super.transactionPollingTimeout;
    }

    /**
     * Sets the defaultAccount property on all contracts and on the personal module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        if (this.resolverContract) {
            this.resolverContract.defaultAccount = value;
        }

        super.defaultAccount = value;
    }

    /**
     * Gets the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {String} value
     */
    get defaultAccount() {
        return super.defaultAccount;
    }

    /**
     * Setter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @param {String|Number}value
     */
    set defaultBlock(value) {
        if (this.resolverContract) {
            this.resolverContract.defaultBlock = value;
        }

        super.defaultBlock = value;
    }

    /**
     * Gets the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number} value
     */
    get defaultBlock() {
        return super.defaultBlock;
    }

    /**
     * Returns the address of the owner of an Ens name.
     *
     * @method owner
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async owner(name, callback) {
        if (!this.address) {
            this.address = await this.checkNetwork();
        }

        try {
            const owner = await this.methods.owner(namehash.hash(name)).call();

            if (isFunction(callback)) {
                callback(false, owner);
            }

            return owner;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }
    }

    /**
     * Sets the provider for the registry and resolver object.
     * This method will also set the provider in the NetworkPackage and AccountsPackage because they are used here.
     *
     * @method setProvider
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|Web3EthereumProvider|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        if (this.resolverContract) {
            this.resolverContract.setProvider(provider, net);
        }

        return super.setProvider(provider, net);
    }

    /**
     * Returns the resolver contract associated with a name.
     *
     * @method resolver
     *
     * @param {String} name
     *
     * @returns {Promise<AbstractContract>}
     */
    async resolver(name) {
        if (this.resolverName === name && this.resolverContract) {
            return this.resolverContract;
        }

        if (!this.address) {
            this.address = await this.checkNetwork();
        }

        const address = await this.methods.resolver(namehash.hash(name)).call();
        const clone = this.clone();
        clone.jsonInterface = RESOLVER_ABI;
        clone.address = address;

        this.resolverName = name;
        this.resolverContract = clone;

        return clone;
    }

    /**
     * Checks if the current used network is synced and looks for Ens support there.
     * Throws an error if not.
     *
     * @method checkNetwork
     *
     * @returns {Promise<String>}
     */
    async checkNetwork() {
        const ensAddresses = {
            main: '0x314159265dD8dbb310642f98f50C066173C1259b',
            ropsten: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
            rinkeby: '0xe7410170f87102df0055eb195163a03b7f2bff4a'
        };

        const block = await this.net.getBlockByNumber('latest', false);
        const headAge = new Date() / 1000 - block.timestamp;

        if (headAge > 3600) {
            throw new Error(`Network not synced; last block was ${headAge} seconds ago`);
        }

        const networkType = await this.net.getNetworkType();
        const address = ensAddresses[networkType];

        if (typeof address === 'undefined') {
            throw new TypeError(`ENS is not supported on network: "${networkType}"`);
        }

        return address;
    }
}
