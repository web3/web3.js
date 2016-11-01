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
 * @file event.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2016
 */

var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var formatters = require('./formatters');
var sha3 = require('../utils/sha3');
var Subscription = require('./subscription');

/**
 * This prototype should be used to create event filters
 */
var ContractEvent = function (requestManager, json, address, allEvents) {
    this._requestManager = requestManager;
    this._address = address;
    this._json = json;
    this._name = json.inputs ? utils.transformToFullName(json) : null;
    this._params = json.inputs;
    this._anonymous = json.anonymous;
    this._allEvents = !!allEvents;
};

/**
 * Should be used to get filtered param types
 *
 * @method types
 * @param {Bool} decide if returned typed should be indexed
 * @param {Object} params the parameters of the event
 * @return {Array} array of types
 */
ContractEvent.prototype.types = function (indexed, params) {
    return params.filter(function (i) {
        return i.indexed === indexed;
    }).map(function (i) {
        return i.type;
    });
};

/**
 * Should be used to get event display name
 *
 * @method displayName
 * @param {String} name (optional) the events name
 * @return {String} event display name
 */
ContractEvent.prototype.displayName = function (name) {
    return utils.extractDisplayName(name || this._name);
};

/**
 * Should be used to get event type name
 *
 * @method typeName
 * @return {String} event type name
 */
ContractEvent.prototype.typeName = function () {
    return utils.extractTypeName(this._name);
};

/**
 * Should be used to get event signature
 *
 * @method signature
 * @return {String} event signature
 */
ContractEvent.prototype.signature = function () {
    return sha3(this._name);
};

/**
 * Should be used to encode indexed params and options to one final object
 *
 * @method encode
 * @param {Object} options
 * @return {Object} everything combined together and encoded
 */
ContractEvent.prototype.encode = function (options) {
    options = options || {};
    var indexed = options.filter || {},
        result = {};


    ['fromBlock', 'toBlock'].filter(function (f) {
        return options[f] !== undefined;
    }).forEach(function (f) {
        result[f] = formatters.inputBlockNumberFormatter(options[f]);
    });

    result.topics = [];

    // single events
    if(!this._allEvents) {

        if (!this._anonymous) {
            result.topics.push('0x' + this.signature());
        }

        var indexedTopics = this._params.filter(function (i) {
            return i.indexed === true;
        }).map(function (i) {
            var value = indexed[i.name];
            if (value === undefined || value === null) {
                return null;
            }

            if (utils.isArray(value)) {
                return value.map(function (v) {
                    return '0x' + coder.encodeParam(i.type, v);
                });
            }
            return '0x' + coder.encodeParam(i.type, value);
        });

        result.topics = result.topics.concat(indexedTopics);
    }

    result.address = this._address;

    return result;
};

/**
 * Should be used to decode indexed params and options
 *
 * @method decode
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
ContractEvent.prototype.decode = function (data) {
    var name = null,
        params = null,
        anonymous = null;
    data.data = data.data || '';
    data.topics = data.topics || [];

    // all events
    if(this._allEvents) {

        var eventTopic = data.topics[0].slice(2);
        var match = this._json.filter(function (j) {
            return eventTopic === sha3(utils.transformToFullName(j));
        })[0];

        if (!match) { // cannot find matching event?
            console.warn('Can\'t find event for log');
            return data;
        }

        name = utils.transformToFullName(match);
        params = match.inputs;
        anonymous = match.anonymous;

    // single event
    } else {
        name = this._name;
        params = this._params;
        anonymous = this._anonymous;
    }

    var argTopics = anonymous ? data.topics : data.topics.slice(1);
    var indexedData = argTopics.map(function (topics) { return topics.slice(2); }).join("");
    var indexedParams = coder.decodeParams(this.types(true, params), indexedData);

    var notIndexedData = data.data.slice(2);
    var notIndexedParams = coder.decodeParams(this.types(false, params), notIndexedData);

    var result = formatters.outputLogFormatter(data);
    result.event = this.displayName(name);
    result.address = data.address;

    result.returnValues = params.reduce(function (acc, current) {
        acc[current.name] = current.indexed ? indexedParams.shift() : notIndexedParams.shift();
        return acc;
    }, {});

    delete result.data;
    delete result.topics;

    return result;
};

/**
 * Get the arguments of the function call
 *
 * @method getArgs
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} filter object
 */
ContractEvent.prototype.getArgs = function (options, callback) {
    if (utils.isFunction(arguments[arguments.length - 1])) {
        callback = arguments[arguments.length - 1];

        if(arguments.length === 1) {
            options = null;
        }
    }

    return {
        options: this.encode(options),
        formatter: this.decode.bind(this),
        callback: callback
    };
};

/**
 * Should be used to create new filter object from event
 *
 * @method execute
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} filter object
 */
ContractEvent.prototype.execute = function () {

    var args = this.getArgs.apply(this, arguments);
    var subscription = new Subscription({
        subscription: {
            params: 1,
            inputFormatter: [formatters.inputLogFormatter],
            outputFormatter: args.formatter
        },
        subscribeMethod: 'eth_subscribe',
        unsubscribeMethod: 'eth_unsubscribe',
        requestManager: this._requestManager
    });

    return subscription.subscribe.apply(subscription, ['logs', args.options, args.callback]);
};

// TODO: put indexed args into the options object

/**
 * Get past logs for this event
 *
 * @method getPastEvents
 * @param {Object} options
 * @param {Function} callback
 * @param {Contract}
 */
ContractEvent.prototype.getPastEvents = function(){

    var args = this.getArgs.apply(this, arguments);

    // TODO remove send sync and return promise

    if (utils.isFunction(args.callback)) {
        return this._requestManager.send({
            method: 'eth_getLogs',
            params: [args.options]
        }, function(error, logs){
            if(!error) {
                args.callback(null, logs.map(args.formatter));
            } else {
                args.callback(error);
            }
        });
    }

    return this._requestManager.sendSync({
        method: 'eth_getLogs',
        params: [args.options]
    }).map(args.formatter);
};

/**
 * Should be used to attach event to contract object
 *
 * @method attachToContract
 * @param {Contract}
 */
ContractEvent.prototype.attachToContract = function (contract) {
    var execute = this.execute.bind(this);

    // attach past logs
    execute.getPastEvents = this.getPastEvents.bind(this);

    // all events
    if(this._allEvents) {
        contract.allEvents = execute;

    // single event
    } else {

        var displayName = this.displayName();
        if (!contract[displayName]) {
            contract[displayName] = execute;
        }
        contract[displayName][this.typeName()] = this.execute.bind(this, contract);
    }

};

module.exports = ContractEvent;

