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
 * @file web3.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

/**
 *  TODO: It should place the dist files in the root folder of the published package to have cleaner import statements on the consumer side
 *
 * e.g.:
 *
 * import {web3} from 'web3';
 * import {send, mined} from 'web3/ethereum/transaction';
 * import {HttpProvider} from 'web3/core';
 */

import Configuration from "./config/Configuration.js";

const throwError = () => {
    throw new Error('Not allowed action!');
};

let config = null;

export default class web3 {
    /**
     * Getter for the current context
     *
     * @property current
     *
     * @returns {Configuration}
     */
    static get config() {
        if (!config) {
            throw new Error('No Configuration defined!');
        }

        // Return deep clone or this proxy. The actual config object will only get returned from the web3.init method.
        // If this actually does make sense is questionable because the Proxy object or the functions used to deep clone the object
        // could get hijacked anyways from another dependency if sesify isn't in usage.
        return new Proxy(
            config,
            {
                set: throwError,
                defineProperty: throwError,
                deleteProperty: throwError,
                preventExtensions: throwError,
                setPrototypeOf: throwError
            }
        );
    }

    /**
     * Sets the default context of Web3
     *
     * @method init
     *
     * @param {String} name
     * @param {Object} conf
     *
     * @returns {Configuration}
     */
    static init(name, conf) {
        if (config !== null) {
            throw new Error('Init can only be called once. Please pass your custom options directly to the related web3.js function or class.');
        }

        config = new Configuration(conf);

        return config;
    }

    /**
     * TODO: update detection
     *
     * Returns the injected EthereumProvider
     *
     * @property ethereumProvider
     *
     * @returns {AbstractProvider}
     */
    static get ethereumProvider() {
        if (
            typeof global.ethereumProvider !== 'undefined' &&
            global.ethereumProvider.constructor.name === 'EthereumProvider'
        ) {
            return global.ethereumProvider;
        }

        if (typeof global.web3 !== 'undefined' && global.web3.currentProvider) {
            return global.web3.currentProvider;
        }

        return null;
    }
}
