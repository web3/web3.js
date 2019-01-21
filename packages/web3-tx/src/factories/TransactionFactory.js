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
 * @file TransactionFactory.js
 * @author Oscar Fonseca <hiro@cehh.org>
 * @date 2019
 */

import Transaction from '../Transaction';

export default class TransactionFactory {
    /**
     * Returns an object of type Transaction
     *
     * @method createTransaction
     *
     * @returns {Transaction}
     */
    createTransaction(txParams) {
        /* Set the error messages */
        const error = {
            from: "The 'from' parameter needs to be an address or a wallet index number.",
            to: "The 'to' parameter needs to be an address or 'deploy' when deploying code.",
            value:
                "The 'value' parameter needs to be zero or positive, and in number, BN, BigNumber or string format.\n" +
                "Use 'none' for 0 ether.",
            gas: '',
            gasPrice: '',
            data: "The 'data' parameter needs to be hex encoded.\n" + "Use 'none' for no payload.",
            nonce: "The 'nonce' parameter needs to be an integer.\n" + "Use 'auto' to set the RPC-calculated nonce."
        };

        /* Initialise the params */
        const params = {
            from: undefined,
            to: undefined,
            value: undefined,
            gas: undefined,
            gasPrice: undefined,
            data: undefined,
            nonce: undefined
        };

        return new Transaction(
            txParams,
            error,
            params
        );
    }
}
