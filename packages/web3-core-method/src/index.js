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
 * @file index.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var version = require('./package.json');
var MethodPackageFactory = require('./factories/MethodPackageFactory');
var AbstractMethodModelFactory = require('../lib/factories/AbstractMethodModelFactory');
var PromiEventPackage = require('web3-core-promievent');
var SubscriptionPackage = require('web3-core-subscription');
var formatters = require('web3-core-helpers').formatters;

// Methods
    // Network
    var GetProtocolVersionMethodModel = require('./models/methods/network/GetProtocolVersionMethodModel');
    var VersionMethodModel = require('./models/methods/network/VersionMethodModel');
    var ListeningMethodModel = require('./models/methods/network/ListeningMethodModel');
    var PeerCountMethodModel = require('./models/methods/network/PeerCountMethodModel');

    // Node
    var GetNodeInfoMethodModel = require('./models/methods/node/GetNodeInfoMethodModel');
    var GetCoinbaseMethodModel = require('./models/methods/node/GetCoinbaseMethodModel');
    var IsMiningMethodModel = require('./models/methods/node/IsMiningMethodModel');
    var GetHashrateMethodModel = require('./models/methods/node/GetHashrateMethodModel');
    var IsSyncingMethodModel = require('./models/methods/node/IsSyncingMethodModel');
    var GetGasPriceMethodModel = require('./models/methods/node/GetGasPriceMethodModel');
    var SubmitWorkMethodModel = require('./models/methods/node/SubmitWorkMethodModel');
    var GetWorkMethodModel = require('./models/methods/node/GetWorkMethodModel');

    // Account
    var GetAccountsMethodModel = require('./models/methods/account/GetAccountsMethodModel');
    var GetBalanceMethodModel = require('./models/methods/account/GetBalanceMethodModel');
    var GetTransactionCountMethodModel = require('./models/methods/account/GetTransactionCountMethodModel');

    // Block
    var GetBlockNumberMethodModel = require('./models/methods/block/GetBlockNumberMethodModel');
    var GetBlockMethodModel = require('./models/methods/block/GetBlockMethodModel');
    var GetUncleMethodModel = require('./models/methods/block/GetUncleMethodModel');
    var GetBlockTransactionCountMethodModel = require('./models/methods/block/GetBlockTransactionCountMethodModel');
    var GetBlockUncleCountMethodModel = require('./models/methods/block/GetBlockUncleCountMethodModel');

    // Transaction
    var GetTransactionMethodModel = require('./models/methods/transaction/GetTransactionMethodModel');
    var GetTransactionFromBlockMethodModel = require('./models/methods/transaction/GetTransactionFromBlockMethodModel');
    var GetTransactionReceipt = require('./models/methods/transaction/GetTransactionReceipt');
    var SendSignedTransactionMethodModel = require('./models/methods/transaction/SendSignedTransactionMethodModel');
    var SignTransactionMethodModel = require('./models/methods/transaction/SignTransactionMethodModel');
    var SendTransactionMethodModel = require('./models/methods/transaction/SendTransactionMethodModel');

    // Global
    var GetCodeMethodModel = require('./models/methods/GetCodeMethodModel');
    var SignMethodModel = require('./models/methods/SignMethodModel');
    var CallMethodModel = require('./models/methods/CallMethodModel');
    var GetStroageAtMethodModel = require('./models/methods/GetStroageAtMethodModel');
    var EstimateGasMethodModel = require('./models/methods/EstimateGasMethodModel');
    var GetPastLogsMethodModel = require('./models/methods/GetPastLogsMethodModel');

    // Personal
    var EcRecoverMethodModel = require('./models/methods/personal/EcRecoverMethodModel');
    var ImportRawKeyMethodModel = require('./models/methods/personal/ImportRawKeyMethodModel');
    var ListAccountsMethodModel = require('./models/methods/personal/ListAccountsMethodModel');
    var LockAccountMethodModel = require('./models/methods/personal/LockAccountMethodModel');
    var NewAccountMethodModel = require('./models/methods/personal/NewAccountMethodModel');
    var PersonalSendTransactionMethodModel = require('./models/methods/personal/PersonalSendTransactionMethodModel');
    var PersonalSignMethodModel = require('./models/methods/personal/PersonalSignMethodModel');
    var PersonalSignTransactionMethodModel = require('./models/methods/personal/PersonalSignTransactionMethodModel');
    var UnlockAccountMethodModel = require('./models/methods/personal/UnlockAccountMethodModel');

    // SHH
    var AddPrivateKeyMethodModel = require('./models/methods/shh/AddPrivateKeyMethodModel');
    var AddSymKeyMethodModel = require('./models/methods/shh/AddSymKeyMethodModel');
    var DeleteKeyPairMethodModel = require('./models/methods/shh/DeleteKeyPairMethodModel');
    var DeleteMessageFilterMethodModel = require('./models/methods/shh/DeleteMessageFilterMethodModel');
    var DeleteSymKeyMethodModel = require('./models/methods/shh/DeleteSymKeyMethodModel');
    var GenerateSymKeyFromPasswordMethodModel = require('./models/methods/shh/GenerateSymKeyFromPasswordMethodModel');
    var GetFilterMessagesMethodModel = require('./models/methods/shh/GetFilterMessagesMethodModel');
    var GetInfoMethodModel = require('./models/methods/shh/GetInfoMethodModel');
    var GetPrivateKeyMethodModel = require('./models/methods/shh/GetPrivateKeyMethodModel');
    var GetPublicKeyMethodModel = require('./models/methods/shh/GetPublicKeyMethodModel');
    var GetSymKeyMethodModel = require('./models/methods/shh/GetSymKeyMethodModel');
    var HasKeyPairMethodModel = require('./models/methods/shh/HasKeyPairMethodModel');
    var HasSymKeyMethodModel = require('./models/methods/shh/HasSymKeyMethodModel');
    var MarkTrustedPeerMethodModel = require('./models/methods/shh/MarkTrustedPeerMethodModel');
    var NewKeyPairMethodModel = require('./models/methods/shh/NewKeyPairMethodModel');
    var NewMessageFilterMethodModel = require('./models/methods/shh/NewMessageFilterMethodModel');
    var NewSymKeyMethodModel = require('./models/methods/shh/NewSymKeyMethodModel');
    var PostMethodModel = require('./models/methods/shh/PostMethodModel');
    var SetMaxMessageSizeMethodModel = require('./models/methods/shh/SetMaxMessageSizeMethodModel');
    var SetMinPoWMethodModel = require('./models/methods/shh/SetMinPoWMethodModel');
    var ShhVersionMethodModel = require('./models/methods/shh/ShhVersionMethodModel');

