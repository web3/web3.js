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
/** @file subscription.js
 *
 * @authors:
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');
var errors = require('./errors');


Subscriptions = function (options) {
    this.name = options.name;
    this.subscribe = options.subscribe;
    this.unsubscribe = options.unsubscribe;
    this.subscriptions = options.subscriptions || {};
    this.requestManager = null;
};


Subscriptions.prototype.setRequestManager = function (rm) {
    this.requestManager = rm;
};


/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */

Subscriptions.prototype.extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

/**
 * Should be called to check if the number of arguments is correct
 * 
 * @method validateArgs
 * @param {Array} arguments
 * @throws {Error} if it is not
 */

Subscriptions.prototype.validateArgs = function (args) {
    var subscription = this.subscriptions[args[0]];

    if(!subscription)
        subscription = {};

    if(!subscription.params)
        subscription.params = 0;

    if (args.length !== subscription.params + 1) {
        throw errors.InvalidNumberOfParams();
    }
};

/**
 * Should be called to format input args of method
 * 
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */

Subscriptions.prototype.formatInput = function (args) {
    var subscription = this.subscriptions[args[0]];

    if (!subscription || !subscription.inputFormatter) {
        return args;
    }

    return subscription.inputFormatter.map(function (formatter, index) {
        return formatter ? formatter(args[index+1]) : args[index+1];
    });
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */

Subscriptions.prototype.formatOutput = function (subscription, result) {
    var subscription = this.subscriptions[subscription];

    return (subscription && subscription.outputFormatter && result) ? subscription.outputFormatter(result) : result;
};

/**
 * Should create payload from given input args
 *
 * @method toPayload
 * @param {Array} args
 * @return {Object}
 */
Subscriptions.prototype.toPayload = function (args) {
    var callback = this.extractCallback(args);
    var params = this.formatInput(args);
    this.validateArgs(params);

    return {
        method: this.subscribe,
        params: params,
        callback: callback
    };
};


Subscriptions.prototype.attachToObject = function (obj) {
    var func = this.buildCall();
    func.call = this.call; // TODO!!! that's ugly. filter.js uses it
    var name = this.name.split('.');
    if (name.length > 1) {
        obj[name[0]] = obj[name[0]] || {};
        obj[name[0]][name[1]] = func;
    } else {
        obj[name[0]] = func; 
    }
};

/**
 * Creates the subscription and calls the callback when data arrives.
 *
 * @method createSubscription
 * @return {Object}
 */
Subscriptions.prototype.createSubscription = function() {
    var _this = this;
    var payload = this.toPayload(Array.prototype.slice.call(arguments));

    // throw error, if provider doesnt support subscriptions
    if(!this.requestManager.provider.onNotification)
        throw new Error('The current provider doesn\'t support subscriptions', this.requestManager.provider);

    if (payload.callback) {
        var subscription = {
            id: null, 
            unsubscribe: function(callback){
                return _this.requestManager.removeSubscription(subscription.id, callback);
            }
        };


        this.requestManager.sendAsync(payload, function (err, result) {
            if(!err && result) {
                subscription.id = result;
                
                // call callback on notifications
                _this.requestManager.addSubscription('eth', subscription.id, function(err, result){
                    payload.callback(err, _this.formatOutput(payload.params[0], result), subscription);
                });
            } else {
                payload.callback(err);
            }
        });

        // return an object to cancel the subscription
        return subscription;

    } else
        throw new Error('Subscriptions require a callback as the last parameter!');
};

Subscriptions.prototype.buildCall = function() {
    var _this = this;
    var createSubscription = this.createSubscription.bind(this);
    return createSubscription;
};

module.exports = Subscriptions;

