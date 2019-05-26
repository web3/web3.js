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
 * @file ProviderDetector.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

const global =
    (function() {
        return this || (typeof self === 'object' && self);
        // eslint-disable-next-line no-new-func
    })() || new Function('return this')();

// TODO: Remove the detector because of window/global.ethereum
export default class ProviderDetector {
    /**
     * Detects which provider is given in the current environment
     *
     * @method detect
     *
     * @returns {Object|null} provider
     */
    static detect() {
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
