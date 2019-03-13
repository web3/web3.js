import {
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    EthSendTransactionMethod,
    GetAccountsMethod,
    GetBalanceMethod,
    GetBlockNumberMethod,
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
    VersionMethod
} from 'web3-core-method';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import MethodFactory from '../../../src/factories/MethodFactory';
import GetBlockMethod from '../../../src/methods/GetBlockMethod';
import GetUncleMethod from '../../../src/methods/GetUncleMethod';
import GetBlockTransactionCountMethod from '../../../src/methods/GetBlockTransactionCountMethod';
import GetBlockUncleCountMethod from '../../../src/methods/GetBlockUncleCountMethod';
import GetTransactionFromBlockMethod from '../../../src/methods/GetTransactionFromBlockMethod';
import EthSignTransactionMethod from '../../../src/methods/EthSignTransactionMethod';
import EthSignMethod from '../../../src/methods/EthSignMethod';

jest.mock('Utils');
jest.mock('formatters');

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
            getAccounts: GetAccountsMethod,
            getBlockNumber: GetBlockNumberMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getUncle: GetUncleMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getBlockUncleCount: GetBlockUncleCountMethod,
            getTransaction: GetTransactionMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceiptMethod,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: EthSignTransactionMethod,
            sendTransaction: EthSendTransactionMethod,
            sign: EthSignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod,
            getChainId: ChainIdMethod,
            getId: VersionMethod
        });
    });
});
