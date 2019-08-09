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
 * @file TransactionReceipt.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

export default class TransactionReceipt {
    /**
     * @param {Object} receipt
     *
     * @constructor
     */
    constructor(receipt) {
        this._value = null;
        this.value = receipt;
    }

    /**
     * Setter for the value property.
     *
     * @property value
     *
     * @param {Object} receipt
     */
    set value(receipt) {
        if (receipt.blockNumber !== null) {
            receipt.blockNumber = Hex.fromNumber(receipt.blockNumber).toString();
        }

        if (receipt.transactionIndex !== null) {
            receipt.transactionIndex = new Hex(receipt.transactionIndex).toNumber();
        }

        if (receipt.gasPrice) {
            receipt.gasPrice = new BigNumber(receipt.gasPrice).toString(10);
        }

        if (receipt.value) {
            receipt.value = new BigNumber(receipt.gasPrice).toString(10);
        }

        receipt.nonce = new Hex((receipt.nonce).toNumber();
        receipt.gas = new Hex(receipt.gas).toNumber();
        receipt.cumulativeGasUsed = new Hex(receipt.cumulativeGasUsed).toNumber();
        receipt.gasUsed = new Hex(receipt.gasUsed).toNumber();

        if (receipt.to && Address.isValid(receipt.to)) {
            // tx.to could be `0x0` or `null` while contract creation
            receipt.to = new Address(receipt.to).toChecksumAddress();
        } else {
            receipt.to = null; // set to `null` if invalid address
        }

        if (receipt.from) {
            receipt.from = new Address(receipt.from).toChecksumAddress();
        }

        if (isArray(receipt.logs)) {
            receipt.logs = receipt.logs.map((log) => {
                return new Log(log);
            });
        }

        if (receipt.contractAddress) {
            receipt.contractAddress = new Address(receipt.contractAddress).toChecksumAddress();
        }

        if (typeof receipt.status !== 'undefined' && receipt.status !== null) {
            receipt.status = Boolean(parseInt(receipt.status));
        } else {
            receipt.status = true;
        }
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {null|Object}
     */
    get value() {
        return this._value;
    }
}
