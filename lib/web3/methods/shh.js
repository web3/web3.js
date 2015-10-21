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
/** @file shh.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Method = require('../method');
var formatters = require('../formatters');
var Filter = require('../filter');
var watches = require('./watches');

var Shh = function (web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) { 
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
};

Shh.prototype.filter = function (fil, callback) {
    return new Filter(this._requestManager, fil, watches.shh(), formatters.outputPostFormatter, callback);
};

var methods = function () { 

    var post = new Method({
        name: 'post', 
        call: 'shh_post', 
        params: 1,
        inputFormatter: [formatters.inputPostFormatter]
    });

    var newIdentity = new Method({
        name: 'newIdentity',
        call: 'shh_newIdentity',
        params: 0
    });

    var hasIdentity = new Method({
        name: 'hasIdentity',
        call: 'shh_hasIdentity',
        params: 1
    });

    var newGroup = new Method({
        name: 'newGroup',
        call: 'shh_newGroup',
        params: 0
    });

    var addToGroup = new Method({
        name: 'addToGroup',
        call: 'shh_addToGroup',
        params: 0
    });

    return [
        post,
        newIdentity,
        hasIdentity,
        newGroup,
        addToGroup
    ];
};

module.exports = Shh;

