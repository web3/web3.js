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
 * @file SendSignedTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractMethod from '../../../lib/methods/AbstractMethod';

export default class SendSignedTransactionMethod extends AbstractMethod {
    /**
     * @param {SendTransactionMethodCommand} sendTransactionMethodCommand
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(sendTransactionMethodCommand, utils, formatters) {
        super('eth_sendRawTransaction', 1, sendTransactionMethodCommand, utils, formatters);
    }

    /**
     * Returns the commandType of this Method
     *
     * @property CommandType
     *
     * @returns {String}
     */
    static get CommandType() {
        return 'SEND_TRANSACTION';
    }
}
