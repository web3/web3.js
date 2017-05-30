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

    var addSymmetricKeyDirect = new Method({
        name: 'addSymmetricKeyDirect',
        call: 'shh_addSymmetricKeyDirect',
        params: 1,
        inputFormatter: [null]
    });

    var addSymmetricKeyFromPassword = new Method({
        name: 'addSymmetricFromPassword',
        call: 'shh_addSymmetricKeyFromPassword',
        params: 1,
        inputFormatter: [null]
    });

    var allowP2PMessagesFromPeer = new Method({
        name: 'allowP2PMessagesFromPeer',
        call: 'shh_allowP2PMessagesFromPeer',
        params: 1,
        inputFormatter: [null]
    });

    var deleteKeyPair = new Method({
        name: 'deleteKeyPair',
        call: 'shh_deleteKeyPair',
        params: 1,
        inputFormatter: [null]
    });

    var deleteSymmetricKey = new Method({
        name: 'deleteSymmetricKey',
        call: 'shh_deleteSymmetricKey',
        params: 1,
        inputFormatter: [null]
    });

    var generateSymmetricKey = new Method({
        name: 'generateSymmetricKey',
        call: 'shh_generateSymmetricKey',
        params: 0
    });

    var getFloatingMessages = new Method({
        name: 'getFloatingMessages',
        call: 'shh_getFloatingMessages',
        params: 1,
        inputFormatter: [null]
    });

    var getNewSubscriptionMessages = new Method({
        name: 'getNewSubscriptionMessages',
        call: 'shh_getNewSubscriptionMessages',
        params: 1,
        inputFormatter: [null]
    });

    var getPrivateKey = new Method({
        name: 'getPrivateKey',
        call: 'shh_getPrivateKey',
        params: 1,
        inputFormatter: [null]
    });

    var getPublicKey = new Method({
        name: 'getPublicKey',
        call: 'shh_getPublicKey',
        params: 1,
        inputFormatter: [null]
    });

    var getSymmetricKey = new Method({
        name: 'getSymmetricKey',
        call: 'shh_getSymmetricKey',
        params: 1,
        inputFormatter: [null]
    });

    var hasKeyPair = new Method({
        name: 'hasKeyPair',
        call: 'shh_hasKeyPair',
        params: 1,
        inputFormatter: [null]
    });

    var hasSymmetricKey = new Method({
        name: 'hasSymmetricKey',
        call: 'shh_hasSymmetricKey',
        params: 1,
        inputFormatter: [null]
    });

    var info = new Method({
        name: 'info',
        call: 'shh_info',
        params: 0
    });

    var newKeyPair = new Method({
        name: 'newKeyPair',
        call: 'shh_newKeyPair',
        params: 0
    });

    var post = new Method({
        name: 'post', 
        call: 'shh_post', 
        params: 1,
        inputFormatter: [formatters.inputPostFormatter]
    });

    var setMaxMessageLength = new Method({
        name: 'setMaxMessageLength',
        call: 'shh_setMaxMessageLength',
        params: 1,
        inputFormatter: [null]
    });

    var setMinimumPoW = new Method({
        name: 'setMinimumPoW',
        call: 'shh_setMinimumPoW',
        params: 1,
        inputFormatter: [null]
    });

    var subscribe = new Method({
        name: 'subscribe',
        call: 'shh_subscribe',
        params: 1,
        inputFormatter: [formatters.subscribeFormatter]
    });

    var unsubscribe = new Method({
        name: 'unsubscribe',
        call: 'shh_unsubscribe',
        params: 1,
        inputFormatter: [null]
    });


    return [
        addSymmetricKeyDirect,
        addSymmetricKeyFromPassword,
        allowP2PMessagesFromPeer,
        deleteKeyPair,
        deleteSymmetricKey,
        generateSymmetricKey,
        getFloatingMessages,
        getNewSubscriptionMessages,
        getPrivateKey,
        getPublicKey,
        getSymmetricKey,
        hasKeyPair,
        hasSymmetricKey,
        info,
        newKeyPair,
        post,
        setMaxMessageLength,
        setMinimumPoW,
        subscribe,
        unsubscribe

    ];
};

module.exports = Shh;

