import {
    AddPeerMethod,
    DataDirectoryMethod,
    NodeInfoMethod,
    PeersMethod,
    SetSolcMethod,
    StartRpcMethod,
    StartWsMethod,
    StopRpcMethod,
    StopWsMethod
} from 'web3-core-method';

import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory({}, {});
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            addPeer: AddPeerMethod,
            getDataDirectory: DataDirectoryMethod,
            getNodeInfo: NodeInfoMethod,
            getPeers: PeersMethod,
            setSolc: SetSolcMethod,
            startRPC: StartRpcMethod,
            startWS: StartWsMethod,
            stopRPC: StopRpcMethod,
            stopWS: StopWsMethod
        });
    });
});
