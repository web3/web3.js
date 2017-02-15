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
 * @file trace.js
 * @author Alexis Roussel <alexis@bity.com>
 * @date 2017
 */

"use strict";

var Method = require('../method');
var formatters = require('../formatters');

function Trace(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var call = new Method({
        name: 'call',
        call: 'trace_call',
        params: 3,
        inputFormatter: [formatters.inputCallFormatter, null, formatters.inputDefaultBlockNumberFormatter]
    });

    var rawTransaction = new Method({
        name: 'rawTransaction',
        call: 'trace_rawTransaction',
        params: 2
    });

    var replayTransaction = new Method({
        name: 'replayTransaction',
        call: 'trace_replayTransaction',
        params: 2
    });

    var block = new Method({
        name: 'block',
        call: 'trace_block',
        params: 1,
        inputFormatter: [formatters.inputDefaultBlockNumberFormatter]
    });

    var filter = new Method({
        name: 'filter',
        call: 'trace_filter',
        params: 1
    });

    var get = new Method({
        name: 'get',
        call: 'trace_get',
        params: 2
    });

    var transaction = new Method({
        name: 'transaction',
        call: 'trace_transaction',
        params: 1
    });

    return [
        call,
        rawTransaction,
        replayTransaction,
        block,
        filter,
        get,
        transaction
    ];
};

module.exports = Trace;
