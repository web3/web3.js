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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var utils = require('web3-utils');
var Net = require('web3-net');

var formatters = require('web3-core-helpers').formatters;


var Personal = function Personal() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);


    methods().forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

    this.net = new Net(this.currentProvider);
};

core.addProviders(Personal);


var methods = function () {

    var getAccounts = new Method({
        name: 'getAccounts',
        call: 'personal_listAccounts',
        params: 0,
        outputFormatter: utils.toChecksumAddress
    });

    var newAccount = new Method({
        name: 'newAccount',
        call: 'personal_newAccount',
        params: 1,
        inputFormatter: [null],
        outputFormatter: utils.toChecksumAddress
    });

    var unlockAccount = new Method({
        name: 'unlockAccount',
        call: 'personal_unlockAccount',
        params: 3,
        inputFormatter: [formatters.inputAddressFormatter, null, null]
    });

    var lockAccount = new Method({
        name: 'lockAccount',
        call: 'personal_lockAccount',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });

    var importRawKey = new Method({
        name: 'importRawKey',
        call: 'personal_importRawKey',
        params: 2
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'personal_sendTransaction',
        params: 2,
        inputFormatter: [formatters.inputTransactionFormatter, null]
    });

    var sign = new Method({
        name: 'sign',
        call: 'personal_sign',
        params: 3,
        inputFormatter: [formatters.inputSignFormatter, formatters.inputAddressFormatter, null]
    });

    var ecRecover = new Method({
        name: 'ecRecover',
        call: 'personal_ecRecover',
        params: 2,
        inputFormatter: [formatters.inputSignFormatter, null]
    });


    return [
        getAccounts,
        newAccount,
        unlockAccount,
        sendTransaction,
        lockAccount,
        importRawKey,
        sign,
        ecRecover
    ];
};


module.exports = Personal;


