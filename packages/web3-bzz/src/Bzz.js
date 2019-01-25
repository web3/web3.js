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
 * @file Bzz.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import * as swarm from 'swarm-js';

// TODO: Refactor the complete module and implement the swarm API correct.
export default class Bzz {
    /**
     * @param {Object|String} provider
     *
     * @constructor
     */
    constructor(provider) {
        this.givenProvider = Bzz.givenProvider;
        this.currentProvider = null;
        this.setProvider(provider);
    }

    /**
     * Gets the pick methods from swarm if it is executed in the browser
     *
     * @method pick
     *
     * @returns {Object|Boolean}
     */
    pick() {
        if (typeof document !== 'undefined') {
            return this.swarm.pick;
        }

        throw new Error('Pick is not supported for this environment.');
    }

    /**
     * Downloads a file from the swarm network
     *
     * @method download
     *
     * @param {String} bzzHash
     * @param {String} localPath
     *
     * @returns {Promise<Buffer|Object|String>}
     */
    download(bzzHash, localPath) {
        if (this.hasProvider()) {
            return this.swarm.download(bzzHash, localPath);
        }

        this.throwProviderError();
    }

    /**
     * Uploads the given data to swarm
     *
     * @method upload
     *
     * @param {String|Buffer|Uint8Array|Object} data
     *
     * @returns {Promise<String>}
     */
    upload(data) {
        if (this.hasProvider()) {
            return this.swarm.upload(data);
        }

        this.throwProviderError();
    }

    /**
     * Checks if swarm is available
     *
     * @method isAvailable
     *
     * @returns {Promise<boolean>}
     */
    isAvailable() {
        if (this.hasProvider()) {
            return this.swarm.isAvailable();
        }

        this.throwProviderError();
    }

    /**
     * Checks if currentProvider is set
     *
     * @method hasProvider
     *
     * @returns {Boolean}
     */
    hasProvider() {
        return !!this.currentProvider;
    }

    /**
     * Throws the provider error
     *
     * @method throwProviderError
     */
    throwProviderError() {
        throw new Error('No provider set, please set one using bzz.setProvider().');
    }

    /**
     * Sets the provider for swarm
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     *
     * @returns {Boolean}
     */
    setProvider(provider) {
        // is ethereum provider
        if (isObject(provider) && isString(provider.bzz)) {
            provider = provider.bzz;
        }

        if (isString(provider)) {
            this.currentProvider = provider;
            this.swarm = swarm.at(provider);

            return true;
        }

        this.currentProvider = null;

        return false;
    }
}

Bzz.givenProvider = null;
/* eslint-disable no-undef */
if (typeof ethereumProvider !== 'undefined' && ethereumProvider.bzz) {
    Bzz.givenProvider = ethereumProvider.bzz;
}
/* eslint-enable no-undef */
