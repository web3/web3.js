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
/** @file web3.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var version = require('./version.json');
var net = require('./web3/net');
var eth = require('./web3/eth');
var db = require('./web3/db');
var shh = require('./web3/shh');
var watches = require('./web3/watches');
var filter = require('./web3/filter');
var utils = require('./utils/utils');
var formatters = require('./solidity/formatters');
var requestManager = require('./web3/requestmanager');
var c              = require('./utils/config');

/// @returns an array of objects describing web3 api methods
var web3Methods = [
    { name: 'sha3', call: 'web3_sha3', inputFormatter: utils.toHex },
];
var web3Properties = [
    { name: 'version.client', getter: 'web3_clientVersion' },
    { name: 'version.network', getter: 'net_version' }
];

/// creates methods in a given object based on method description on input
/// setups api calls for these methods
var setupMethods = function (obj, methods) {
    methods.forEach(function (method) {
        // allow for object methods 'myObject.method'
        var objectMethods = method.name.split('.'),
            callFunction = function () {
                /*jshint maxcomplexity:8 */

                var callback = null,
                    args = Array.prototype.slice.call(arguments),
                    call = typeof method.call === 'function' ? method.call(args) : method.call;

                // get the callback if one is available
                if (typeof args[args.length - 1] === 'function') {
                    callback = args[args.length - 1];
                    Array.prototype.pop.call(args);
                }

                // add the defaultBlock if not given
                if (method.addDefaultblock) {
                    if (args.length !== method.addDefaultblock)
                        Array.prototype.push.call(args, (isFinite(c.ETH_DEFAULTBLOCK) ? utils.fromDecimal(c.ETH_DEFAULTBLOCK) : c.ETH_DEFAULTBLOCK));
                    else
                        args[args.length - 1] = isFinite(args[args.length - 1]) ? utils.fromDecimal(args[args.length - 1]) : args[args.length - 1];
                }

                // show deprecated warning
                if (method.newMethod)
                    console.warn('This method is deprecated please use web3.' + method.newMethod + '() instead.');

                return web3.manager.send({
                    method: call,
                    params: args,
                    outputFormatter: method.outputFormatter,
                    inputFormatter: method.inputFormatter,
                    addDefaultblock: method.addDefaultblock
                }, callback);
            };

        if (objectMethods.length > 1) {
            if (!obj[objectMethods[0]])
                obj[objectMethods[0]] = {};

            obj[objectMethods[0]][objectMethods[1]] = callFunction;

        } else {

            obj[objectMethods[0]] = callFunction;
        }
    });
};

/// creates properties in a given object based on properties description on input
/// setups api calls for these properties
var setupProperties = function (obj, properties) {
    properties.forEach(function (property) {
        var objectProperties = property.name.split('.'),
            proto = {};

        proto.get = function () {

            // show deprecated warning
            if (property.newProperty)
                console.warn('This property is deprecated please use web3.' + property.newProperty + ' instead.');

            return web3.manager.send({
                method: property.getter,
                outputFormatter: property.outputFormatter
            });
        };

        if (property.setter) {
            proto.set = function (val) {

                // show deprecated warning
                if (property.newProperty)
                    console.warn('This property is deprecated please use web3.' + property.newProperty + ' instead.');

                return web3.manager.send({
                    method: property.setter,
                    params: [val],
                    inputFormatter: property.inputFormatter
                });
            };
        }

        proto.enumerable = !property.newProperty;

        if(objectProperties.length > 1) {
            if(!obj[objectProperties[0]])
                obj[objectProperties[0]] = {};

            Object.defineProperty(obj[objectProperties[0]], objectProperties[1], proto);        
        } else
            Object.defineProperty(obj, property.name, proto);
    });
};

/*jshint maxparams:4 */
var startPolling = function (method, id, callback, uninstall) {
    web3.manager.startPolling({
        method: method,
        params: [id]
    }, id, callback, uninstall);
};
/*jshint maxparams:3 */

