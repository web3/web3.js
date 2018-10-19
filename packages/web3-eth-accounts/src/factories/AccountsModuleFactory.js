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
 * @file AccountsModuleFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {MethodModelFactory} from './MethodModelFactory';
import {Accounts} from '../Accounts';

export default class AccountsModuleFactory {

    /**
     * Returns an object of type Accounts
     *
     * @param {AbstractProviderAdapter} provider
     * @param {ProvidersPackage} providersPackage
     * @param {MethodController} methodController
     * @param {Object} utils
     * @param {Object} formatters
     *
     * @returns {Accounts}
     */
    createAccounts(provider, providersPackage, methodController, utils, formatters) {
        return new Accounts(
            provider,
            providersPackage,
            methodController,
            new MethodModelFactory(utils, formatters),
            utils,
            formatters
        );
    }
}
