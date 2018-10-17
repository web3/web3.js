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
 * @file TransactionSigner.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

import AbstractSigner from '../../lib/signers/AbstractSigner';

export default class TransactionSigner extends AbstractSigner {

    /**
     * Signs the given transaction
     *
     * @method sign
     *
     * @param {Object} transaction
     * @param {Accounts} accounts
     *
     * @returns {Promise<Boolean|String>}
     */
    sign(transaction, accounts) {
        return new Promise((resolve, reject) => {
            const wallet = this.getWallet(transaction.from, accounts);

            if (wallet && wallet.privateKey) {
                delete transaction.from;

                accounts.signTransaction(transaction, wallet.privateKey).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });

                return;
            }

            reject(new Error('Wallet or privateKey in wallet is not set!'));
        });
    }
}
