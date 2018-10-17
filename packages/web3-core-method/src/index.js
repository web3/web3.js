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

import {version} from '../package.json';
import MethodPackageFactory from './factories/MethodPackageFactory';
import AbstractMethodModelFactory from '../lib/factories/AbstractMethodModelFactory';
import PromiEventPackage from 'web3-core-promievent';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {formatters} from 'web3-core-helpers';
// Methods
// Network
import GetProtocolVersionMethodModel from './models/methods/network/GetProtocolVersionMethodModel';

import VersionMethodModel from './models/methods/network/VersionMethodModel';
import ListeningMethodModel from './models/methods/network/ListeningMethodModel';
import PeerCountMethodModel from './models/methods/network/PeerCountMethodModel';
// Node
import GetNodeInfoMethodModel from './models/methods/node/GetNodeInfoMethodModel';

import GetCoinbaseMethodModel from './models/methods/node/GetCoinbaseMethodModel';
import IsMiningMethodModel from './models/methods/node/IsMiningMethodModel';
import GetHashrateMethodModel from './models/methods/node/GetHashrateMethodModel';
import IsSyncingMethodModel from './models/methods/node/IsSyncingMethodModel';
import GetGasPriceMethodModel from './models/methods/node/GetGasPriceMethodModel';
import SubmitWorkMethodModel from './models/methods/node/SubmitWorkMethodModel';
import GetWorkMethodModel from './models/methods/node/GetWorkMethodModel';
// Account
import GetAccountsMethodModel from './models/methods/account/GetAccountsMethodModel';

import GetBalanceMethodModel from './models/methods/account/GetBalanceMethodModel';
import GetTransactionCountMethodModel from './models/methods/account/GetTransactionCountMethodModel';
// Block
import GetBlockNumberMethodModel from './models/methods/block/GetBlockNumberMethodModel';

import GetBlockMethodModel from './models/methods/block/GetBlockMethodModel';
import GetUncleMethodModel from './models/methods/block/GetUncleMethodModel';
import GetBlockTransactionCountMethodModel from './models/methods/block/GetBlockTransactionCountMethodModel';
import GetBlockUncleCountMethodModel from './models/methods/block/GetBlockUncleCountMethodModel';
// Transaction
import GetTransactionMethodModel from './models/methods/transaction/GetTransactionMethodModel';

import GetTransactionFromBlockMethodModel from './models/methods/transaction/GetTransactionFromBlockMethodModel';
import GetTransactionReceipt from './models/methods/transaction/GetTransactionReceiptMethodModel';
import SendSignedTransactionMethodModel from './models/methods/transaction/SendSignedTransactionMethodModel';
import SignTransactionMethodModel from './models/methods/transaction/SignTransactionMethodModel';
import SendTransactionMethodModel from './models/methods/transaction/SendTransactionMethodModel';
// Global
import GetCodeMethodModel from './models/methods/GetCodeMethodModel';

import SignMethodModel from './models/methods/SignMethodModel';
import CallMethodModel from './models/methods/CallMethodModel';
import GetStorageAtMethodModel from './models/methods/GetStorageAtMethodModel';
import EstimateGasMethodModel from './models/methods/EstimateGasMethodModel';
import GetPastLogsMethodModel from './models/methods/GetPastLogsMethodModel';
// Personal
import EcRecoverMethodModel from './models/methods/personal/EcRecoverMethodModel';

import ImportRawKeyMethodModel from './models/methods/personal/ImportRawKeyMethodModel';
import ListAccountsMethodModel from './models/methods/personal/ListAccountsMethodModel';
import LockAccountMethodModel from './models/methods/personal/LockAccountMethodModel';
import NewAccountMethodModel from './models/methods/personal/NewAccountMethodModel';
import PersonalSendTransactionMethodModel from './models/methods/personal/PersonalSendTransactionMethodModel';
import PersonalSignMethodModel from './models/methods/personal/PersonalSignMethodModel';
import PersonalSignTransactionMethodModel from './models/methods/personal/PersonalSignTransactionMethodModel';
import UnlockAccountMethodModel from './models/methods/personal/UnlockAccountMethodModel';
// SHH
import AddPrivateKeyMethodModel from './models/methods/shh/AddPrivateKeyMethodModel';

