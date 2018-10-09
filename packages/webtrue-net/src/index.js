/*
    This file is part of webtrue.js.

    webtrue.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    webtrue.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with webtrue.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var core = require('webtrue-core');
var Method = require('webtrue-core-method');
var utils = require('webtrue-utils');


var Net = function () {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);


    [
        new Method({
            name: 'getId',
            call: 'net_version',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'isListening',
            call: 'net_listening',
            params: 0
        }),
        new Method({
            name: 'getPeerCount',
            call: 'net_peerCount',
            params: 0,
            outputFormatter: utils.hexToNumber
        })
    ].forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

};

core.addProviders(Net);


module.exports = Net;


