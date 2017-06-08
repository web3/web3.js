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
 * @file signer.js
 * @date 2017
 */

"use strict";

var Method = require('../method');
var Property = require('../property');
var formatters = require('../formatters');

function Signer(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    /**
     * Confirms a request in the signer queue
     */
    var confirmRequest = new Method({
        name: 'confirmRequest',
        call: 'signer_confirmRequest',
        params: 3,
        inputFormatter: [null, null, null]
    });

    /**
     * Confirms a request in the signer queue providing signed request
     */
    var confirmRequestRaw = new Method({
        name: 'confirmRequestRaw',
        call: 'signer_confirmRequestRaw',
        params: 2,
        inputFormatter: [null, null]
    });

    /**
     * Confirms specific request with token
     */
    var confirmRequestWithToken = new Method({
        name: 'confirmRequestWithToken',
        call: 'signer_confirmRequestWithToken',
        params: 3,
        inputFormatter: [null, null, null]
    });

    /**
     * Rejects a request in the signer queue
     */
    var rejectRequest = new Method({
        name: 'rejectRequest',
        call: 'signer_rejectRequest',
        params: 1,
        inputFormatter: [null]
    });

    return [
        confirmRequest,
        confirmRequestRaw,
        confirmRequestWithToken,
        rejectRequest
    ];
};

var properties = function () {
    /**
     * Transactions awaiting authorization
     */
    var requestsToConfirm = new Property({
        name: 'requestsToConfirm',
        getter: 'signer_requestsToConfirm',
    });

    return [
        requestsToConfirm
    ];
};


module.exports = Signer;
