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
 * TODO: Overthink the handling of PromiEvent its just wrong to do it over injection.
 * TODO: Watching transactions with an Observable would solve it.
 *
 * @file index.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ModuleFactory from './factories/ModuleFactory';
import {SubscriptionsFactory} from 'web3-core-subscriptions';
import {formatters} from 'web3-core-helpers';
import * as Utils from 'web3-utils';

/**
 * Returns the ModuleFactory of the method module
 *
 * @returns {ModuleFactory}
 *
 * @constructor
 */
export const MethodModuleFactory = () => {
    return new ModuleFactory(new SubscriptionsFactory(), Utils, formatters);
};

export AbstractMethod from '../lib/methods/AbstractMethod';
export AbstractMethodFactory from '../lib/factories/AbstractMethodFactory';

// Network
export GetProtocolVersionMethod from './methods/network/GetProtocolVersionMethod';
export VersionMethod from './methods/network/VersionMethod';
export ListeningMethod from './methods/network/ListeningMethod';
export PeerCountMethod from './methods/network/PeerCountMethod';

// Node
export GetNodeInfoMethod from './methods/node/GetNodeInfoMethod';
export GetCoinbaseMethod from './methods/node/GetCoinbaseMethod';
export IsMiningMethod from './methods/node/IsMiningMethod';
export GetHashrateMethod from './methods/node/GetHashrateMethod';
export IsSyncingMethod from './methods/node/IsSyncingMethod';
export GetGasPriceMethod from './methods/node/GetGasPriceMethod';
export SubmitWorkMethod from './methods/node/SubmitWorkMethod';
export GetWorkMethod from './methods/node/GetWorkMethod';

// Account
export GetAccountsMethod from './methods/account/GetAccountsMethod';
export GetBalanceMethod from './methods/account/GetBalanceMethod';
export GetTransactionCountMethod from './methods/account/GetTransactionCountMethod';
export RequestAccountsMethod from './methods/account/RequestAccountsMethod';

// Block
export GetBlockNumberMethod from './methods/block/GetBlockNumberMethod';
export GetBlockMethod from './methods/block/GetBlockMethod';
export GetUncleMethod from './methods/block/GetUncleMethod';
export GetBlockTransactionCountMethod from './methods/block/GetBlockTransactionCountMethod';
export GetBlockUncleCountMethod from './methods/block/GetBlockUncleCountMethod';

// Transaction
export GetTransactionMethod from './methods/transaction/GetTransactionMethod';
export GetTransactionFromBlockMethod from './methods/transaction/GetTransactionFromBlockMethod';
export GetTransactionReceipt from './methods/transaction/GetTransactionReceiptMethod';
export SendRawTransactionMethod from './methods/transaction/SendRawTransactionMethod';
export SignTransactionMethod from './methods/transaction/SignTransactionMethod';
export SendTransactionMethod from './methods/transaction/SendTransactionMethod';

// Global
export GetCodeMethod from './methods/GetCodeMethod';
export SignMethod from './methods/SignMethod';
export CallMethod from './methods/CallMethod';
export GetStorageAtMethod from './methods/GetStorageAtMethod';
export EstimateGasMethod from './methods/EstimateGasMethod';
export GetPastLogsMethod from './methods/GetPastLogsMethod';

// Personal
export EcRecoverMethod from './methods/personal/EcRecoverMethod';
export ImportRawKeyMethod from './methods/personal/ImportRawKeyMethod';
export ListAccountsMethod from './methods/personal/ListAccountsMethod';
export LockAccountMethod from './methods/personal/LockAccountMethod';
export NewAccountMethod from './methods/personal/NewAccountMethod';
export PersonalSendTransactionMethod from './methods/personal/PersonalSendTransactionMethod';
export PersonalSignMethod from './methods/personal/PersonalSignMethod';
export PersonalSignTransactionMethod from './methods/personal/PersonalSignTransactionMethod';
export UnlockAccountMethod from './methods/personal/UnlockAccountMethod';

// SHH
export AddPrivateKeyMethod from './methods/shh/AddPrivateKeyMethod';
export AddSymKeyMethod from './methods/shh/AddSymKeyMethod';
export DeleteKeyPairMethod from './methods/shh/DeleteKeyPairMethod';
export DeleteMessageFilterMethod from './methods/shh/DeleteMessageFilterMethod';
export DeleteSymKeyMethod from './methods/shh/DeleteSymKeyMethod';
export GenerateSymKeyFromPasswordMethod from './methods/shh/GenerateSymKeyFromPasswordMethod';
export GetFilterMessagesMethod from './methods/shh/GetFilterMessagesMethod';
export GetInfoMethod from './methods/shh/GetInfoMethod';
export GetPrivateKeyMethod from './methods/shh/GetPrivateKeyMethod';
export GetPublicKeyMethod from './methods/shh/GetPublicKeyMethod';
export GetSymKeyMethod from './methods/shh/GetSymKeyMethod';
export HasKeyPairMethod from './methods/shh/HasKeyPairMethod';
export HasSymKeyMethod from './methods/shh/HasSymKeyMethod';
export MarkTrustedPeerMethod from './methods/shh/MarkTrustedPeerMethod';
export NewKeyPairMethod from './methods/shh/NewKeyPairMethod';
export NewMessageFilterMethod from './methods/shh/NewMessageFilterMethod';
export NewSymKeyMethod from './methods/shh/NewSymKeyMethod';
export PostMethod from './methods/shh/PostMethod';
export SetMaxMessageSizeMethod from './methods/shh/SetMaxMessageSizeMethod';
export SetMinPoWMethod from './methods/shh/SetMinPoWMethod';
export ShhVersionMethod from './methods/shh/ShhVersionMethod';
