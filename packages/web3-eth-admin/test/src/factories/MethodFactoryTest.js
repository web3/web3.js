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
            addAdminPeer: AdminAddPeerMethod,
            getadminDataDirectory: GetAdminDataDirectoryMethod,
            getAdminNodeInfo: GetAdminNodeInfoMethod,
            getAdminPeers: GetAdminPeersMethod,
            setAdminSolc: SetAdminSolcMethod,
            startRPC: AdminStartRpcMethod,
            startWS: AdminStartWsMethod,
            stopRPC: AdminStopRpcMethod,
            stopWS: AdminStopWsMethod
        });
    });
});
