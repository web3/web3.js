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
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Marek Kotewicz <marek@ethcore.io>
 * @date 2017
 */

var Method = require('../method');
var formatters = require('../formatters');
var Subscriptions = require('../subscriptions');


var Shh = function (web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
};


var methods = function () {

    var getPastLogs = new Method({
        name: 'getPastMessages',
        call: 'shh_getMessages',
        params: 1,
        inputFormatter: [formatters.inputLogFormatter],
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
                inputFormatter: [formatters.inputLogFormatter],
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
        subscribe
    ];
};

module.exports = Shh;

