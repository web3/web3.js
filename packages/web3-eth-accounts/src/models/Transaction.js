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
 * @date 2019
 */

export default class Transaction {

    constructor(options) {
        this.options = options;
    }

    set options(value) {
        this._options = this.validate(value);
    }

    validate() {

        if (this.isUndefinedOrNull(tx.chainId)) {
            tx.chainId = await moduleInstance.getChainId();
        }
        if (this.isUndefinedOrNull(tx.nonce)) {
            tx.nonce = await moduleInstance.getTransactionCount(tx.from);
        }
        if (this.isUndefinedOrNull(tx.gasPrice)) {
            tx.gasPrice = await moduleInstance.getGasPrice();
        }

        // delete tx.from;
        tx = this.formatters.txInputFormatter(tx);

        const transaction = tx;
        transaction.to = tx.to || '0x';
        transaction.data = tx.data || '0x';
        transaction.value = tx.value || '0x';
        transaction.chainId = this.utils.numberToHex(tx.chainId);
    }
}
