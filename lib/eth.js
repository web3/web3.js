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
/** @file eth.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var formatters = require('./formatters');


var blockCall = function (args) {
    return typeof args[0] === "string" ? "eth_blockByHash" : "eth_blockByNumber";
};

var transactionCall = function (args) {
    return typeof args[0] === "string" ? 'eth_transactionByHash' : 'eth_transactionByNumber';
};

var uncleCall = function (args) {
    return typeof args[0] === "string" ? 'eth_uncleByHash' : 'eth_uncleByNumber';
};

var transactionCountCall = function (args) {
    return typeof args[0] === "string" ? 'eth_transactionCountByHash' : 'eth_transactionCountByNumber';
};

var uncleCountCall = function (args) {
    return typeof args[0] === "string" ? 'eth_uncleCountByHash' : 'eth_uncleCountByNumber';
};

/// @returns an array of objects describing web3.eth api methods
var methods = [
    { name: 'getBalance', call: 'eth_balanceAt', outputFormatter: formatters.convertToBigNumber},
    { name: 'getState', call: 'eth_stateAt' },
    { name: 'getStorage', call: 'eth_storageAt' },
    { name: 'getTransactionCount', call: 'eth_countAt'},
    { name: 'getCode', call: 'eth_codeAt' },
    { name: 'sendTransaction', call: 'eth_transact', inputFormatter: formatters.inputTransactionFormatter },
    { name: 'call', call: 'eth_call' },
    { name: 'getBlock', call: blockCall },
    { name: 'getTransaction', call: transactionCall },
    { name: 'getUncle', call: uncleCall },
    { name: 'getCompilers', call: 'eth_compilers' },
    { name: 'flush', call: 'eth_flush' },
    { name: 'compile.solidity', call: 'eth_solidity' },
    { name: 'compile.lll', call: 'eth_lll' },
    { name: 'compile.serpent', call: 'eth_serpent' },
    { name: 'getBlockTransactionCount', call: transactionCountCall },
    { name: 'getBlockUncleCount', call: uncleCountCall },

    // deprecated methods
    { name: 'balanceAt', call: 'eth_balanceAt', newMethod: 'getBalance' },
    { name: 'stateAt', call: 'eth_stateAt', newMethod: 'getState' },
    { name: 'storageAt', call: 'eth_storageAt', newMethod: 'getStorage' },
    { name: 'countAt', call: 'eth_countAt', newMethod: 'getTransactionCount' },
    { name: 'codeAt', call: 'eth_codeAt', newMethod: 'getCode' },
    { name: 'transact', call: 'eth_transact', newMethod: 'sendTransaction' },
    { name: 'block', call: blockCall, newMethod: 'getBlock' },
    { name: 'transaction', call: transactionCall, newMethod: 'getTransaction' },
    { name: 'uncle', call: uncleCall, newMethod: 'getUncle' },
    { name: 'compilers', call: 'eth_compilers', newMethod: 'getCompilers' },
    { name: 'solidity', call: 'eth_solidity', newMethod: 'compile.solidity' },
    { name: 'lll', call: 'eth_lll', newMethod: 'compile.lll' },
    { name: 'serpent', call: 'eth_serpent', newMethod: 'compile.serpent' },
    { name: 'transactionCount', call: transactionCountCall, newMethod: 'getBlockTransactionCount' },
    { name: 'uncleCount', call: uncleCountCall, newMethod: 'getBlockUncleCount' },
    { name: 'logs', call: 'eth_logs' }
];

/// @returns an array of objects describing web3.eth api properties
var properties = [
    { name: 'coinbase', getter: 'eth_coinbase', setter: 'eth_setCoinbase' },
    { name: 'listening', getter: 'eth_listening', setter: 'eth_setListening' },
    { name: 'mining', getter: 'eth_mining', setter: 'eth_setMining' },
    { name: 'gasPrice', getter: 'eth_gasPrice', outputFormatter: formatters.convertToBigNumber},
    { name: 'accounts', getter: 'eth_accounts' },
    { name: 'peerCount', getter: 'eth_peerCount' },
    { name: 'defaultBlock', getter: 'eth_defaultBlock', setter: 'eth_setDefaultBlock' },
    { name: 'blockNumber', getter: 'eth_number'},

    // deprecated properties
    { name: 'number', getter: 'eth_number', newProperty: 'blockNumber'}
];


module.exports = {
    methods: methods,
    properties: properties
};

