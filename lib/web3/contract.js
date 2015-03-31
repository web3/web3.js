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
/** @file contract.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var web3 = require('../web3'); 
var abi = require('../solidity/abi');
var utils = require('../utils/utils');
var eventImpl = require('./event');
var signature = require('./signature');

var addFunctionRelatedPropertiesToContract = function (contract) {
    
    contract.call = function (options) {
        contract._isTransaction = false;
        contract._options = options;
        return contract;
    };

    contract.sendTransaction = function (options) {
        contract._isTransaction = true;
        contract._options = options;
        return contract;
    };
};

var addFunctionsToContract = function (contract, desc, address) {
    var inputParser = abi.inputParser(desc);
    var outputParser = abi.outputParser(desc);

    // create contract functions
    utils.filterFunctions(desc).forEach(function (method) {

        var displayName = utils.extractDisplayName(method.name);
        var typeName = utils.extractTypeName(method.name);

        var impl = function () {
            /*jshint maxcomplexity:7 */
            var params = Array.prototype.slice.call(arguments);
            var sign = signature.functionSignatureFromAscii(method.name);
            var parsed = inputParser[displayName][typeName].apply(null, params);

            var options = contract._options || {};
            options.to = address;
            options.data = sign + parsed;
            
            var isTransaction = contract._isTransaction === true || (contract._isTransaction !== false && !method.constant);
            var collapse = options.collapse !== false;
            
            // reset
            contract._options = {};
            contract._isTransaction = null;

            if (isTransaction) {
                
                // transactions do not have any output, cause we do not know, when they will be processed
                web3.eth.sendTransaction(options);
                return;
            }
            
            var output = web3.eth.call(options);
            var ret = outputParser[displayName][typeName](output);
            if (collapse)
            {
                if (ret.length === 1)
                    ret = ret[0];
                else if (ret.length === 0)
                    ret = null;
            }
            return ret;
        };

        if (contract[displayName] === undefined) {
            contract[displayName] = impl;
        }

        contract[displayName][typeName] = impl;
    });
};

var addEventRelatedPropertiesToContract = function (contract, desc, address) {
    contract.address = address;
    contract._onWatchEventResult = function (data) {
        var matchingEvent = event.getMatchingEvent(utils.filterEvents(desc));
        var parser = eventImpl.outputParser(matchingEvent);
        return parser(data);
    };
    
    Object.defineProperty(contract, 'topics', {
        get: function() {
            return utils.filterEvents(desc).map(function (e) {
                return signature.eventSignatureFromAscii(e.name);
            });
        }
    });

};

var addEventsToContract = function (contract, desc, address) {
    // create contract events
    utils.filterEvents(desc).forEach(function (e) {

        var impl = function () {
            var params = Array.prototype.slice.call(arguments);
            var sign = signature.eventSignatureFromAscii(e.name);
            var event = eventImpl.inputParser(address, sign, e);
            var o = event.apply(null, params);
            var outputFormatter = function (data) {
                var parser = eventImpl.outputParser(e);
                return parser(data);
            };
            return web3.eth.filter(o, undefined, undefined, outputFormatter);
        };
        
        // this property should be used by eth.filter to check if object is an event
        impl._isEvent = true;

        var displayName = utils.extractDisplayName(e.name);
        var typeName = utils.extractTypeName(e.name);

        if (contract[displayName] === undefined) {
            contract[displayName] = impl;
        }

        contract[displayName][typeName] = impl;

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

function Contract(abi, address) {

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

    var result = {};
    addFunctionRelatedPropertiesToContract(result);
    addFunctionsToContract(result, abi, address);
    addEventRelatedPropertiesToContract(result, abi, address);
    addEventsToContract(result, abi, address);

    return result;
}

module.exports = contract;