module.exports = {
    version: version,
    AbstractMethodModelFactory: AbstractMethodModelFactory,

    /**
     * Returns the MethodController object
     *
     * @method createMethodController
     *
     * @returns {MethodController}
     */
    createMethodController: function () {
        return new MethodPackageFactory().createMethodController(
            PromiEventPackage,
            SubscriptionPackage.createSubscriptionsFactory(),
            formatters
        );
    },

    /**
     * Methods
     */

        // Network
        GetProtocolVersionMethodModel: GetProtocolVersionMethodModel,
        VersionMethodModel: VersionMethodModel,
        ListeningMethodModel: ListeningMethodModel,
        PeerCountMethodModel: PeerCountMethodModel,

        // Node
        GetNodeInfoMethodModel: GetNodeInfoMethodModel,
        GetCoinbaseMethodModel: GetCoinbaseMethodModel,
        IsMiningMethodModel: IsMiningMethodModel,
        GetHashrateMethodModel: GetHashrateMethodModel,
        IsSyncingMethodModel: IsSyncingMethodModel,
        GetWorkMethodModel: GetWorkMethodModel,
        GetGasPriceMethodModel: GetGasPriceMethodModel,
        SubmitWorkMethodModel: SubmitWorkMethodModel,

        // Account
        GetAccountsMethodModel: GetAccountsMethodModel,
        GetBalanceMethodModel: GetBalanceMethodModel,
        GetTransactionCountMethodModel: GetTransactionCountMethodModel,

        // Block
        GetBlockNumberMethodModel: GetBlockNumberMethodModel,
        GetBlockMethodModel: GetBlockMethodModel,
        GetUncleMethodModel: GetUncleMethodModel,
        GetBlockTransactionCountMethodModel: GetBlockTransactionCountMethodModel,
        GetBlockUncleCountMethodModel: GetBlockUncleCountMethodModel,

        // Transaction
        GetTransactionMethodModel: GetTransactionMethodModel,
        GetTransactionFromBlockMethodModel: GetTransactionFromBlockMethodModel,
        SendSignedTransactionMethodModel: SendSignedTransactionMethodModel,
        SignTransactionMethodModel: SignTransactionMethodModel,
        SendTransactionMethodModel: SendTransactionMethodModel,
        GetTransactionReceipt: GetTransactionReceipt,

        // Global
        GetStroageAtMethodModel: GetStroageAtMethodModel,
        GetCodeMethodModel: GetCodeMethodModel,
        SignMethodModel: SignMethodModel,
        CallMethodModel: CallMethodModel,
        EstimateGasMethodModel: EstimateGasMethodModel,
        GetPastLogsMethodModel: GetPastLogsMethodModel,

        // Personal
        EcRecoverMethodModel: EcRecoverMethodModel,
        ImportRawKeyMethodModel: ImportRawKeyMethodModel,
        ListAccountsMethodModel: ListAccountsMethodModel,
        LockAccountMethodModel: LockAccountMethodModel,
        NewAccountMethodModel: NewAccountMethodModel,
        PersonalSendTransactionMethodModel: PersonalSendTransactionMethodModel,
        PersonalSignMethodModel: PersonalSignMethodModel,
        PersonalSignTransactionMethodModel: PersonalSignTransactionMethodModel,
        UnlockAccountMethodModel: UnlockAccountMethodModel,

        // SHH
        AddPrivateKeyMethodModel: AddPrivateKeyMethodModel,
        AddSymKeyMethodModel: AddSymKeyMethodModel,
        DeleteKeyPairMethodModel: DeleteKeyPairMethodModel,
        DeleteMessageFilterMethodModel: DeleteMessageFilterMethodModel,
        DeleteSymKeyMethodModel: DeleteSymKeyMethodModel,
        GenerateSymKeyFromPasswordMethodModel: GenerateSymKeyFromPasswordMethodModel,
        GetFilterMessagesMethodModel: GetFilterMessagesMethodModel,
        GetInfoMethodModel: GetInfoMethodModel,
        GetPrivateKeyMethodModel: GetPrivateKeyMethodModel,
        GetPublicKeyMethodModel: GetPublicKeyMethodModel,
        GetSymKeyMethodModel: GetSymKeyMethodModel,
        HasKeyPairMethodModel: HasKeyPairMethodModel,
        HasSymKeyMethodModel: HasSymKeyMethodModel,
        MarkTrustedPeerMethodModel: MarkTrustedPeerMethodModel,
        NewKeyPairMethodModel: NewKeyPairMethodModel,
        NewMessageFilterMethodModel: NewMessageFilterMethodModel,
        NewSymKeyMethodModel: NewSymKeyMethodModel,
        PostMethodModel: PostMethodModel,
        SetMaxMessageSizeMethodModel: SetMaxMessageSizeMethodModel,
        SetMinPoWMethodModel: SetMinPoWMethodModel,
        ShhVersionMethodModel: ShhVersionMethodModel
};
