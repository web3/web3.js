import {
    AddPeerMethod,
    AdminDataDirectoryMethod,
    AdminNodeInfoMethod,
    GetAdminPeersMethod,
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
            getDataDirectory: AdminDataDirectoryMethod,
            getNodeInfo: AdminNodeInfoMethod,
            getPeers: GetAdminPeersMethod,
            setSolc: SetSolcMethod,
            startRPC: StartRpcMethod,
            startWS: StartWsMethod,
            stopRPC: StopRpcMethod,
            stopWS: StopWsMethod
        });
    });
});
