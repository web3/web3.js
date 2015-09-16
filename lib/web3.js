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
var net = require('./web3/methods/net');
var eth = require('./web3/methods/eth');
var db = require('./web3/methods/db');
var shh = require('./web3/methods/shh');
var watches = require('./web3/methods/watches');
var Filter = require('./web3/filter');
var utils = require('./utils/utils');
var formatters = require('./web3/formatters');
var RequestManager = require('./web3/requestmanager');
var c = require('./utils/config');
var Property = require('./web3/property');
var Batch = require('./web3/batch');
var sha3 = require('./utils/sha3');
var Eth = require('./web3/methods/eth1');

var web3Properties = [
    new Property({
        name: 'version.client',
        getter: 'web3_clientVersion'
    }),
    new Property({
        name: 'version.network',
        getter: 'net_version',
        inputFormatter: utils.toDecimal
    }),
    new Property({
        name: 'version.ethereum',
        getter: 'eth_protocolVersion',
        inputFormatter: utils.toDecimal
    }),
    new Property({
        name: 'version.whisper',
        getter: 'shh_version',
        inputFormatter: utils.toDecimal
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

/// setups web3 object, and it's in-browser executed methods
function Web3(provider) {
    this.currentProvider = provider;
    this.requestManager = new RequestManager();
    this.requestManager.setProvider(provider);
    this.eth1 = new Eth(this);
}
Web3.prototype.providers = {};
Web3.prototype.version = {};
Web3.prototype.version.api = version.version;
Web3.prototype.eth = {};

/*jshint maxparams:4 */
Web3.prototype.eth.filter = function (fil, callback) {
    return new Filter(fil, watches.eth(), formatters.outputLogFormatter, callback);
};
/*jshint maxparams:3 */

Web3.prototype.shh = {};
Web3.prototype.shh.filter = function (fil, callback) {
    return new Filter(fil, watches.shh(), formatters.outputPostFormatter, callback);
};
Web3.prototype.net = {};
Web3.prototype.db = {};
Web3.prototype.setProvider = function (provider) {
    this.currentProvider = provider;
    RequestManager.getInstance().setProvider(provider);
};
Web3.prototype.isConnected = function(){
     return (this.currentProvider && this.currentProvider.isConnected());
};
Web3.prototype.reset = function () {
    RequestManager.getInstance().reset();
    c.defaultBlock = 'latest';
    c.defaultAccount = undefined;
};
Web3.prototype.toHex = utils.toHex;
Web3.prototype.toAscii = utils.toAscii;
Web3.prototype.toUtf8 = utils.toUtf8;
Web3.prototype.fromAscii = utils.fromAscii;
Web3.prototype.fromUtf8 = utils.fromUtf8;
Web3.prototype.toDecimal = utils.toDecimal;
Web3.prototype.fromDecimal = utils.fromDecimal;
Web3.prototype.toBigNumber = utils.toBigNumber;
Web3.prototype.toWei = utils.toWei;
Web3.prototype.fromWei = utils.fromWei;
Web3.prototype.isAddress = utils.isAddress;
Web3.prototype.isIBAN = utils.isIBAN;
Web3.prototype.sha3 = sha3;
Web3.prototype.createBatch = function () {
    return new Batch();
};

// ADD defaultblock
Object.defineProperty(Web3.prototype.eth, 'defaultBlock', {
    get: function () {
        return c.defaultBlock;
    },
    set: function (val) {
        c.defaultBlock = val;
        return val;
    }
});

Object.defineProperty(Web3.prototype.eth, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});


// EXTEND
Web3.prototype._extend = function(extension){
    /*jshint maxcomplexity: 6 */

    if(extension.property && !this[extension.property])
        this[extension.property] = {};

    setupMethods(this[extension.property] || this, extension.methods || []);
    setupProperties(this[extension.property] || this, extension.properties || []);
};
Web3.prototype._extend.formatters = formatters;
Web3.prototype._extend.utils = utils;
Web3.prototype._extend.Method = require('./web3/method');
Web3.prototype._extend.Property = require('./web3/property');


/// setups all api methods
setupProperties(Web3.prototype, web3Properties);
setupMethods(Web3.prototype.net, net.methods);
setupProperties(Web3.prototype.net, net.properties);
setupMethods(Web3.prototype.eth, eth.methods);
setupProperties(Web3.prototype.eth, eth.properties);
setupMethods(Web3.prototype.db, db.methods);
setupMethods(Web3.prototype.shh, shh.methods);

module.exports = Web3;

