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
 * @author Oscar Fonseca <hiro@cehh.io>
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
    createTransaction(params) {
        /* Set the error messages */
        const error = {
            from: (value) =>
                `The 'from' parameter ${value} needs to be an address string, a Web3 Address object, or a wallet index number.\n` +
                'The address string needs to be hex encoded, supplied as a string, and checksummed.\n' +
                'A Web3 Address object can be created using the Address class in the types module.\n' +
                'A wallet index number parameter corresponds to the address of the locally unlocked wallet index.',
            to: (value) =>
                `The 'to' parameter ${value} needs to be an address or 'deploy' when deploying code.\n` +
                'The address string needs to be hex encoded, supplied as a string, and checksummed.\n' +
                'A Web3 Address object can be created using the Address class in the types module.\n' +
                'A wallet index number parameter corresponds to the address of the locally unlocked wallet index.',
            value: (value) =>
                `The 'value' parameter ${value} needs to be zero or positive, and in number, BN, BigNumber or string format.\n` +
                "Use 'none' to add 0 ether to the transaction.",
            gas: (value) => `${value}`,
            gasPrice: (value) => `${value}`,
            data: (value) =>
                `The 'data' parameter ${value} needs to be hex encoded.\n` +
                'A Web3 Hex object can be created using the Hex class in the types module.\n' +
                "Use 'none' for no payload.",
            nonce: (value) =>
                `The 'nonce' parameter ${value} needs to be an integer.\n` +
                "Use 'auto' to set the RPC-calculated nonce.",
            chainId: (value) =>
                `The 'chainId' parameter ${value} needs to be an integer.\n` + "Use 'main' to set the mainnet chain ID."
        };

        /* Initialise the params */
        const initParams = {
            from: undefined,
            to: undefined,
            value: undefined,
            gas: undefined,
            gasPrice: undefined,
            data: undefined,
            nonce: undefined,
            chainId: undefined
        };

        return new Transaction(params, error, initParams);
    }
}
