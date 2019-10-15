/*
    This file is part of confluxWeb.
    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import ConfluxTx from 'confluxjs-transaction';

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
     * Add to be production build save
     *
     * @property Type
     *
     * @returns {String}
     */
    get type() {
        return 'TransactionSigner';
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

        const cfxTx = new ConfluxTx(transaction);
        cfxTx.sign(Buffer.from(privateKey, 'hex'));

        const validationResult = cfxTx.validate(true);

        if (validationResult !== '') {
            throw new Error(`TransactionSigner Error: ${validationResult}`);
        }

        const rlpEncoded = cfxTx.serialize().toString('hex');
        const rawTransaction = '0x' + rlpEncoded;

        return {
            messageHash: Buffer.from(cfxTx.hash(false)).toString('hex'),
            v: '0x' + Buffer.from(cfxTx.v).toString('hex'),
            r: '0x' + Buffer.from(cfxTx.r).toString('hex'),
            s: '0x' + Buffer.from(cfxTx.s).toString('hex'),
            rawTransaction
        };
    }
}
