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
 * @file MethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    AbstractMethodFactory,
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    GetBalanceMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionMethod,
    GetTransactionReceiptMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    RequestAccountsMethod,
    SubmitWorkMethod,
    VersionMethod,
    SendRawTransactionMethod,
    CfxSendTransactionMethod,
    GetEpochNumberMethod,
    GetBlocksByEpochMethod
} from 'conflux-web-core-method';

import GetBlockMethod from '../methods/GetBlockMethod';
import GetBlockTransactionCountMethod from '../methods/GetBlockTransactionCountMethod';
import GetTransactionFromBlockMethod from '../methods/GetTransactionFromBlockMethod';
import CfxSignTransactionMethod from '../methods/CfxSignTransactionMethod';
import CfxSignMethod from '../methods/CfxSignMethod';
import CfxGetAccountsMethod from '../methods/CfxGetAccountsMethod';

export default class MethodFactory extends AbstractMethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super(utils, formatters);

        this.methods = {
            getNodeInfo: GetNodeInfoMethod,
            getProtocolVersion: GetProtocolVersionMethod,
            getCoinbase: GetCoinbaseMethod,
            isMining: IsMiningMethod,
            getHashrate: GetHashrateMethod,
            isSyncing: IsSyncingMethod,
            getGasPrice: GetGasPriceMethod,
            getAccounts: CfxGetAccountsMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getTransaction: GetTransactionMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceiptMethod,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: CfxSignTransactionMethod,
            sendTransaction: CfxSendTransactionMethod,
            sign: CfxSignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod,
            getId: VersionMethod,
            getChainId: ChainIdMethod,
            getEpochNumber: GetEpochNumberMethod,
            getBlocksByEpoch :GetBlocksByEpochMethod
        };
    }
}
