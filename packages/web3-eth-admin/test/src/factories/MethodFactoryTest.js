import {
    AdminAddPeerMethod,
    GetAdminDataDirectoryMethod,
    GetAdminNodeInfoMethod,
    GetAdminPeersMethod,
    SetAdminSolcMethod,
    AdminStartRpcMethod,
    AdminStartWsMethod,
    AdminStopRpcMethod,
    AdminStopWsMethod
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
            addPeer: AdminAddPeerMethod,
            getDataDirectory: GetAdminDataDirectoryMethod,
            getNodeInfo: GetAdminNodeInfoMethod,
            getPeers: GetAdminPeersMethod,
            setSolc: SetAdminSolcMethod,
            startRPC: AdminStartRpcMethod,
            startWS: AdminStartWsMethod,
            stopRPC: AdminStopRpcMethod,
            stopWS: AdminStopWsMethod
        });
    });
});
