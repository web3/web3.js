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
 * @date 2019
 */

import EthereumTx from 'ethereumjs-tx'

export default class TransactionSigner {
    /**
     * @param {Utils} utils // TODO: Remove utils dependency and use a Hex VO
     * @param {Object} formatters // TODO: Remove formatters dependency and use a Transaction VO
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Signs the transaction
     *
     * @param {Object} transaction
     * @param {String} privateKey
     *
     * @returns {Promise<{messageHash, v, r, s, rawTransaction}>}
     */
    async sign(transaction, privateKey) {
        if (!privateKey) {
            throw new Error('No privateKey given to the TransactionSigner.');
        }

        if (privateKey.startsWith('0x')) {
            privateKey = privateKey.substring(2);
        }

        const ethTx = new EthereumTx(transaction);
        const validationResult = ethTx.validate(true);

        if (validationResult !== true)  {
            throw new Error(`Transaction signer error: ${JSON.stringify(JSON.stringify(validationResult))}`);
        }

        ethTx.sign(Buffer.from(privateKey, "hex"));

        const rlpEncoded = ethTx.serialize().toString('hex');
        const rawTransaction = '0x' + rlpEncoded;

        return {
            messageHash: ethTx.hash(),
            v: '0x' + ethTx.v.toString('hex'),
            r: '0x' + ethTx.r.toString('hex'),
            s: '0x' + ethTx.s.toString('hex'),
            rawTransaction
        };
    }
}
