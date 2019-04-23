import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {
    BackTraceAtMethod,
    BlockProfileMethod,
    CpuProfileMethod,
    DumpBlockMethod,
    GcStatsMethod,
    GetBlockRlpMethod,
    GoTraceMethod,
    MemStatsMethod,
    SeedHashMethod,
    SetBlockProfileRateMethod,
    SetHeadMethod,
    StacksMethod,
    StartCpuProfileMethod,
    StartGoTraceMethod,
    StopCpuProfileMethod,
    StopGoTraceMethod,
    TraceBlockByHashMethod,
    TraceBlockByNumberMethod,
    TraceBlockFromFileMethod,
    TraceBlockMethod,
    TraceTransactionMethod,
    VerbosityMethod,
    VmoduleMethod,
    WriteBlockProfileMethod,
    WriteMemProfileMethod
} from 'web3-core-method';

import MethodFactory from '../../../src/factories/MethodFactory';

// Mocks
jest.mock('web3-utils');
jest.mock('web3-core-helpers');

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
            backTraceAt: BackTraceAtMethod,
            blockProfile: BlockProfileMethod,
            cpuProfile: CpuProfileMethod,
            dumpBlock: DumpBlockMethod,
            gcStats: GcStatsMethod,
            getBlockRlp: GetBlockRlpMethod,
            goTrace: GoTraceMethod,
            memStats: MemStatsMethod,
            seedHash: SeedHashMethod,
            setBlockProfileRate: SetBlockProfileRateMethod,
            setHead: SetHeadMethod,
            stacks: StacksMethod,
            startCPUProfile: StartCpuProfileMethod,
            startGoTrace: StartGoTraceMethod,
            stopCPUProfile: StopCpuProfileMethod,
            stopGoTrace: StopGoTraceMethod,
            traceBlockByHash: TraceBlockByHashMethod,
            traceBlockByNumber: TraceBlockByNumberMethod,
            traceBlockFromFile: TraceBlockFromFileMethod,
            traceBlock: TraceBlockMethod,
            traceTransaction: TraceTransactionMethod,
            verbosity: VerbosityMethod,
            vmodule: VmoduleMethod,
            writeBlockProfile: WriteBlockProfileMethod,
            writeMemProfile: WriteMemProfileMethod
        });
    });
});