import AddSymKeyMethodModel from './models/methods/shh/AddSymKeyMethodModel';
import DeleteKeyPairMethodModel from './models/methods/shh/DeleteKeyPairMethodModel';
import DeleteMessageFilterMethodModel from './models/methods/shh/DeleteMessageFilterMethodModel';
import DeleteSymKeyMethodModel from './models/methods/shh/DeleteSymKeyMethodModel';
import GenerateSymKeyFromPasswordMethodModel from './models/methods/shh/GenerateSymKeyFromPasswordMethodModel';
import GetFilterMessagesMethodModel from './models/methods/shh/GetFilterMessagesMethodModel';
import GetInfoMethodModel from './models/methods/shh/GetInfoMethodModel';
import GetPrivateKeyMethodModel from './models/methods/shh/GetPrivateKeyMethodModel';
import GetPublicKeyMethodModel from './models/methods/shh/GetPublicKeyMethodModel';
import GetSymKeyMethodModel from './models/methods/shh/GetSymKeyMethodModel';
import HasKeyPairMethodModel from './models/methods/shh/HasKeyPairMethodModel';
import HasSymKeyMethodModel from './models/methods/shh/HasSymKeyMethodModel';
import MarkTrustedPeerMethodModel from './models/methods/shh/MarkTrustedPeerMethodModel';
import NewKeyPairMethodModel from './models/methods/shh/NewKeyPairMethodModel';
import NewMessageFilterMethodModel from './models/methods/shh/NewMessageFilterMethodModel';
import NewSymKeyMethodModel from './models/methods/shh/NewSymKeyMethodModel';
import PostMethodModel from './models/methods/shh/PostMethodModel';
import SetMaxMessageSizeMethodModel from './models/methods/shh/SetMaxMessageSizeMethodModel';
import SetMinPoWMethodModel from './models/methods/shh/SetMinPoWMethodModel';
import ShhVersionMethodModel from './models/methods/shh/ShhVersionMethodModel';

export default {
    version,
    AbstractMethodModelFactory,

    /**
     * Returns the MethodController object
     *
     * @method MethodController
     *
     * @returns {MethodController}
     */
    MethodController() {
        return new MethodPackageFactory().createMethodController(
            PromiEventPackage,
            new SubscriptionsFactory(),
            formatters
        );
    },

    /**
     * Methods
     */
    // Network
    GetProtocolVersionMethodModel,
    VersionMethodModel,
    ListeningMethodModel,
    PeerCountMethodModel,

    // Node
    GetNodeInfoMethodModel,
    GetCoinbaseMethodModel,
    IsMiningMethodModel,
    GetHashrateMethodModel,
    IsSyncingMethodModel,
    GetWorkMethodModel,
    GetGasPriceMethodModel,
    SubmitWorkMethodModel,

    // Account
    GetAccountsMethodModel,
    GetBalanceMethodModel,
    GetTransactionCountMethodModel,

    // Block
    GetBlockNumberMethodModel,
    GetBlockMethodModel,
    GetUncleMethodModel,
    GetBlockTransactionCountMethodModel,
    GetBlockUncleCountMethodModel,

    // Transaction
    GetTransactionMethodModel,
    GetTransactionFromBlockMethodModel,
    SendSignedTransactionMethodModel,
    SignTransactionMethodModel,
    SendTransactionMethodModel,
    GetTransactionReceipt,

    // Global
    GetStorageAtMethodModel,
    GetCodeMethodModel,
    SignMethodModel,
    CallMethodModel,
    EstimateGasMethodModel,
    GetPastLogsMethodModel,

    // Personal
    EcRecoverMethodModel,
    ImportRawKeyMethodModel,
    ListAccountsMethodModel,
    LockAccountMethodModel,
    NewAccountMethodModel,
    PersonalSendTransactionMethodModel,
    PersonalSignMethodModel,
    PersonalSignTransactionMethodModel,
    UnlockAccountMethodModel,

    // SHH
    AddPrivateKeyMethodModel,
    AddSymKeyMethodModel,
    DeleteKeyPairMethodModel,
    DeleteMessageFilterMethodModel,
    DeleteSymKeyMethodModel,
    GenerateSymKeyFromPasswordMethodModel,
    GetFilterMessagesMethodModel,
    GetInfoMethodModel,
    GetPrivateKeyMethodModel,
    GetPublicKeyMethodModel,
    GetSymKeyMethodModel,
    HasKeyPairMethodModel,
    HasSymKeyMethodModel,
    MarkTrustedPeerMethodModel,
    NewKeyPairMethodModel,
    NewMessageFilterMethodModel,
    NewSymKeyMethodModel,
    PostMethodModel,
    SetMaxMessageSizeMethodModel,
    SetMinPoWMethodModel,
    ShhVersionMethodModel
};
