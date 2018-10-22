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
 * @file ENSModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ENS from '../ENS';
import Registry from '../contracts/Registry';
import ResolverMethodHandler from '../handlers/ResolverMethodHandler';

export default class ENSModuleFactory {
    /**
     * Returns an object of type ENS
     *
     * @method createENS
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Network} net
     * @param {Accounts} accounts
     * @param {Contract} Contract
     * @param {Object} registryAbi
     * @param {Object} resolverAbi
     * @param {PromiEvent} PromiEvent
     *
     * @returns {ENS}
     */
    createENS(provider, net, accounts, Contract, registryAbi, resolverAbi, PromiEvent) {
        const registry = this.createRegistry(provider, net, accounts, Contract, registryAbi, resolverAbi);

        return new ENS(registry, this.createResolverMethodHandler(registry, PromiEvent));
    }

    /**
     * Returns an object of type Registry
     *
     * @method createRegistry
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {Network} net
     * @param {Accounts} accounts
     * @param {Contract} Contract
     * @param {Object} registryAbi
     * @param {Object} resolverAbi
     *
     * @returns {Registry}
     */
    createRegistry(provider, net, accounts, Contract, registryAbi, resolverAbi) {
        return new Registry(provider, net, accounts, Contract, registryAbi, resolverAbi);
    }

    /**
     * Returns an object of type ResolverMethodHandler
     *
     * @method createResolverMethodHandler
     *
     * @param {Registry} registry
     * @param {PromiEvent} PromiEvent
     *
     * @returns {ResolverMethodHandler}
     */
    createResolverMethodHandler(registry, PromiEvent) {
        return new ResolverMethodHandler(registry, PromiEvent);
    }
}
