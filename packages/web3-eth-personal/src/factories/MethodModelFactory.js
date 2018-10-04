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
 * @file MethodModelFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var web3CoreMethod = require('web3-core-method');

/**
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function MethodModelFactory(utils, formatters) {
    web3CoreMethod.AbstractMethodModelFactory.call(
        this,
        {
            getAccounts: web3CoreMethod.GetAccountsMethodModel,
            newAccount: web3CoreMethod.NewAccountMethodModel,
            unlockAccount: web3CoreMethod.UnlockAccountMethodModel,
            lockAccount: web3CoreMethod.LockAccountMethodModel,
            importRawKey: web3CoreMethod.ImportRawKeyMethodModel,
            sendTransaction: web3CoreMethod.PersonalSendTransactionMethodModel,
            signTransaction: web3CoreMethod.PersonalSignTransactionMethodModel,
            sign: web3CoreMethod.PersonalSignMethodModel,
            ecRecover: web3CoreMethod.EcRecoverMethodModel
        },
        utils,
        formatters
    );
}

MethodModelFactory.prototype = Object.create(web3CoreMethod.AbstractMethodModelFactory.prototype);
MethodModelFactory.prototype.constructor = MethodModelFactory;

module.exports = MethodModelFactory;
