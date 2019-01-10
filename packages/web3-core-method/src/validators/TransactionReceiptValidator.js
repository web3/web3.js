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

import {isObject} from 'lodash';

export default class TransactionReceiptValidator {
    /**
     * Validates the receipt
     *
     * @method validate
     *
     * @param {Object} receipt
     * @param {Array} methodParameters
     *
     * @returns {Error|Boolean}
     */
    validate(receipt, methodParameters) {
        if (this.isValidGasUsage(receipt, methodParameters) && this.isValidReceiptStatus(receipt)) {
            return true;
        }

        const receiptJSON = JSON.stringify(receipt, null, 2);

        if (receipt.status === false || receipt.status === '0x0') {
            return new Error(`Transaction has been reverted by the EVM:\n${receiptJSON}`);
        }

        return new Error(`Transaction ran out of gas. Please provide more gas:\n${receiptJSON}`);
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
     * @param {Array} methodParameters
     *
     * @returns {Boolean}
     */
    isValidGasUsage(receipt, methodParameters) {
        let gasProvided = null;

        if (isObject(methodParameters[0]) && methodParameters[0].gas) {
            gasProvided = methodParameters[0].gas;
        }

        return !receipt.outOfGas && (!gasProvided || gasProvided !== receipt.gasUsed);
    }
}
