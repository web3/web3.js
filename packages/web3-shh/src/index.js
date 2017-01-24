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
var Subscriptions = require('web3-core-subscriptions').subscriptions;
var Method = require('web3-core-method');

var formatters = require('web3-core-helpers').formatters;


var Shh = function (provider) {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);


    methods().forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });
};

core.addProviders(Shh);


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

    var getPastMessages = new Method({
        name: 'getPastMessages',
        call: 'shh_getMessages',
        params: 1,
        inputFormatter: [formatters.inputPostFormatter],
        outputFormatter: formatters.outputPostFormatter
    });

    // subscriptions
    var subscribe = new Subscriptions({
        name: 'subscribe',
        subscribe: 'shh_subscribe',
        unsubscribe: 'shh_unsubscribe',
        subscriptions: {
            'messages': {
                params: 1,
                inputFormatter: [formatters.inputPostFormatter],
                outputFormatter: formatters.outputPostFormatter
            }
        }
    });

    return [
        post,
        newIdentity,
        hasIdentity,
        newGroup,
        addToGroup,
        getPastMessages,
        subscribe
    ];
};

module.exports = Shh;


