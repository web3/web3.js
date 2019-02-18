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
 * @file TransactionReceiptValidator.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isObject from 'lodash/isObject';

export default class TransactionReceiptValidator {
    /**
     * Validates the receipt
     *
     * @method validate
     *
     * @param {Object} receipt
     * @param {AbstractMethod} method
     *
     * @returns {Error|Boolean}
     */
    validate(receipt, method) {
        const receiptJSON = JSON.stringify(receipt, null, 2);

        if (!this.isValidGasUsage(receipt, method)) {
            return new Error(`Transaction ran out of gas. Please provide more gas:\n${receiptJSON}`);
        }

        if (!this.isValidReceiptStatus(receipt)) {
            return new Error(`Transaction has been reverted by the EVM:\n${receiptJSON}`);
        }

        return true;
    }

    /**
     * Checks if receipt status is valid
     *
     * @method isValidReceiptStatus
     *
     * @param {Object} receipt
     *
     * @returns {Boolean}
     */
    isValidReceiptStatus(receipt) {
        return receipt.status === true || receipt.status === '0x1' || typeof receipt.status === 'undefined';
    }

    /**
     * Checks it is a valid gas usage
     *
     * @method isValidGasUsage
     *
     * @param {Object} receipt
     * @param {AbstractMethod} method
     *
     * @returns {Boolean}
     */
    isValidGasUsage(receipt, method) {
        let gasProvided = null;
        const parameters = method.parameters[0];

        if (isObject(parameters[0]) && parameters[0].gas) {
            gasProvided = method.utils.numberToHex(parameters[0].gas);
        }

        return !receipt.outOfGas && (!gasProvided || gasProvided !== receipt.gasUsed);
    }
}
