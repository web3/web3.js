import {
    EcRecoverMethod,
    GetAccountsMethod,
    ImportRawKeyMethod,
    LockAccountMethod,
    NewAccountMethod,
    PersonalSendTransactionMethod,
    PersonalSignMethod,
    PersonalSignTransactionMethod,
    UnlockAccountMethod
} from 'web3-core-method';

import MethodFactory from '../../../src/factories/MethodFactory';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory();
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            getAccounts: GetAccountsMethod,
            newAccount: NewAccountMethod,
            unlockAccount: UnlockAccountMethod,
            lockAccount: LockAccountMethod,
            importRawKey: ImportRawKeyMethod,
            sendTransaction: PersonalSendTransactionMethod,
            signTransaction: PersonalSignTransactionMethod,
            sign: PersonalSignMethod,
            ecRecover: EcRecoverMethod
        });
    });
});
