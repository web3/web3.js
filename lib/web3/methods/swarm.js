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
 * @file bzz.js
 * @author Alex Beregszaszi <alex@rtfs.hu>
 * @date 2016
 *
 * Reference: https://github.com/ethereum/go-ethereum/blob/swarm/internal/web3ext/web3ext.go#L33
 */

"use strict";

var Method = require('../method');
var Property = require('../property');

function Swarm(web3) {
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
    var blockNetworkRead = new Method({
        name: 'blockNetworkRead',
        call: 'bzz_blockNetworkRead',
        params: 1,
        inputFormatter: [null]
    });

    var syncEnabled = new Method({
        name: 'syncEnabled',
        call: 'bzz_syncEnabled',
        params: 1,
        inputFormatter: [null]
    });

    var swapEnabled = new Method({
        name: 'swapEnabled',
        call: 'bzz_swapEnabled',
        params: 1,
        inputFormatter: [null]
    });

    var download = new Method({
        name: 'download',
        call: 'bzz_download',
        params: 2,
        inputFormatter: [null, null]
    });

    var upload = new Method({
        name: 'upload',
        call: 'bzz_upload',
        params: 2,
        inputFormatter: [null, null]
    });

    var retrieve = new Method({
        name: 'retrieve',
        call: 'bzz_retrieve',
        params: 1,
        inputFormatter: [null]
    });

    var store = new Method({
        name: 'store',
        call: 'bzz_store',
        params: 2,
        inputFormatter: [null, null]
    });

    var get = new Method({
        name: 'get',
        call: 'bzz_get',
        params: 1,
        inputFormatter: [null]
    });

    var put = new Method({
        name: 'put',
        call: 'bzz_put',
        params: 2,
        inputFormatter: [null, null]
    });

    var modify = new Method({
        name: 'modify',
        call: 'bzz_modify',
        params: 4,
        inputFormatter: [null, null, null, null]
    });

    return [
        blockNetworkRead,
        syncEnabled,
        swapEnabled,
        download,
        upload,
        retrieve,
        store,
        get,
        put,
        modify
    ];
};

var properties = function () {
    return [
        new Property({
            name: 'hive',
            getter: 'bzz_hive'
        }),
        new Property({
            name: 'info',
            getter: 'bzz_info'
        })
    ];
};


module.exports = Swarm;
