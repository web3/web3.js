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
var EventEmitter = require('eventemitter3');
var coder = require('../solidity/coder');




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
    var args = Array.prototype.slice.call(arguments);
    this.options = {};


    if(!(this instanceof Contract))
        throw new Error('Please use the "new" keyword to instantiate a web3.eth.contract() object!');

    if(!jsonInterface)
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

    this.jsonInterface = jsonInterface;
    this.address = address;
};

Contract.prototype._web3 = {}; // web3 is attached here in eth.js


/**
 * Fires an error in an event emitter and callback and returns the eventemitter
 *
 * @method _fireError
 * @param {Object} error
 * @param {Object} emitter
 * @param {Function} callback
 * @return {Object} the emitter
 */
Contract.prototype._fireError = function (error, emitter, callback) {
    setTimeout(function(){
        if(utils.isFunction(callback)) {
            callback(error);
        }
        emitter.emit('error', error);
    }, 0);
    return emitter;
};


/**
 * Should be called to encode constructor params
 *
 * @method _encodeConstructorParams
 * @param {Array} abi
 * @param {Array} constructor params
 */
Contract.prototype._encodeConstructorParams = function (jsonInterface, params) {
    return jsonInterface.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';
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
    var filter = this._web3.eth.filter('latest', function(e){
        if (!e && !callbackFired) {
            count++;

            // stop watching after 50 blocks (timeout)
            if (count > 50) {

                filter.stopWatching();
                callbackFired = true;

                if (callback)
                    callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));


            } else {

                _this._web3.eth.getTransactionReceipt(transactionHash, function(e, receipt){
                    if(receipt && !callbackFired) {

                        _this._web3.eth.getCode(receipt.contractAddress, function(e, code){

                            if(callbackFired || !code)
                                return;

                            filter.stopWatching();
                            callbackFired = true;

                            if(code.length > 2) {
                                callback(null, receipt.contractAddress);
                            } else {
                                callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
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
        emitter = new EventEmitter();
    options = options || {};

    options.arguments = options.arguments || [];
    options.data = options.data || this.options.data;
    options.from = options.from || this.options.from;
    options.gasPrice = options.gasPrice || this.options.gasPrice;
    options.gasLimit = options.gasLimit || this.options.gasLimit;

    // return error, if no "from" is specified
    if(!utils.isAddress(options.from)) {
        return this._fireError(new Error('No "from" address specified in either the default options, or the given options.'), emitter, callback);
    }

    // return error, if no "data" is specified
    if(!options.data) {
        return this._fireError(new Error('No "data" specified in either the default options, or the given options.'), emitter, callback);
    }

    // add constructor parameters
    var bytes = this._encodeConstructorParams(this.jsonInterface, options.arguments);
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
            emitter.emit('error', err);
            // remove all listeners on the end, as no event will ever fire again
            emitter.removeAllListeners();

        } else {
            emitter.emit('transactionHash', hash);

            // wait for the contract to be mined and return the address
            _this._checkForContractAddress(hash, function(err, address){
                if(err) {
                    emitter.emit('error', err);
                } else {
                    emitter.emit('mined', address);
                }

                // remove all listeners on the end, as no event will ever fire again
                emitter.removeAllListeners();
            });
        }
    });

    return emitter;
};


/**
 * Encodes any contract function, including the constructor into a data ABI HEX string.
 *
 * @method encodeABI
 * @param {Object} options
 */
Contract.prototype.encodeABI = function(options){

};

/**
 * Get events from contracts
 *
 * @method on
 * @param {Object} options
 */
Contract.prototype.on = function(event, options, callback){
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
 * @method call
 * @param {Object} options
 */
Contract.prototype.call = function(options){
    // prepare call

};


/**
 * Transact to a contract method
 *
 * @method transact
 * @param {Object} options
 */
Contract.prototype.transact = function(options){
    // prepare call
};


/**
 * TODO: method called after call() or transact()
 *
 * @method _method
 * @param {Object} options
 */
Contract.prototype._method = function(){
    var args = Array.prototype.slice.call(arguments),
        callback;

    // get the callback
    if(utils.isFunction(args[args.length - 1])) {
        callback = args.pop();

    }

    // function params: args

    // return eventEmitter, or promise?
};

module.exports = Contract;
