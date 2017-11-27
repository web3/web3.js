import u from './helpers/test.utils.js';
import Shh from '../packages/web3-shh';

const shh = new Shh();

describe('shh', () => {
    describe('methods', () => {
        u.methodExists(shh, 'subscribe');

        u.methodExists(shh, 'getVersion');
        u.methodExists(shh, 'getInfo');
        u.methodExists(shh, 'setMaxMessageSize');
        u.methodExists(shh, 'setMinPoW');
        u.methodExists(shh, 'markTrustedPeer');
        u.methodExists(shh, 'newKeyPair');
        u.methodExists(shh, 'addPrivateKey');
        u.methodExists(shh, 'deleteKeyPair');
        u.methodExists(shh, 'hasKeyPair');
        u.methodExists(shh, 'getPublicKey');
        u.methodExists(shh, 'getPrivateKey');
        u.methodExists(shh, 'newSymKey');
        u.methodExists(shh, 'addSymKey');
        u.methodExists(shh, 'generateSymKeyFromPassword');
        u.methodExists(shh, 'hasSymKey');
        u.methodExists(shh, 'getSymKey');
        u.methodExists(shh, 'deleteSymKey');
        u.methodExists(shh, 'newMessageFilter');
        u.methodExists(shh, 'getFilterMessages');
        u.methodExists(shh, 'deleteMessageFilter');
        u.methodExists(shh, 'post');
    });
});
