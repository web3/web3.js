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
 * @file contract.js
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2016
 */

var utils = require('../utils/utils');
var eventifiedPromise = require('./eventifiedPromise.js');
var coder = require('../solidity/coder');
var formatters = require('./formatters');
var sha3 = require('../utils/sha3');
var Subscription = require('./subscription.js');



/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} address
 * @param {Object} options
 */
var Contract = function(jsonInterface, address, options) {
    var _this = this,
        args = Array.prototype.slice.call(arguments);
    this.options = {};


    if(!(this instanceof Contract))
        throw new Error('Please use the "new" keyword to instantiate a web3.eth.contract() object!');

    if(!jsonInterface || !(jsonInterface instanceof Array))
        throw new Error('You must provide the json interface of the contract when instatiating a contract object.');

    // get the options object
    if(utils.isObject(args[args.length - 1])) {
        options = args[args.length - 1];
        this.options.data = options.data;
        this.options.from = options.from;
        this.options.gasPrice = options.gasPrice;
        this.options.gasLimit = options.gasLimit;

        if(utils.isObject(address)) {
            address = null;
        }
    }

    this._methods = {};
    this._jsonInterface = [];

    this.address = address;


    // add method and event signatures, when the jsonInterface gets set
    Object.defineProperty(this, 'jsonInterface', {
        set: function(value){
            _this._jsonInterface = value.map(function(method) {
                // function
                if (method.type === 'function') {
                    method.signature = sha3(utils.transformToFullName(method)).slice(0, 8);
                    method.outputTypes = method.outputs.map(function (i) {
                        return i.type;
                    });

                    // add method only if not one already exists
                    if(!_this._methods[method.name])
                        _this._methods[method.name] = {
                            signatureBased: false,
                            method: method,
                        };
                    // definitely add the method based on its signature
                    _this._methods[method.signature] = {
                        signatureBased: true,
                        method: method
                    };

                    // event
                } else if (method.type === 'event') {
                    method.signature = sha3(utils.transformToFullName(method));
                }


                return method;
            });
            return _this._jsonInterface;
        },
        get: function(){
            return _this._jsonInterface;
        },
        enumerable: true
    });
    // set the jsonInterface
    this.jsonInterface = jsonInterface;


};

Contract.prototype._web3 = {}; // web3 is attached here in eth.js

/**
 * Checks that no listener with name "newListener" or "removeListener" is added.
 *
 * @method _checkListener
 * @param {String} type
 * @param {String} event
 * @param {Function} func
 * @return {Object} the contract instance
 */
Contract.prototype._checkListener = function(type, event, func){
    if(event === type) {
        throw new Error('The event "'+ type +'" is a reserved event name, you can\'t use it.');
    }
};


/**
 * Fires an error in an event emitter and callback and returns the eventemitter
 *
 * @method _fireError
 * @param {Object} error
 * @param {Object} emitter
 * @param {Function} reject
 * @param {Function} callback
 * @return {Object} the emitter
 */
Contract.prototype._fireError = function (error, emitter, reject, callback) {
    setTimeout(function(){
        if(utils.isFunction(callback)) {
            callback(error);
        }
        if(utils.isFunction(reject)) {
            reject(error);
        }
        emitter.emit('error', error);
        emitter.removeAllListeners();
    }, 0);
    return emitter;
};


/**
 * Should be used to encode indexed params and options to one final object
 *
 * @method _encodeEventABI
 * @param {Object} options
 * @return {Object} everything combined together and encoded
 */
