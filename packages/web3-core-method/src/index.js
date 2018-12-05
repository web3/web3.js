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
 * TODO: Overthink the handling of PromiEvent its just wrong to do it over injection
 * @file index.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ModuleFactory from './factories/ModuleFactory';
import {PromiEvent} from 'web3-core-promievent';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {formatters} from 'web3-core-helpers';

/**
 * Returns the ModuleFactory of the method module
 *
 * @returns {ModuleFactory}
 *
 * @constructor
 */
export const MethodModuleFactory = () => {
    return new ModuleFactory(PromiEvent, new SubscriptionsFactory(), formatters);
};

export AbstractMethodModel from '../lib/models/AbstractMethodModel';
export AbstractMethodModelFactory from '../lib/factories/AbstractMethodFactory';

// Network
export GetProtocolVersionMethodModel from './models/methods/network/GetProtocolVersionMethodModel';
export VersionMethodModel from './models/methods/network/VersionMethodModel';
export ListeningMethodModel from './models/methods/network/ListeningMethodModel';
export PeerCountMethodModel from './models/methods/network/PeerCountMethodModel';

// Node
export GetNodeInfoMethodModel from './models/methods/node/GetNodeInfoMethodModel';
export GetCoinbaseMethodModel from './models/methods/node/GetCoinbaseMethodModel';
export IsMiningMethodModel from './models/methods/node/IsMiningMethodModel';
export GetHashrateMethodModel from './models/methods/node/GetHashrateMethodModel';
export IsSyncingMethodModel from './models/methods/node/IsSyncingMethodModel';
export GetGasPriceMethodModel from './models/methods/node/GetGasPriceMethodModel';
export SubmitWorkMethodModel from './models/methods/node/SubmitWorkMethodModel';
export GetWorkMethodModel from './models/methods/node/GetWorkMethod';

// Account
export GetAccountsMethodModel from './models/methods/account/GetAccountsMethodModel';
export GetBalanceMethodModel from './models/methods/account/GetBalanceMethodModel';
export GetTransactionCountMethodModel from './models/methods/account/GetTransactionCountMethod';

// Block
export GetBlockNumberMethodModel from './models/methods/block/GetBlockNumberMethodModel';
export GetBlockMethodModel from './models/methods/block/GetBlockMethodModel';
export GetUncleMethodModel from './models/methods/block/GetUncleMethodModel';
export GetBlockTransactionCountMethodModel from './models/methods/block/GetBlockTransactionCountMethodModel';
export GetBlockUncleCountMethodModel from './models/methods/block/GetBlockUncleCountMethodModel';

// Transaction
export GetTransactionMethodModel from './models/methods/transaction/GetTransactionMethodModel';
export GetTransactionFromBlockMethodModel from './models/methods/transaction/GetTransactionFromBlockMethodModel';
export GetTransactionReceipt from './models/methods/transaction/GetTransactionReceiptMethodModel';
export SendSignedTransactionMethodModel from './models/methods/transaction/SendSignedTransactionMethodModel';
export SignTransactionMethodModel from './models/methods/transaction/SignTransactionMethodModel';
export SendTransactionMethodModel from './models/methods/transaction/SendTransactionMethodModel';

// Global
export GetCodeMethodModel from './models/methods/GetCodeMethodModel';
export SignMethodModel from './models/methods/SignMethod';
export CallMethodModel from './models/methods/CallMethodModel';
export GetStorageAtMethodModel from './models/methods/GetStorageAtMethod';
export EstimateGasMethodModel from './models/methods/EstimateGasMethod';
export GetPastLogsMethodModel from './models/methods/GetPastLogsMethodModel';

// Personal
export EcRecoverMethodModel from './models/methods/personal/EcRecoverMethodModel';
export ImportRawKeyMethodModel from './models/methods/personal/ImportRawKeyMethodModel';
export ListAccountsMethodModel from './models/methods/personal/ListAccountsMethodModel';
export LockAccountMethodModel from './models/methods/personal/LockAccountMethodModel';
export NewAccountMethodModel from './models/methods/personal/NewAccountMethod';
export PersonalSendTransactionMethodModel from './models/methods/personal/PersonalSendTransactionMethod';
export PersonalSignMethodModel from './models/methods/personal/PersonalSignMethod';
export PersonalSignTransactionMethodModel from './models/methods/personal/PersonalSignTransactionMethod';
export UnlockAccountMethodModel from './models/methods/personal/UnlockAccountMethodModel';

// SHH
export AddPrivateKeyMethodModel from './models/methods/shh/AddPrivateKeyMethodModel';
export AddSymKeyMethodModel from './models/methods/shh/AddSymKeyMethodModel';
export DeleteKeyPairMethodModel from './models/methods/shh/DeleteKeyPairMethodModel';
export DeleteMessageFilterMethodModel from './models/methods/shh/DeleteMessageFilterMethodModel';
export DeleteSymKeyMethodModel from './models/methods/shh/DeleteSymKeyMethod';
export GenerateSymKeyFromPasswordMethodModel from './models/methods/shh/GenerateSymKeyFromPasswordMethodModel';
export GetFilterMessagesMethodModel from './models/methods/shh/GetFilterMessagesMethodModel';
export GetInfoMethodModel from './models/methods/shh/GetInfoMethod';
export GetPrivateKeyMethodModel from './models/methods/shh/GetPrivateKeyMethodModel';
export GetPublicKeyMethodModel from './models/methods/shh/GetPublicKeyMethodModel';
export GetSymKeyMethodModel from './models/methods/shh/GetSymKeyMethodModel';
export HasKeyPairMethodModel from './models/methods/shh/HasKeyPairMethodModel';
export HasSymKeyMethodModel from './models/methods/shh/HasSymKeyMethodModel';
export MarkTrustedPeerMethodModel from './models/methods/shh/MarkTrustedPeerMethodModel';
export NewKeyPairMethodModel from './models/methods/shh/NewKeyPairMethodModel';
export NewMessageFilterMethodModel from './models/methods/shh/NewMessageFilterMethodModel';
export NewSymKeyMethodModel from './models/methods/shh/NewSymKeyMethodModel';
export PostMethodModel from './models/methods/shh/PostMethodModel';
export SetMaxMessageSizeMethodModel from './models/methods/shh/SetMaxMessageSizeMethodModel';
export SetMinPoWMethodModel from './models/methods/shh/SetMinPoWMethodModel';
export ShhVersionMethodModel from './models/methods/shh/ShhVersionMethodModel';