var stopPolling = function (id) {
    web3.manager.stopPolling(id);
};

var ethWatch = {
    startPolling: startPolling.bind(null, 'eth_getFilterChanges'),
    stopPolling: stopPolling
};

var shhWatch = {
    startPolling: startPolling.bind(null, 'shh_getFilterChanges'),
    stopPolling: stopPolling
};

/// setups web3 object, and it's in-browser executed methods
var web3 = {

    version: {
        api: version.version
    },

    manager: requestManager(),
    providers: {},

    setProvider: function (provider) {
        web3.manager.setProvider(provider);
    },

    /// Should be called to reset state of web3 object
    /// Resets everything except manager
    reset: function () {
        web3.manager.reset();
    },

    /// @returns hex string of the input
    toHex: utils.toHex,

    /// @returns ascii string representation of hex value prefixed with 0x
    toAscii: utils.toAscii,

    /// @returns hex representation (prefixed by 0x) of ascii string
    fromAscii: utils.fromAscii,

    /// @returns decimal representaton of hex value prefixed by 0x
    toDecimal: utils.toDecimal,

    /// @returns hex representation (prefixed by 0x) of decimal value
    fromDecimal: utils.fromDecimal,

    /// @returns a BigNumber object
    toBigNumber: utils.toBigNumber,

    toWei: utils.toWei,
    fromWei: utils.fromWei,
    isAddress: utils.isAddress,

    // provide network information
    net: {
        // peerCount: 
    },


    /// eth object prototype
    eth: {
        // DEPRECATED
        contractFromAbi: function (abi) {
            console.warn('Initiating a contract like this is deprecated please use var MyContract = eth.contract(abi); new MyContract(address); instead.');

            return function (addr) {
                // Default to address of Config. TODO: rremove prior to genesis.
                addr = addr || '0xc6d9d2cd449a754c494264e1809c50e34d64562b';
                var ret = web3.eth.contract(addr, abi);
                ret.address = addr;
                return ret;
            };
        },

        /// @param filter may be a string, object or event
        /// @param eventParams is optional, this is an object with optional event eventParams params
        /// @param options is optional, this is an object with optional event options ('max'...)
        /*jshint maxparams:4 */
        filter: function (fil, eventParams, options) {

            // if its event, treat it differently
            if (fil._isEvent)
                return fil(eventParams, options);

            return filter(fil, ethWatch, formatters.outputLogFormatter);
        },
        // DEPRECATED
        watch: function (fil, eventParams, options) {
                console.warn('eth.watch() is deprecated please use eth.filter() instead.');
                return this.filter(fil, eventParams, options);
            }
            /*jshint maxparams:3 */
    },

    /// db object prototype
    db: {},

    /// shh object prototype
    shh: {
        /// @param filter may be a string, object or event
        filter: function (fil) {
            return filter(fil, shhWatch, formatters.outputPostFormatter);
        },
        // DEPRECATED
        watch: function (fil) {
            console.warn('shh.watch() is deprecated please use shh.filter() instead.');
            return this.filter(fil);
        }
    }
};


// ADD defaultblock
Object.defineProperty(web3.eth, 'defaultBlock', {
    get: function () {
        return c.ETH_DEFAULTBLOCK;
    },
    set: function (val) {
        c.ETH_DEFAULTBLOCK = val;
        return c.ETH_DEFAULTBLOCK;
    }
});


/// setups all api methods
setupMethods(web3, web3Methods);
setupProperties(web3, web3Properties);
setupMethods(web3.net, net.methods);
setupProperties(web3.net, net.properties);
setupMethods(web3.eth, eth.methods);
setupProperties(web3.eth, eth.properties);
setupMethods(web3.db, db.methods());
setupMethods(web3.shh, shh.methods());
setupMethods(ethWatch, watches.eth());
setupMethods(shhWatch, watches.shh());

module.exports = web3;
