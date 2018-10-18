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

import _ from 'underscore';
import namehash from 'eth-ens-namehash';

export default class Registry {

    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Accounts} accounts
     * @param {ContractPackage} contractPackage
     * @param {Object} registryABI
     * @param {Object} resolverABI
     *
     * @constructor
     */
    constructor(provider, accounts, contractPackage, registryABI, resolverABI) {
        this.net = net;
        this.accounts = accounts;
        this.contractPackage = contractPackage;
        this.registryABI = registryABI;
        this.resolverABI = resolverABI;
        this.provider = provider;

        this.contract = this.checkNetwork().then(address => {
            return new this.contractPackage.Contract(
                this.provider,
                this.accounts,
                this.registryABI,
                address
            );
        });
    }

    /**
     * Sets the provider in NetworkPackage, AccountsPackage and the current object.
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        this.provider = this.providersPackage.resolve(provider, net);

        return !!(this.net.setProvider(provider, net) && this.accounts.setProvider(provider, net) && this.provider);
    }

    /**
     * Returns the address of the owner of an ENS name.
     *
     * @method owner
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<*>}
     */
    owner(name, callback) {
        return new Promise((resolve, reject) => {
            this.contract.then(contract => {
                contract.methods.owner(namehash.hash(name))
                    .call()
                    .then(receipt => {
                        resolve(receipt);

                        if (_.isFunction(callback)) {
                            callback(false, receipt);
                        }
                    })
                    .catch(error => {
                        reject(error);

                        if (_.isFunction(callback)) {
                            callback(error, null);
                        }
                    });
            });
        });
    }

    /**
     * Returns the resolver contract associated with a name.
     *
     * @method resolver
     *
     * @param {String} name
     *
     * @returns {Promise<Contract>}
     */
    resolver(name) {
        return this.contract.then(contract => {
            return contract.methods.resolver(namehash.hash(name)).call();
        }).then(address => {
            return new this.contractPackage.Contract(
                this.provider,
                this.accounts,
                this.resolverABI,
                address
            );
        });
    }

    /**
     * Checks if the current used network is synced and looks for ENS support there.
     * Throws an error if not.
     *
     * @method checkNetwork
     *
     * @returns {Promise<String>}
     */
    checkNetwork() {
        const ensAddresses = {
            main: "0x314159265dD8dbb310642f98f50C066173C1259b",
            ropsten: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
            rinkeby: "0xe7410170f87102df0055eb195163a03b7f2bff4a"
        };

        return this.net.getBlock('latest', false).then(block => {
            const headAge = new Date() / 1000 - block.timestamp;
            if (headAge > 3600) {
                throw new Error(`Network not synced; last block was ${headAge} seconds ago`);
            }

            return this.net.getNetworkType();
        }).then(networkType => {
            const addr = ensAddresses[networkType];
            if (typeof addr === 'undefined') {
                throw new Error(`ENS is not supported on network ${networkType}`);
            }

            return addr;
        });
    }
}
