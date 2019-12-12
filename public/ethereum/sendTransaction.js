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
 * @file sendTransaction.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import web3 from '../index.js';
// import Transaction from "./Transaction";

/**
 * POC
 *
 * @param {TransactionOptions} txOptions
 * @param {EthereumConfiguration} config
 *
 * @returns {Promise<Transaction>}
 */
export default async function sendTransaction(txOptions, config = web3.config.ethereum) {
    console.log(config);
    // return new Transaction(txOptions, config).send();
}
