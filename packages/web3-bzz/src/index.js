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
var Net = require('web3-net');


var Bzz = function Bzz() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);


    methods().forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

    this.net = new Net(this.currentProvider);
};

core.addProviders(Bzz);



var methods = function () {

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

    var getManifest = new Method({
        name: 'getManifest',
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

    var getInfo = new Method({
        name: 'getInfo',
        call: 'bzz_info',
        params: 0,
        inputFormatter: []
    });

    return [
        download,
        upload,
        getManifest,
        put,
        modify,
        getInfo
    ];
};


module.exports = Bzz;

