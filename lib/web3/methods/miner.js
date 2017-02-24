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
 * @file miner.js
 * @author
 * @date 2017
 */

"use strict";

var Method = require('../method');

function Miner(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var start = new Method({
        name: 'start',
        call: 'miner_start',
        params: 1,
        inputFormatter: [null]
    });

    var stop = new Method({
        name: 'stop',
        call: 'miner_stop',
        params: 0,
        inputFormatter: []
    });

    return [
        start,
        stop,
    ];
};

module.exports = Miner;
