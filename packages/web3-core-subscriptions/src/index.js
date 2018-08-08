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

var Subscription = require('./subscription.js');


var Subscriptions = function Subscriptions(options) {
    this.name = options.name;
    this.type = options.type;
    this.subscriptions = options.subscriptions || {};
    this.requestManager = null;
};


Subscriptions.prototype.setRequestManager = function (rm) {
    this.requestManager = rm;
};


Subscriptions.prototype.attachToObject = function (obj) {
    var func = this.buildCall();
    var name = this.name.split('.');
    if (name.length > 1) {
        obj[name[0]] = obj[name[0]] || {};
        obj[name[0]][name[1]] = func;
    } else {
        obj[name[0]] = func;
    }
};


Subscriptions.prototype.buildCall = function() {
    var _this = this;

    return function(){
        if(!_this.subscriptions[arguments[0]]) {
            console.warn('Subscription '+ JSON.stringify(arguments[0]) +' doesn\'t exist. Subscribing anyway.');
        }

        var subscription = new Subscription({
            subscription: _this.subscriptions[arguments[0]],
            requestManager: _this.requestManager,
            type: _this.type
        });

        return subscription.subscribe.apply(subscription, arguments);
    };
};


module.exports = {
    subscriptions: Subscriptions,
    subscription: Subscription
};
