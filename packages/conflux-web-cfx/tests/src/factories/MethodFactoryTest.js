import {
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    CfxSendTransactionMethod,
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
    SendRawTransactionMethod,
    SubmitWorkMethod,
    VersionMethod,
    GetEpochNumberMethod
} from 'conflux-web-core-method';
import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import MethodFactory from '../../../src/factories/MethodFactory';
import GetBlockMethod from '../../../src/methods/GetBlockMethod';
import GetBlocksByEpochMethod from '../../../src/methods/GetBlocksByEpochMethod';
import GetBestBlockHashMethod from '../../../src/methods/GetBestBlockHashMethod';
import GetBlockByHashWithPivotAssumptionMethod from '../../../src/methods/GetBlockByHashWithPivotAssumptionMethod';
import GetBlockTransactionCountMethod from '../../../src/methods/GetBlockTransactionCountMethod';
import GetTransactionFromBlockMethod from '../../../src/methods/GetTransactionFromBlockMethod';
import CfxSignTransactionMethod from '../../../src/methods/CfxSignTransactionMethod';
import CfxSignMethod from '../../../src/methods/CfxSignMethod';
import CfxGetAccountsMethod from '../../../src/methods/CfxGetAccountsMethod';

jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory(Utils, formatters);
    });

    it('constructor check', () => {
        expect(methodFactory.utils).toEqual(Utils);

        expect(methodFactory.formatters).toEqual(formatters);
    });

    it('JSON-RPC methods check', () => {
        expect(methodFactory.methods).toEqual({
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
            getChainId: ChainIdMethod,
            getId: VersionMethod,
            getEpochNumber: GetEpochNumberMethod,
            getBlocksByEpoch: GetBlocksByEpochMethod,
            getBlockByHashWithPivotAssumption: GetBlockByHashWithPivotAssumptionMethod,
            getBestBlockHash: GetBestBlockHashMethod
        });
    });
});
