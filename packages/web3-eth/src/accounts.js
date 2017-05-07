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
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var EthFP = require("ethfp");
var utils = require('web3-utils');
var helpers = require('web3-core-helpers');
var _ = require("underscore");

module.exports = {
  create: function(entropy) {
      return EthFP.Account.create(entropy || utils.randomHex(32));
  },
  privateToAccount: function(privateKey) {
      return EthFP.Account.fromPrivate(privateKey);
  },
  signTransaction: function(tx, privateKey, callback) {
      function signed(tx) {
          var transaction = {
              nonce: utils.numberToHex(tx.nonce),
              to: tx.to ? helpers.formatters.inputAddressFormatter(tx.to) : "0x",
              data: tx.data || "0x",
              value: utils.numberToHex(tx.value),
              gasLimit: utils.numberToHex(tx.gas),
              gasPrice: utils.numberToHex(tx.gasPrice),
              chainId: utils.numberToHex(tx.chainId)
          }
          var signature = EthFP.Account.signTransaction(transaction, privateKey);
          if (_.isFunction(callback)) {
              callback(null, signature);
          }
          return signature;
      }

      // Returns synchronously if nonce, chainId and price are provided
      if (tx.nonce && tx.chainId && tx.gasPrice) {
          return signed(tx);
      }

      // Otherwise, get the missing info from the Ethereum Node
      return Promise.all([
          tx.chainId || 3 || this._eth.net.getId(),
          tx.gasPrice || this._eth.getGasPrice(),
          tx.nonce || this._eth.getTransactionCount(this.privateToAccount(privateKey).address)
      ]).then(function(args) {
          return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
      });
  },
  recoverTransaction: function(rawTx) {
      return EthFP.Account.recoverTransaction(rawTx);
  }
}