Contract.prototype._encodeEventABI = function (event, options) {
    options = options || {};
    var filter = options.filter || {},
        result = {};


    ['fromBlock', 'toBlock'].filter(function (f) {
        return options[f] !== undefined;
    }).forEach(function (f) {
        result[f] = formatters.inputBlockNumberFormatter(options[f]);
    });

    result.topics = [];

    // add event signature
    if(event && !event.anonymous) {
        result.topics.push('0x' + event.signature);
    }

    // add event topics (indexed arguments)
    var indexedTopics = event.inputs.filter(function (i) {
        return i.indexed === true;
    }).map(function (i) {
        var value = filter[i.name];
        if (!value) {
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
    result.address = this.address;

    return result;
};

/**
 * Should be used to decode indexed params and options
 *
 * @method _decodeEventABI
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
Contract.prototype._decodeEventABI = function (data) {
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
 * Encodes an ABI for a method, including signature or the method.
 * Or when constructor encodes only the constructor parameters.
 *
 * @method _encodeMethodABI
 * @param {String} method
 * @param {Array} params
 * @param {String} the encoded ABI
 */
Contract.prototype._encodeMethodABI = function (method, params) {
    var signature = false,
        paramsABI = this.jsonInterface.filter(function (json) {
        return ((method === 'constructor' && json.type === method) ||
            ((json.signature === method || json.name === method) && json.type === 'function')) &&
            json.inputs.length === params.length;
    }).map(function (json) {
        if(json.type === 'function') {
            signature = json.signature;
        }
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';

    return (signature) ? signature + paramsABI : paramsABI;
};

/**
 * Decode method return values
 *
 * @method _decodeMethodReturn
 * @param {Array} abi
 * @param {Array} constructor params
 */
Contract.prototype._decodeMethodReturn = function (returnValues, outputTypes) {
    if (!returnValues) {
        return;
    }

    returnValues = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
    var result = coder.decodeParams(outputTypes, returnValues);
    result = result.length === 1 ? result[0] : result;
    if(result === '0x')
        result = null;
    return result;
};

/**
 * Should be called to check if a contract gets properly deployed on the blockchain.
 *
 * @method _checkForContractAddress
 * @param {String} transactionHash
 * @param {Function} callback
 * @returns {Undefined}
 */
Contract.prototype._checkForContractAddress = function(transactionHash, callback){
    var _this = this,
        count = 0,
        callbackFired = false;

    // wait for receipt
    var sub = this._web3.eth.subscribe('newBlocks', {}, function(e){
        if (!e && !callbackFired) {
            count++;

            // stop watching after 50 blocks (timeout)
            if (count > 50) {

                sub.unsubscribe();
                callbackFired = true;

                if (callback)
                    callback(new Error('Contract deployment timed out. Transaction couldn\'t be found after 50 blocks'));


            } else {

                _this._web3.eth.getTransactionReceipt(transactionHash, function(e, receipt){
                    if(receipt && !callbackFired) {

                        _this._web3.eth.getCode(receipt.contractAddress, function(e, code){

                            if(callbackFired || !code)
                                return;

                            sub.unsubscribe();
                            callbackFired = true;

                            if(code.length > 2) {
                                callback(null, receipt.contractAddress);
                            } else {
                                callback(new Error('The contract code couldn\'t be stored, please check your gas limit.'));
                            }
                        });
                    }
                });
            }
        }
    });
};

/**
 * Deploys a contract and fire events based on its state: transactionHash, mined
 *
 * All event listeners will be removed, once the last possible event is fired ("error", or "mined")
 *
 * @method deploy
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} EventEmitter possible events are "error", "transactionHash" and "mined"
 */
Contract.prototype.deploy = function(options, callback){
    /*jshint maxcomplexity: 9 */
    var _this = this,
        defer = eventifiedPromise();

    options = options || {};

    options.arguments = options.arguments || [];
    options.data = options.data || this.options.data;
    options.from = options.from || this.options.from;
    options.gasPrice = options.gasPrice || this.options.gasPrice;
    options.gasLimit = options.gasLimit || this.options.gasLimit;

    // return error, if no "from" is specified
    if(!utils.isAddress(options.from)) {
        return this._fireError(new Error('No "from" address specified in either the default options, or the given options.'), defer.promise, defer.reject, callback);
    }

    // return error, if no "data" is specified
    if(!options.data) {
        return this._fireError(new Error('No "data" specified in either the default options, or the given options.'), defer.promise, defer.reject, callback);
    }

    // add constructor parameters
    var bytes = this._encodeParams('constructor', options.arguments);
    options.data += bytes;


    // send the actual deploy transaction
    this._web3.eth.sendTransaction({
        from: options.from,
        gasPice: options.gasPrice,
        gasLimit: options.gasLimit,
        data: options.data
    }, function (err, hash) {

        // call callback if available
        if(utils.isFunction(callback)) {
            callback(err, hash);
        }

        if (err) {
            defer.reject(err);
            defer.promise.emit('error', err);
            // remove all listeners on the end, as no event will ever fire again
            defer.promise.removeAllListeners();

        } else {
            defer.promise.emit('transactionHash', hash);

            // wait for the contract to be mined and return the address
            _this._checkForContractAddress(hash, function(err, address){
                if(err) {
                    defer.reject(err);
                    defer.promise.emit('error', err);
                } else {
                    defer.resolve(address);
                    defer.promise.emit('mined', address);
                }

                // remove all listeners on the end, as no event will ever fire again
                defer.promise.removeAllListeners();
            });
        }
    });

    return defer.promise;
};


/**
 * Encodes any contract function, including the constructor into a data ABI HEX string.
 *
 * @method encodeABI
 * @param {Object} options
 */
Contract.prototype.encodeABI = function(options){
    var bytes = '0x';
    options = options || {};

    options.arguments = options.arguments || [];
    options.data = options.data || this.options.data || '';

    if(!options.method)
        throw new Error('You must provide a method, or the string "constructor".');

    if(options.method === 'constructor') {
        bytes = options.data || bytes;
    }


    // remove 0x
    options.method = options.method.replace(/^0x/,'');

    // add the parameters (and signature, if method not constructor)
    bytes += this._encodeMethodABI(options.method, options.arguments);

    return bytes;
};


/**
 * Adds event listeners and creates a subscription, if none exists.
 *
 * @method on
 * @param {String} event
 * @param {Object} options
 * @param {Function} func
 * @return {Object} the event subscription
 */
Contract.prototype.on = function(event, options, func){
    var args = Array.prototype.slice.call(arguments),
        event = this.jsonInterface.find(function(json){
            return (json.type === 'event' && json.name === event);
        });

    if(!event) {
        throw new Error('Event "'+ event.name +'" doesn\'t exist in this contract.');
    }

    if(!utils.isAddress(this.address)) {
        throw new Error('This contract object doesn\'t have address set yet, please set an address first.');
    }

    if (utils.isFunction(args[args.length - 1])) {
        func = args[args.length - 1];
    }

    this._checkListener('newListener', event.name, func);
    this._checkListener('removeListener', event.name, func);

    options = (utils.isObject(args[args.length - 1])) ? args[args.length - 1] : options;
    var subscriptionParams = this._encodeEventABI(event ,options);

    console.log(subscriptionParams);

    // create new subscription
    var subscription = new Subscription({
        subscription: {
            params: 1,
            inputFormatter: [formatters.inputLogFormatter],
            outputFormatter: formatters.outputLogFormatter
        },
        subscribeMethod: 'eth_subscribe',
        unsubscribeMethod: 'eth_unsubscribe',
        requestManager: this._web3._requestManager
    });
    subscription.subscribe('logs', subscriptionParams, func);

    return subscription;
};

/**
 * Get past events from contracts
 *
 * @method pastEvents
 * @param {Object} options
 */
Contract.prototype.pastEvents = function(event, options, callback){
    var args = Array.prototype.slice.call(arguments);

    // get the callback
    if(utils.isFunction(args[args.length - 1])) {
        callback = args[args.length - 1];

        if(utils.isFunction(options)) {
            options = null;
        }
    }
};

/**
 * Call a contract method
 *
 * @method estimateGas
 * @param {Object} options
 */
Contract.prototype.estimateGas = function(options){
    return Contract.prototype._prepareMethods.call(this, 'estimateGas', options);
};

/**
 * Call a contract method
 *
 * @method call
 * @param {Object} options
 */
Contract.prototype.call = function(options){
    return Contract.prototype._prepareMethods.call(this, 'call', options);
};


/**
 * Transact to a contract method
 *
 * @method transact
 * @param {Object} options
 */
Contract.prototype.transact = function(options){
    return Contract.prototype._prepareMethods.call(this, 'transact', options);
};


/**
 * Prepares a list of methods with the right context
 *
 * @method _prepareMethods
 * @param {Object} options
 * @returns {Object} the prepeared methods
 */
Contract.prototype._prepareMethods = function(type, options){
    var _this = this,
        methods = {};
    options = options || {};

    options.from = options.from || this.options.from;
    options.gasPrice = options.gasPrice || this.options.gasPrice;
    options.gasLimit = options.gasLimit || this.options.gasLimit;

    // return error, if no "from" is specified
    if(type === 'transact' && !utils.isAddress(options.from)) {
        throw new Error('No "from" address specified in either the default options, or the given options.');
    }

    // prepare the methods
    Object.keys(this._methods).forEach(function(key) {
        if(_this._methods.hasOwnProperty(key)) {
            var context = {
                type: type,
                method: _this._methods[key].method,
                signatureBased: _this._methods[key].signatureBased,
                parent: _this,
                options: options
            };
            methods[key] = _this._executeMethod.bind(context);
        }
    });

    return methods;
};

/**
 * Executes a call, transact or estimateGas on a contract function
 *
 * @method _executeMethod
 * @param {Object} options
 */
Contract.prototype._executeMethod = function(){
    var _this = this,
        args = Array.prototype.slice.call(arguments),
        defer = eventifiedPromise(),
        callback;

    // get the callback
    if(utils.isFunction(args[args.length - 1])) {
        callback = args.pop();
    }

    this.options.data = this.signatureBased ? this.parent._encodeMethodABI(this.method.signature, args) : this.parent._encodeMethodABI(this.method.name, args);

    // return error, if no "data" is specified
    if(!this.options.data) {
        return this.parent._fireError(new Error('Couldn\'t find a matching contract method, the number of parameters seems wrong.'), defer.promise, defer.reject, callback);
    }

    // TODO remove once we switched everywhere to gasLimit
    this.options.gas = this.options.gasLimit;

    // add contract address
    if(!utils.isAddress(this.parent.address)) {
        throw new Error('This contract object doesn\'t have address set yet, please set an address first.');
    }

    this.options.to = this.parent.address;

    // create the callback method
    var methodReturnCallback = function(err, returnValues) {
        var decodedReturnValues = (_this.type === 'estimateGas') ? returnValues : _this.parent._decodeMethodReturn(returnValues, _this.method.outputTypes);

        if (utils.isFunction(callback)) {
            callback(err, decodedReturnValues);
        }

        if (err) {
            defer.reject(err);
            defer.promise.emit('error', err);
            // remove all listeners on the end, as no event will ever fire again
            defer.promise.removeAllListeners();
        } else {
            defer.promise.emit('data', decodedReturnValues);

            if(_this.type === 'transact') {
                // TODO check for confirmations
                // fire "mined" event and resolve after
                defer.resolve(decodedReturnValues);

            } else {
                // remove all listeners on the end, as no event will ever fire again
                defer.resolve(decodedReturnValues);
                defer.promise.removeAllListeners();
            }
        }
    };

    switch (this.type) {
        case 'estimateGas':

            this.parent._web3.eth.estimateGas(this.options, methodReturnCallback);

            break;
        case 'call':

            this.parent._web3.eth.call(this.options, methodReturnCallback);

            break;
        case 'transact':

            this.parent._web3.eth.sendTransaction(this.options, methodReturnCallback);

            break;
    }

    return defer.promise;
};


module.exports = Contract;
