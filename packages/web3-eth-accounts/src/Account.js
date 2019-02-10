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
 * @file Account.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class Account {

    constructor(accountOptions, accounts) {
        this.address = accountOptions.address;
        this.privateKey = accountOptions.privateKey;
        this.accountsModule = accounts;
    }

    signTransaction(tx, callback) {
        return this.accountsModule.signTransaction(tx, this.privateKey, callback);
    }

    sign(data) {
        return this.accountsModule.sign(data, this.privateKey);
    }

    encrypt(password, options) {
        return this.accountsModule.encrypt(this.privateKey, password, options);
    }
}
