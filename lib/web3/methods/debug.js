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
 * @file debug.js
 * @author ewasm team
 * @date 2018
 */

"use strict";

var Method = require('../method');

function Debug(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
}

var methods = function () {

    var accountRangeAt = new Method({
        name: 'accountRangeAt',
        call: 'debug_accountRangeAt',
        params: 4
    });

    var storageRangeAt = new Method({
        name: 'storageRangeAt',
        call: 'debug_storageRangeAt',
        params: 5
    });

    return [
        accountRangeAt,
        storageRangeAt
    ];
};

module.exports = Debug;
