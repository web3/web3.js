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

// Methods
    // Network
    var GetProtocolVersionMethodModel = require('./methods/network/GetProtocolVersionMethodModel');
    var VersionMethodModel = require('./methods/network/VersionMethodModel');
    var ListeningMethodModel = require('./methods/network/ListeningMethodModel');
    var PeerCountMethodModel = require('./methods/network/PeerCountMethodModel');

    // Node
    var GetNodeInfoMethodModel = require('./methods/node/GetNodeInfoMethodModel');
    var GetCoinbaseMethodModel = require('./methods/node/GetCoinbaseMethodModel');
    var IsMiningMethodModel = require('./methods/node/IsMiningMethodModel');
    var GetHashrateMethodModel = require('./methods/node/GetHashrateMethodModel');
    var IsSyncingMethodModel = require('./methods/node/IsSyncingMethodModel');
    var GetGasPriceMethodModel = require('./methods/node/GetGasPriceMethodModel');
    var SubmitWorkMethodModel = require('./methods/node/SubmitWorkMethodModel');
    var GetWorkMethodModel = require('./methods/node/GetWorkMethodModel');

    // Account
    var GetAccountsMethodModel = require('./methods/account/GetAccountsMethodModel');
    var GetBalanceMethodModel = require('./methods/account/GetBalanceMethodModel');
    var GetTransactionCountMethodModel = require('./methods/account/GetTransactionCountMethodModel');

    // Block
    var GetBlockNumberMethodModel = require('./methods/block/GetBlockNumberMethodModel');
    var GetBlockMethodModel = require('./methods/block/GetBlockMethodModel');
    var GetUncleMethodModel = require('./methods/block/GetUncleMethodModel');
    var GetBlockTransactionCountMethodModel = require('./methods/block/GetBlockTransactionCountMethodModel');
    var GetBlockUncleCountMethodModel = require('./methods/block/GetBlockUncleCountMethodModel');

    // Transaction
    var GetTransactionMethodModel = require('./methods/transaction/GetTransactionMethodModel');
    var GetTransactionFromBlockMethodModel = require('./methods/transaction/GetTransactionFromBlockMethodModel');
    var GetTransactionReceipt = require('./methods/transaction/GetTransactionReceipt');
    var SendSignedTransactionMethodModel = require('./methods/transaction/SendSignedTransactionMethodModel');
    var SignTransactionMethodModel = require('./methods/transaction/SignTransactionMethodModel');
    var SendTransactionMethodModel = require('./methods/transaction/SendTransactionMethodModel');

    // Global
    var GetCodeMethodModel = require('./methods/GetCodeMethodModel');
    var SignMethodModel = require('./methods/SignMethodModel');
    var CallMethodModel = require('./methods/CallMethodModel');
    var GetStroageAtMethodModel = require('./methods/GetStroageAtMethodModel');
    var EstimateGasMethodModel = require('./methods/EstimateGasMethodModel');
    var GetPastLogsMethodModel = require('./methods/GetPastLogsMethodModel');

    // Personal
    var EcRecoverMethodModel = require('./methods/personal/EcRecoverMethodModel');
    var ImportRawKeyMethodModel = require('./methods/personal/ImportRawKeyMethodModel');
    var ListAccountsMethodModel = require('./methods/personal/ListAccountsMethodModel');
    var LockAccountMethodModel = require('./methods/personal/LockAccountMethodModel');
    var NewAccountMethodModel = require('./methods/personal/NewAccountMethodModel');
    var PersonalSendTransactionMethodModel = require('./methods/personal/PersonalSendTransactionMethodModel');
    var PersonalSignMethodModel = require('./methods/personal/PersonalSignMethodModel');
    var PersonalSignTransactionMethodModel = require('./methods/personal/PersonalSignTransactionMethodModel');
    var UnlockAccountMethodModel = require('./methods/personal/UnlockAccountMethodModel');

    // SHH
    var AddPrivateKeyMethodModel = require('./methods/shh/AddPrivateKeyMethodModel');
    var AddSymKeyMethodModel = require('./methods/shh/AddSymKeyMethodModel');
    var DeleteKeyPairMethodModel = require('./methods/shh/DeleteKeyPairMethodModel');
    var DeleteMessageFilterMethodModel = require('./methods/shh/DeleteMessageFilterMethodModel');
    var DeleteSymKeyMethodModel = require('./methods/shh/DeleteSymKeyMethodModel');
    var GenerateSymKeyFromPasswordMethodModel = require('./methods/shh/GenerateSymKeyFromPasswordMethodModel');
    var GetFilterMessagesMethodModel = require('./methods/shh/GetFilterMessagesMethodModel');
    var GetInfoMethodModel = require('./methods/shh/GetInfoMethodModel');
    var GetPrivateKeyMethodModel = require('./methods/shh/GetPrivateKeyMethodModel');
    var GetPublicKeyMethodModel = require('./methods/shh/GetPublicKeyMethodModel');
    var GetSymKeyMethodModel = require('./methods/shh/GetSymKeyMethodModel');
    var HasKeyPairMethodModel = require('./methods/shh/HasKeyPairMethodModel');
    var HasSymKeyMethodModel = require('./methods/shh/HasSymKeyMethodModel');
    var MarkTrustedPeerMethodModel = require('./methods/shh/MarkTrustedPeerMethodModel');
    var NewKeyPairMethodModel = require('./methods/shh/NewKeyPairMethodModel');
    var NewMessageFilterMethodModel = require('./methods/shh/NewMessageFilterMethodModel');
    var NewSymKeyMethodModel = require('./methods/shh/NewSymKeyMethodModel');
    var PostMethodModel = require('./methods/shh/PostMethodModel');
    var SetMaxMessageSizeMethodModel = require('./methods/shh/SetMaxMessageSizeMethodModel');
    var SetMinPoWMethodModel = require('./methods/shh/SetMinPoWMethodModel');
    var ShhVersionMethodModel = require('./methods/shh/ShhVersionMethodModel');

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
            SubscriptionPackage
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
