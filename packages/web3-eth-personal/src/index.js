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

import core from 'web3-core';
import Method from 'web3-core-method';
import {toChecksumAddress} from 'web3-utils';
import Net from 'web3-net';
import {formatters} from 'web3-core-helpers';

var Personal = function Personal() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    this.net = new Net(this.currentProvider);

    var defaultAccount = null;
    var defaultBlock = 'latest';

    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if(val) {
                defaultAccount = toChecksumAddress(formatters.inputAddressFormatter(val));
            }

            // update defaultBlock
            methods.forEach(function(method) {
                method.defaultAccount = defaultAccount;
            });

            return val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return defaultBlock;
        },
        set: function (val) {
            defaultBlock = val;

            // update defaultBlock
            methods.forEach(function(method) {
                method.defaultBlock = defaultBlock;
            });

            return val;
        },
        enumerable: true
    });


    var methods = [
        new Method({
            name: 'getAccounts',
            call: 'personal_listAccounts',
            params: 0,
            outputFormatter: toChecksumAddress
        }),
        new Method({
            name: 'newAccount',
            call: 'personal_newAccount',
            params: 1,
            inputFormatter: [null],
            outputFormatter: toChecksumAddress
        }),
        new Method({
            name: 'unlockAccount',
            call: 'personal_unlockAccount',
            params: 3,
            inputFormatter: [formatters.inputAddressFormatter, null, null]
        }),
        new Method({
            name: 'lockAccount',
            call: 'personal_lockAccount',
            params: 1,
            inputFormatter: [formatters.inputAddressFormatter]
        }),
        new Method({
            name: 'importRawKey',
            call: 'personal_importRawKey',
            params: 2
        }),
        new Method({
            name: 'sendTransaction',
            call: 'personal_sendTransaction',
            params: 2,
            inputFormatter: [formatters.inputTransactionFormatter, null]
        }),
        new Method({
            name: 'signTransaction',
            call: 'personal_signTransaction',
            params: 2,
            inputFormatter: [formatters.inputTransactionFormatter, null]
        }),
        new Method({
            name: 'sign',
            call: 'personal_sign',
            params: 3,
            inputFormatter: [formatters.inputSignFormatter, formatters.inputAddressFormatter, null]
        }),
        new Method({
            name: 'ecRecover',
            call: 'personal_ecRecover',
            params: 2,
            inputFormatter: [formatters.inputSignFormatter, null]
        })
    ];
    methods.forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
        method.defaultBlock = _this.defaultBlock;
        method.defaultAccount = _this.defaultAccount;
    });
};

core.addProviders(Personal);



export default Personal;


