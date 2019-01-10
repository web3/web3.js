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
 * @file AbstractSigner.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class AbstractSigner {
    /**
     * @param {Accounts} accounts
     */
    constructor(accounts) {
        this.accounts = accounts;
    }

    /**
     * Get wallet for address with accounts package
     *
     * @method getWallet
     *
     * @param {String} from
     *
     * @returns {Account}
     */
    getWallet(from) {
        const account = this.accounts.wallet[from];
        if (account) {
            return account;
        }

        return null;
    }
}
