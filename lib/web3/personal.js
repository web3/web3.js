/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file eth.js
 * @author Ales Katona <almindor@gmail.com>
 * @date 2015
 */

/**
 * Web3
 *
 * @module web3
 */

/**
 * Personal methods and properties
 *
 * An example method object can look as follows:
 *
 *      {
 *      name: 'listAccounts',
 *      call: 'personal_listAccounts',
 *      params: 0
 *      }
 *
 * @class [web3] personal
 * @constructor
 */

"use strict";

var Method = require('./method');
var Property = require('./property');

/// @returns an array of objects describing web3.personal api methods

var listAccounts = new Method({
    name: 'listAccounts',
    call: 'personal_listAccounts',
    params: 0,
});

var newAccount = new Method({
    name: 'newAccount',
    call: 'personal_newAccount',
    params: 1
});

var deleteAccount = new Method({
    name: 'deleteAccount',
    call: 'personal_deleteAccount',
    params: 2
});

var unlockAccount = new Method({
    name: 'unlockAccount',
    call: 'personal_unlockAccount',
    params: 3
});

var methods = [
    listAccounts,
    newAccount,
    deleteAccount,
    unlockAccount
];

/// @returns an array of objects describing web3.eth api properties

var properties = [
    new Property({
        name: 'accounts',
        getter: 'listAccounts'
    }),
];

module.exports = {
    methods: methods,
    properties: properties
};
