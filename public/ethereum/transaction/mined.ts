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
 * @file mined.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import web3 from '../../index.js';
import confirmations from './confirmations';
import EthereumConfiguration from "../../../internal/ethereum/src/config/EthereumConfiguration";
import TransactionReceipt from "../../../internal/ethereum/lib/types/output/TransactionReceipt";

/**
 * Returns the receipt if the amount of configured confirmations is reached.
 *
 * @method mined
 *
 * @param {String} txHash
 * @param {EthereumConfiguration} config
 *
 * @returns {Promise<TransactionReceipt>}
 */
export default function mined(
    txHash: string,
    config: EthereumConfiguration = web3.config.ethereum
): Promise<TransactionReceipt> {
    return new Promise((resolve, reject) => {
        let counter: number = 0;

        const subscription = confirmations(txHash, config).subscribe(
            (confirmation: TransactionReceipt) => {
                if (counter === config.transaction.confirmations) {
                    subscription.unsubscribe();
                    resolve(confirmation);
                } else {
                    counter++;
                }
            },
            (error: Error) => {
                reject(error);
            }
        );
    });
}

