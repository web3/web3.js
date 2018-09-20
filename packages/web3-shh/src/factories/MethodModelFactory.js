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
 * @file MethodModelFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var web3CoreMethod = require('web3-core-method');

/**
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function MethodModelFactory(utils, formatters) {
    web3CoreMethod.AbstractMethodModelFactory.call(this, utils, formatters);

    this.methodModels = {
        getVersion: web3CoreMethod.ShhVersionMethodModel,
        getInfo: web3CoreMethod.GetInfoMethodModel,
        setMaxMessageSize: web3CoreMethod.SetMaxMessageSizeMethodModel,
        setMinPoW: web3CoreMethod.SetMinPoWMethodModel,
        markTrustedPeer: web3CoreMethod.MarkTrustedPeerMethodModel,
        newKeyPair: web3CoreMethod.NewKeyPairMethodModel,
        addPrivateKey: web3CoreMethod.AddPrivateKeyMethodModel,
        deleteKeyPair: web3CoreMethod.DeleteKeyPairMethodModel,
        hasKeyPair: web3CoreMethod.HasKeyPairMethodModel,
        getPublicKey: web3CoreMethod.GetPublicKeyMethodModel,
        getPrivateKey: web3CoreMethod.GetPrivateKeyMethodModel,
        newSymKey: web3CoreMethod.NewSymKeyMethodModel,
        addSymKey: web3CoreMethod.AddSymKeyMethodModel,
        generateSymKeyFromPassword: web3CoreMethod.GenerateSymKeyFromPasswordMethodModel,
        hasSymKey: web3CoreMethod.HasSymKeyMethodModel,
        getSymKey: web3CoreMethod.GetSymKeyMethodModel,
        deleteSymKey: web3CoreMethod.DeleteSymKeyMethodModel,
        newMessageFilter: web3CoreMethod.NewMessageFilterMethodModel,
        getFilterMessages: web3CoreMethod.GetFilterMessagesMethodModel,
        deleteMessageFilter: web3CoreMethod.DeleteMessageFilterMethodModel,
        post: web3CoreMethod.PostMethodModel,
    };

}

MethodModelFactory.prototype = Object.create(web3CoreMethod.AbstractMethodModelFactory.prototype);
MethodModelFactory.prototype.constructor = MethodModelFactory;

module.exports = MethodModelFactory;
