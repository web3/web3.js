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
import Nat from 'eth-lib/lib/nat';
import Bytes from 'eth-lib/lib/bytes';
import Hash from 'eth-lib/lib/hash';
import RLP from 'eth-lib/lib/rlp';
import Account from 'eth-lib/lib/account';

/**
 * @file TransactionSigner.js
 * @author Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2019
 */
export default class TransactionSigner {
    /**
     * @param {Wallet} wallet
     * @param {SignMethod} signMethod
     * @param {Object} formatters
     * @param {Utils} utils
     *
     * @constructor
     */
    constructor(wallet, signMethod, formatters, utils) {
        this.wallet = wallet;
        this.signMethod = signMethod;
        this.formatters = formatters;
        this.utils = utils;
    }

    /**
     * Signs the transaction
     *
     * @param {Transaction} tx
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<Transaction>}
     */
    sign(tx, moduleInstance) {
        if (this.wallet.length > 0) {
            return this.signLocal(tx, moduleInstance);
        }

        return this.signRemote(tx, moduleInstance);

    }

    /**
     * This method signs the transaction remotely on the node.
     *
     * @method signLocal
     *
     * @param {Object} tx
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<{messageHash: *, v: String, r: String, s: String, rawTransaction: *}>}
     */
    signRemote(tx, moduleInstance) {
        this.signMethod.parameters = [tx];

        return this.signMethod.execute(moduleInstance);
    }

    /**
     * This method signs the transaction with the local decrypted account.
     *
     * @method signLocal
     *
     * @param {Object} tx
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<{messageHash: *, v: String, r: String, s: String, rawTransaction: *}>}
     */
    async signLocal(tx, moduleInstance) {
        let result;
        const privateKey = this.wallet[from];

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
        tx = this.formatters.inputCallFormatter(tx, moduleInstance);

        const transaction = tx;
        transaction.to = tx.to || '0x';
        transaction.data = tx.data || '0x';
        transaction.value = tx.value || '0x';
        transaction.chainId = this.utils.numberToHex(tx.chainId);

        const rlpEncoded = RLP.encode([
            Bytes.fromNat(transaction.nonce),
            Bytes.fromNat(transaction.gasPrice),
            Bytes.fromNat(transaction.gas),
            transaction.to.toLowerCase(),
            Bytes.fromNat(transaction.value),
            transaction.data,
            Bytes.fromNat(transaction.chainId || '0x1'),
            '0x',
            '0x'
        ]);

        const hash = Hash.keccak256(rlpEncoded);

        const signature = Account.makeSigner(Nat.toNumber(transaction.chainId || '0x1') * 2 + 35)(
            Hash.keccak256(rlpEncoded),
            privateKey
        );

        const rawTx = RLP.decode(rlpEncoded)
            .slice(0, 6)
            .concat(Account.decodeSignature(signature));

        rawTx[6] = this.makeEven(this.trimLeadingZero(rawTx[6]));
        rawTx[7] = this.makeEven(this.trimLeadingZero(rawTx[7]));
        rawTx[8] = this.makeEven(this.trimLeadingZero(rawTx[8]));

        const rawTransaction = RLP.encode(rawTx);

        const values = RLP.decode(rawTransaction);
        result = {
            messageHash: hash,
            v: this.trimLeadingZero(values[6]),
            r: this.trimLeadingZero(values[7]),
            s: this.trimLeadingZero(values[8]),
            rawTransaction
        };

        return result;
    }


    /**
     * Removes the zeros until no zero follows after '0x'
     *
     * @method trimLeadingZero
     *
     * @param {String} hex
     *
     * @returns {String}
     */
    trimLeadingZero(hex) {
        while (hex && hex.startsWith('0x0')) {
            hex = `0x${hex.slice(3)}`;
        }

        return hex;
    }

    /**
     * Maps the hex string starting with '0x' to an even string with adding an additional zero after '0x' if it isn't.
     *
     * @method makeEven
     *
     * @param {String} hex
     *
     * @returns {String}
     */
    makeEven(hex) {
        if (hex.length % 2 === 1) {
            hex = hex.replace('0x', '0x0');
        }

        return hex;
    }

    /**
     * Checks if the value is not undefined or null
     *
     * @method isNotUndefinedOrNull
     *
     * @param {any} value
     *
     * @returns {Boolean}
     */
    isUndefinedOrNull(value) {
        return (typeof value === 'undefined' && value === null);
    }
}
