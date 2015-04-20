/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file contract.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var web3 = require('../web3'); 
var solAbi = require('../solidity/abi');
var utils = require('../utils/utils');
var SolidityEvent = require('./event');
var SolidityFunction = require('./function');

var addFunctionsToContract = function (contract, desc) {
    desc.filter(function (json) {
        return json.type === 'function';
    }).map(function (json) {
        return new SolidityFunction(json);
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

var addEventsToContract = function (contract, desc, address) {
    desc.filter(function (json) {
        return json.type === 'event';
    }).map(function (json) {
        return new SolidityEvent(json, address);
    }).forEach(function (e) {
        e.attachToContract(contract);
    });
};

/**
 * This method should be called when we want to call / transact some solidity method from javascript
 * it returns an object which has same methods available as solidity contract description
 * usage example: 
 *
 * var abi = [{
 *      name: 'myMethod',
 *      inputs: [{ name: 'a', type: 'string' }],
 *      outputs: [{name: 'd', type: 'string' }]
 * }];  // contract abi
 *
 * var MyContract = web3.eth.contract(abi); // creation of contract prototype
 *
 * var contractInstance = new MyContract('0x0123123121');
 *
 * contractInstance.myMethod('this is test string param for call'); // myMethod call (implicit, default)
 * contractInstance.call().myMethod('this is test string param for call'); // myMethod call (explicit)
 * contractInstance.sendTransaction().myMethod('this is test string param for transact'); // myMethod sendTransaction
 *
 * @param abi - abi json description of the contract, which is being created
 * @returns contract object
 */
var contract = function (abi) {

    // return prototype
    return Contract.bind(null, abi);
};

var Contract = function (abi, options) {

    // workaround for invalid assumption that method.name is the full anonymous prototype of the method.
    // it's not. it's just the name. the rest of the code assumes it's actually the anonymous
    // prototype, so we make it so as a workaround.
    // TODO: we may not want to modify input params, maybe use copy instead?
    abi.forEach(function (method) {
        if (method.name.indexOf('(') === -1) {
            var displayName = method.name;
            var typeName = method.inputs.map(function(i){return i.type; }).join();
            method.name = displayName + '(' + typeName + ')';
        }
    });

    this.address = '';
    this._isTransaction = null;
    this._options = {};
    if (utils.isAddress(options)) {
        this.address = options;
    } else { // is an object!
        // TODO, parse the rest of the args
        options = options || {};
        var args = Array.prototype.slice.call(arguments, 2);
        var bytes = solAbi.formatConstructorParams(abi, args);
        options.data += bytes;
        this.address = web3.eth.sendTransaction(options);
    }

    addFunctionsToContract(this, abi);
    addEventsToContract(this, abi, this.address);
};

Contract.prototype.call = function (options) {
    this._isTransaction = false;
    this._options = options;
    return this;
};

Contract.prototype.sendTransaction = function (options) {
    this._isTransaction = true;
    this._options = options;
    return this;
};

module.exports = contract;

