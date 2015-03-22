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
 * @file eth.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

/**
 * Web3
 * 
 * @module web3
 */

/**
 * Eth methods and properties
 *
 * An example method object can look as follows:
 *
 *      {
 *      name: 'getBlock',
 *      call: blockCall,
 *      outputFormatter: formatters.outputBlockFormatter,
 *      inputFormatter: [ // can be a formatter funciton or an array of functions. Where each item in the array will be used for one parameter
 *           utils.toHex, // formats paramter 1
 *           function(param){ if(!param) return false; } // formats paramter 2
 *         ]
 *       },
 *
 * @class [web3] eth
 * @constructor
 */

"use strict";

var formatters = require('./formatters');
var utils = require('../utils/utils');


var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
};

/// @returns an array of objects describing web3.eth api methods
var methods = [{ 
    name: 'getBalance', 
    call: 'eth_getBalance', 
    addDefaultblock: 2,
    outputFormatter: formatters.inputNumberFormatter
}, { 
    name: 'getStorage', 
    call: 'eth_getStorage', 
    addDefaultblock: 2
}, { 
    name: 'getStorageAt',
    call: 'eth_getStorageAt',
    addDefaultblock: 3,
    inputFormatter: utils.toHex
}, { 
    name: 'getCode',
    call: 'eth_getCode',
    addDefaultblock: 2
}, { 
    name: 'getBlock', 
    call: blockCall,
    outputFormatter: formatters.outputBlockFormatter,
    inputFormatter: formatters.inputBlockFormatter
}, {
    name: 'getUncle',
    call: uncleCall,
    outputFormatter: formatters.outputBlockFormatter,
    inputFormatter: formatters.inputUncleFormatter
}, {
    name: 'getCompilers',
    call: 'eth_getCompilers'
}, { 
    name: 'getBlockTransactionCount',
    call: getBlockTransactionCountCall,
    outputFormatter: utils.toDecimal,
    inputFormatter: utils.toHex 
}, { 
    name: 'getBlockUncleCount',
    call: uncleCountCall,
    outputFormatter: utils.toDecimal,
    inputFormatter: utils.toHex
}, { 
    name: 'getTransaction',
    call: 'eth_getTransactionByHash',
    outputFormatter: formatters.outputTransactionFormatter
}, {
    name: 'getTransactionFromBlock',
    call: transactionFromBlockCall,
    outputFormatter: formatters.outputTransactionFormatter,
    inputFormatter: utils.toHex
}, {
    name: 'getTransactionCount',
    call: 'eth_getTransactionCount',
    addDefaultblock: 2,
    outputFormatter: utils.toDecimal
}, { 
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    inputFormatter: formatters.inputTransactionFormatter 
}, { 
    name: 'call',
    call: 'eth_call',
    addDefaultblock: 2,
    inputFormatter: formatters.inputCallFormatter
}, {
    name: 'compile.solidity',
    call: 'eth_compileSolidity'
}, {
    name: 'compile.lll',
    call: 'eth_compileLLL',
    inputFormatter: utils.toHex
}, {
    name: 'compile.serpent',
    call: 'eth_compileSerpent',
    inputFormatter: utils.toHex
}, {
    name: 'flush',
    call: 'eth_flush'
},

    // deprecated methods
    { name: 'balanceAt', call: 'eth_balanceAt', newMethod: 'eth.getBalance' },
    { name: 'stateAt', call: 'eth_stateAt', newMethod: 'eth.getStorageAt' },
    { name: 'storageAt', call: 'eth_storageAt', newMethod: 'eth.getStorage' },
    { name: 'countAt', call: 'eth_countAt', newMethod: 'eth.getTransactionCount' },
    { name: 'codeAt', call: 'eth_codeAt', newMethod: 'eth.getCode' },
    { name: 'transact', call: 'eth_transact', newMethod: 'eth.sendTransaction' },
    { name: 'block', call: blockCall, newMethod: 'eth.getBlock' },
    { name: 'transaction', call: transactionFromBlockCall, newMethod: 'eth.getTransaction' },
    { name: 'uncle', call: uncleCall, newMethod: 'eth.getUncle' },
    { name: 'compilers', call: 'eth_compilers', newMethod: 'eth.getCompilers' },
    { name: 'solidity', call: 'eth_solidity', newMethod: 'eth.compile.solidity' },
    { name: 'lll', call: 'eth_lll', newMethod: 'eth.compile.lll' },
    { name: 'serpent', call: 'eth_serpent', newMethod: 'eth.compile.serpent' },
    { name: 'transactionCount', call: getBlockTransactionCountCall, newMethod: 'eth.getBlockTransactionCount' },
    { name: 'uncleCount', call: uncleCountCall, newMethod: 'eth.getBlockUncleCount' },
    { name: 'logs', call: 'eth_logs' }
];

/// @returns an array of objects describing web3.eth api properties
var properties = [
    { name: 'coinbase', getter: 'eth_coinbase'},
    { name: 'mining', getter: 'eth_mining'},
    { name: 'gasPrice', getter: 'eth_gasPrice', outputFormatter: formatters.inputNumberFormatter},
    { name: 'accounts', getter: 'eth_accounts' },
    { name: 'blockNumber', getter: 'eth_blockNumber', outputFormatter: utils.toDecimal},

    // deprecated properties
    { name: 'listening', getter: 'net_listening', setter: 'eth_setListening', newProperty: 'net.listening'},
    { name: 'peerCount', getter: 'net_peerCount', newProperty: 'net.peerCount'},
    { name: 'number', getter: 'eth_number', newProperty: 'eth.blockNumber'}
];

module.exports = {
    methods: methods,
    properties: properties
};

