/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

export default class MethodOptionsMapper {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Sets the default options where it is required
     *
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {Object}
     */
    map(contract, options) {
        let from = null;

        if (options.from) {
            from = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(options.from));
        }

        options.to = contract.address;
        options.from = from || contract.defaultAccount;
        options.gasPrice = options.gasPrice || contract.defaultGasPrice;
        options.gas = options.gas || options.gasLimit || contract.defaultGas;
        delete options.gasLimit;

        return options;
    }
}
