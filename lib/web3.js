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
var Filter = require('./web3/filter');
var utils = require('./utils/utils');
var formatters = require('./web3/formatters');
var RequestManager = require('./web3/requestmanager');
var c = require('./utils/config');
var Method = require('./web3/method');
var Property = require('./web3/property');

/// @returns an array of objects describing web3 api methods
var web3Methods = function () {
    var sha3 = new Method({
        name: 'sha3',
        call: 'web3_sha3',
        params: 1
    });

    return [sha3];
};

var web3Properties = [
    new Property({
        name: 'version.client',
        getter: 'web3_clientVersion'
    }),
    new Property({
        name: 'version.network',
        getter: 'net_version'
    })
];

/// creates methods in a given object based on method description on input
/// setups api calls for these methods
var setupMethods = function (obj, methods) {
    methods.forEach(function (method) {
        method.attachToObject(obj);
    });
};

/// creates properties in a given object based on properties description on input
/// setups api calls for these properties
var setupProperties = function (obj, properties) {
    properties.forEach(function (property) {
        property.attachToObject(obj);
    });
};

/*jshint maxparams:4 */
//var startPolling = function (method, id, callback, uninstall) {
    //RequestManager.getInstance().startPolling({
        //method: method, 
        //params: [id]
    //}, id,  callback, uninstall); 
//};
//[>jshint maxparams:3 <]

//var stopPolling = function (id) {
    //RequestManager.getInstance().stopPolling(id);
//};

//var ethWatch = {
    //startPolling: startPolling.bind(null, 'eth_getFilterChanges'), 
    //stopPolling: stopPolling
//};

//var shhWatch = {
    //startPolling: startPolling.bind(null, 'shh_getFilterChanges'), 
    //stopPolling: stopPolling
//};

/// setups web3 object, and it's in-browser executed methods
var web3 = {

    version: {
        api: version.version
    },

    providers: {},

    setProvider: function (provider) {
        RequestManager.getInstance().setProvider(provider);
    },
    
    /// Should be called to reset state of web3 object
    /// Resets everything except manager
    reset: function () {
        RequestManager.getInstance().reset(); 
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
        /// @param filter may be a string, object or event
        /// @param eventParams is optional, this is an object with optional event eventParams params
        /// @param options is optional, this is an object with optional event options ('max'...)
        /*jshint maxparams:4 */
        filter: function (fil, eventParams, options) {

            // if its event, treat it differently
            if (fil._isEvent)
                return fil(eventParams, options);

            return new Filter(fil, watches.eth(), formatters.outputLogFormatter);
        },
        /*jshint maxparams:3 */
    },

    /// db object prototype
    db: {},

    /// shh object prototype
    shh: {
        /// @param filter may be a string, object or event
        filter: function (fil) {
            return new Filter(fil, watches.shh(), formatters.outputPostFormatter);
        },
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
setupMethods(web3, web3Methods());
setupProperties(web3, web3Properties);
setupMethods(web3.net, net.methods);
setupProperties(web3.net, net.properties);
setupMethods(web3.eth, eth.methods);
setupProperties(web3.eth, eth.properties);
setupMethods(web3.db, db.methods);
setupMethods(web3.shh, shh.methods);
//setupMethods(ethWatch, watches.eth());
//setupMethods(shhWatch, watches.shh());

module.exports = web3;

