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
 *
 * To initialize a contract use:
 *
 *  var Contract = require('web3-eth-contract');
 *  Contract.setProvider('ws://localhost:8546');
 *  var contract = new Contract(abi, address, ...);
 *
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */


"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var utils = require('web3-utils');
var Subscription = require('web3-core-subscriptions').subscription;
var formatters = require('web3-core-helpers').formatters;
var errors = require('web3-core-helpers').errors;
var promiEvent = require('web3-core-promievent');
var abi = require('web3-eth-abi');


/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} address
 * @param {Object} options
 */
var Contract = function Contract(jsonInterface, address, options) {
    var _this = this,
        args = Array.prototype.slice.call(arguments);

    if(!(this instanceof Contract)) {
        throw new Error('Please use the "new" keyword to instantiate a web3.eth.Contract() object!');
    }

    this.setProvider = function () {
        core.packageInit(_this, arguments);

        _this.clearSubscriptions = _this._requestManager.clearSubscriptions;
    };

    // sets _requestmanager
    core.packageInit(this, [this.constructor]);

    this.clearSubscriptions = this._requestManager.clearSubscriptions;

    if(!jsonInterface || !(Array.isArray(jsonInterface))) {
        throw errors.ContractMissingABIError();
    }

    // create the options object
    this.options = {};

    var lastArg = args[args.length - 1];
    if(!!lastArg && typeof lastArg === 'object' && !Array.isArray(lastArg)) {
        options = lastArg;

        this.options = { ...this.options, ...this._getOrSetDefaultOptions(options)};
        if(!!address && typeof address === 'object') {
            address = null;
        }
    }

    // set address
    Object.defineProperty(this.options, 'address', {
        set: function(value){
            if(value) {
                _this._address = utils.toChecksumAddress(formatters.inputAddressFormatter(value));
            }
        },
        get: function(){
            return _this._address;
        },
        enumerable: true
    });

    // add method and event signatures, when the jsonInterface gets set
    Object.defineProperty(this.options, 'jsonInterface', {
        set: function(value){
            _this.methods = {};
            _this.events = {};

            _this._jsonInterface = value.map(function(method) {
                var func,
                    funcName;

                // make constant and payable backwards compatible
                method.constant = (method.stateMutability === "view" || method.stateMutability === "pure" || method.constant);
                method.payable = (method.stateMutability === "payable" || method.payable);


                if (method.name) {
                    funcName = utils._jsonInterfaceMethodToString(method);
                }


                // function
                if (method.type === 'function') {
                    method.signature = abi.encodeFunctionSignature(funcName);
                    func = _this._createTxObject.bind({
                        method: method,
                        parent: _this
                    });


                    // add method only if not one already exists
                    if(!_this.methods[method.name]) {
                        _this.methods[method.name] = func;
                    } else {
                        var cascadeFunc = _this._createTxObject.bind({
                            method: method,
                            parent: _this,
                            nextMethod: _this.methods[method.name]
                        });
                        _this.methods[method.name] = cascadeFunc;
                    }

                    // definitely add the method based on its signature
                    _this.methods[method.signature] = func;

                    // add method by name
                    _this.methods[funcName] = func;


                // event
                } else if (method.type === 'event') {
                    method.signature = abi.encodeEventSignature(funcName);
                    var event = _this._on.bind(_this, method.signature);

                    // add method only if not already exists
                    if(!_this.events[method.name] || _this.events[method.name].name === 'bound ')
                        _this.events[method.name] = event;

                    // definitely add the method based on its signature
                    _this.events[method.signature] = event;

                    // add event by name
                    _this.events[funcName] = event;
                }


                return method;
            });

            // add allEvents
            _this.events.allEvents = _this._on.bind(_this, 'allevents');

            return _this._jsonInterface;
        },
        get: function(){
            return _this._jsonInterface;
        },
        enumerable: true
    });

    // get default account from the Class
    var defaultAccount = this.constructor.defaultAccount;
    var defaultBlock = this.constructor.defaultBlock || 'latest';

    Object.defineProperty(this, 'handleRevert', {
        get: function () {
            if (_this.options.handleRevert === false || _this.options.handleRevert === true) {
                return _this.options.handleRevert;
            }

            return this.constructor.handleRevert;
        },
        set: function (val) {
            _this.options.handleRevert = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultCommon', {
        get: function () {
            return _this.options.common || this.constructor.defaultCommon;
        },
        set: function (val) {
            _this.options.common = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultHardfork', {
        get: function () {
            return _this.options.hardfork || this.constructor.defaultHardfork;
        },
        set: function (val) {
            _this.options.hardfork = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultChain', {
        get: function () {
            return _this.options.chain || this.constructor.defaultChain;
        },
        set: function (val) {
            _this.options.chain = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'transactionPollingTimeout', {
        get: function () {
            if (_this.options.transactionPollingTimeout === 0) {
                return _this.options.transactionPollingTimeout;
            }

            return _this.options.transactionPollingTimeout || this.constructor.transactionPollingTimeout;
        },
        set: function (val) {
            _this.options.transactionPollingTimeout = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'transactionPollingInterval', {
        get: function () {
            if (_this.options.transactionPollingInterval === 0) {
                return _this.options.transactionPollingInterval;
            }

            return _this.options.transactionPollingInterval || this.constructor.transactionPollingInterval;
        },
        set: function (val) {
            _this.options.transactionPollingInterval = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'transactionConfirmationBlocks', {
        get: function () {
            if (_this.options.transactionConfirmationBlocks === 0) {
                return _this.options.transactionConfirmationBlocks;
            }

            return _this.options.transactionConfirmationBlocks || this.constructor.transactionConfirmationBlocks;
        },
        set: function (val) {
            _this.options.transactionConfirmationBlocks = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'transactionBlockTimeout', {
        get: function () {
            if (_this.options.transactionBlockTimeout === 0) {
                return _this.options.transactionBlockTimeout;
            }

            return _this.options.transactionBlockTimeout || this.constructor.transactionBlockTimeout;
        },
        set: function (val) {
            _this.options.transactionBlockTimeout = val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'blockHeaderTimeout', {
        get: function () {
            if (_this.options.blockHeaderTimeout === 0) {
                return _this.options.blockHeaderTimeout;
            }

            return _this.options.blockHeaderTimeout || this.constructor.blockHeaderTimeout;
        },
        set: function (val) {
            _this.options.blockHeaderTimeout = val;
        },
        enumerable: true
    });    
    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if(val) {
                defaultAccount = utils.toChecksumAddress(formatters.inputAddressFormatter(val));
            }

            return val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return defaultBlock;
        },
        set: function (val) {
            defaultBlock = val;

            return val;
        },
        enumerable: true
    });

    // properties
    this.methods = {};
    this.events = {};

    this._address = null;
    this._jsonInterface = [];

    // set getter/setter properties
    this.options.address = address;
    this.options.jsonInterface = jsonInterface;

};

/**
 * Sets the new provider, creates a new requestManager, registers the "data" listener on the provider and sets the
 * accounts module for the Contract class.
 *
 * @method setProvider
 *
 * @param {string|provider} provider
 * @param {Accounts} accounts
 *
 * @returns void
 */
Contract.setProvider = function(provider, accounts) {
    // Contract.currentProvider = provider;
    core.packageInit(this, [provider]);

    this._ethAccounts = accounts;
};


/**
 * Get the callback and modify the array if necessary
 *
 * @method _getCallback
 * @param {Array} args
 * @return {Function} the callback
 */
Contract.prototype._getCallback = function getCallback(args) {
    if (args && !!args[args.length- 1 ] && typeof args[args.length - 1] === 'function') {
        return args.pop(); // modify the args array!
    }
};

/**
 * Checks that no listener with name "newListener" or "removeListener" is added.
 *
 * @method _checkListener
 * @param {String} type
 * @param {String} event
 * @return {Object} the contract instance
 */
Contract.prototype._checkListener = function(type, event){
    if(event === type) {
        throw errors.ContractReservedEventError(type);
    }
};


/**
 * Use default values, if options are not available
 *
 * @method _getOrSetDefaultOptions
 * @param {Object} options the options gived by the user
 * @return {Object} the options with gaps filled by defaults
 */
Contract.prototype._getOrSetDefaultOptions = function getOrSetDefaultOptions(options) {
    var gasPrice = options.gasPrice ? String(options.gasPrice): null;
    var from = options.from ? utils.toChecksumAddress(formatters.inputAddressFormatter(options.from)) : null;

    options.data = options.data || this.options.data;

    options.from = from || this.options.from;
    options.gasPrice = gasPrice || this.options.gasPrice;
    options.gas = options.gas || options.gasLimit || this.options.gas;

    // TODO replace with only gasLimit?
    delete options.gasLimit;

    return options;
};


/**
 * Should be used to encode indexed params and options to one final object
 *
 * @method _encodeEventABI
 * @param {Object} event
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

    // use given topics
    if(Array.isArray(options.topics)) {
        result.topics = options.topics;

    // create topics based on filter
    } else {

        result.topics = [];

        // add event signature
        if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
            result.topics.push(event.signature);
        }

        // add event topics (indexed arguments)
        if (event.name !== 'ALLEVENTS') {
            var indexedTopics = event.inputs.filter(function (i) {
                return i.indexed === true;
            }).map(function (i) {
                var value = filter[i.name];
                if (!value) {
                    return null;
                }

                // TODO: https://github.com/ethereum/web3.js/issues/344
                // TODO: deal properly with components

                if (Array.isArray(value)) {
                    return value.map(function (v) {
                        return abi.encodeParameter(i.type, v);
                    });
                }
                return abi.encodeParameter(i.type, value);
            });

            result.topics = result.topics.concat(indexedTopics);
        }

        if(!result.topics.length)
            delete result.topics;
    }

    if(this.options.address) {
        result.address = this.options.address.toLowerCase();
    }

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
    var event = this;

    data.data = data.data || '';
    data.topics = data.topics || [];
    var result = formatters.outputLogFormatter(data);

    // if allEvents get the right event
    if(event.name === 'ALLEVENTS') {
        event = event.jsonInterface.find(function (intf) {
            return (intf.signature === data.topics[0]);
        }) || {anonymous: true};
    }

    // create empty inputs if none are present (e.g. anonymous events on allEvents)
    event.inputs = event.inputs || [];

    // Handle case where an event signature shadows the current ABI with non-identical
    // arg indexing. If # of topics doesn't match, event is anon.
    if (!event.anonymous){
        let indexedInputs = 0;
        event.inputs.forEach(input => input.indexed ? indexedInputs++ : null);

        if (indexedInputs > 0 && (data.topics.length !== indexedInputs + 1)){
            event = {
                anonymous: true,
                inputs: []
            };
        }
    }

    var argTopics = event.anonymous ? data.topics : data.topics.slice(1);

    result.returnValues = abi.decodeLog(event.inputs, data.data, argTopics);
    delete result.returnValues.__length__;

    // add name
    result.event = event.name;

    // add signature
    result.signature = (event.anonymous || !data.topics[0]) ? null : data.topics[0];

    // move the data and topics to "raw"
    result.raw = {
        data: result.data,
        topics: result.topics
    };
    delete result.data;
    delete result.topics;


    return result;
};

/**
 * Encodes an ABI for a method, including signature or the method.
 * Or when constructor encodes only the constructor parameters.
 *
 * @method _encodeMethodABI
 * @param {Mixed} args the arguments to encode
 * @param {String} the encoded ABI
 */
Contract.prototype._encodeMethodABI = function _encodeMethodABI() {
    var methodSignature = this._method.signature,
        args = this.arguments || [];

    var signature = false,
        paramsABI = this._parent.options.jsonInterface.filter(function (json) {
            return ((methodSignature === 'constructor' && json.type === methodSignature) ||
                ((json.signature === methodSignature || json.signature === methodSignature.replace('0x','') || json.name === methodSignature) && json.type === 'function'));
        }).map(function (json) {
            var inputLength = (Array.isArray(json.inputs)) ? json.inputs.length : 0;

            if (inputLength !== args.length) {
                throw new Error('The number of arguments is not matching the methods required number. You need to pass '+ inputLength +' arguments.');
            }

            if (json.type === 'function') {
                signature = json.signature;
            }
            return Array.isArray(json.inputs) ? json.inputs : [];
        }).map(function (inputs) {
            return abi.encodeParameters(inputs, args).replace('0x','');
        })[0] || '';

    // return constructor
    if(methodSignature === 'constructor') {
        if(!this._deployData)
            throw new Error('The contract has no contract data option set. This is necessary to append the constructor parameters.');

        if(!this._deployData.startsWith('0x')) {
            this._deployData = '0x' + this._deployData;
        }

        return this._deployData + paramsABI;

    }

    // return method
    var returnValue = (signature) ? signature + paramsABI : paramsABI;

    if(!returnValue) {
        throw new Error('Couldn\'t find a matching contract method named "'+ this._method.name +'".');
    }

    return returnValue;
};


/**
 * Decode method return values
 *
 * @method _decodeMethodReturn
 * @param {Array} outputs
 * @param {String} returnValues
 * @return {Object} decoded output return values
 */
Contract.prototype._decodeMethodReturn = function (outputs, returnValues) {
    if (!returnValues) {
        return null;
    }

    returnValues = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
    var result = abi.decodeParameters(outputs, returnValues);

    if (result.__length__ === 1) {
        return result[0];
    }

    delete result.__length__;
    return result;
};


/**
 * Deploys a contract and fire events based on its state: transactionHash, receipt
 *
 * All event listeners will be removed, once the last possible event is fired ("error", or "receipt")
 *
 * @method deploy
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} EventEmitter possible events are "error", "transactionHash" and "receipt"
 */
Contract.prototype.deploy = function(options, callback){

    options = options || {};

    options.arguments = options.arguments || [];
    options = this._getOrSetDefaultOptions(options);


    // throw error, if no "data" is specified
    if(!options.data) {
        if (typeof callback === 'function'){
            return callback(errors.ContractMissingDeployDataError());
        }
        throw errors.ContractMissingDeployDataError();
    }

    var constructor = this.options.jsonInterface.find((method) => {
        return (method.type === 'constructor');
    }) || {};
    constructor.signature = 'constructor';

    return this._createTxObject.apply({
        method: constructor,
        parent: this,
        deployData: options.data,
        _ethAccounts: this.constructor._ethAccounts
    }, options.arguments);

};

/**
 * Gets the event signature and outputFormatters
 *
 * @method _generateEventOptions
 * @param {Object} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event options object
 */
Contract.prototype._generateEventOptions = function() {
    var args = Array.prototype.slice.call(arguments);

    // get the callback
    var callback = this._getCallback(args);

    // get the options
    var options = (!!args[args.length - 1] && typeof args[args.length - 1]) === 'object' ? args.pop() : {};

    var eventName = (typeof args[0] === 'string') ? args[0] : 'allevents';
    var event = (eventName.toLowerCase() === 'allevents') ? {
            name: 'ALLEVENTS',
            jsonInterface: this.options.jsonInterface
        } : this.options.jsonInterface.find(function (json) {
            return (json.type === 'event' && (json.name === eventName || json.signature === '0x'+ eventName.replace('0x','')));
        });

    if (!event) {
        throw errors.ContractEventDoesNotExistError(eventName);
    }

    if (!utils.isAddress(this.options.address)) {
        throw errors.ContractNoAddressDefinedError();
    }

    return {
        params: this._encodeEventABI(event, options),
        event: event,
        callback: callback
    };
};

/**
 * Adds event listeners and creates a subscription, and remove it once its fired.
 *
 * @method clone
 * @return {Object} the event subscription
 */
Contract.prototype.clone = function() {
    return new this.constructor(this.options.jsonInterface, this.options.address, this.options);
};


/**
 * Adds event listeners and creates a subscription, and remove it once its fired.
 *
 * @method once
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event subscription
 */
Contract.prototype.once = function(event, options, callback) {
    var args = Array.prototype.slice.call(arguments);

    // get the callback
    callback = this._getCallback(args);

    if (!callback) {
        throw errors.ContractOnceRequiresCallbackError();
    }

    // don't allow fromBlock
    if (options)
        delete options.fromBlock;

    // don't return as once shouldn't provide "on"
    this._on(event, options, function (err, res, sub) {
        sub.unsubscribe();
        if(typeof callback === 'function'){
            callback(err, res, sub);
        }
    });

    return undefined;
};

/**
 * Adds event listeners and creates a subscription.
 *
 * @method _on
 *
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 *
 * @return {Object} the event subscription
 */
Contract.prototype._on = function(){
    var subOptions = this._generateEventOptions.apply(this, arguments);

    if (subOptions.params && subOptions.params.toBlock) {
        delete subOptions.params.toBlock;
        console.warn('Invalid option: toBlock. Use getPastEvents for specific range.');
    }

    // prevent the event "newListener" and "removeListener" from being overwritten
    this._checkListener('newListener', subOptions.event.name);
    this._checkListener('removeListener', subOptions.event.name);

    // TODO check if listener already exists? and reuse subscription if options are the same.

    // create new subscription
    var subscription = new Subscription({
        subscription: {
            params: 1,
            inputFormatter: [formatters.inputLogFormatter],
            outputFormatter: this._decodeEventABI.bind(subOptions.event),
            // DUBLICATE, also in web3-eth
            subscriptionHandler: function (output) {
                if(output.removed) {
                    this.emit('changed', output);
                } else {
                    this.emit('data', output);
                }

                if (typeof this.callback === 'function') {
                    this.callback(null, output, this);
                }
            }
        },
        type: 'eth',
        requestManager: this._requestManager
    });

    subscription.subscribe('logs', subOptions.params, subOptions.callback || function () {});

    return subscription;
};

/**
 * Get past events from contracts
 *
 * @method getPastEvents
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the promievent
 */
Contract.prototype.getPastEvents = function(){
    var subOptions = this._generateEventOptions.apply(this, arguments);

    var getPastLogs = new Method({
        name: 'getPastLogs',
        call: 'eth_getLogs',
        params: 1,
        inputFormatter: [formatters.inputLogFormatter],
        outputFormatter: this._decodeEventABI.bind(subOptions.event)
    });
    getPastLogs.setRequestManager(this._requestManager);
    var call = getPastLogs.buildCall();

    getPastLogs = null;

    return call(subOptions.params, subOptions.callback);
};


/**
 * returns the an object with call, send, estimate functions
 *
 * @method _createTxObject
 * @returns {Object} an object with functions to call the methods
 */
Contract.prototype._createTxObject =  function _createTxObject(){
    var args = Array.prototype.slice.call(arguments);
    var txObject = {};

    if(this.method.type === 'function') {

        txObject.call = this.parent._executeMethod.bind(txObject, 'call');
        txObject.call.request = this.parent._executeMethod.bind(txObject, 'call', true); // to make batch requests

    }

    txObject.send = this.parent._executeMethod.bind(txObject, 'send');
    txObject.send.request = this.parent._executeMethod.bind(txObject, 'send', true); // to make batch requests
    txObject.encodeABI = this.parent._encodeMethodABI.bind(txObject);
    txObject.estimateGas = this.parent._executeMethod.bind(txObject, 'estimate');
    txObject.createAccessList = this.parent._executeMethod.bind(txObject, 'createAccessList');

    if (args && this.method.inputs && args.length !== this.method.inputs.length) {
        if (this.nextMethod) {
            return this.nextMethod.apply(null, args);
        }
        throw errors.InvalidNumberOfParams(args.length, this.method.inputs.length, this.method.name);
    }

    txObject.arguments = args || [];
    txObject._method = this.method;
    txObject._parent = this.parent;
    txObject._ethAccounts = this.parent.constructor._ethAccounts || this._ethAccounts;

    if(this.deployData) {
        txObject._deployData = this.deployData;
    }

    return txObject;
};


/**
 * Generates the options for the execute call
 *
 * @method _processExecuteArguments
 * @param {Array} args
 * @param {Promise} defer
 */
Contract.prototype._processExecuteArguments = function _processExecuteArguments(args, defer) {
    var processedArgs = {};

    processedArgs.type = args.shift();

    // get the callback
    processedArgs.callback = this._parent._getCallback(args);

    // get block number to use for call
    if(processedArgs.type === 'call' && args[args.length - 1] !== true && (typeof args[args.length - 1] === 'string' || isFinite(args[args.length - 1])))
        processedArgs.defaultBlock = args.pop();

    // get the options
    processedArgs.options = (!!args[args.length - 1] && typeof args[args.length - 1]) === 'object' ? args.pop() : {};

    // get the generateRequest argument for batch requests
    processedArgs.generateRequest = (args[args.length - 1] === true)? args.pop() : false;

    processedArgs.options = this._parent._getOrSetDefaultOptions(processedArgs.options);
    processedArgs.options.data = this.encodeABI();

    // add contract address
    if(!this._deployData && !utils.isAddress(this._parent.options.address))
        throw errors.ContractNoAddressDefinedError();

    if(!this._deployData)
        processedArgs.options.to = this._parent.options.address;

    // return error, if no "data" is specified
    if(!processedArgs.options.data)
        return utils._fireError(new Error('Couldn\'t find a matching contract method, or the number of parameters is wrong.'), defer.eventEmitter, defer.reject, processedArgs.callback);

    return processedArgs;
};

/**
 * Executes a call, transact or estimateGas on a contract function
 *
 * @method _executeMethod
 * @param {String} type the type this execute function should execute
 * @param {Boolean} makeRequest if true, it simply returns the request parameters, rather than executing it
 */
Contract.prototype._executeMethod = function _executeMethod(){
    var _this = this,
        args = this._parent._processExecuteArguments.call(this, Array.prototype.slice.call(arguments), defer),
        defer = promiEvent((args.type !== 'send')),
        ethAccounts = _this.constructor._ethAccounts || _this._ethAccounts;

    // simple return request for batch requests
    if(args.generateRequest) {

        var payload = {
            params: [formatters.inputCallFormatter.call(this._parent, args.options)],
            callback: args.callback
        };

        if(args.type === 'call') {
            payload.params.push(formatters.inputDefaultBlockNumberFormatter.call(this._parent, args.defaultBlock));
            payload.method = 'eth_call';
            payload.format = this._parent._decodeMethodReturn.bind(null, this._method.outputs);
        } else {
            payload.method = 'eth_sendTransaction';
        }

        return payload;

    }

    switch (args.type) {
        case 'createAccessList':

            // return error, if no "from" is specified
            if(!utils.isAddress(args.options.from)) {
                return utils._fireError(errors.ContractNoFromAddressDefinedError(), defer.eventEmitter, defer.reject, args.callback);
            }

            var createAccessList = (new Method({
                name: 'createAccessList',
                call: 'eth_createAccessList',
                params: 2,
                inputFormatter: [formatters.inputTransactionFormatter, formatters.inputDefaultBlockNumberFormatter],
                requestManager: _this._parent._requestManager,
                accounts: ethAccounts, // is eth.accounts (necessary for wallet signing)
                defaultAccount: _this._parent.defaultAccount,
                defaultBlock: _this._parent.defaultBlock
            })).createFunction();

            return createAccessList(args.options, args.callback);

        case 'estimate':

            var estimateGas = (new Method({
                name: 'estimateGas',
                call: 'eth_estimateGas',
                params: 1,
                inputFormatter: [formatters.inputCallFormatter],
                outputFormatter: utils.hexToNumber,
                requestManager: _this._parent._requestManager,
                accounts: ethAccounts, // is eth.accounts (necessary for wallet signing)
                defaultAccount: _this._parent.defaultAccount,
                defaultBlock: _this._parent.defaultBlock
            })).createFunction();

            return estimateGas(args.options, args.callback);

        case 'call':

            // TODO check errors: missing "from" should give error on deploy and send, call ?

            var call = (new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter],
                // add output formatter for decoding
                outputFormatter: function (result) {
                    return _this._parent._decodeMethodReturn(_this._method.outputs, result);
                },
                requestManager: _this._parent._requestManager,
                accounts: ethAccounts, // is eth.accounts (necessary for wallet signing)
                defaultAccount: _this._parent.defaultAccount,
                defaultBlock: _this._parent.defaultBlock,
                handleRevert: _this._parent.handleRevert,
                abiCoder: abi
            })).createFunction();

            return call(args.options, args.defaultBlock, args.callback);

        case 'send':

            // return error, if no "from" is specified
            if(!utils.isAddress(args.options.from)) {
                return utils._fireError(errors.ContractNoFromAddressDefinedError(), defer.eventEmitter, defer.reject, args.callback);
            }

            if (typeof this._method.payable === 'boolean' && !this._method.payable && args.options.value && args.options.value > 0) {
                return utils._fireError(new Error('Can not send value to non-payable contract method or constructor'), defer.eventEmitter, defer.reject, args.callback);
            }


            // make sure receipt logs are decoded
            var extraFormatters = {
                receiptFormatter: function (receipt) {
                    if (Array.isArray(receipt.logs)) {

                        // decode logs
                        var events = receipt.logs.map((log) => {
                            return _this._parent._decodeEventABI.call({
                                name: 'ALLEVENTS',
                                jsonInterface: _this._parent.options.jsonInterface
                            }, log);
                        });

                        // make log names keys
                        receipt.events = {};
                        var count = 0;
                        events.forEach(function (ev) {
                            if (ev.event) {
                                // if > 1 of the same event, don't overwrite any existing events
                                if (receipt.events[ev.event]) {
                                    if (Array.isArray(receipt.events[ ev.event ])) {
                                        receipt.events[ ev.event ].push(ev);
                                    } else {
                                        receipt.events[ev.event] = [receipt.events[ev.event], ev];
                                    }
                                } else {
                                    receipt.events[ ev.event ] = ev;
                                }
                            } else {
                                receipt.events[count] = ev;
                                count++;
                            }
                        });

                        delete receipt.logs;
                    }
                    return receipt;
                },
                contractDeployFormatter: function (receipt) {
                    var newContract = _this._parent.clone();
                    newContract.options.address = receipt.contractAddress;
                    return newContract;
                }
            };

            var sendTransaction = (new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter],
                requestManager: _this._parent._requestManager,
                accounts: _this.constructor._ethAccounts || _this._ethAccounts, // is eth.accounts (necessary for wallet signing)
                defaultAccount: _this._parent.defaultAccount,
                defaultBlock: _this._parent.defaultBlock,
                transactionBlockTimeout: _this._parent.transactionBlockTimeout,
                transactionConfirmationBlocks: _this._parent.transactionConfirmationBlocks,
                transactionPollingTimeout: _this._parent.transactionPollingTimeout,
                transactionPollingInterval: _this._parent.transactionPollingInterval,
                defaultCommon: _this._parent.defaultCommon,
                defaultChain: _this._parent.defaultChain,
                defaultHardfork: _this._parent.defaultHardfork,
                handleRevert: _this._parent.handleRevert,
                extraFormatters: extraFormatters,
                abiCoder: abi
            })).createFunction();

            return sendTransaction(args.options, args.callback);

        default:
            throw new Error('Method "' + args.type + '" not implemented.');

    }


};

module.exports = Contract;
