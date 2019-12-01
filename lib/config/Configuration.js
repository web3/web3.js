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
 * @file Configuration.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import EthereumConfiguration from "./ethereum/EthereumConfiguration";

export default class Configuration {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options = {}) {
        this.ethereum = options.ethereum;
    }

    /**
     * Getter for the ethereum property
     *
     * @property ethereum
     *
     * @returns {EthereumConfiguration}
     */
    get ethereum() {
        return this._ethereum;
    }

    /**
     * Setter for the ethereum property
     *
     * @property ethereum
     *
     * @param {EthereumConfiguration} value
     */
    set ethereum(value) {
        this._ethereum = new EthereumConfiguration(value);
    }
}
