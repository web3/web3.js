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

var packageCore = require('../../../lib/package-core.js');

var utils = require('../../../lib/utils/utils');
var Property = require('../../../lib/web3/property');


var Net = function (provider) {
    var _this = this;

    // sets _requestmanager
    packageCore(this, arguments);

    properties().forEach(function(p) {
        p.attachToObject(_this);
        p.setRequestManager(_this._requestManager);
    });
};

/// @returns an array of objects describing web3.eth api properties
var properties = function () {
    return [
        new Property({
            name: 'listening',
            getter: 'net_listening'
        }),
        new Property({
            name: 'peerCount',
            getter: 'net_peerCount',
            outputFormatter: utils.toDecimal
        })
    ];
};

module.exports = Net;


