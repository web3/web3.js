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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */
export default class TransactionSigner {

    constructor(formatters, utils) {
        this.formatters = formatters;
        this.utils = utils;
    }

    sign(tx, moduleInstance, callback) {
        let result;

        try {
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
        } catch (error) {
            callback(error);
            return Promise.reject(error);
        }

        callback(null, result);

        return result;
    }


    trimLeadingZero(hex) {
        while (hex && hex.startsWith('0x0')) {
            hex = `0x${hex.slice(3)}`;
        }
        return hex;
    }

    makeEven(hex) {
        if (hex.length % 2 === 1) {
            hex = hex.replace('0x', '0x0');
        }

        return hex;
    }
}
