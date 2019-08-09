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
 * @file Transaction.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import isNumber from 'lodash/isNumber';
import Address from './Address';
import Hex from './Hex';

export default class Transaction {
    /**
     * @param {Object} transactionOptions
     *
     * @constructor
     */
    constructor(transactionOptions) {
        this._value = null;
        this.value = transactionOptions;
    }

    /**
     * Setter for the value property
     *
     * @param {Object} transactionOptions
     *
     * @property value
     */
    set value(transactionOptions) {
        if (!transactionOptions.from && !isNumber(transactionOptions.from)) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        transactionOptions.from = new Address(transactionOptions.from).toString();

        if (transactionOptions.to) {
            transactionOptions.to = new Address(transactionOptions.to).toString();
        }

        if (transactionOptions.data && transactionOptions.input) {
            throw new Error(
                'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.'
            );
        }

        if (!transactionOptions.data && transactionOptions.input) {
            transactionOptions.data = transactionOptions.input;
            delete transactionOptions.input;
        }

        if (transactionOptions.data && !Hex.isValid(transactionOptions.data)) {
            throw new Error('The data field must be HEX encoded data.');
        }

        // allow both
        if (transactionOptions.gas || transactionOptions.gasLimit) {
            transactionOptions.gas = transactionOptions.gas || transactionOptions.gasLimit;
        }

        ['gasPrice', 'gas', 'value', 'nonce']
            .filter((key) => {
                return transactionOptions[key] !== undefined;
            })
            .forEach((key) => {
                transactionOptions[key] = Hex.fromNumber(transactionOptions[key]).toString();
            });

        this._value = transactionOptions;
    }

    /**
     * Getter for the value property
     *
     * @property value
     *
     * @returns {null | Object}
     */
    get value() {
        return this._value;
    }
}
