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

    // get the options object
    if(utils.isObject(args[args.length - 1])) {
        options = args[args.length - 1];
        this.options.binary = options.binary;
        this.options.from = options.from;
        this.options.gasPrice = options.gasPrice;
        this.options.gasLimit = options.gasLimit;

        if(utils.isObject(address)) {
            address = null;
        }
    }

    console.log(this);

    this.jsonInterface = jsonInterface;
    this.address = address;
};


/**
 * Deploys a contract, and sets its address
 *
 * @method deploy
 * @param {Object} options
 */
Contract.prototype.deploy = function(options){

    // return eventEmitter
};


/**
 * Encodes any contract function, including the constructor into a binary ABI HEX string.
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
