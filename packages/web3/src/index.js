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
 * @file index.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import {formatters} from 'web3-core-helpers';
import {AbstractMethodModelFactory, MethodController} from 'web3-core-method';
import {ProvidersModuleFactory, providers} from 'web3-providers';
import Utils from 'web3-utils';
import {Eth} from 'web3-eth';
import {Shh} from 'web3-shh';
import {Bzz} from 'web3-bzz';
import {Network} from 'web3-net';
import {Personal} from 'web3-eth-personal';
import {version} from '../package.json';

export default class Web3 extends AbstractWeb3Module {

    /**
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @constructor
     */
    constructor(provider, net) {
        var providersModuleFactory = new ProvidersModuleFactory();
        var providerAdapterResolver = providersModuleFactory.createProviderAdapterResolver();
        var providerDetector = providersModuleFactory.createProviderDetector();

        provider = providerAdapterResolver.resolve(provider, net);

        super(
            provider,
            providerDetector,
            providerAdapterResolver,
            providersModuleFactory,
            providers,
            new MethodController(),
            new AbstractMethodModelFactory({}, Utils, formatters)
        );

        this.eth = new Eth(provider);
        this.shh = new Shh(provider);
        this.bzz = new Bzz(provider);
    }

    /**
     * Sets the provider for all packages
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(
            super.setProvider(provider, net) &&
            this.eth.setProvider(provider, net) &&
            this.shh.setProvider(provider, net) &&
            this.bzz.setProvider(provider)
        );
    }

    /**
     * Returns the detected provider
     *
     * @returns {Object}
     */
    static get givenProvider() {
        return new ProvidersModuleFactory().createProviderDetector().detect();
    }

    /**
     * Returns the web3 version
     *
     * @returns {String}
     */
    static get version() {
        return version;
    }

    /**
     * Returns the utils
     *
     * @returns {Utils}
     */
    static get utils() {
        return Utils;
    }

    /**
     * Returns an object with all public web3 modules
     *
     * @returns {Object}
     */
    static get modules() {
        const providerAdapterResolver = new ProvidersModuleFactory().createProviderAdapterResolver();

        return {
            Eth: (provider, net) => {
                return new Eth(providerAdapterResolver.resolve(provider, net));
            },
            Net: (provider, net) => {
                return new Network(providerAdapterResolver.resolve(provider, net));
            },
            Personal: (provider, net) => {
                return new Personal(providerAdapterResolver.resolve(provider, net));
            },
            Shh: (provider, net) => {
                return new Shh(providerAdapterResolver.resolve(provider, net));
            },
            Bzz: (provider, net) => {
                return new Bzz(providerAdapterResolver.resolve(provider, net));
            }
        };
    }

    /**
     * Returns an object with all providers of web3
     *
     * @returns {Object}
     */
    static get providers() {
        return providers;
    }
}
